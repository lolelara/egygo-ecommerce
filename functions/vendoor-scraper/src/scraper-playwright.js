/**
 * Vendoor Scraper using Playwright with webkit (lighter than Puppeteer)
 */

const { chromium } = require('playwright'); // chromium يعمل في Appwrite بدون deps

const BASE = 'https://aff.ven-door.com';
const LOGIN_URL = `${BASE}/login`;
const PRODUCTS_URL = (page) => `${BASE}/products?page=${page}`;

function sleep(ms) { 
  return new Promise(r => setTimeout(r, ms)); 
}

/**
 * تسجيل الدخول إلى Vendoor
 */
async function loginToVendoor(page, email, password, log) {
  log('🔐 تسجيل الدخول إلى Vendoor...');
  
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);
  
  await page.waitForSelector('input[name="name"]', { timeout: 10000 });
  await page.fill('input[name="name"]', email);
  await page.fill('input[type="password"]', password);
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {}),
    page.click('button[type="submit"]')
  ]);
  
  await sleep(5000);
  
  if (page.url().includes('login')) {
    throw new Error('فشل تسجيل الدخول');
  }
  
  log('✅ تم تسجيل الدخول بنجاح');
}

/**
 * جلب منتجات من صفحة واحدة
 */
async function scrapeProductsPage(page, pageNum, log) {
  const url = PRODUCTS_URL(pageNum);
  log(`📄 جلب الصفحة ${pageNum}...`);
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(800);
  
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  
  await page.waitForSelector('table tbody tr a[href*="/product/"]', { timeout: 10000 }).catch(() => {});
  
  const products = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    
    return rows.map(row => {
      const link = row.querySelector('a[href*="/product/"]');
      const cells = row.querySelectorAll('td');
      
      if (!link || cells.length < 6) return null;
      
      const productId = link.href.match(/\/product\/(\d+)/)?.[1];
      const image = row.querySelector('img')?.src || '';
      const title = cells[1]?.innerText?.trim() || '';
      const supplier = cells[2]?.innerText?.trim() || '';
      const price = cells[3]?.innerText?.trim() || '0';
      const commission = cells[4]?.innerText?.trim() || '0';
      const stock = cells[5]?.innerText?.trim() || '0';
      
      return {
        id: productId,
        title,
        supplier,
        price,
        commission,
        stock,
        image,
        url: link.href
      };
    }).filter(p => p && p.id);
  });
  
  log(`✅ تم جلب ${products.length} منتج من الصفحة ${pageNum}`);
  return products;
}

/**
 * جلب جميع المنتجات (41 صفحة)
 */
async function scrapeAllProducts(email, password, log = console.log) {
  let browser = null;
  
  try {
    log('🚀 بدء عملية جلب المنتجات مع Playwright chromium...');
    
    // استخدام chromium (يعمل في Appwrite)
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });
    
    log('✅ تم فتح متصفح chromium');
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    // تسجيل الدخول
    await loginToVendoor(page, email, password, log);
    
    // جلب المنتجات من جميع الصفحات
    const allProducts = [];
    const maxPages = 41;
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        const products = await scrapeProductsPage(page, pageNum, log);
        allProducts.push(...products);
        
        log(`📊 إجمالي المنتجات حتى الآن: ${allProducts.length}`);
        
        // انتظار بين الصفحات لتجنب الحظر
        if (pageNum < maxPages) {
          await sleep(1000 + Math.random() * 1000);
        }
      } catch (error) {
        log(`⚠️ خطأ في الصفحة ${pageNum}: ${error.message}`);
        // متابعة للصفحة التالية
      }
    }
    
    log(`✅ اكتمل! تم جلب ${allProducts.length} منتج`);
    
    return {
      success: true,
      products: allProducts,
      totalProducts: allProducts.length,
      totalPages: maxPages
    };
    
  } catch (error) {
    log(`❌ خطأ: ${error.message}`);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      log('🔄 تم إغلاق المتصفح');
    }
  }
}

/**
 * جلب صفحة واحدة فقط
 */
async function scrapePage(email, password, pageNum = 1, log = console.log) {
  let browser = null;
  
  try {
    log(`🚀 جلب الصفحة ${pageNum} مع Playwright chromium...`);
    
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await loginToVendoor(page, email, password, log);
    
    const products = await scrapeProductsPage(page, pageNum, log);
    
    return {
      success: true,
      products,
      page: pageNum,
      totalProducts: products.length
    };
    
  } catch (error) {
    log(`❌ خطأ: ${error.message}`);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  scrapeAllProducts,
  scrapePage
};
