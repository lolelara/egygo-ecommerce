import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const endpoint = process.env.VITE_APPWRITE_ENDPOINT;
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID;

if (!projectId || !endpoint || !databaseId) {
  console.error('❌ خطأ: متغيرات البيئة مفقودة');
  console.log('يرجى التأكد من وجود هذه المتغيرات في ملف .env:');
  console.log('- VITE_APPWRITE_PROJECT_ID');
  console.log('- VITE_APPWRITE_ENDPOINT');
  console.log('- VITE_APPWRITE_DATABASE_ID');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(process.env.APPWRITE_API_KEY || 'your-api-key-here'); // نحتاج API Key للسيرفر

const databases = new Databases(client);

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
      { key: 'commissionRate', type: 'double', required: false, default: 0.15 }
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
      { key: 'price', type: 'double', required: true },
      { key: 'comparePrice', type: 'double', required: false },
      { key: 'stock', type: 'integer', required: true, default: 0 },
      { key: 'images', type: 'string', size: 2000, required: false, array: true },
      { key: 'categoryId', type: 'string', size: 36, required: true },
      { key: 'tags', type: 'string', size: 50, required: false, array: true },
      { key: 'isActive', type: 'boolean', required: false, default: true },
      { key: 'isFeatured', type: 'boolean', required: false, default: false },
      { key: 'rating', type: 'double', required: false, default: 0 },
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
      { key: 'total', type: 'double', required: true },
      { key: 'status', type: 'string', size: 20, required: true, default: 'pending' },
      { key: 'customerName', type: 'string', size: 255, required: true },
      { key: 'customerEmail', type: 'string', size: 255, required: true },
      { key: 'customerPhone', type: 'string', size: 20, required: true },
      { key: 'shippingAddress', type: 'string', size: 1000, required: true },
      { key: 'paymentMethod', type: 'string', size: 50, required: true },
      { key: 'affiliateCode', type: 'string', size: 10, required: false },
      { key: 'affiliateCommission', type: 'double', required: false, default: 0 }
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
      { key: 'price', type: 'double', required: true },
      { key: 'quantity', type: 'integer', required: true },
      { key: 'total', type: 'double', required: true }
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
      { key: 'commissionRate', type: 'double', required: false, default: 0.15 },
      { key: 'totalEarnings', type: 'double', required: false, default: 0 },
      { key: 'totalSales', type: 'integer', required: false, default: 0 },
      { key: 'isActive', type: 'boolean', required: false, default: true }
    ],
    indexes: [
      { key: 'affiliate_code_index', type: 'unique', attributes: ['code'] },
      { key: 'user_affiliate_index', type: 'unique', attributes: ['userId'] }
    ]
  }
];

async function createCollections() {
  console.log('🚀 بدء إنشاء Collections...\n');
  console.log(`📡 Endpoint: ${endpoint}`);
  console.log(`🆔 Project ID: ${projectId}`);
  console.log(`💾 Database ID: ${databaseId}\n`);

  for (const collection of collections) {
    try {
      console.log(`📁 إنشاء Collection: ${collection.name} (${collection.id})`);
      
      // إنشاء Collection
      const createdCollection = await databases.createCollection(
        databaseId,
        collection.id,
        collection.name,
        undefined, // permissions will be set separately
        collection.documentSecurity
      );
      
      console.log(`✅ تم إنشاء Collection: ${collection.name}`);

      // إنشاء Attributes
      for (const attr of collection.attributes) {
        try {
          console.log(`  📝 إضافة Attribute: ${attr.key}`);
          
          if (attr.type === 'string') {
            await databases.createStringAttribute(
              databaseId,
              collection.id,
              attr.key,
              attr.size,
              attr.required,
              attr.default,
              attr.array || false
            );
          } else if (attr.type === 'boolean') {
            await databases.createBooleanAttribute(
              databaseId,
              collection.id,
              attr.key,
              attr.required,
              attr.default,
              attr.array || false
            );
          } else if (attr.type === 'integer') {
            await databases.createIntegerAttribute(
              databaseId,
              collection.id,
              attr.key,
              attr.required,
              undefined, // min
              undefined, // max
              attr.default,
              attr.array || false
            );
          } else if (attr.type === 'double') {
            await databases.createFloatAttribute(
              databaseId,
              collection.id,
              attr.key,
              attr.required,
              undefined, // min
              undefined, // max
              attr.default,
              attr.array || false
            );
          }
          
          console.log(`  ✅ تم إضافة Attribute: ${attr.key}`);
          
          // انتظار قصير بين الـ attributes
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`  ❌ خطأ في إضافة Attribute ${attr.key}:`, error.message);
        }
      }

      // إنشاء Indexes (سيتم تأجيلها للتأكد من إنشاء الـ attributes أولاً)
      console.log(`  🔍 إنشاء Indexes للـ Collection: ${collection.name}`);
      for (const index of collection.indexes) {
        try {
          await databases.createIndex(
            databaseId,
            collection.id,
            index.key,
            index.type,
            index.attributes
          );
          console.log(`  ✅ تم إنشاء Index: ${index.key}`);
        } catch (error) {
          console.error(`  ❌ خطأ في إنشاء Index ${index.key}:`, error.message);
        }
      }

      console.log(`🎉 تم إنشاء Collection بنجاح: ${collection.name}\n`);
      
    } catch (error) {
      console.error(`❌ خطأ في إنشاء Collection ${collection.name}:`, error.message);
      if (error.code === 409) {
        console.log(`ℹ️  Collection ${collection.name} موجود بالفعل\n`);
      }
    }
  }

  console.log('🎉 تم الانتهاء من إنشاء جميع Collections!');
  console.log('\n📋 الخطوات التالية:');
  console.log('1. تحقق من Collections في Appwrite Console');
  console.log('2. اضبط الصلاحيات (Permissions) حسب الحاجة');
  console.log('3. أضف بيانات تجريبية باستخدام create-sample-data.ts');
  console.log('4. اختبر الموقع على localhost');
}

// تشغيل السكريبت
createCollections().catch(console.error);