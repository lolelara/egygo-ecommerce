import { Client, Databases, IndexType } from 'node-appwrite';
import { config } from 'dotenv';

config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); // Need API key for admin operations

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = 'products';

async function addMerchantAttributes() {
  try {
    console.log('🚀 بدء إضافة attributes للتجار...\n');

    // 1. Add merchantId attribute
    console.log('➕ إضافة merchantId attribute...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'merchantId',
        36,
        false // not required
      );
      console.log('✅ تم إضافة merchantId بنجاح!\n');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  merchantId موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // Wait for attribute to be available
    console.log('⏳ انتظار تفعيل merchantId...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2. Add colors attribute (array)
    console.log('➕ إضافة colors attribute...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'colors',
        50,
        false, // not required
        undefined, // default value
        true // array = true
      );
      console.log('✅ تم إضافة colors بنجاح!\n');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  colors موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // Wait for attribute to be available
    console.log('⏳ انتظار تفعيل colors...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 3. Add sizes attribute (array)
    console.log('➕ إضافة sizes attribute...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'sizes',
        50,
        false, // not required
        undefined, // default value
        true // array = true
      );
      console.log('✅ تم إضافة sizes بنجاح!\n');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  sizes موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // Wait for attribute to be available
    console.log('⏳ انتظار تفعيل sizes...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 4. Create index on merchantId
    console.log('➕ إنشاء merchant_index...');
    try {
      await databases.createIndex(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'merchant_index',
        IndexType.Key,
        ['merchantId']
      );
      console.log('✅ تم إنشاء merchant_index بنجاح!\n');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  merchant_index موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    console.log('🎉 تم تطبيق جميع التعديلات بنجاح!');
    console.log('\n📋 تم إضافة:');
    console.log('   ✅ merchantId (String, size: 36)');
    console.log('   ✅ colors (String Array, size: 50)');
    console.log('   ✅ sizes (String Array, size: 50)');
    console.log('   ✅ merchant_index (Index on merchantId)');
    console.log('\n🚀 الآن يمكنك استخدام ميزات التجار بالكامل!');

  } catch (error) {
    console.error('❌ خطأ:', error.message);
    console.error('التفاصيل:', error);
    process.exit(1);
  }
}

addMerchantAttributes();
