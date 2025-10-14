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

async function addColorSizeInventory() {
  try {
    console.log('🚀 بدء إضافة colorSizeInventory attribute...\n');

    // Add colorSizeInventory attribute
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
    console.log('\n📋 تم إضافة:');
    console.log('   ✅ colorSizeInventory (String, size: 5000)');
    console.log('\n🚀 الآن يمكنك استخدام نظام إدارة المخزون المتقدم!');

  } catch (error) {
    console.error('❌ خطأ:', error.message);
    console.error('التفاصيل:', error);
    process.exit(1);
  }
}

addColorSizeInventory();
