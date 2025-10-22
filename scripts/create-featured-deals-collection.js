/**
 * Create Featured Deals Collection
 * سكريبت إنشاء مجموعة العروض المميزة
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

console.log('🚀 بدء إنشاء Featured Deals Collection...\n');
console.log('📋 DATABASE_ID:', DATABASE_ID);
console.log('📋 PROJECT_ID:', process.env.APPWRITE_PROJECT_ID);
console.log('─────────────────────────────────────────\n');

async function createFeaturedDealsCollection() {
  try {
    console.log('📦 إنشاء featuredDeals collection...');
    
    // Create collection
    await databases.createCollection(
      DATABASE_ID,
      'featuredDeals',
      'featuredDeals',
      [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.team('admin')),
        sdk.Permission.update(sdk.Role.team('admin')),
        sdk.Permission.delete(sdk.Role.team('admin')),
      ]
    );

    console.log('✅ featuredDeals collection created');

    // Create Attributes
    console.log('📝 إنشاء Attributes...');

    await databases.createStringAttribute(DATABASE_ID, 'featuredDeals', 'productId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'featuredDeals', 'productName', 500, true);
    await databases.createStringAttribute(DATABASE_ID, 'featuredDeals', 'productImage', 2000, false);
    await databases.createFloatAttribute(DATABASE_ID, 'featuredDeals', 'price', true);
    await databases.createFloatAttribute(DATABASE_ID, 'featuredDeals', 'originalPrice', true);
    await databases.createIntegerAttribute(DATABASE_ID, 'featuredDeals', 'discount', true);
    await databases.createIntegerAttribute(DATABASE_ID, 'featuredDeals', 'order', true);
    await databases.createBooleanAttribute(DATABASE_ID, 'featuredDeals', 'active', true, true);
    await databases.createDatetimeAttribute(DATABASE_ID, 'featuredDeals', 'createdAt', true);

    console.log('✅ Attributes created');

    // Wait for attributes to be available
    console.log('⏳ انتظار تفعيل Attributes...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create Indexes
    console.log('📊 إنشاء Indexes...');

    await databases.createIndex(
      DATABASE_ID,
      'featuredDeals',
      'productId_idx',
      'key',
      ['productId'],
      ['asc']
    );

    await databases.createIndex(
      DATABASE_ID,
      'featuredDeals',
      'order_idx',
      'key',
      ['order'],
      ['asc']
    );

    await databases.createIndex(
      DATABASE_ID,
      'featuredDeals',
      'active_idx',
      'key',
      ['active'],
      ['asc']
    );

    await databases.createIndex(
      DATABASE_ID,
      'featuredDeals',
      'createdAt_idx',
      'key',
      ['createdAt'],
      ['desc']
    );

    console.log('✅ Indexes created\n');
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  featuredDeals collection already exists\n');
    } else {
      console.error('❌ Error creating featuredDeals:', error.message);
      throw error;
    }
  }
}

async function main() {
  try {
    await createFeaturedDealsCollection();

    console.log('─────────────────────────────────────────');
    console.log('🎉 تم إنشاء Featured Deals Collection بنجاح!\n');
    console.log('📋 الملخص:');
    console.log('  ✅ featuredDeals collection');
    console.log('  ✅ 9 Attributes (productId, productName, productImage, price, originalPrice, discount, order, active, createdAt)');
    console.log('  ✅ 4 Indexes (productId, order, active, createdAt)\n');
    console.log('✨ يمكنك الآن إدارة العروض من لوحة الأدمن!\n');
    console.log('🔗 الخطوات التالية:');
    console.log('  1. افتح /admin/deals لإدارة العروض');
    console.log('  2. أضف منتجات للعروض');
    console.log('  3. رتب العروض بالسحب والإفلات');
    console.log('  4. تحقق من /deals لعرض النتيجة');
    console.log('─────────────────────────────────────────\n');
  } catch (error) {
    console.error('\n❌ فشل في إنشاء Collection');
    console.error('تفاصيل الخطأ:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
