/**
 * Update Products Collection for Intermediary System
 * Adds new fields: sourceUrl, originalPrice, priceMarkup, priceMarkupType, intermediaryId, intermediaryName
 */

import { Client, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '68d8b9db00134c41e7c8')
  .setKey(process.env.VITE_APPWRITE_API_KEY || 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';
const COLLECTION_ID = process.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID || 'products';

async function updateProductsCollection() {
  console.log('🔄 بدء تحديث Products Collection...\n');

  try {
    // 1. Add sourceUrl (string, 2048)
    console.log('📝 إضافة حقل sourceUrl...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'sourceUrl',
        2048,
        false, // not required
        '', // default value
        false // not array
      );
      console.log('✅ تم إضافة sourceUrl\n');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('ℹ️  sourceUrl موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // Wait a bit for Appwrite to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Add originalPrice (float)
    console.log('📝 إضافة حقل originalPrice...');
    try {
      await databases.createFloatAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'originalPrice',
        false, // not required
        0, // default value
        undefined, // min
        undefined, // max
        false // not array
      );
      console.log('✅ تم إضافة originalPrice\n');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('ℹ️  originalPrice موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Add priceMarkup (float)
    console.log('📝 إضافة حقل priceMarkup...');
    try {
      await databases.createFloatAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'priceMarkup',
        false, // not required
        0, // default value
        undefined,
        undefined,
        false
      );
      console.log('✅ تم إضافة priceMarkup\n');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('ℹ️  priceMarkup موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Add priceMarkupType (string, 20)
    console.log('📝 إضافة حقل priceMarkupType...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'priceMarkupType',
        20,
        false, // not required
        'percentage', // default value
        false
      );
      console.log('✅ تم إضافة priceMarkupType\n');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('ℹ️  priceMarkupType موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Add intermediaryId (string, 100)
    console.log('📝 إضافة حقل intermediaryId...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'intermediaryId',
        100,
        false, // not required
        '', // default value
        false
      );
      console.log('✅ تم إضافة intermediaryId\n');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('ℹ️  intermediaryId موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 6. Add intermediaryName (string, 255)
    console.log('📝 إضافة حقل intermediaryName...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'intermediaryName',
        255,
        false, // not required
        '', // default value
        false
      );
      console.log('✅ تم إضافة intermediaryName\n');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('ℹ️  intermediaryName موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 تم تحديث Products Collection بنجاح!');
    console.log('\n📋 الحقول المضافة:');
    console.log('   ✅ sourceUrl (string, 2048)');
    console.log('   ✅ originalPrice (float)');
    console.log('   ✅ priceMarkup (float)');
    console.log('   ✅ priceMarkupType (string, 20)');
    console.log('   ✅ intermediaryId (string, 100)');
    console.log('   ✅ intermediaryName (string, 255)');
    console.log('\n✨ نظام الوسيط جاهز للاستخدام الآن!\n');

  } catch (error) {
    console.error('\n❌ خطأ في تحديث Collection:', error);
    throw error;
  }
}

// Run the update
updateProductsCollection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
