import Puppeteer from 'puppeteer';
import { Client, Databases } from 'node-appwrite';

const LOGIN_URL = 'https://aff.ven-door.com/login';
const PRODUCTS_BASE_URL = 'https://aff.ven-door.com/products';
const MAX_PAGES = 41;

/**
 * تسجيل الدخول إلى Ven-door
 */
async function loginToVendoor(page, email, password) {
  console.log('🔐 تسجيل الدخول...');
  
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await page.waitForSelector('input[name="name"]', { timeout: 10000 });
  await page.type('input[name="name"]', email, { delay: 50 });
  await page.type('input[type="password"]', password, { delay: 50 });
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
    page.click('button[type="submit"]')
  ]).catch(() => {});
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  if (page.url().includes('login')) {
    throw new Error('فشل تسجيل الدخول');
  }
  
  console.log('✅ تم تسجيل الدخول');
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
        
        const img = imageCell?.querySelector('img');
        const image = img ? (img.src || img.getAttribute('data-src')) : '';
        const title = nameCell?.textContent.trim() || '';
        const supplier = supplierCell?.textContent.trim() || '';
        const price = priceCell?.textContent.trim() || '';
        const commission = commissionCell?.textContent.trim() || '';
        const stock = stockCell?.textContent.trim() || '';
        
        const viewBtn = actionCell?.querySelector('a[href*="/products/"]');
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

/**
 * جلب جميع المنتجات
 */
export async function scrapeAllProducts(email, password, log) {
  const browser = await Puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });
  
  try {
    const page = await browser.newPage();
    
    // تسجيل الدخول
    await loginToVendoor(page, email, password);
    
    const allProducts = [];
    let currentPage = 1;
    
    // جلب المنتجات من كل صفحة
    while (currentPage <= MAX_PAGES) {
      log(`📄 معالجة الصفحة ${currentPage}/${MAX_PAGES}...`);
      
      const products = await scrapeProductsPage(page, currentPage);
      
      if (products.length === 0) {
        log(`✅ تم الوصول لآخر صفحة عند ${currentPage - 1}`);
        break;
      }
      
      allProducts.push(...products);
      log(`✅ تم جلب ${products.length} منتج من الصفحة ${currentPage}`);
      
      currentPage++;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    log(`🎉 تم جلب ${allProducts.length} منتج من ${currentPage - 1} صفحة`);
    
    return {
      success: true,
      totalProducts: allProducts.length,
      totalPages: currentPage - 1,
      products: allProducts
    };
    
  } finally {
    await browser.close();
  }
}

/**
 * جلب صفحة واحدة
 */
export async function scrapePage(email, password, pageNum, log) {
  const browser = await Puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    await loginToVendoor(page, email, password);
    const products = await scrapeProductsPage(page, pageNum);
    
    log(`✅ تم جلب ${products.length} منتج من الصفحة ${pageNum}`);
    
    return {
      success: true,
      page: pageNum,
      totalProducts: products.length,
      products: products
    };
    
  } finally {
    await browser.close();
  }
}
