/**
 * Fix Featured Deals Collection Permissions
 * إصلاح صلاحيات مجموعة العروض المميزة
 */

import * as sdk from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Appwrite
const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';
const COLLECTION_ID = 'featuredDeals';

console.log('🔧 إصلاح صلاحيات Featured Deals Collection...\n');
console.log('📋 DATABASE_ID:', DATABASE_ID);
console.log('📋 COLLECTION_ID:', COLLECTION_ID);
console.log('─────────────────────────────────────────\n');

async function fixPermissions() {
  try {
    console.log('⚙️  تحديث صلاحيات Collection...');

    // Update collection permissions
    await databases.updateCollection(
      DATABASE_ID,
      COLLECTION_ID,
      COLLECTION_ID,
      [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.users()),
        sdk.Permission.update(sdk.Role.users()),
        sdk.Permission.delete(sdk.Role.users()),
      ],
      false, // documentSecurity
      true   // enabled
    );

    console.log('✅ تم تحديث الصلاحيات بنجاح!\n');
    console.log('📋 الصلاحيات الجديدة:');
    console.log('  ✅ Read: أي شخص (any)');
    console.log('  ✅ Create: المستخدمين المسجلين (users)');
    console.log('  ✅ Update: المستخدمين المسجلين (users)');
    console.log('  ✅ Delete: المستخدمين المسجلين (users)\n');
    
  } catch (error) {
    if (error.code === 404) {
      console.log('⚠️  Collection غير موجود! سيتم إنشاؤه...\n');
      
      // If collection doesn't exist, create it
      await createFeaturedDealsCollection();
    } else {
      console.error('❌ خطأ في تحديث الصلاحيات:', error.message);
      throw error;
    }
  }
}

async function createFeaturedDealsCollection() {
  try {
    console.log('📦 إنشاء featuredDeals collection...');
    
    // Create collection
    await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      COLLECTION_ID,
      [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.users()),
        sdk.Permission.update(sdk.Role.users()),
        sdk.Permission.delete(sdk.Role.users()),
      ]
    );

    console.log('✅ featuredDeals collection created');

    // Create Attributes
    console.log('📝 إنشاء Attributes...');

    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'productId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'productName', 500, true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'productImage', 2000, false);
    await databases.createFloatAttribute(DATABASE_ID, COLLECTION_ID, 'price', true);
    await databases.createFloatAttribute(DATABASE_ID, COLLECTION_ID, 'originalPrice', true);
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'discount', true);
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'order', true);
    await databases.createBooleanAttribute(DATABASE_ID, COLLECTION_ID, 'active', false, true);
    await databases.createDatetimeAttribute(DATABASE_ID, COLLECTION_ID, 'createdAt', true);

    console.log('✅ Attributes created');

    // Wait for attributes
    console.log('⏳ انتظار تفعيل Attributes...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create Indexes
    console.log('📊 إنشاء Indexes...');

    await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'productId_idx', 'key', ['productId'], ['asc']);
    await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'order_idx', 'key', ['order'], ['asc']);
    await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'active_idx', 'key', ['active'], ['asc']);
    await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'createdAt_idx', 'key', ['createdAt'], ['desc']);

    console.log('✅ Indexes created\n');
  } catch (error) {
    console.error('❌ Error creating collection:', error.message);
    throw error;
  }
}

async function main() {
  try {
    await fixPermissions();

    console.log('─────────────────────────────────────────');
    console.log('🎉 تم إصلاح Permissions بنجاح!\n');
    console.log('✨ يمكنك الآن:');
    console.log('  1. إضافة عروض جديدة');
    console.log('  2. تعديل العروض الموجودة');
    console.log('  3. حذف العروض');
    console.log('  4. عرض العروض في الصفحة الرئيسية\n');
    console.log('🔗 اذهب إلى: /admin/deals');
    console.log('─────────────────────────────────────────\n');
  } catch (error) {
    console.error('\n❌ فشل في إصلاح Permissions');
    console.error('تفاصيل الخطأ:', error.message);
    console.error('\nالحلول المقترحة:');
    console.log('1. تأكد من صحة APPWRITE_API_KEY في .env');
    console.log('2. تأكد من صحة APPWRITE_PROJECT_ID');
    console.log('3. تأكد من أن API Key له صلاحيات كافية');
    console.log('4. قم بإنشاء Collection يدوياً من لوحة Appwrite\n');
    process.exit(1);
  }
}

// Run the script
main();
