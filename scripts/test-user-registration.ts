/**
 * سكريبت اختبار تسجيل المستخدمين
 * 
 * هذا السكريبت يقوم بـ:
 * 1. إنشاء مستخدمين تجريبيين (عميل، تاجر، مسوق)
 * 2. التحقق من أنهم يظهرون في users collection
 * 3. التحقق من جميع الحقول
 */

import { config } from 'dotenv';
import { Client, Account, Databases, Query, ID } from 'node-appwrite';

// تحميل متغيرات البيئة
config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const account = new Account(client);
const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';
const USERS_COLLECTION_ID = process.env.VITE_APPWRITE_USERS_COLLECTION || 'users';

interface TestUser {
  email: string;
  password: string;
  name: string;
  accountType: 'customer' | 'merchant' | 'affiliate';
  phone: string;
}

const testUsers: TestUser[] = [
  {
    email: 'test-customer-' + Date.now() + '@egygo.test',
    password: 'Test123456!',
    name: 'عميل تجريبي',
    accountType: 'customer',
    phone: '01111111111',
  },
  {
    email: 'test-merchant-' + Date.now() + '@egygo.test',
    password: 'Test123456!',
    name: 'تاجر تجريبي',
    accountType: 'merchant',
    phone: '01222222222',
  },
  {
    email: 'test-affiliate-' + Date.now() + '@egygo.test',
    password: 'Test123456!',
    name: 'مسوق تجريبي',
    accountType: 'affiliate',
    phone: '01333333333',
  },
];

/**
 * إنشاء مستخدم تجريبي
 */
async function createTestUser(user: TestUser): Promise<void> {
  console.log(`\n📝 إنشاء مستخدم: ${user.name} (${user.accountType})`);
  console.log(`   📧 البريد: ${user.email}`);

  try {
    // 1. إنشاء المستخدم في Auth
    const authUser = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    console.log(`   ✓ تم إنشاء المستخدم في Auth`);
    console.log(`   🆔 User ID: ${authUser.$id}`);

    // 2. تحديد حالة الحساب
    const needsApproval = user.accountType === 'merchant' || user.accountType === 'affiliate';
    const accountStatus = needsApproval ? 'pending' : 'approved';

    // 3. إنشاء كود المسوق إذا لزم الأمر (أقصى 10 أحرف)
    let affiliateCode = null;
    if (user.accountType === 'affiliate') {
      // إنشاء كود قصير (10 أحرف كحد أقصى)
      const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
      affiliateCode = `AF${randomPart}`.substring(0, 10);
    }

    // 4. إنشاء المستند في users collection
    const userDoc = await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      authUser.$id,
      {
        email: user.email,
        name: user.name,
        phone: user.phone,
        alternativePhone: '',
        address: '',
        isAffiliate: user.accountType === 'affiliate',
        isMerchant: user.accountType === 'merchant',
        isIntermediary: false,
        affiliateCode: affiliateCode,
        commissionRate: 0.15,
        totalEarnings: 0,
        pendingEarnings: 0,
        referralCount: 0,
        accountStatus: accountStatus,
        approvedAt: needsApproval ? undefined : new Date().toISOString(),
        approvedBy: null,
        rejectionReason: null,
        isActive: !needsApproval,
      }
    );

    console.log(`   ✓ تم إنشاء المستند في Collection`);
    console.log(`   📊 حالة الحساب: ${accountStatus}`);
    if (affiliateCode) {
      console.log(`   🔑 كود المسوق: ${affiliateCode}`);
    }

    // 5. التحقق من المستند
    const verifyDoc = await databases.getDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      authUser.$id
    );

    console.log(`   ✓ تم التحقق من المستند`);
    console.log(`   📋 الحقول:`);
    console.log(`      - email: ${verifyDoc.email}`);
    console.log(`      - name: ${verifyDoc.name}`);
    console.log(`      - phone: ${verifyDoc.phone}`);
    console.log(`      - isAffiliate: ${verifyDoc.isAffiliate}`);
    console.log(`      - isMerchant: ${verifyDoc.isMerchant}`);
    console.log(`      - accountStatus: ${verifyDoc.accountStatus}`);
    console.log(`      - isActive: ${verifyDoc.isActive}`);

    console.log(`\n   ✅ نجح إنشاء ${user.name}!`);

  } catch (error: any) {
    console.error(`\n   ❌ فشل إنشاء ${user.name}:`);
    console.error(`   ${error.message}`);
    throw error;
  }
}

