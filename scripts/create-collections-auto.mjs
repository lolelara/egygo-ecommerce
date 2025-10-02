import * as dotenv from 'dotenv';
import fs from 'fs';

// تحميل متغيرات البيئة
dotenv.config();

const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;
const apiKey = process.env.APPWRITE_API_KEY;

console.log('🚀 مُنشئ Collections التلقائي لـ EgyGo\n');

// التحقق من البيانات الأساسية
if (!projectId || !endpoint || !databaseId) {
  console.error('❌ خطأ: متغيرات البيئة الأساسية مفقودة في ملف .env');
  console.log('يرجى التأكد من وجود:');
  console.log('- VITE_APPWRITE_PROJECT_ID');
  console.log('- VITE_APPWRITE_ENDPOINT');
  console.log('- VITE_APPWRITE_DATABASE_ID');
  process.exit(1);
}

console.log(`📡 Endpoint: ${endpoint}`);
console.log(`🆔 Project ID: ${projectId}`);
console.log(`💾 Database ID: ${databaseId}`);

// التحقق من وجود API Key
if (!apiKey || apiKey === 'your_api_key_here') {
  console.log('\n🔑 API Key مطلوب لإنشاء Collections تلقائياً');
  console.log('\n📋 خطوات إنشاء API Key:');
  console.log(`1. اذهب إلى: https://cloud.appwrite.io/console/project-${projectId}`);
  console.log('2. في القائمة الجانبية: Overview > Integrations > API Keys');
  console.log('3. اضغط "Create API Key"');
  console.log('4. Name: "Collections Creator"');
  console.log('5. Scopes: اختر هذه الصلاحيات:');
  console.log('   ✅ databases.write');
  console.log('   ✅ collections.write'); 
  console.log('   ✅ attributes.write');
  console.log('   ✅ indexes.write');
  console.log('   ✅ buckets.write');
  console.log('6. اضغط "Create"');
  console.log('7. انسخ الـ API Key');
  console.log('8. أضفه في ملف .env:');
  console.log('   APPWRITE_API_KEY=your_copied_api_key');
  console.log('\n9. شغّل السكريپت مرة أخرى');
  
  console.log('\n🔗 رابط مباشر للـ API Keys:');
  console.log(`https://cloud.appwrite.io/console/project-${projectId}/overview/integrations`);
  
  process.exit(0);
}

console.log('✅ API Key موجود، بدء إنشاء Collections...\n');

// Headers للـ API calls
const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': projectId,
  'X-Appwrite-Key': apiKey
};

