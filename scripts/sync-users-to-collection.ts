/**
 * سكريبت لمزامنة المستخدمين من Appwrite Auth إلى Users Collection
 * 
 * هذا السكريبت يجب تشغيله من Server-side فقط
 * لأن Appwrite لا يسمح بجلب قائمة المستخدمين من Client-side
 */

import { config } from 'dotenv';
import { Client, Users, Databases, Query } from 'node-appwrite';

// تحميل متغيرات البيئة من .env
config();

// تكوين Appwrite
const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || ''); // ⚠️ API Key مطلوب (Server-side only)

const users = new Users(client);
const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';
const USERS_COLLECTION_ID = process.env.VITE_APPWRITE_USERS_COLLECTION || 'users';

interface AppwriteUser {
  $id: string;
  email: string;
  name: string;
  prefs: any;
  registration: string;
  status: boolean;
}

/**
 * جلب جميع المستخدمين من Appwrite Auth
 */
async function getAllAuthUsers(): Promise<AppwriteUser[]> {
  try {
    console.log('📥 جلب المستخدمين من Appwrite Auth...');
    
    const allUsers: AppwriteUser[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await users.list([
        Query.limit(limit),
        Query.offset(offset)
      ]);

      allUsers.push(...response.users as any);
      
      console.log(`   ✓ تم جلب ${response.users.length} مستخدم (الإجمالي: ${allUsers.length})`);

      if (response.users.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    console.log(`✅ تم جلب ${allUsers.length} مستخدم من Auth\n`);
    return allUsers;
  } catch (error) {
    console.error('❌ خطأ في جلب المستخدمين:', error);
    throw error;
  }
}

/**
 * التحقق من وجود مستخدم في Collection
 */
async function userExistsInCollection(userId: string): Promise<boolean> {
  try {
    await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);
    return true;
  } catch (error: any) {
    if (error.code === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * إنشاء أو تحديث مستخدم في Collection
 */
async function syncUserToCollection(user: AppwriteUser): Promise<void> {
  try {
    const exists = await userExistsInCollection(user.$id);
    
    const userData = {
      email: user.email,
      name: user.name || user.email.split('@')[0],
      phone: user.prefs?.phone || '',
      alternativePhone: user.prefs?.alternativePhone || '',
      address: user.prefs?.address || '',
      isAffiliate: user.prefs?.isAffiliate || false,
      isMerchant: user.prefs?.isMerchant || false,
      isIntermediary: user.prefs?.isIntermediary || false,
      affiliateCode: user.prefs?.affiliateCode || null,
      commissionRate: user.prefs?.commissionRate || 0.15,
      totalEarnings: user.prefs?.totalEarnings || 0,
      pendingEarnings: user.prefs?.pendingEarnings || 0,
      referralCount: user.prefs?.referralCount || 0,
      accountStatus: user.prefs?.accountStatus || 'approved',
      isActive: user.status,
      approvedAt: user.prefs?.approvedAt || user.registration,
      approvedBy: user.prefs?.approvedBy || null,
      rejectionReason: user.prefs?.rejectionReason || null,
    };

    if (exists) {
      // تحديث المستخدم الموجود
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id,
        userData
      );
      console.log(`   ↻ تم تحديث: ${user.email}`);
    } else {
      // إنشاء مستخدم جديد
      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        user.$id,
        userData
      );
      console.log(`   ✓ تم إنشاء: ${user.email}`);
    }
  } catch (error: any) {
    console.error(`   ❌ خطأ في مزامنة ${user.email}:`, error.message);
  }
}

/**
 * مزامنة جميع المستخدمين
 */
async function syncAllUsers() {
  try {
    console.log('🚀 بدء مزامنة المستخدمين...\n');
    console.log('=' .repeat(60));
    
    // التحقق من API Key
    if (!process.env.APPWRITE_API_KEY) {
      throw new Error('❌ APPWRITE_API_KEY غير موجود في .env');
    }

    // جلب جميع المستخدمين من Auth
    const authUsers = await getAllAuthUsers();

    if (authUsers.length === 0) {
      console.log('⚠️  لا يوجد مستخدمين للمزامنة');
      return;
    }

    // مزامنة كل مستخدم
    console.log('📝 بدء المزامنة إلى Collection...\n');
    
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const user of authUsers) {
      try {
        const exists = await userExistsInCollection(user.$id);
        await syncUserToCollection(user);
        
        if (exists) {
          updated++;
        } else {
          created++;
        }
      } catch (error) {
        failed++;
      }
    }

    // النتائج
    console.log('\n' + '='.repeat(60));
    console.log('✅ اكتملت المزامنة!\n');
    console.log(`📊 الإحصائيات:`);
    console.log(`   • إجمالي المستخدمين: ${authUsers.length}`);
    console.log(`   • تم الإنشاء: ${created}`);
    console.log(`   • تم التحديث: ${updated}`);
    console.log(`   • فشل: ${failed}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ خطأ في المزامنة:', error);
    process.exit(1);
  }
}

/**
 * إنشاء مستخدم تجريبي للاختبار
 */
async function createTestAffiliate() {
  try {
    console.log('\n🧪 إنشاء مستخدم مسوق تجريبي...\n');

    const testUser = {
      email: 'affiliate-test@egygo.me',
      name: 'مسوق تجريبي',
      phone: '01234567890',
      isAffiliate: true,
      affiliateCode: 'AFF' + Date.now().toString(36).toUpperCase(),
      commissionRate: 0.15,
      totalEarnings: 1250.50,
      pendingEarnings: 350.00,
      referralCount: 25,
      accountStatus: 'approved',
      isActive: true,
      approvedAt: new Date().toISOString(),
    };

    await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      'unique()',
      testUser
    );

    console.log('✅ تم إنشاء المستخدم التجريبي بنجاح!');
    console.log(`   📧 البريد: ${testUser.email}`);
    console.log(`   🔑 كود المسوق: ${testUser.affiliateCode}`);
    console.log(`   💰 الأرباح: ${testUser.totalEarnings} ج.م`);
    console.log(`   👥 الإحالات: ${testUser.referralCount}`);

  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  المستخدم التجريبي موجود بالفعل');
    } else {
      console.error('❌ خطأ في إنشاء المستخدم التجريبي:', error);
    }
  }
}

// تشغيل السكريبت
const command = process.argv[2];

if (command === 'sync') {
  syncAllUsers();
} else if (command === 'test') {
  createTestAffiliate();
} else {
  console.log(`
🔄 سكريبت مزامنة المستخدمين - EgyGo

الاستخدام:
  npm run sync-users sync    # مزامنة جميع المستخدمين من Auth إلى Collection
  npm run sync-users test    # إنشاء مستخدم مسوق تجريبي

⚠️  ملاحظات مهمة:
  1. يجب إضافة APPWRITE_API_KEY في ملف .env
  2. API Key يجب أن يكون لديه صلاحيات:
     - users.read
     - databases.read
     - databases.write
  3. يجب إنشاء users collection في Appwrite أولاً

📚 للمزيد من المعلومات، راجع: APPWRITE_DATABASE_SCHEMA.md
  `);
}
