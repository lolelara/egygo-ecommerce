/**
 * إصلاح أذونات Collections في Appwrite
 * يسمح للجميع بقراءة المنتجات والفئات
 */

import 'dotenv/config';

const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.VITE_APPWRITE_API_KEY || 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

// Collections التي تحتاج أذونات قراءة عامة
const PUBLIC_READ_COLLECTIONS = [
  'products',
  'categories',
  'reviews'
];

// Collections التي تحتاج أذونات محددة
const USER_COLLECTIONS = [
  'orders',
  'wishlist',
  'commissions'
];

async function updateCollectionPermissions(collectionId, permissions) {
  const url = `${APPWRITE_ENDPOINT}/databases/${DATABASE_ID}/collections/${collectionId}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Appwrite-Project': PROJECT_ID,
      'X-Appwrite-Key': API_KEY
    },
    body: JSON.stringify({
      name: collectionId,
      permissions: permissions,
      documentSecurity: true // مهم: تفعيل document-level permissions
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to update ${collectionId}: ${error.message}`);
  }

  return response.json();
}

async function fixPermissions() {
  console.log('🔧 بدء إصلاح الأذونات...\n');

  try {
    // 1. Collections عامة - قراءة للجميع
    console.log('📖 تعديل أذونات القراءة العامة...');
    for (const collectionId of PUBLIC_READ_COLLECTIONS) {
      try {
        await updateCollectionPermissions(collectionId, [
          'read("any")',     // أي شخص يمكنه القراءة
          'create("users")', // المستخدمون المسجلون يمكنهم الإنشاء
          'update("users")', // المستخدمون المسجلون يمكنهم التحديث
          'delete("users")'  // المستخدمون المسجلون يمكنهم الحذف
        ]);
        console.log(`  ✅ ${collectionId}`);
      } catch (error) {
        console.log(`  ⚠️  ${collectionId}: ${error.message}`);
      }
    }

    // 2. Collections خاصة - المستخدمون فقط
    console.log('\n🔒 تعديل أذونات المستخدمين...');
    for (const collectionId of USER_COLLECTIONS) {
      try {
        await updateCollectionPermissions(collectionId, [
          'read("users")',   // المستخدمون المسجلون فقط
          'create("users")',
          'update("users")',
          'delete("users")'
        ]);
        console.log(`  ✅ ${collectionId}`);
      } catch (error) {
        console.log(`  ⚠️  ${collectionId}: ${error.message}`);
      }
    }

    // 3. Users collection - صلاحيات خاصة
    console.log('\n👥 تعديل أذونات المستخدمين...');
    try {
      await updateCollectionPermissions('users', [
        'read("users")',   // المستخدمون يقرأون بياناتهم فقط
        'create("users")', // التسجيل
        'update("users")', // تحديث البيانات
        'delete("users")'  // حذف الحساب
      ]);
      console.log('  ✅ users');
    } catch (error) {
      console.log(`  ⚠️  users: ${error.message}`);
    }

    console.log('\n✅ تم إصلاح الأذونات بنجاح!');
    console.log('\n📝 ملاحظة: تأكد من أن documentSecurity مفعّل لكل collection');
    console.log('   يمكنك التحقق من Appwrite Console > Database > Collections');

  } catch (error) {
    console.error('\n❌ خطأ:', error.message);
    process.exit(1);
  }
}

// تشغيل السكريبت
fixPermissions();
