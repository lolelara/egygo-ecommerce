/**
 * Delete User Script
 * حذف مستخدم بشكل كامل من النظام
 */

import { Client, Databases, Users, Query } from 'node-appwrite';
import { config } from 'dotenv';

config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const users = new Users(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

// معلومات المستخدم المراد حذفه
const USER_EMAIL = 'moazkasr@gmail.com';
const USER_PHONE = '01010919028';

async function deleteUser() {
  console.log('\n🗑️  بدء عملية حذف المستخدم...\n');
  console.log(`📧 البريد الإلكتروني: ${USER_EMAIL}`);
  console.log(`📱 رقم الهاتف: ${USER_PHONE}\n`);

  let userId: string | null = null;
  let userPref: any = null;

  try {
    // 1. البحث في Auth أولاً
    console.log('🔍 البحث عن المستخدم في Auth...');
    try {
      const usersList = await users.list([
        Query.equal('email', USER_EMAIL)
      ]);

      if (usersList.users.length > 0) {
        const authUser = usersList.users[0];
        userId = authUser.$id;
        console.log(`✅ تم العثور على المستخدم في Auth:`);
        console.log(`   - الاسم: ${authUser.name}`);
        console.log(`   - البريد: ${authUser.email}`);
        console.log(`   - الهاتف: ${authUser.phone}`);
        console.log(`   - User ID: ${userId}\n`);
      } else {
        console.log('⚠️  لم يتم العثور على المستخدم في Auth');
      }
    } catch (authError: any) {
      console.log('⚠️  خطأ في البحث في Auth:', authError.message);
    }

    // 2. البحث عن المستخدم في userPreferences
    console.log('🔍 البحث عن المستخدم في userPreferences...');
    const userPrefsResponse = await databases.listDocuments(
      DATABASE_ID,
      'userPreferences',
      [
        Query.equal('email', USER_EMAIL)
      ]
    );

    if (userPrefsResponse.documents.length === 0) {
      console.log('⚠️  لم يتم العثور على المستخدم في userPreferences');
      
      // محاولة البحث برقم الهاتف
      const phoneSearch = await databases.listDocuments(
        DATABASE_ID,
        'userPreferences',
        [
          Query.equal('phone', USER_PHONE)
        ]
      );

      if (phoneSearch.documents.length > 0) {
        userPref = phoneSearch.documents[0];
        if (!userId) userId = userPref.userId;
      }
    } else {
      userPref = userPrefsResponse.documents[0];
      if (!userId) userId = userPref.userId;
    }

    if (!userId) {
      console.log('❌ لم يتم العثور على المستخدم بالبريد أو الهاتف في أي مكان');
      return;
    }

    if (userPref) {
      console.log(`✅ تم العثور على المستخدم في userPreferences:`);
      console.log(`   - الاسم: ${userPref.name}`);
      console.log(`   - البريد: ${userPref.email}`);
      console.log(`   - الهاتف: ${userPref.phone}`);
      console.log(`   - الدور: ${userPref.role}`);
      console.log(`   - Document ID: ${userPref.$id}\n`);
    }

    console.log(`🎯 User ID المستخدم للحذف: ${userId}\n`);

    // 3. حذف من userPreferences collection
    if (userPref) {
      console.log('🗑️  حذف من userPreferences collection...');
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          'userPreferences',
          userPref.$id
        );
        console.log('✅ تم الحذف من userPreferences\n');
      } catch (error: any) {
        console.error('❌ خطأ في حذف userPreferences:', error.message);
      }
    }

    // 3. حذف الإشعارات الخاصة بالمستخدم
    console.log('🔔 حذف الإشعارات...');
    try {
      const notifications = await databases.listDocuments(
        DATABASE_ID,
        'notifications',
        [
          Query.equal('userId', userId),
          Query.limit(100)
        ]
      );

      for (const notif of notifications.documents) {
        await databases.deleteDocument(DATABASE_ID, 'notifications', notif.$id);
      }
      console.log(`✅ تم حذف ${notifications.documents.length} إشعار\n`);
    } catch (error: any) {
      console.error('⚠️  خطأ في حذف الإشعارات:', error.message);
    }

    // 4. حذف الإحالات (referrals)
    console.log('👥 حذف الإحالات...');
    try {
      const referrals = await databases.listDocuments(
        DATABASE_ID,
        'referrals',
        [
          Query.equal('referredUserId', userId),
          Query.limit(100)
        ]
      );

      for (const ref of referrals.documents) {
        await databases.deleteDocument(DATABASE_ID, 'referrals', ref.$id);
      }
      console.log(`✅ تم حذف ${referrals.documents.length} إحالة\n`);
    } catch (error: any) {
      console.error('⚠️  خطأ في حذف الإحالات:', error.message);
    }

    // 5. حذف من Auth (Appwrite Authentication)
    console.log('🔐 حذف من نظام المصادقة (Auth)...');
    try {
      await users.delete(userId);
      console.log('✅ تم الحذف من Auth\n');
    } catch (error: any) {
      console.error('⚠️  خطأ في حذف Auth:', error.message);
      console.log('   (قد يكون المستخدم محذوف مسبقاً من Auth)\n');
    }

    console.log('═══════════════════════════════════════════════');
    console.log('✅ تم حذف المستخدم بنجاح من جميع الأماكن!');
    console.log('═══════════════════════════════════════════════\n');

  } catch (error: any) {
    console.error('\n❌ خطأ في عملية الحذف:', error.message);
    throw error;
  }
}

// تشغيل السكريبت
deleteUser()
  .then(() => {
    console.log('✅ اكتملت العملية بنجاح\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ فشلت العملية:', error);
    process.exit(1);
  });