// Collections التي سيتم إنشاؤها
const collections = [
  {
    id: 'users',
    name: 'Users', 
    documentSecurity: true,
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'email', type: 'string', size: 255, required: true },
      { key: 'phone', type: 'string', size: 20, required: false },
      { key: 'address', type: 'string', size: 500, required: false },
      { key: 'isAffiliate', type: 'boolean', required: false, default: false },
      { key: 'affiliateCode', type: 'string', size: 10, required: false },
      { key: 'commissionRate', type: 'float', required: false, default: 0.15 }
    ],
    indexes: [
      { key: 'email_index', type: 'key', attributes: ['email'] }
    ]
  },
  {
    id: 'categories',
    name: 'Categories',
    documentSecurity: false,
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 1000, required: false },
      { key: 'image', type: 'string', size: 255, required: false },
      { key: 'isActive', type: 'boolean', required: false, default: true }
    ],
    indexes: []
  },
  {
    id: 'products',
    name: 'Products',
    documentSecurity: false,
    attributes: [
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'description', type: 'string', size: 2000, required: true },
      { key: 'price', type: 'float', required: true },
      { key: 'comparePrice', type: 'float', required: false },
      { key: 'stock', type: 'integer', required: true, default: 0 },
      { key: 'images', type: 'string', size: 2000, required: false, array: true },
      { key: 'categoryId', type: 'string', size: 36, required: true },
      { key: 'tags', type: 'string', size: 50, required: false, array: true },
      { key: 'isActive', type: 'boolean', required: false, default: true },
      { key: 'isFeatured', type: 'boolean', required: false, default: false },
      { key: 'rating', type: 'float', required: false, default: 0 },
      { key: 'reviewCount', type: 'integer', required: false, default: 0 }
    ],
    indexes: [
      { key: 'category_index', type: 'key', attributes: ['categoryId'] },
      { key: 'price_index', type: 'key', attributes: ['price'] },
      { key: 'featured_index', type: 'key', attributes: ['isFeatured'] }
    ]
  },
  {
    id: 'orders',
    name: 'Orders',
    documentSecurity: true,
    attributes: [
      { key: 'userId', type: 'string', size: 36, required: true },
      { key: 'total', type: 'float', required: true },
      { key: 'status', type: 'string', size: 20, required: true, default: 'pending' },
      { key: 'customerName', type: 'string', size: 255, required: true },
      { key: 'customerEmail', type: 'string', size: 255, required: true },
      { key: 'customerPhone', type: 'string', size: 20, required: true },
      { key: 'shippingAddress', type: 'string', size: 1000, required: true },
      { key: 'paymentMethod', type: 'string', size: 50, required: true },
      { key: 'affiliateCode', type: 'string', size: 10, required: false },
      { key: 'affiliateCommission', type: 'float', required: false, default: 0 }
    ],
    indexes: [
      { key: 'user_orders_index', type: 'key', attributes: ['userId'] },
      { key: 'status_index', type: 'key', attributes: ['status'] }
    ]
  },
  {
    id: 'order_items',
    name: 'Order Items',
    documentSecurity: true,
    attributes: [
      { key: 'orderId', type: 'string', size: 36, required: true },
      { key: 'productId', type: 'string', size: 36, required: true },
      { key: 'productName', type: 'string', size: 255, required: true },
      { key: 'productImage', type: 'string', size: 255, required: false },
      { key: 'price', type: 'float', required: true },
      { key: 'quantity', type: 'integer', required: true },
      { key: 'total', type: 'float', required: true }
    ],
    indexes: [
      { key: 'order_items_index', type: 'key', attributes: ['orderId'] },
      { key: 'product_sales_index', type: 'key', attributes: ['productId'] }
    ]
  },
  {
    id: 'reviews',
    name: 'Reviews',
    documentSecurity: true,
    attributes: [
      { key: 'productId', type: 'string', size: 36, required: true },
      { key: 'userId', type: 'string', size: 36, required: true },
      { key: 'userName', type: 'string', size: 255, required: true },
      { key: 'rating', type: 'integer', required: true },
      { key: 'comment', type: 'string', size: 1000, required: false },
      { key: 'isApproved', type: 'boolean', required: false, default: false }
    ],
    indexes: [
      { key: 'product_reviews_index', type: 'key', attributes: ['productId'] },
      { key: 'user_reviews_index', type: 'key', attributes: ['userId'] }
    ]
  },
  {
    id: 'affiliates',
    name: 'Affiliates',
    documentSecurity: true,
    attributes: [
      { key: 'userId', type: 'string', size: 36, required: true },
      { key: 'code', type: 'string', size: 10, required: true },
      { key: 'commissionRate', type: 'float', required: false, default: 0.15 },
      { key: 'totalEarnings', type: 'float', required: false, default: 0 },
      { key: 'totalSales', type: 'integer', required: false, default: 0 },
      { key: 'isActive', type: 'boolean', required: false, default: true }
    ],
    indexes: [
      { key: 'affiliate_code_index', type: 'unique', attributes: ['code'] },
      { key: 'user_affiliate_index', type: 'unique', attributes: ['userId'] }
    ]
  }
];

async function makeRequest(url, method = 'GET', body = null) {
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    
    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }
    
    return responseText ? JSON.parse(responseText) : {};
  } catch (error) {
    throw error;
  }
}

async function createCollection(collection) {
  const url = `${endpoint}/databases/${databaseId}/collections`;
  const body = {
    collectionId: collection.id,
    name: collection.name,
    documentSecurity: collection.documentSecurity
  };
  
  return await makeRequest(url, 'POST', body);
}

