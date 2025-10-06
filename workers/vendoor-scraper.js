/**
 * Cloudflare Worker لجلب منتجات Ven-door باستخدام Puppeteer
 * 
 * الميزات:
 * - يعمل في Production بدون مشاكل
 * - يستخدم Cloudflare Browser Rendering API
 * - يدعم جلب جميع المنتجات من 41 صفحة
 * 
 * Setup:
 * 1. npm install -g wrangler
 * 2. wrangler login
 * 3. wrangler deploy
 */

import puppeteer from '@cloudflare/puppeteer';

const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';
const LOGIN_URL = 'https://aff.ven-door.com/login';
const PRODUCTS_BASE_URL = 'https://aff.ven-door.com/products';
const MAX_PAGES = 41;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // معالجة CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Routes
    if (url.pathname === '/scrape-all') {
      return handleScrapeAll(request, env, corsHeaders);
    } else if (url.pathname === '/scrape-page') {
      return handleScrapePage(request, env, corsHeaders);
    } else if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', message: 'Vendoor Scraper Worker is running' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};

/**
 * جلب جميع المنتجات من كل الصفحات
 */
async function handleScrapeAll(request, env, corsHeaders) {
  try {
    console.log('🚀 بدء عملية جلب جميع المنتجات...');
    
    const browser = await puppeteer.launch(env.MYBROWSER);
    const page = await browser.newPage();
    
    // تسجيل الدخول
    await loginToVendoor(page);
    
    const allProducts = [];
    let currentPage = 1;
    
    // جلب المنتجات من كل صفحة
    while (currentPage <= MAX_PAGES) {
      console.log(`📄 جاري معالجة الصفحة ${currentPage}/${MAX_PAGES}...`);
      
      const products = await scrapeProductsPage(page, currentPage);
      
      if (products.length === 0) {
        console.log(`✅ تم الوصول لآخر صفحة عند الصفحة ${currentPage - 1}`);
        break;
      }
      
      allProducts.push(...products);
      console.log(`✅ تم جلب ${products.length} منتج من الصفحة ${currentPage}`);
      
      currentPage++;
      
      // انتظار قصير بين الصفحات
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await browser.close();
    
    console.log(`🎉 تم جلب ${allProducts.length} منتج من ${currentPage - 1} صفحة`);
    
    return new Response(JSON.stringify({
      success: true,
      totalProducts: allProducts.length,
      totalPages: currentPage - 1,
      products: allProducts
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ خطأ في جلب المنتجات:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      details: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * جلب منتجات صفحة واحدة فقط
 */
async function handleScrapePage(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('page') || '1');
    
    console.log(`🚀 بدء جلب منتجات الصفحة ${pageNum}...`);
    
    const browser = await puppeteer.launch(env.MYBROWSER);
    const page = await browser.newPage();
    
    // تسجيل الدخول
    await loginToVendoor(page);
    
    // جلب المنتجات من الصفحة المحددة
    const products = await scrapeProductsPage(page, pageNum);
    
    await browser.close();
    
    console.log(`✅ تم جلب ${products.length} منتج من الصفحة ${pageNum}`);
    
    return new Response(JSON.stringify({
      success: true,
      page: pageNum,
      totalProducts: products.length,
      products: products
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ خطأ في جلب الصفحة:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * تسجيل الدخول إلى Ven-door
 */
async function loginToVendoor(page) {
  console.log('🔐 جاري تسجيل الدخول...');
  
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await page.waitForSelector('input[name="name"]', { timeout: 5000 });
  await page.type('input[name="name"]', VENDOOR_EMAIL, { delay: 50 });
  await page.type('input[type="password"]', VENDOOR_PASSWORD, { delay: 50 });
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
    page.click('button[type="submit"]')
  ]).catch(() => {});
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const currentUrl = page.url();
  if (currentUrl.includes('login')) {
    throw new Error('فشل تسجيل الدخول');
  }
  
  console.log('✅ تم تسجيل الدخول بنجاح');
}

/**
 * جلب منتجات صفحة واحدة
 */
async function scrapeProductsPage(page, pageNum) {
  const url = `${PRODUCTS_BASE_URL}?page=${pageNum}`;
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const products = await page.evaluate(() => {
    const productsList = [];
    const rows = document.querySelectorAll('table tbody tr');
    
    rows.forEach(row => {
      try {
        const cells = row.querySelectorAll('td');
        if (cells.length < 5) return;
        
        const imageCell = cells[0];
        const nameCell = cells[1];
        const supplierCell = cells[2];
        const priceCell = cells[3];
        const commissionCell = cells[4];
        const stockCell = cells[5];
        const actionCell = cells[7];
        
        // استخراج الصورة
        const img = imageCell ? imageCell.querySelector('img') : null;
        const image = img ? (img.src || img.getAttribute('data-src')) : '';
        
        // استخراج العنوان
        const title = nameCell ? nameCell.textContent.trim() : '';
        
        // استخراج المورد
        const supplier = supplierCell ? supplierCell.textContent.trim() : '';
        
        // استخراج السعر
        const price = priceCell ? priceCell.textContent.trim() : '';
        
        // استخراج العمولة
        const commission = commissionCell ? commissionCell.textContent.trim() : '';
        
        // استخراج حالة المخزون
        const stock = stockCell ? stockCell.textContent.trim() : '';
        
        // استخراج رقم المنتج من زر المشاهدة
        const viewBtn = actionCell ? actionCell.querySelector('a[href*="/products/"]') : null;
        const productId = viewBtn ? viewBtn.href.split('/products/')[1] : '';
        
        if (productId && title) {
          productsList.push({
            id: productId,
            title,
            supplier,
            price,
            commission,
            stock,
            image
          });
        }
      } catch (error) {
        console.error('خطأ في معالجة صف:', error);
      }
    });
    
    return productsList;
  });
  
  return products;
}
