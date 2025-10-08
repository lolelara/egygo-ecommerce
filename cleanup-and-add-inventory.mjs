import { Client, Databases } from 'node-appwrite';
import { config } from 'dotenv';

config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_API_KEY || process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = 'products';

// Attributes to delete (unused ones)
const ATTRIBUTES_TO_DELETE = [
  'sourceUrl',
  'originalPrice', 
  'priceMarkup',
  'priceMarkupType',
  'intermediaryId',
  'intermediaryName',
  'lastSyncedAt',
  'autoSyncEnabled',
  'syncIntervalMinutes',
  'originalDescription',
  'customDescription',
  'priceOverride'
];

async function cleanupAndAddInventory() {
  try {
    console.log('🚀 بدء تنظيف الـ attributes وإضافة colorSizeInventory...\n');

    // Step 1: Delete unused attributes
    console.log('🗑️  حذف الـ attributes غير المستخدمة...\n');
    
    for (const attr of ATTRIBUTES_TO_DELETE) {
      try {
        await databases.deleteAttribute(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          attr
        );
        console.log(`   ✅ تم حذف ${attr}`);
        
        // Wait a bit between deletions
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        if (error.code === 404) {
          console.log(`   ⚠️  ${attr} غير موجود`);
        } else {
          console.log(`   ❌ خطأ في حذف ${attr}: ${error.message}`);
        }
      }
    }

    console.log('\n⏳ انتظار 5 ثوانٍ لضمان اكتمال الحذف...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 2: Add colorSizeInventory attribute
    console.log('➕ إضافة colorSizeInventory attribute...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'colorSizeInventory',
        5000,
        false // not required
      );
      console.log('✅ تم إضافة colorSizeInventory بنجاح!');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  colorSizeInventory موجود بالفعل');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 تم تطبيق جميع التعديلات بنجاح!');
    console.log('\n📋 ملخص:');
    console.log(`   🗑️  تم حذف ${ATTRIBUTES_TO_DELETE.length} attributes غير مستخدمة`);
    console.log('   ✅ تم إضافة colorSizeInventory (String, size: 5000)');
    console.log('\n🚀 الآن يمكنك استخدام نظام إدارة المخزون المتقدم!');

  } catch (error) {
    console.error('\n❌ خطأ:', error.message);
    console.error('التفاصيل:', error);
    process.exit(1);
  }
}

cleanupAndAddInventory();
