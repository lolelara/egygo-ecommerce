/**
 * اختبار Vendoor Scraping بـ Node.js
 * للتشغيل: node scripts/test-scraping-node.js
 */

const FUNCTION_URL = 'https://68e1f6240030405882c5.fra.appwrite.run';
const EMAIL = 'almlmibrahym574@gmail.com';
const PASSWORD = 'hema2004';

async function testScraping() {
  console.log('🧪 اختبار Vendoor Scraping...\n');

  // 1. Health Check
  console.log('1️⃣ Health Check...');
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'health' })
    });
    
    const data = await response.json();
    console.log('✅ النتيجة:', data);
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
  
  console.log('\n---\n');

  // 2. جلب منتج واحد
  console.log('2️⃣ جلب منتج واحد (4259)...');
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'scrape-single',
        productId: '4259',
        email: EMAIL,
        password: PASSWORD
      })
    });
    
    const data = await response.json();
    console.log('✅ النتيجة:', data);
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
  
  console.log('\n---\n');

  // 3. جلب صفحة واحدة
  console.log('3️⃣ جلب الصفحة 1...');
  console.log('⏱️ قد يأخذ 30-60 ثانية...');
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'scrape-page',
        page: 1,
        email: EMAIL,
        password: PASSWORD
      })
    });
    
    const data = await response.json();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log(`✅ النتيجة (${duration}s):`);
    console.log(`   عدد المنتجات: ${data.products?.length || 0}`);
    
    if (data.products && data.products.length > 0) {
      console.log('\n   أول 3 منتجات:');
      data.products.slice(0, 3).forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.title} - ${p.price}`);
      });
    }
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
  
  console.log('\n✅ الاختبار مكتمل!');
}

// تشغيل
testScraping().catch(console.error);
