/**
 * سكريبت تلقائي لإعداد قاعدة بيانات Appwrite بالكامل
 * 
 * هذا السكريبت يقوم بـ:
 * 1. إنشاء users collection إذا لم تكن موجودة
 * 2. إضافة جميع الـ attributes المطلوبة
 * 3. ضبط الـ indexes
 * 4. ضبط الـ permissions
 * 5. مزامنة المستخدمين من Auth إلى Collection
 */

import { config } from 'dotenv';
import { Client, Databases, Users, Query, Permission, Role } from 'node-appwrite';

// تحميل متغيرات البيئة من .env
config();

// تكوين Appwrite
const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const users = new Users(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';
const USERS_COLLECTION_ID = process.env.VITE_APPWRITE_USERS_COLLECTION || 'users';

interface AttributeConfig {
  key: string;
  type: 'string' | 'integer' | 'double' | 'boolean' | 'datetime';
  size?: number;
  required: boolean;
  default?: any;
  array?: boolean;
}

const USERS_ATTRIBUTES: AttributeConfig[] = [
  { key: 'email', type: 'string', size: 255, required: true },
  { key: 'name', type: 'string', size: 255, required: true },
  { key: 'phone', type: 'string', size: 20, required: false, default: '' },
  { key: 'alternativePhone', type: 'string', size: 20, required: false, default: '' },
  { key: 'address', type: 'string', size: 500, required: false, default: '' },
  { key: 'isAffiliate', type: 'boolean', required: false, default: false },
  { key: 'isMerchant', type: 'boolean', required: false, default: false },
  { key: 'isIntermediary', type: 'boolean', required: false, default: false },
  { key: 'affiliateCode', type: 'string', size: 50, required: false },
  { key: 'commissionRate', type: 'double', required: false, default: 0.15 },
  { key: 'totalEarnings', type: 'double', required: false, default: 0 },
  { key: 'pendingEarnings', type: 'double', required: false, default: 0 },
  { key: 'referralCount', type: 'integer', required: false, default: 0 },
  { key: 'accountStatus', type: 'string', size: 50, required: false, default: 'approved' },
  { key: 'isActive', type: 'boolean', required: false, default: true },
  { key: 'approvedAt', type: 'datetime', required: false },
  { key: 'approvedBy', type: 'string', size: 50, required: false },
  { key: 'rejectionReason', type: 'string', size: 500, required: false },
];

/**
 * التحقق من وجود collection
 */
async function collectionExists(): Promise<boolean> {
  try {
    await databases.getCollection(DATABASE_ID, USERS_COLLECTION_ID);
    return true;
  } catch (error: any) {
    if (error.code === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * إنشاء users collection
 */
async function createUsersCollection(): Promise<void> {
  try {
    console.log('📦 إنشاء users collection...');
    
    await databases.createCollection(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      'Users',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      false, // documentSecurity
      true   // enabled
    );
    
    console.log('✅ تم إنشاء collection بنجاح!\n');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('ℹ️  Collection موجود بالفعل\n');
    } else {
      throw error;
    }
  }
}

/**
 * التحقق من وجود attribute
 */
async function attributeExists(key: string): Promise<boolean> {
  try {
    const collection = await databases.getCollection(DATABASE_ID, USERS_COLLECTION_ID);
    return collection.attributes.some((attr: any) => attr.key === key);
  } catch (error) {
    return false;
  }
}

/**
 * إضافة attribute
 */
async function createAttribute(attr: AttributeConfig): Promise<void> {
  try {
    const exists = await attributeExists(attr.key);
    
    if (exists) {
      console.log(`   ↻ ${attr.key} موجود بالفعل`);
      return;
    }

    console.log(`   ➕ إضافة ${attr.key}...`);

    switch (attr.type) {
      case 'string':
        await databases.createStringAttribute(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          attr.key,
          attr.size || 255,
          attr.required,
          attr.default,
          attr.array || false
        );
        break;

      case 'integer':
        await databases.createIntegerAttribute(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          attr.key,
          attr.required,
          undefined,
          undefined,
          attr.default,
          attr.array || false
        );
        break;

      case 'double':
        await databases.createFloatAttribute(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          attr.key,
          attr.required,
          undefined,
          undefined,
          attr.default,
          attr.array || false
        );
        break;

      case 'boolean':
        await databases.createBooleanAttribute(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          attr.key,
          attr.required,
          attr.default,
          attr.array || false
        );
        break;

      case 'datetime':
        await databases.createDatetimeAttribute(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          attr.key,
          attr.required,
          attr.default,
          attr.array || false
        );
        break;
    }

    // انتظر قليلاً لإنشاء الـ attribute
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`   ✓ تم إضافة ${attr.key}`);
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`   ↻ ${attr.key} موجود بالفعل`);
    } else {
      console.error(`   ❌ خطأ في إضافة ${attr.key}:`, error.message);
    }
  }
}

