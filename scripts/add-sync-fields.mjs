import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// تحميل المتغيرات من .env
dotenv.config({ path: join(__dirname, '..', '.env') });

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.VITE_APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = process.env.VITE_APPWRITE_PRODUCTS_COLLECTION || 'products';

async function addSyncFields() {
  console.log('🔄 بدء إضافة حقول التحديث التلقائي...\n');

  try {
    // 1. lastSyncedAt - آخر وقت تم فيه تحديث المنتج
    console.log('📝 إضافة حقل lastSyncedAt...');
    try {
      await databases.createDatetimeAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'lastSyncedAt',
        false // not required
      );
      console.log('✅ تم إضافة lastSyncedAt');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️ lastSyncedAt موجود بالفعل');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. autoSyncEnabled - هل التحديث التلقائي مفعل
    console.log('\n📝 إضافة حقل autoSyncEnabled...');
    try {
      await databases.createBooleanAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'autoSyncEnabled',
        false,
        true // default to true
      );
      console.log('✅ تم إضافة autoSyncEnabled');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️ autoSyncEnabled موجود بالفعل');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. syncIntervalMinutes - الفترة بين كل تحديث (دقائق)
    console.log('\n📝 إضافة حقل syncIntervalMinutes...');
    try {
      await databases.createIntegerAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'syncIntervalMinutes',
        false,
        10 // default 10 minutes
      );
      console.log('✅ تم إضافة syncIntervalMinutes');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️ syncIntervalMinutes موجود بالفعل');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. originalDescription - الوصف الأصلي قبل التعديل
    console.log('\n📝 إضافة حقل originalDescription...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'originalDescription',
        5000, // 5000 characters
        false
      );
      console.log('✅ تم إضافة originalDescription');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️ originalDescription موجود بالفعل');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. customDescription - الوصف المخصص من الوسيط
    console.log('\n📝 إضافة حقل customDescription...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'customDescription',
        5000,
        false
      );
      console.log('✅ تم إضافة customDescription');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️ customDescription موجود بالفعل');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 6. priceOverride - السعر المخصص من الوسيط (إذا كان مختلف عن الحساب التلقائي)
    console.log('\n📝 إضافة حقل priceOverride...');
    try {
      await databases.createFloatAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'priceOverride',
        false
      );
      console.log('✅ تم إضافة priceOverride');
    } catch (error) {
      if (error.message?.includes('already exists')) {
        console.log('⚠️ priceOverride موجود بالفعل');
      } else {
        throw error;
      }
    }

    console.log('\n\n🎉 تم إضافة جميع حقول التحديث التلقائي بنجاح!\n');
    console.log('📋 الحقول المضافة:');
    console.log('   ✅ lastSyncedAt (datetime) - آخر وقت تحديث');
    console.log('   ✅ autoSyncEnabled (boolean) - تفعيل التحديث التلقائي');
    console.log('   ✅ syncIntervalMinutes (integer) - الفترة بين التحديثات');
    console.log('   ✅ originalDescription (string) - الوصف الأصلي');
    console.log('   ✅ customDescription (string) - الوصف المخصص');
    console.log('   ✅ priceOverride (float) - السعر المخصص');
    console.log('\n✨ نظام التحديث التلقائي جاهز للاستخدام!\n');

  } catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
  }
}

addSyncFields();
