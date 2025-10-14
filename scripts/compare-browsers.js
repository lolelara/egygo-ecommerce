/**
 * مقارنة أداء المتصفحات: chromium vs webkit vs firefox
 * للتشغيل: node scripts/compare-browsers.js
 */

const { chromium, webkit, firefox } = require('playwright');

const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';
const BASE = 'https://aff.ven-door.com';
const LOGIN_URL = `${BASE}/login`;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function testBrowser(browserName, browserInstance) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🧪 اختبار ${browserName}...`);
  console.log(`${'='.repeat(50)}\n`);
  
  const startTime = Date.now();
  
  try {
    const browser = await browserInstance.launch({
      headless: true // headless للسرعة
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // قياس وقت تحميل الصفحة
    const loadStart = Date.now();
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle', timeout: 30000 });
    const loadTime = Date.now() - loadStart;
    
    console.log(`⏱️  وقت تحميل الصفحة: ${loadTime}ms`);
    
    await sleep(2000);
    
    // قياس وقت تسجيل الدخول
    const loginStart = Date.now();
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });
    await page.fill('input[name="name"]', VENDOOR_EMAIL);
    await page.fill('input[type="password"]', VENDOOR_PASSWORD);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {}),
      page.click('button[type="submit"]')
    ]);
    
    const loginTime = Date.now() - loginStart;
    console.log(`⏱️  وقت تسجيل الدخول: ${loginTime}ms`);
    
    await sleep(5000);
    
    if (page.url().includes('login')) {
      throw new Error('فشل تسجيل الدخول');
    }
    
    // قياس استهلاك الذاكرة (تقريبي)
    const metrics = await page.evaluate(() => {
      const perf = performance.memory || {};
      return {
        usedJSHeapSize: perf.usedJSHeapSize,
        totalJSHeapSize: perf.totalJSHeapSize,
        jsHeapSizeLimit: perf.jsHeapSizeLimit
      };
    });
    
    console.log(`💾 استهلاك الذاكرة: ${(metrics.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
    
    await browser.close();
    
    const totalTime = Date.now() - startTime;
    
    console.log(`\n✅ ${browserName} - الوقت الإجمالي: ${totalTime}ms`);
    
    return {
      browser: browserName,
      loadTime,
      loginTime,
      totalTime,
      memory: metrics.usedJSHeapSize / 1024 / 1024,
      success: true
    };
    
  } catch (error) {
    console.error(`\n❌ ${browserName} - خطأ:`, error.message);
    
    const totalTime = Date.now() - startTime;
    
    return {
      browser: browserName,
      success: false,
      error: error.message,
      totalTime
    };
  }
}

async function main() {
  console.log('🚀 مقارنة أداء المتصفحات\n');
  console.log('📝 سيتم اختبار: Chromium, WebKit, Firefox\n');
  
  const results = [];
  
  // اختبار كل متصفح
  results.push(await testBrowser('Chromium', chromium));
  await sleep(3000);
  
  results.push(await testBrowser('WebKit', webkit));
  await sleep(3000);
  
  results.push(await testBrowser('Firefox', firefox));
  
  // عرض النتائج
  console.log('\n' + '='.repeat(70));
  console.log('📊 ملخص النتائج');
  console.log('='.repeat(70) + '\n');
  
  const successResults = results.filter(r => r.success);
  
  if (successResults.length > 0) {
    // ترتيب حسب السرعة
    successResults.sort((a, b) => a.totalTime - b.totalTime);
    
    console.log('🏆 الترتيب حسب السرعة:\n');
    successResults.forEach((r, i) => {
      const emoji = i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉';
      console.log(`${emoji} ${i + 1}. ${r.browser}`);
      console.log(`   ⏱️  الوقت الإجمالي: ${r.totalTime}ms`);
      console.log(`   📄 تحميل الصفحة: ${r.loadTime}ms`);
      console.log(`   🔐 تسجيل الدخول: ${r.loginTime}ms`);
      console.log(`   💾 الذاكرة: ${r.memory.toFixed(2)} MB\n`);
    });
    
    // أفضل متصفح
    const fastest = successResults[0];
    console.log(`✨ التوصية: استخدم ${fastest.browser} (الأسرع)`);
  }
  
  const failedResults = results.filter(r => !r.success);
  if (failedResults.length > 0) {
    console.log('\n❌ فشل الاختبار:\n');
    failedResults.forEach(r => {
      console.log(`- ${r.browser}: ${r.error}`);
    });
  }
  
  // حفظ النتائج
  const fs = require('fs');
  fs.writeFileSync(
    'browser-comparison-results.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n💾 تم حفظ النتائج في: browser-comparison-results.json');
}

main().catch(console.error);