/**
 * إضافة جميع الـ attributes
 */
async function createAllAttributes(): Promise<void> {
  console.log('🔧 إضافة Attributes...\n');
  
  for (const attr of USERS_ATTRIBUTES) {
    await createAttribute(attr);
  }
  
  console.log('\n✅ تم إضافة جميع الـ Attributes!\n');
}

/**
 * إنشاء indexes
 */
async function createIndexes(): Promise<void> {
  console.log('🔍 إنشاء Indexes...\n');
  
  const indexes = [
    { key: 'email_idx', type: 'unique', attributes: ['email'] },
    { key: 'isAffiliate_idx', type: 'key', attributes: ['isAffiliate'] },
    { key: 'isMerchant_idx', type: 'key', attributes: ['isMerchant'] },
    { key: 'accountStatus_idx', type: 'key', attributes: ['accountStatus'] },
    { key: 'affiliateCode_idx', type: 'unique', attributes: ['affiliateCode'] },
  ];

  for (const index of indexes) {
    try {
      console.log(`   ➕ إنشاء index: ${index.key}...`);
      
      await databases.createIndex(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        index.key,
        index.type as any,
        index.attributes,
        []
      );
      
      // انتظر قليلاً
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`   ✓ تم إنشاء ${index.key}`);
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`   ↻ ${index.key} موجود بالفعل`);
      } else {
        console.error(`   ⚠️  خطأ في إنشاء ${index.key}:`, error.message);
      }
    }
  }
  
  console.log('\n✅ تم إنشاء جميع الـ Indexes!\n');
}

/**
 * مزامنة المستخدمين من Auth إلى Collection
 */
