import { Client, Account, ID, Databases } from 'node-appwrite';

// Appwrite configuration
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68d8b9db00134c41e7c8')
  .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const account = new Account(client);
const databases = new Databases(client);

const DATABASE_ID = '68de037e003bd03c4d45';
const USERS_COLLECTION_ID = '68de03ac0034e3aeed2d';

const testAccounts = [
  {
    email: 'admin@egygo.com',
    password: 'Admin@123456',
    name: 'مدير الموقع',
    role: 'admin',
    description: 'حساب المدير - الوصول الكامل للوحة التحكم'
  },
  {
    email: 'merchant@egygo.com',
    password: 'Merchant@123',
    name: 'أحمد التاجر',
    role: 'merchant',
    description: 'حساب تاجر - إضافة وإدارة المنتجات فقط'
  },
  {
    email: 'affiliate@egygo.com',
    password: 'Affiliate@123',
    name: 'محمد المسوق',
    role: 'affiliate',
    description: 'حساب مسوق - لوحة العمولات والروابط'
  },
  {
    email: 'customer@egygo.com',
    password: 'Customer@123',
    name: 'أحمد العميل',
    role: 'customer',
    description: 'حساب عميل عادي - تصفح وشراء المنتجات'
  }
];

async function createTestAccounts() {
  console.log('🚀 بدء إنشاء الحسابات التجريبية...\n');

  for (const accountData of testAccounts) {
    try {
      console.log(`📝 إنشاء حساب: ${accountData.name} (${accountData.email})`);
      
      // Create account in Appwrite Auth
      const user = await account.create(
        ID.unique(),
        accountData.email,
        accountData.password,
        accountData.name
      );

      console.log(`✅ تم إنشاء الحساب في النظام - User ID: ${user.$id}`);

      // Update user preferences with role
      try {
        await account.updatePrefs({
          role: accountData.role,
          affiliateId: accountData.role === 'affiliate' ? user.$id : null,
          createdAt: new Date().toISOString()
        });
        console.log(`✅ تم تحديث دور المستخدم: ${accountData.role}`);
      } catch (error) {
        console.log(`⚠️  تحذير: لم يتم تحديث التفضيلات - ${error.message}`);
      }

      console.log(`✨ تم بنجاح!\n`);
      console.log(`   البريد: ${accountData.email}`);
      console.log(`   الرقم السري: ${accountData.password}`);
      console.log(`   الدور: ${accountData.role}`);
      console.log(`   الوصف: ${accountData.description}\n`);
      console.log('─'.repeat(60) + '\n');

    } catch (error) {
      if (error.code === 409) {
        console.log(`⚠️  الحساب موجود بالفعل: ${accountData.email}\n`);
      } else {
        console.error(`❌ خطأ في إنشاء ${accountData.email}:`, error.message, '\n');
      }
    }
  }

  console.log('\n✅ انتهى إنشاء جميع الحسابات!\n');
  console.log('📋 ملخص الحسابات:');
  console.log('═'.repeat(60));
  console.log('\n1️⃣  حساب المدير (Admin):');
  console.log('   البريد: admin@egygo.com');
  console.log('   الرقم السري: Admin@123456');
  console.log('   الرابط: http://localhost:8080/admin');
  console.log('\n2️⃣  حساب التاجر (Merchant):');
  console.log('   البريد: merchant@egygo.com');
  console.log('   الرقم السري: Merchant@123');
  console.log('   الرابط: http://localhost:8080/admin/products');
  console.log('\n3️⃣  حساب المسوق (Affiliate):');
  console.log('   البريد: affiliate@egygo.com');
  console.log('   الرقم السري: Affiliate@123');
  console.log('   الرابط: http://localhost:8080/affiliate/dashboard');
  console.log('\n4️⃣  حساب العميل (Customer):');
  console.log('   البريد: customer@egygo.com');
  console.log('   الرقم السري: Customer@123');
  console.log('   الرابط: http://localhost:8080');
  console.log('\n═'.repeat(60));
  console.log('\n💡 يمكنك الآن تسجيل الدخول بأي من هذه الحسابات!');
}

createTestAccounts().catch(console.error);
