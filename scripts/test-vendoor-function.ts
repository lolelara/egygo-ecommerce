/**
 * اختبار Vendoor Function
 * تشغيل: tsx scripts/test-vendoor-function.ts
 */

const VENDOOR_FUNCTION_URL = 'https://68e1f6240030405882c5.fra.appwrite.run';

async function testHealthEndpoint() {
  console.log('🔍 اختبار Health Endpoint...\n');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(`${VENDOOR_FUNCTION_URL}/health`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Function يعمل بنجاح!');
      console.log('📊 الاستجابة:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log('❌ Function يستجيب لكن بخطأ:', response.status);
      return false;
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('⏱️  Timeout: Function يستغرق وقتاً طويلاً (cold start)');
      console.log('💡 هذا طبيعي في أول استدعاء. حاول مرة أخرى بعد دقيقة.');
    } else {
      console.log('❌ خطأ في الاتصال:', error.message);
    }
    return false;
  }
}

async function testFetchAllEndpoint() {
  console.log('\n🔍 اختبار Fetch All Endpoint...\n');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    console.log('⏳ جاري جلب المنتجات... (قد يستغرق 30-60 ثانية)');
    
    const startTime = Date.now();
    const response = await fetch(`${VENDOOR_FUNCTION_URL}/vendoor/fetch-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ تم جلب المنتجات بنجاح في ${duration} ثانية!`);
      console.log(`📦 عدد المنتجات: ${data.products?.length || 0}`);
      
      if (data.products && data.products.length > 0) {
        console.log('\n📋 أول منتج:');
        console.log(JSON.stringify(data.products[0], null, 2));
      }
      
      return true;
    } else {
      console.log('❌ فشل جلب المنتجات:', response.status);
      const errorText = await response.text();
      console.log('📄 الخطأ:', errorText);
      return false;
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('⏱️  Timeout: Function يستغرق أكثر من دقيقة');
      console.log('💡 قد يكون هناك مشكلة في تسجيل الدخول إلى Vendoor');
    } else {
      console.log('❌ خطأ في الاتصال:', error.message);
    }
    return false;
  }
}

async function testManualSyncEndpoint() {
  console.log('\n🔍 اختبار Manual Sync Endpoint...\n');
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    console.log('⏳ جاري المزامنة... (قد يستغرق 30-60 ثانية)');
    
    const startTime = Date.now();
    const response = await fetch(`${VENDOOR_FUNCTION_URL}/vendoor/sync-manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ تمت المزامنة بنجاح في ${duration} ثانية!`);
      console.log('📊 النتائج:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log('❌ فشلت المزامنة:', response.status);
      const errorText = await response.text();
      console.log('📄 الخطأ:', errorText);
      return false;
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('⏱️  Timeout: المزامنة تستغرق أكثر من دقيقة');
    } else {
      console.log('❌ خطأ في الاتصال:', error.message);
    }
    return false;
  }
}

async function main() {
  console.log('🚀 بدء اختبار Vendoor Function\n');
  console.log('🔗 URL:', VENDOOR_FUNCTION_URL);
  console.log('='.repeat(60) + '\n');
  
  // Test 1: Health Check
  const healthOk = await testHealthEndpoint();
  
  if (!healthOk) {
    console.log('\n⚠️  Function غير متاح حالياً. تحقق من:');
    console.log('   1. الرابط صحيح');
    console.log('   2. Function مُنشر في Appwrite');
    console.log('   3. لا توجد مشاكل في الشبكة');
    return;
  }
  
  // Test 2: Fetch All Products (optional - takes longer)
  console.log('\n❓ هل تريد اختبار جلب المنتجات؟ (سيستغرق 30-60 ثانية)');
  console.log('   تخطي هذا الاختبار الآن...\n');
  
  // Uncomment to test:
  // await testFetchAllEndpoint();
  
  // Test 3: Manual Sync (optional - takes longer)
  // await testManualSyncEndpoint();
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ اكتمل الاختبار!');
  console.log('\n💡 نصائح:');
  console.log('   • أول استدعاء يستغرق 10-15 ثانية (cold start)');
  console.log('   • جلب المنتجات يستغرق 30-60 ثانية');
  console.log('   • استخدم /health للتحقق السريع من الحالة');
  console.log('='.repeat(60) + '\n');
}

main();
