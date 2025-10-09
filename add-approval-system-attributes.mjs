import { Client, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68de037e003bd03c4d45')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';
const COLLECTION_ID = 'users';

async function addApprovalAttributes() {
  try {
    console.log('🔧 إضافة حقول نظام الموافقة إلى جدول users...\n');
    
    // 1. Add alternativePhone attribute
    console.log('1️⃣ إضافة حقل alternativePhone...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'alternativePhone',
        255,
        false, // not required
        ''     // default value
      );
      console.log('   ✅ تم إضافة alternativePhone بنجاح');
    } catch (error) {
      if (error.code === 409) {
        console.log('   ℹ️  alternativePhone موجود بالفعل');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Add accountStatus attribute
    console.log('\n2️⃣ إضافة حقل accountStatus...');
    try {
      await databases.createEnumAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'accountStatus',
        ['pending', 'approved', 'rejected'],
        false,  // not required
        'approved' // default value
      );
      console.log('   ✅ تم إضافة accountStatus بنجاح');
    } catch (error) {
      if (error.code === 409) {
        console.log('   ℹ️  accountStatus موجود بالفعل');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Add approvedAt attribute
    console.log('\n3️⃣ إضافة حقل approvedAt...');
    try {
      await databases.createDatetimeAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'approvedAt',
        false // not required
      );
      console.log('   ✅ تم إضافة approvedAt بنجاح');
    } catch (error) {
      if (error.code === 409) {
        console.log('   ℹ️  approvedAt موجود بالفعل');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 4. Add approvedBy attribute (admin user ID who approved)
    console.log('\n4️⃣ إضافة حقل approvedBy...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'approvedBy',
        255,
        false // not required
      );
      console.log('   ✅ تم إضافة approvedBy بنجاح');
    } catch (error) {
      if (error.code === 409) {
        console.log('   ℹ️  approvedBy موجود بالفعل');
      } else {
        throw error;
      }
    }

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Add rejectionReason attribute
    console.log('\n5️⃣ إضافة حقل rejectionReason...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        COLLECTION_ID,
        'rejectionReason',
        1000,
        false // not required
      );
      console.log('   ✅ تم إضافة rejectionReason بنجاح');
    } catch (error) {
      if (error.code === 409) {
        console.log('   ℹ️  rejectionReason موجود بالفعل');
      } else {
        throw error;
      }
    }

    console.log('\n⏳ انتظار 5 ثواني للتأكد من جاهزية الحقول...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n✨ تم الانتهاء بنجاح!');
    console.log('\n📋 ملخص الحقول المضافة:');
    console.log('   • alternativePhone (String) - رقم هاتف بديل');
    console.log('   • accountStatus (Enum) - حالة الحساب [pending, approved, rejected]');
    console.log('   • approvedAt (DateTime) - تاريخ الموافقة');
    console.log('   • approvedBy (String) - معرف المسؤول الذي وافق');
    console.log('   • rejectionReason (String) - سبب الرفض');
    
    console.log('\n🔔 ملاحظات مهمة:');
    console.log('   1. حسابات التجار والمسوقين الجديدة ستكون بحالة "pending"');
    console.log('   2. يجب على الأدمن مراجعة والموافقة على الحسابات الجديدة');
    console.log('   3. حسابات العملاء تتم الموافقة عليها تلقائياً');
    
  } catch (error) {
    console.error('\n❌ حدث خطأ:', error);
    throw error;
  }
}

// Run the script
addApprovalAttributes()
  .then(() => {
    console.log('\n✅ تم تنفيذ السكريبت بنجاح!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 فشل تنفيذ السكريبت:', error);
    process.exit(1);
  });
