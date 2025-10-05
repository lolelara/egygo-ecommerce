const puppeteer = require('puppeteer');

const LOGIN_URL = 'https://vendoor.co/user/login?returnUrl=%2Faffiliate%2Fproducts';
const PRODUCTS_BASE_URL = 'https://vendoor.co/affiliate/products?page=';
const MAX_PAGES = 41;

/**
 * تسجيل الدخول إلى Ven-door
 */
async function loginToVendoor(page, email, password) {
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });
  
  // ملء بيانات تسجيل الدخول
  await page.type('input[name="Email"]', email);
  await page.type('input[name="Password"]', password);
  
  // الضغط على زر تسجيل الدخول
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
}

/**
 * استخراج المنتجات من صفحة واحدة
 */
async function scrapeProductsPage(page, pageNum) {
  const url = `${PRODUCTS_BASE_URL}${pageNum}`;
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  // انتظار تحميل الجدول
  await page.waitForSelector('table tbody tr', { timeout: 10000 });
  
  // استخراج البيانات
  const products = await page.evaluate(() => {
    const rows = document.querySelectorAll('table tbody tr');
    const results = [];
    
    rows.forEach(row => {
      try {
        const cells = row.querySelectorAll('td');
        if (cells.length < 6) return;
        
        // الصورة
        const imgElement = cells[0].querySelector('img');
        const image = imgElement ? imgElement.src : '';
        
        // العنوان
        const titleElement = cells[1].querySelector('a');
        const title = titleElement ? titleElement.textContent.trim() : '';
        
        // السعر
        const priceText = cells[2].textContent.trim();
        const price = priceText.replace(/[^\d.]/g, '');
        
        // العمولة
        const commissionText = cells[3].textContent.trim();
        const commission = commissionText.replace(/[^\d.]/g, '');
        
        // المخزون
        const stock = cells[4].textContent.trim();
        
        // معرف المنتج (من الرابط)
        const productLink = titleElement ? titleElement.href : '';
        const productId = productLink.split('/').pop() || '';
        
        results.push({
          id: productId,
          title,
          price,
          commission,
          stock,
          image,
          url: productLink
        });
      } catch (error) {
        console.error('خطأ في معالجة صف:', error);
      }
    });
    
    return results;
  });
  
  return products;
}

/**
 * جلب جميع المنتجات من جميع الصفحات
 */
async function scrapeAllProducts(email, password, log) {
  let browser;
  
  try {
    log('🚀 بدء Puppeteer...');
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    
    log('🔐 تسجيل الدخول...');
    await loginToVendoor(page, email, password);
    
    log(`📦 جلب ${MAX_PAGES} صفحة...`);
    const allProducts = [];
    
    for (let i = 1; i <= MAX_PAGES; i++) {
      log(`📄 الصفحة ${i}/${MAX_PAGES}...`);
      const products = await scrapeProductsPage(page, i);
      allProducts.push(...products);
      
      // تأخير بسيط لتجنب الحظر
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await browser.close();
    
    log(`✅ تم جلب ${allProducts.length} منتج`);
    
    return {
      success: true,
      totalProducts: allProducts.length,
      products: allProducts
    };
    
  } catch (error) {
    if (browser) await browser.close();
    log(`❌ خطأ: ${error.message}`);
    throw error;
  }
}

/**
 * جلب منتجات صفحة واحدة فقط
 */
async function scrapePage(email, password, pageNum, log) {
  let browser;
  
  try {
    log(`🚀 بدء جلب الصفحة ${pageNum}...`);
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    
    log('🔐 تسجيل الدخول...');
    await loginToVendoor(page, email, password);
    
    log(`📄 جلب الصفحة ${pageNum}...`);
    const products = await scrapeProductsPage(page, pageNum);
    
    await browser.close();
    
    log(`✅ تم جلب ${products.length} منتج من الصفحة ${pageNum}`);
    
    return {
      success: true,
      page: pageNum,
      totalProducts: products.length,
      products
    };
    
  } catch (error) {
    if (browser) await browser.close();
    log(`❌ خطأ: ${error.message}`);
    throw error;
  }
}

module.exports = {
  scrapeAllProducts,
  scrapePage
};