async function syncUsers(): Promise<void> {
  console.log('🔄 مزامنة المستخدمين من Auth...\n');
  
  try {
    // جلب جميع المستخدمين من Auth
    const allUsers: any[] = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await users.list([
        Query.limit(limit),
        Query.offset(offset)
      ]);

      allUsers.push(...response.users);

      if (response.users.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    console.log(`📥 تم جلب ${allUsers.length} مستخدم من Auth\n`);

    if (allUsers.length === 0) {
      console.log('⚠️  لا يوجد مستخدمين للمزامنة\n');
      return;
    }

    // مزامنة كل مستخدم
    let created = 0;
    let updated = 0;
    let failed = 0;

    for (const user of allUsers) {
      try {
        // التحقق من وجود المستخدم
        let exists = false;
        try {
          await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id);
          exists = true;
        } catch (error: any) {
          if (error.code !== 404) throw error;
        }

        // تقصير affiliateCode إذا كان أطول من 50 حرف
        let affiliateCode = (user.prefs as any)?.affiliateCode || null;
        if (affiliateCode && affiliateCode.length > 50) {
          affiliateCode = affiliateCode.substring(0, 50);
        }

        const userData = {
          email: user.email,
          name: user.name || user.email.split('@')[0],
          phone: (user.prefs as any)?.phone || '',
          alternativePhone: (user.prefs as any)?.alternativePhone || '',
          address: (user.prefs as any)?.address || '',
          isAffiliate: (user.prefs as any)?.isAffiliate || false,
          isMerchant: (user.prefs as any)?.isMerchant || false,
          isIntermediary: (user.prefs as any)?.isIntermediary || false,
          affiliateCode: affiliateCode,
          commissionRate: (user.prefs as any)?.commissionRate || 0.15,
          totalEarnings: (user.prefs as any)?.totalEarnings || 0,
          pendingEarnings: (user.prefs as any)?.pendingEarnings || 0,
          referralCount: (user.prefs as any)?.referralCount || 0,
          accountStatus: (user.prefs as any)?.accountStatus || 'approved',
          isActive: user.status,
          approvedAt: (user.prefs as any)?.approvedAt || user.registration,
          approvedBy: (user.prefs as any)?.approvedBy || null,
          rejectionReason: (user.prefs as any)?.rejectionReason || null,
        };

        if (exists) {
          await databases.updateDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            user.$id,
            userData
          );
          console.log(`   ↻ تحديث: ${user.email}`);
          updated++;
        } else {
          await databases.createDocument(
            DATABASE_ID,
            USERS_COLLECTION_ID,
            user.$id,
            userData
          );
          console.log(`   ✓ إنشاء: ${user.email}`);
          created++;
        }
      } catch (error: any) {
        console.error(`   ❌ خطأ في ${user.email}:`, error.message);
        failed++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ اكتملت المزامنة!\n');
    console.log(`📊 الإحصائيات:`);
    console.log(`   • إجمالي المستخدمين: ${allUsers.length}`);
    console.log(`   • تم الإنشاء: ${created}`);
    console.log(`   • تم التحديث: ${updated}`);
    console.log(`   • فشل: ${failed}`);
    console.log('='.repeat(60) + '\n');

  } catch (error: any) {
    console.error('❌ خطأ في المزامنة:', error.message);
    throw error;
  }
}

/**
 * إنشاء مستخدمين تجريبيين
 */
async function createTestUsers(): Promise<void> {
  console.log('🧪 إنشاء مستخدمين تجريبيين...\n');

  const testUsers = [
    {
      id: 'test-affiliate-1',
      email: 'affiliate1@egygo.test',
      name: 'مسوق تجريبي 1',
      phone: '01234567890',
      isAffiliate: true,
      affiliateCode: 'AFF' + Date.now().toString(36).toUpperCase(),
      commissionRate: 0.15,
      totalEarnings: 2500.75,
      pendingEarnings: 450.00,
      referralCount: 35,
      accountStatus: 'approved',
      isActive: true,
    },
    {
      id: 'test-merchant-1',
      email: 'merchant1@egygo.test',
      name: 'تاجر تجريبي 1',
      phone: '01098765432',
      isMerchant: true,
      accountStatus: 'approved',
      isActive: true,
    },
    {
      id: 'test-pending-1',
      email: 'pending@egygo.test',
      name: 'حساب معلق تجريبي',
      phone: '01555555555',
      isAffiliate: true,
      affiliateCode: 'AFFPEND' + Date.now().toString(36).toUpperCase(),
      accountStatus: 'pending',
      isActive: false,
    },
  ];

  for (const testUser of testUsers) {
    try {
      // التحقق من وجود المستخدم
      try {
        await databases.getDocument(DATABASE_ID, USERS_COLLECTION_ID, testUser.id);
        console.log(`   ↻ ${testUser.name} موجود بالفعل`);
        continue;
      } catch (error: any) {
        if (error.code !== 404) throw error;
      }

      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        testUser.id,
        testUser
      );

      console.log(`   ✓ تم إنشاء: ${testUser.name}`);
      console.log(`      📧 ${testUser.email}`);
      if (testUser.affiliateCode) {
        console.log(`      🔑 ${testUser.affiliateCode}`);
      }
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`   ↻ ${testUser.name} موجود بالفعل`);
      } else {
        console.error(`   ❌ خطأ في إنشاء ${testUser.name}:`, error.message);
      }
    }
  }

  console.log('\n✅ تم إنشاء المستخدمين التجريبيين!\n');
}

/**
 * الدالة الرئيسية
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 إعداد قاعدة بيانات Appwrite - EgyGo');
  console.log('='.repeat(60) + '\n');

  try {
    // التحقق من API Key
    if (!process.env.APPWRITE_API_KEY) {
      throw new Error('❌ APPWRITE_API_KEY غير موجود في .env');
    }

    console.log('✓ تم التحقق من API Key\n');

    // 1. إنشاء Collection
    const exists = await collectionExists();
    if (!exists) {
      await createUsersCollection();
    } else {
      console.log('ℹ️  users collection موجود بالفعل\n');
    }

    // 2. إضافة Attributes
    await createAllAttributes();

    // 3. إنشاء Indexes
    await createIndexes();

    // 4. مزامنة المستخدمين
    const command = process.argv[2];
    if (command !== 'skip-sync') {
      await syncUsers();
    }

    // 5. إنشاء مستخدمين تجريبيين (اختياري)
    if (command === 'with-test-users') {
      await createTestUsers();
    }

    console.log('='.repeat(60));
    console.log('🎉 تم إعداد قاعدة البيانات بنجاح!');
    console.log('='.repeat(60) + '\n');

    console.log('📝 الخطوات التالية:');
    console.log('   1. افتح https://egygo.me/#/admin/users');
    console.log('   2. يجب أن ترى جميع المستخدمين');
    console.log('   3. اضغط على تبويب "المسوقين" لرؤية المسوقين\n');

  } catch (error: any) {
    console.error('\n❌ فشل الإعداد:', error.message);
    console.error('\nالتفاصيل:', error);
    process.exit(1);
  }
}

// تشغيل السكريبت
main();
