import * as dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!projectId || !endpoint || !databaseId) {
  console.error('❌ خطأ: متغيرات البيئة مفقودة');
  console.log('يرجى التأكد من وجود هذه المتغيرات في ملف .env:');
  console.log('- VITE_APPWRITE_PROJECT_ID');
  console.log('- VITE_APPWRITE_ENDPOINT');
  console.log('- VITE_APPWRITE_DATABASE_ID');
  console.log('- APPWRITE_API_KEY (للحصول عليه من Console)');
  process.exit(1);
}

if (!apiKey) {
  console.log('🔑 لإنشاء API Key:');
  console.log('1. اذهب إلى: https://cloud.appwrite.io/console/project-' + projectId);
  console.log('2. في القائمة الجانبية، اضغط على "Overview"');
  console.log('3. اضغط على "Integrations"');
  console.log('4. اضغط على "API Keys"');
  console.log('5. اضغط على "Create API Key"');
  console.log('6. أدخل اسم: "Collections Creator"');
  console.log('7. اختر Scopes: databases.write, collections.write, attributes.write, indexes.write');
  console.log('8. انسخ الـ API Key وأضفه في ملف .env:');
  console.log('   APPWRITE_API_KEY=your_api_key_here');
  console.log('\nثم شغّل السكريپت مرة أخرى.');
  process.exit(1);
}

// Headers للـ API calls
const headers = {
  'Content-Type': 'application/json',
  'X-Appwrite-Project': projectId,
  'X-Appwrite-Key': apiKey
};

// تعريف Collections
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
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
    
    return await response.json();
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
  console.log('🚀 بدء إنشاء Collections تلقائياً...\n');
  console.log(`📡 Endpoint: ${endpoint}`);
  console.log(`🆔 Project ID: ${projectId}`);
  console.log(`💾 Database ID: ${databaseId}\n`);

  for (const collection of collections) {
    try {
      console.log(`📁 إنشاء Collection: ${collection.name} (${collection.id})`);
      
      // إنشاء Collection
      await createCollection(collection);
      console.log(`✅ تم إنشاء Collection: ${collection.name}`);

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

      console.log(`🎉 تم إنشاء Collection بنجاح: ${collection.name}\n`);
      
    } catch (error) {
      console.error(`❌ خطأ في إنشاء Collection ${collection.name}:`, error.message);
      if (error.message.includes('409')) {
        console.log(`ℹ️  Collection ${collection.name} موجود بالفعل\n`);
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

  console.log('\n🎉 تم الانتهاء من إنشاء جميع Collections والStorage!');
  console.log('\n📋 الخطوات التالية:');
  console.log('1. تحقق من Collections في Appwrite Console');
  console.log('2. شغّل الموقع: npm run dev');
  console.log('3. اذهب إلى: http://localhost:8080');
  console.log('4. تأكد من ظهور: "🟢 Appwrite Status: Connected"');
}

// تشغيل السكريپت
createCollections().catch(console.error);