async function createAttribute(collectionId, attr) {
  let url = `${endpoint}/databases/${databaseId}/collections/${collectionId}/attributes`;
  let body = {
    key: attr.key,
    required: attr.required
  };

  if (attr.type === 'string') {
    url += '/string';
    body.size = attr.size;
    if (attr.array) body.array = true;
    if (attr.default !== undefined) body.default = attr.default;
  } else if (attr.type === 'boolean') {
    url += '/boolean';
    if (attr.default !== undefined) body.default = attr.default;
  } else if (attr.type === 'integer') {
    url += '/integer';
    if (attr.default !== undefined) body.default = attr.default;
  } else if (attr.type === 'float') {
    url += '/float';
    if (attr.default !== undefined) body.default = attr.default;
  }

  return await makeRequest(url, 'POST', body);
}

async function createIndex(collectionId, index) {
  const url = `${endpoint}/databases/${databaseId}/collections/${collectionId}/indexes`;
  const body = {
    key: index.key,
    type: index.type,
    attributes: index.attributes
  };
  
  return await makeRequest(url, 'POST', body);
}

async function createStorageBucket() {
  const url = `${endpoint}/storage/buckets`;
  const body = {
    bucketId: 'product-images',
    name: 'Product Images',
    fileSecurity: false,
    maximumFileSize: 5242880, // 5MB
    allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp']
  };
  
  return await makeRequest(url, 'POST', body);
}

async function createCollections() {
  let successCount = 0;
  let errorCount = 0;

  for (const collection of collections) {
    try {
      console.log(`📁 إنشاء Collection: ${collection.name} (${collection.id})`);
      
      // إنشاء Collection
      await createCollection(collection);
      console.log(`✅ تم إنشاء Collection: ${collection.name}`);
      successCount++;

      // انتظار قصير
      await new Promise(resolve => setTimeout(resolve, 500));

      // إنشاء Attributes
      for (const attr of collection.attributes) {
        try {
          console.log(`  📝 إضافة Attribute: ${attr.key}`);
          await createAttribute(collection.id, attr);
          console.log(`  ✅ تم إضافة Attribute: ${attr.key}`);
          
          // انتظار بين الـ attributes
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`  ❌ خطأ في إضافة Attribute ${attr.key}:`, error.message);
        }
      }

      // انتظار أطول قبل إنشاء Indexes
      await new Promise(resolve => setTimeout(resolve, 1000));

      // إنشاء Indexes
      for (const index of collection.indexes) {
        try {
          console.log(`  🔍 إنشاء Index: ${index.key}`);
          await createIndex(collection.id, index);
          console.log(`  ✅ تم إنشاء Index: ${index.key}`);
        } catch (error) {
          console.error(`  ❌ خطأ في إنشاء Index ${index.key}:`, error.message);
        }
      }

      console.log(`🎉 تم إكمال Collection: ${collection.name}\n`);
      
    } catch (error) {
      console.error(`❌ خطأ في إنشاء Collection ${collection.name}:`, error.message);
      if (error.message.includes('409')) {
        console.log(`ℹ️  Collection ${collection.name} موجود بالفعل\n`);
        successCount++;
      } else {
        errorCount++;
      }
    }
  }

  // إنشاء Storage Bucket
  try {
    console.log('🗂️ إنشاء Storage Bucket: product-images');
    await createStorageBucket();
    console.log('✅ تم إنشاء Storage Bucket بنجاح');
  } catch (error) {
    console.error('❌ خطأ في إنشاء Storage Bucket:', error.message);
    if (error.message.includes('409')) {
      console.log('ℹ️  Storage Bucket موجود بالفعل');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 نتائج العملية:');
  console.log(`✅ Collections ناجحة: ${successCount}/${collections.length}`);
  console.log(`❌ Collections فاشلة: ${errorCount}/${collections.length}`);
  
  if (successCount === collections.length) {
    console.log('\n🎉 تم إنشاء جميع Collections بنجاح!');
    console.log('\n🚀 الخطوات التالية:');
    console.log('1. شغّل الموقع: npm run dev');
    console.log('2. اذهب إلى: http://localhost:8080');
    console.log('3. تأكد من ظهور: "🟢 Appwrite Status: Connected"');
    console.log('4. جرب التسجيل وتسجيل الدخول');
  } else {
    console.log('\n⚠️  يرجى مراجعة الأخطاء أعلاه وإعادة المحاولة');
  }
}

// تشغيل السكريپت
createCollections().catch(console.error);