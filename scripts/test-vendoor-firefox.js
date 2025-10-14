/**
 * اختبار Vendoor Scraper مع Playwright (firefox - خفيف)
 * للتشغيل: node scripts/test-vendoor-firefox.js
 */

const { firefox } = require('playwright');

// بيانات تسجيل الدخول
const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';

const BASE = 'https://aff.ven-door.com';
const LOGIN_URL = `${BASE}/login`;
const PRODUCTS_URL = (page) => `${BASE}/products?page=${page}`;

function sleep(ms) { 
  return new Promise(r => setTimeout(r, ms)); 
}

async function loginToVendoor(page, email, password) {
  console.log('🔐 تسجيل الدخول...');
  
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
  
  console.log('✅ تم تسجيل الدخول بنجاح');
}

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

async function main() {
  console.log('🚀 بدء الاختبار مع Playwright (Firefox)...\n');
  
  // إنشاء متصفح firefox (خفيف جداً)
  const browser = await firefox.launch({
    headless: false,
    slowMo: 50
  });
  
  console.log('✅ تم فتح متصفح Firefox');
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  try {
    await loginToVendoor(page, VENDOOR_EMAIL, VENDOOR_PASSWORD);
    
    const allProducts = [];
    
    for (let pageNum = 1; pageNum <= 2; pageNum++) {
      const products = await scrapeProductsPage(page, pageNum);
      allProducts.push(...products);
      
      console.log(`📊 إجمالي المنتجات حتى الآن: ${allProducts.length}`);
      
      if (pageNum < 2) {
        await sleep(2000);
      }
    }
    
    console.log('\n✅ اكتمل الاختبار!');
    console.log(`📦 إجمالي المنتجات: ${allProducts.length}`);
    
    console.log('\n📋 أول 5 منتجات:');
    allProducts.slice(0, 5).forEach((p, i) => {
      console.log(`${i + 1}. ${p.title} - ${p.price} - مخزون: ${p.stock}`);
    });
    
    const fs = require('fs');
    fs.writeFileSync(
      'vendoor-test-firefox-results.json',
      JSON.stringify(allProducts, null, 2)
    );
    console.log('\n💾 تم حفظ النتائج في: vendoor-test-firefox-results.json');
    
  } catch (error) {
    console.error('\n❌ خطأ:', error.message);
    console.error(error.stack);
  } finally {
    console.log('\n🔄 إغلاق المتصفح...');
    await browser.close();
    console.log('✅ تم');
  }
}

main().catch(console.error);
