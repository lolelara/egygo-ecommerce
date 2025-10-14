/**
 * اختبار Vendoor Scraper مع Playwright (webkit - أخف من chromium)
 * للتشغيل: node scripts/test-vendoor-webkit.js
 */

const { webkit } = require('playwright');

// بيانات تسجيل الدخول
const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';

const BASE = 'https://aff.ven-door.com';
const LOGIN_URL = `${BASE}/login`;
const PRODUCTS_URL = (page) => `${BASE}/products?page=${page}`;

function sleep(ms) { 
  return new Promise(r => setTimeout(r, ms)); 
}

/**
 * تسجيل الدخول
 */
async function loginToVendoor(page, email, password) {
  console.log('🔐 تسجيل الدخول...');
  
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);
  
  await page.waitForSelector('input[name="name"]', { timeout: 10000 });
  await page.type('input[name="name"]', email, { delay: 50 });
  await page.type('input[type="password"]', password, { delay: 50 });
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {}),
    page.click('button[type="submit"]')
  ]);
  
  await sleep(5000);
  
  if (page.url().includes('login')) {
    throw new Error('فشل تسجيل الدخول');
  }
  
  console.log('✅ تم تسجيل الدخول بنجاح');
}

/**
 * جلب منتجات من صفحة واحدة
 */
async function scrapeProductsPage(page, pageNum) {
  console.log(`\n📄 جلب الصفحة ${pageNum}...`);
  
  const url = PRODUCTS_URL(pageNum);
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
  
  console.log(`✅ تم جلب ${products.length} منتج من الصفحة ${pageNum}`);
  return products;
}

/**
 * الدالة الرئيسية
 */
async function main() {
  console.log('🚀 بدء الاختبار مع Playwright (webkit)...\n');
  
  // إنشاء متصفح webkit (أخف من chromium)
  const browser = await webkit.launch({
    headless: false, // false لمشاهدة المتصفح
    slowMo: 50 // تبطيء الحركة لسهولة المتابعة
  });
  
  console.log('✅ تم فتح متصفح webkit');
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    // تسجيل الدخول
    await loginToVendoor(page, VENDOOR_EMAIL, VENDOOR_PASSWORD);
    
    // جلب أول صفحتين فقط (للاختبار)
    const allProducts = [];
    
    for (let pageNum = 1; pageNum <= 2; pageNum++) {
      const products = await scrapeProductsPage(page, pageNum);
      allProducts.push(...products);
      
      console.log(`📊 إجمالي المنتجات حتى الآن: ${allProducts.length}`);
      
      // انتظار بين الصفحات
      if (pageNum < 2) {
        await sleep(2000);
      }
    }
    
    console.log('\n✅ اكتمل الاختبار!');
    console.log(`📦 إجمالي المنتجات: ${allProducts.length}`);
    
    // عرض أول 5 منتجات
    console.log('\n📋 أول 5 منتجات:');
    allProducts.slice(0, 5).forEach((p, i) => {
      console.log(`${i + 1}. ${p.title} - ${p.price} - مخزون: ${p.stock}`);
    });
    
    // حفظ النتائج في ملف
    const fs = require('fs');
    fs.writeFileSync(
      'vendoor-test-results.json',
      JSON.stringify(allProducts, null, 2)
    );
    console.log('\n💾 تم حفظ النتائج في: vendoor-test-results.json');
    
  } catch (error) {
    console.error('\n❌ خطأ:', error.message);
    console.error(error.stack);
  } finally {
    console.log('\n🔄 إغلاق المتصفح...');
    await browser.close();
    console.log('✅ تم');
  }
}

// تشغيل
main().catch(console.error);
