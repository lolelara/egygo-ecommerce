import * as dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;
const apiKey = process.env.APPWRITE_API_KEY;

console.log('🔍 فحص حالة Collections في قاعدة البيانات\n');

if (!projectId || !endpoint || !databaseId) {
  console.error('❌ خطأ: متغيرات البيئة مفقودة');
  process.exit(1);
}

console.log(`📡 Endpoint: ${endpoint}`);
console.log(`🆔 Project ID: ${projectId}`);
console.log(`💾 Database ID: ${databaseId}\n`);

// القوائم المطلوبة
const requiredCollections = [
  'users', 'categories', 'products', 'orders', 
  'order_items', 'reviews', 'affiliates'
];

const requiredBuckets = ['product-images'];

async function checkCollections() {
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.log('⚠️  لا يمكن فحص Collections بدون API Key');
    console.log('للحصول على API Key، راجع التعليمات في السكريپت السابق\n');
    
    // فحص أساسي للاتصال
    try {
      const response = await fetch(`${endpoint}/databases/${databaseId}`, {
        headers: { 'X-Appwrite-Project': projectId }
      });
      
      if (response.ok) {
        console.log('✅ الاتصال بـ Database ناجح');
        console.log('📋 يرجى إنشاء Collections يدوياً أو استخدام API Key للإنشاء التلقائي');
      } else {
        console.log('❌ فشل الاتصال بـ Database');
      }
    } catch (error) {
      console.log('❌ خطأ في الاتصال:', error.message);
    }
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': projectId,
    'X-Appwrite-Key': apiKey
  };

  try {
    // فحص Collections
    console.log('🔍 فحص Collections...');
    const collectionsResponse = await fetch(`${endpoint}/databases/${databaseId}/collections`, {
      headers
    });

    if (collectionsResponse.ok) {
      const collectionsData = await collectionsResponse.json();
      const existingCollections = collectionsData.collections.map(c => c.$id);
      
      console.log(`📊 عدد Collections الموجودة: ${existingCollections.length}`);
      
      requiredCollections.forEach(collectionId => {
        if (existingCollections.includes(collectionId)) {
          console.log(`✅ ${collectionId} - موجود`);
        } else {
          console.log(`❌ ${collectionId} - مفقود`);
        }
      });
      
      const missingCollections = requiredCollections.filter(id => !existingCollections.includes(id));
      
      if (missingCollections.length === 0) {
        console.log('\n🎉 جميع Collections موجودة!');
      } else {
        console.log(`\n⚠️  Collections مفقودة: ${missingCollections.join(', ')}`);
      }
    }

    // فحص Storage Buckets
    console.log('\n🔍 فحص Storage Buckets...');
    const bucketsResponse = await fetch(`${endpoint}/storage/buckets`, {
      headers
    });

    if (bucketsResponse.ok) {
      const bucketsData = await bucketsResponse.json();
      const existingBuckets = bucketsData.buckets.map(b => b.$id);
      
      console.log(`📊 عدد Buckets الموجودة: ${existingBuckets.length}`);
      
      requiredBuckets.forEach(bucketId => {
        if (existingBuckets.includes(bucketId)) {
          console.log(`✅ ${bucketId} - موجود`);
        } else {
          console.log(`❌ ${bucketId} - مفقود`);
        }
      });
    }

    // تقرير شامل
    console.log('\n' + '='.repeat(50));
    console.log('📋 تقرير الحالة النهائية:');
    
    const allCollectionsExist = requiredCollections.every(id => 
      collectionsData?.collections?.some(c => c.$id === id)
    );
    
    const allBucketsExist = requiredBuckets.every(id => 
      bucketsData?.buckets?.some(b => b.$id === id)
    );

    if (allCollectionsExist && allBucketsExist) {
      console.log('🎉 جميع المتطلبات موجودة! يمكنك تشغيل الموقع');
      console.log('\n🚀 للتشغيل:');
      console.log('npm run dev');
      console.log('ثم اذهب إلى: http://localhost:8080');
    } else {
      console.log('⚠️  بعض المتطلبات مفقودة');
      console.log('\n📋 للإنشاء التلقائي:');
      console.log('node scripts/create-collections-auto.mjs');
      console.log('\n📖 أو للإنشاء اليدوي:');
      console.log('راجع ملف: COLLECTIONS_MANUAL_GUIDE.md');
    }

  } catch (error) {
    console.error('❌ خطأ في فحص Database:', error.message);
  }
}

checkCollections();