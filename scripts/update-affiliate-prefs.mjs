import { Client, Account } from 'appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '');

const account = new Account(client);

async function updateAffiliatePreferences() {
  try {
    console.log('🔄 تسجيل الدخول كمسوق...');
    
    // Login as affiliate
    const email = 'almlmibrahym574@gmail.com';
    const password = 'Affiliatex8k3cmsq4ktmgaiwrlo';
    
    const session = await account.createEmailPasswordSession(email, password);
    console.log('✅ تم تسجيل الدخول بنجاح');
    
    // Update preferences
    console.log('🔄 تحديث إعدادات المسوق...');
    await account.updatePrefs({
      isAffiliate: true,
      role: 'affiliate',
      commissionRate: 15
    });
    
    console.log('✅ تم تحديث الإعدادات بنجاح!');
    console.log('\nالآن يمكنك:');
    console.log('1. سجل دخول بالإيميل: almlmibrahym574@gmail.com');
    console.log('2. ستظهر لك "لوحة تحكم المسوق" في القائمة');
    
    // Logout
    await account.deleteSession('current');
    console.log('\n✅ تم تسجيل الخروج');
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    console.log('\nالحل البديل:');
    console.log('1. سجل دخول إلى الموقع بحساب المسوق');
    console.log('2. افتح Console في المتصفح');
    console.log('3. قم بتشغيل الكود التالي:');
    console.log(`
// في Console المتصفح:
import { account } from '@/lib/appwrite';
await account.updatePrefs({
  isAffiliate: true,
  role: 'affiliate',
  commissionRate: 15
});
    `);
  }
}

updateAffiliatePreferences();
