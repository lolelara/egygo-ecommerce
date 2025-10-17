/**
 * Script to add Product Approval fields to Appwrite products collection
 * 
 * This script adds the following attributes:
 * - verificationVideo (String)
 * - approvalStatus (Enum: pending, approved, rejected)
 * - rejectionReason (String)
 * - approvedAt (String - DateTime)
 * - approvedBy (String)
 */

import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '';
const PRODUCTS_COLLECTION_ID = process.env.VITE_APPWRITE_PRODUCTS_COLLECTION || 'products';

async function addProductApprovalFields() {
  console.log('🚀 بدء إضافة حقول موافقة المنتجات...\n');
  console.log('📋 المعلومات:');
  console.log(`   Database ID: ${DATABASE_ID}`);
  console.log(`   Collection ID: ${PRODUCTS_COLLECTION_ID}\n`);

  try {
    // 1. Add verificationVideo field
    console.log('1️⃣ إضافة حقل verificationVideo...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'verificationVideo',
        500,         // size
        false        // required
      );
      console.log('   ✅ تم إضافة verificationVideo بنجاح\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('   ⚠️ verificationVideo موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 2. Add approvalStatus field (Enum) - without default value for required field
    console.log('2️⃣ إضافة حقل approvalStatus...');
    try {
      await databases.createEnumAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'approvalStatus',
        ['pending', 'approved', 'rejected'],  // enum values
        false        // optional (to avoid default value issue)
      );
      console.log('   ✅ تم إضافة approvalStatus بنجاح\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('   ⚠️ approvalStatus موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 3. Add rejectionReason field
    console.log('3️⃣ إضافة حقل rejectionReason...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'rejectionReason',
        1000,        // size
        false        // required
      );
      console.log('   ✅ تم إضافة rejectionReason بنجاح\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('   ⚠️ rejectionReason موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 4. Add approvedAt field
    console.log('4️⃣ إضافة حقل approvedAt...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'approvedAt',
        50,          // size
        false        // required
      );
      console.log('   ✅ تم إضافة approvedAt بنجاح\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('   ⚠️ approvedAt موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 5. Add approvedBy field
    console.log('5️⃣ إضافة حقل approvedBy...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        'approvedBy',
        50,          // size
        false        // required
      );
      console.log('   ✅ تم إضافة approvedBy بنجاح\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('   ⚠️ approvedBy موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    console.log('═══════════════════════════════════════════════');
    console.log('✨ تم إضافة جميع الحقول بنجاح!');
    console.log('═══════════════════════════════════════════════\n');
    
    console.log('📝 الحقول المضافة:');
    console.log('   1. verificationVideo (String, 500) - Optional');
    console.log('   2. approvalStatus (Enum: pending, approved, rejected) - Optional');
    console.log('   3. rejectionReason (String, 1000) - Optional');
    console.log('   4. approvedAt (String, 50) - Optional');
    console.log('   5. approvedBy (String, 50) - Optional\n');

    console.log('🎯 الخطوات التالية:');
    console.log('   1. افتح Appwrite Dashboard للتحقق من الحقول');
    console.log('   2. تأكد من Permissions للـ Collection');
    console.log('   3. يمكنك الآن استخدام نظام موافقة المنتجات\n');

  } catch (error: any) {
    console.error('❌ حدث خطأ:', error.message);
    console.error('\nالتفاصيل:', error);
    process.exit(1);
  }
}

// Run the script
console.log('\n');
console.log('═══════════════════════════════════════════════');
console.log('   🔐 إضافة حقول موافقة المنتجات');
console.log('═══════════════════════════════════════════════\n');

addProductApprovalFields()
  .then(() => {
    console.log('✅ اكتمل السكريبت بنجاح!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ فشل السكريبت:', error);
    process.exit(1);
  });
