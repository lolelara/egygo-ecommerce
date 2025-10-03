import 'dotenv/config';
import { Client, Users, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.VITE_APPWRITE_API_KEY || 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const users = new Users(client);
const databases = new Databases(client);

async function setAdminRole(email: string) {
  try {
    console.log(`🔍 البحث عن المستخدم: ${email}...`);
    
    // البحث عن المستخدم بالبريد الإلكتروني
    const usersList = await users.list([`email="${email}"`]);
    
    if (usersList.total === 0) {
      console.log(`❌ لم يتم العثور على مستخدم بالبريد: ${email}`);
      console.log(`💡 يرجى التأكد من أن المستخدم قام بالتسجيل أولاً`);
      return;
    }
    
    const user = usersList.users[0];
    console.log(`✅ تم العثور على المستخدم: ${user.name} (${user.$id})`);
    
    // تحديث preferences المستخدم لجعله Admin
    console.log(`🔄 تحديث دور المستخدم إلى Admin...`);
    
    await users.updatePrefs(user.$id, {
      role: 'admin',
      isAdmin: true,
      isSuperAdmin: true,
      permissions: [
        'products.manage',
        'categories.manage',
        'orders.manage',
        'users.manage',
        'affiliates.manage',
        'commissions.manage',
        'settings.manage',
        'analytics.view'
      ]
    });
    
    console.log(`✅ تم تعيين دور Admin للمستخدم بنجاح!`);
    console.log(`\n📋 تفاصيل المستخدم:`);
    console.log(`   - الاسم: ${user.name}`);
    console.log(`   - البريد: ${user.email}`);
    console.log(`   - المعرف: ${user.$id}`);
    console.log(`   - الدور: Admin (Super Admin)`);
    console.log(`\n✨ يمكن للمستخدم الآن الوصول إلى لوحة التحكم الإدارية على:`);
    console.log(`   http://localhost:8080/admin`);
    
  } catch (error: any) {
    console.error(`❌ حدث خطأ:`, error.message);
    
    if (error.code === 401) {
      console.log(`\n💡 تأكد من أن API Key صحيح في ملف .env`);
    } else if (error.code === 404) {
      console.log(`\n💡 تأكد من أن Project ID صحيح في ملف .env`);
    }
  }
}

// تشغيل السكريبت
const targetEmail = process.argv[2] || 'lolelarap@gmail.com';

console.log(`\n🚀 بدء تعيين دور Admin...`);
console.log(`📧 البريد الإلكتروني: ${targetEmail}\n`);

setAdminRole(targetEmail)
  .then(() => {
    console.log(`\n✅ تم الانتهاء بنجاح!`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(`\n❌ فشل التنفيذ:`, error);
    process.exit(1);
  });
