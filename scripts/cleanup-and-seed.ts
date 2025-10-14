import { Client, Databases, Storage, Users, ID, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || '')
  .setKey(process.env.VITE_APPWRITE_API_KEY || process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const storage = new Storage(client);
const users = new Users(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || process.env.APPWRITE_DATABASE_ID || '';
const STORAGE_BUCKET_ID = process.env.VITE_APPWRITE_STORAGE_ID || process.env.APPWRITE_STORAGE_BUCKET_ID || 'product-images';

// Test users data
const testUsers = [
  {
    email: 'admin@egygo.com',
    password: 'Admin@123',
    name: 'مدير النظام',
    role: 'admin',
    phone: '+201000000001'
  },
  {
    email: 'merchant@egygo.com',
    password: 'Merchant@123',
    name: 'تاجر تجريبي',
    role: 'merchant',
    phone: '+201000000002'
  },
  {
    email: 'affiliate@egygo.com',
    password: 'Affiliate@123',
    name: 'مسوق بالعمولة',
    role: 'affiliate',
    phone: '+201000000003'
  },
  {
    email: 'intermediary@egygo.com',
    password: 'Intermediary@123',
    name: 'وسيط تجريبي',
    role: 'intermediary',
    phone: '+201000000004'
  },
  {
    email: 'customer@egygo.com',
    password: 'Customer@123',
    name: 'عميل تجريبي',
    role: 'customer',
    phone: '+201000000005'
  }
];

/**
 * حذف جميع المستخدمين
 */
async function deleteAllUsers() {
  console.log('🗑️  حذف جميع المستخدمين...');
  
  try {
    let hasMore = true;
    let deletedCount = 0;
    
    while (hasMore) {
      const usersList = await users.list([Query.limit(100)]);
      
      if (usersList.users.length === 0) {
        hasMore = false;
        break;
      }
      
      for (const user of usersList.users) {
        try {
          await users.delete(user.$id);
          deletedCount++;
          console.log(`  ✓ تم حذف المستخدم: ${user.name || user.email}`);
        } catch (error: any) {
          console.log(`  ✗ فشل حذف المستخدم ${user.email}: ${error.message}`);
        }
      }
    }
    
    console.log(`✅ تم حذف ${deletedCount} مستخدم\n`);
  } catch (error: any) {
    console.error('❌ خطأ في حذف المستخدمين:', error.message);
  }
}

/**
 * حذف جميع الصور من Storage
 */
async function deleteAllImages() {
  console.log('🗑️  حذف جميع الصور...');
  
  try {
    let hasMore = true;
    let deletedCount = 0;
    
    while (hasMore) {
      const filesList = await storage.listFiles(STORAGE_BUCKET_ID, [Query.limit(100)]);
      
      if (filesList.files.length === 0) {
        hasMore = false;
        break;
      }
      
      for (const file of filesList.files) {
        try {
          await storage.deleteFile(STORAGE_BUCKET_ID, file.$id);
          deletedCount++;
          console.log(`  ✓ تم حذف الصورة: ${file.name}`);
        } catch (error: any) {
          console.log(`  ✗ فشل حذف الصورة ${file.name}: ${error.message}`);
        }
      }
    }
    
    console.log(`✅ تم حذف ${deletedCount} صورة\n`);
  } catch (error: any) {
    console.error('❌ خطأ في حذف الصور:', error.message);
  }
}

/**
 * حذف جميع المنتجات
 */
async function deleteAllProducts() {
  console.log('🗑️  حذف جميع المنتجات...');
  
  try {
    let hasMore = true;
    let deletedCount = 0;
    
    while (hasMore) {
      const productsList = await databases.listDocuments(
        DATABASE_ID,
        'products',
        [Query.limit(100)]
      );
      
      if (productsList.documents.length === 0) {
        hasMore = false;
        break;
      }
      
      for (const product of productsList.documents) {
        try {
          await databases.deleteDocument(DATABASE_ID, 'products', product.$id);
          deletedCount++;
          console.log(`  ✓ تم حذف المنتج: ${product.name}`);
        } catch (error: any) {
          console.log(`  ✗ فشل حذف المنتج ${product.name}: ${error.message}`);
        }
      }
    }
    
    console.log(`✅ تم حذف ${deletedCount} منتج\n`);
  } catch (error: any) {
    console.error('❌ خطأ في حذف المنتجات:', error.message);
  }
}

/**
 * حذف جميع الطلبات
 */
async function deleteAllOrders() {
  console.log('🗑️  حذف جميع الطلبات...');
  
  try {
    let hasMore = true;
    let deletedCount = 0;
    
    while (hasMore) {
      const ordersList = await databases.listDocuments(
        DATABASE_ID,
        'orders',
        [Query.limit(100)]
      );
      
      if (ordersList.documents.length === 0) {
        hasMore = false;
        break;
      }
      
      for (const order of ordersList.documents) {
        try {
          await databases.deleteDocument(DATABASE_ID, 'orders', order.$id);
          deletedCount++;
          console.log(`  ✓ تم حذف الطلب: ${order.$id}`);
        } catch (error: any) {
          console.log(`  ✗ فشل حذف الطلب: ${error.message}`);
        }
      }
    }
    
    console.log(`✅ تم حذف ${deletedCount} طلب\n`);
  } catch (error: any) {
    console.error('❌ خطأ في حذف الطلبات:', error.message);
  }
}

/**
 * إنشاء مستخدم تجريبي
 */
async function createTestUser(userData: typeof testUsers[0]) {
  try {
    // إنشاء المستخدم في Auth
    const user = await users.create(
      ID.unique(),
      userData.email,
      userData.phone,
      userData.password,
      userData.name
    );
    
    console.log(`  ✓ تم إنشاء مستخدم: ${userData.name} (${userData.email})`);
    
    return user;
  } catch (error: any) {
    console.error(`  ❌ فشل إنشاء المستخدم ${userData.email}: ${error.message}`);
    return null;
  }
}

/**
 * إنشاء جميع المستخدمين التجريبيين
 */
async function createAllTestUsers() {
  console.log('👥 إنشاء المستخدمين التجريبيين...\n');
  
  for (const userData of testUsers) {
    await createTestUser(userData);
    console.log('');
  }
  
  console.log('✅ تم إنشاء جميع المستخدمين التجريبيين\n');
}

/**
 * عرض معلومات تسجيل الدخول
 */
function displayLoginInfo() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 معلومات تسجيل الدخول للمستخدمين التجريبيين');
  console.log('='.repeat(60) + '\n');
  
  testUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (${user.role.toUpperCase()})`);
    console.log(`   البريد: ${user.email}`);
    console.log(`   كلمة المرور: ${user.password}`);
    console.log('');
  });
  
  console.log('='.repeat(60) + '\n');
}

/**
 * السكربت الرئيسي
 */
async function main() {
  console.log('\n🚀 بدء تنظيف قاعدة البيانات وإضافة بيانات تجريبية\n');
  console.log('⚠️  تحذير: سيتم حذف جميع البيانات!\n');
  
  try {
    // 1. حذف جميع المستخدمين
    await deleteAllUsers();
    
    // 2. حذف جميع الصور
    await deleteAllImages();
    
    // 3. حذف جميع المنتجات
    await deleteAllProducts();
    
    // 4. حذف جميع الطلبات
    await deleteAllOrders();
    
    // 5. إنشاء المستخدمين التجريبيين
    await createAllTestUsers();
    
    // 6. عرض معلومات تسجيل الدخول
    displayLoginInfo();
    
    console.log('✅ تم تنظيف قاعدة البيانات وإضافة البيانات التجريبية بنجاح!\n');
    
  } catch (error: any) {
    console.error('\n❌ حدث خطأ:', error.message);
    process.exit(1);
  }
}

// تشغيل السكربت
main();