/**
 * التحقق من عرض المستخدمين
 */
async function verifyUsersDisplay(): Promise<void> {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 التحقق من عرض المستخدمين...\n');

  try {
    // 1. جلب جميع المستخدمين
    const allUsers = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.orderDesc('$createdAt'), Query.limit(100)]
    );

    console.log(`✓ إجمالي المستخدمين: ${allUsers.total}`);
    console.log(`✓ المستخدمين في الصفحة: ${allUsers.documents.length}\n`);

    // 2. جلب المسوقين فقط
    const affiliates = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('isAffiliate', true), Query.limit(100)]
    );

    console.log(`✓ إجمالي المسوقين: ${affiliates.total}`);
    console.log(`✓ المسوقين في الصفحة: ${affiliates.documents.length}\n`);

    // 3. جلب التجار فقط
    const merchants = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('isMerchant', true), Query.limit(100)]
    );

    console.log(`✓ إجمالي التجار: ${merchants.total}`);
    console.log(`✓ التجار في الصفحة: ${merchants.documents.length}\n`);

    // 4. جلب الحسابات المعلقة
    const pending = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('accountStatus', 'pending'), Query.limit(100)]
    );

    console.log(`✓ الحسابات المعلقة: ${pending.total}\n`);

    // 5. عرض آخر 5 مستخدمين
    console.log('📋 آخر 5 مستخدمين:\n');
    allUsers.documents.slice(0, 5).forEach((user: any, index: number) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   - النوع: ${user.isAffiliate ? 'مسوق' : user.isMerchant ? 'تاجر' : 'عميل'}`);
      console.log(`   - الحالة: ${user.accountStatus}`);
      console.log(`   - نشط: ${user.isActive ? 'نعم' : 'لا'}`);
      if (user.affiliateCode) {
        console.log(`   - كود المسوق: ${user.affiliateCode}`);
      }
      console.log('');
    });

  } catch (error: any) {
    console.error('❌ خطأ في التحقق:', error.message);
    throw error;
  }
}

/**
 * الدالة الرئيسية
 */
async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 اختبار تسجيل المستخدمين - EgyGo');
  console.log('='.repeat(60));

  try {
    // التحقق من API Key
    if (!process.env.APPWRITE_API_KEY) {
      throw new Error('❌ APPWRITE_API_KEY غير موجود في .env');
    }

    console.log('\n✓ تم التحقق من API Key');

    // إنشاء المستخدمين التجريبيين
    for (const user of testUsers) {
      await createTestUser(user);
      // انتظر قليلاً بين كل مستخدم
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // التحقق من عرض المستخدمين
    await verifyUsersDisplay();

    console.log('='.repeat(60));
    console.log('✅ نجح الاختبار! جميع المستخدمين تم إنشاؤهم وعرضهم بشكل صحيح!');
    console.log('='.repeat(60) + '\n');

    console.log('📝 الخطوات التالية:');
    console.log('   1. افتح https://egygo.me/#/admin/users');
    console.log('   2. يجب أن ترى المستخدمين الجدد');
    console.log('   3. اضغط على "المسوقين" لرؤية المسوق التجريبي');
    console.log('   4. اضغط على "الحسابات المعلقة" لرؤية الحسابات المعلقة\n');

  } catch (error: any) {
    console.error('\n❌ فشل الاختبار:', error.message);
    console.error('\nالتفاصيل:', error);
    process.exit(1);
  }
}

// تشغيل السكريبت
main();
