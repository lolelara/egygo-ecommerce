/**
 * Create Financial Collections and Storage
 * سكريبت إنشاء المجموعات المالية والتخزين
 */

const sdk = require('node-appwrite');
require('dotenv').config();

// Initialize Appwrite
const client = new sdk.Client();
const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

console.log('🚀 بدء إنشاء Collections المالية...\n');
console.log('📋 DATABASE_ID:', DATABASE_ID);
console.log('📋 PROJECT_ID:', process.env.APPWRITE_PROJECT_ID);
console.log('─────────────────────────────────────────\n');

/**
 * Create merchantPayments Collection
 */
async function createMerchantPaymentsCollection() {
  try {
    console.log('📦 إنشاء merchantPayments collection...');
    
    const collection = await databases.createCollection(
      DATABASE_ID,
      'merchantPayments',
      'merchantPayments',
      [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.users()),
        sdk.Permission.update(sdk.Role.team('admin')),
        sdk.Permission.delete(sdk.Role.team('admin')),
      ]
    );

    console.log('✅ merchantPayments collection created');

    // Create Attributes
    await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'merchantId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'merchantName', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'orderId', 255, true);
    await databases.createFloatAttribute(DATABASE_ID, 'merchantPayments', 'totalAmount', true);
    await databases.createFloatAttribute(DATABASE_ID, 'merchantPayments', 'commissionAmount', true);
    await databases.createFloatAttribute(DATABASE_ID, 'merchantPayments', 'platformFee', true);
    await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'transferProof', 2000, false);
    await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'notes', 1000, false);
    await databases.createEnumAttribute(
      DATABASE_ID, 
      'merchantPayments', 
      'status', 
      ['pending', 'verified', 'completed', 'rejected'],
      true,
      'pending'
    );
    await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'paymentMethod', 100, false);
    await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'accountDetails', 500, false);
    await databases.createDatetimeAttribute(DATABASE_ID, 'merchantPayments', 'createdAt', true);
    await databases.createDatetimeAttribute(DATABASE_ID, 'merchantPayments', 'verifiedAt', false);
    await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'verifiedBy', 255, false);

    console.log('✅ merchantPayments attributes created');

    // Wait for attributes to be available
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create Indexes
    await databases.createIndex(
      DATABASE_ID,
      'merchantPayments',
      'merchantId_idx',
      'key',
      ['merchantId'],
      ['asc']
    );

    await databases.createIndex(
      DATABASE_ID,
      'merchantPayments',
      'status_idx',
      'key',
      ['status'],
      ['asc']
    );

    await databases.createIndex(
      DATABASE_ID,
      'merchantPayments',
      'createdAt_idx',
      'key',
      ['createdAt'],
      ['desc']
    );

    console.log('✅ merchantPayments indexes created\n');
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  merchantPayments collection already exists\n');
    } else {
      console.error('❌ Error creating merchantPayments:', error.message);
      throw error;
    }
  }
}

/**
 * Create withdrawalRequests Collection
 */
async function createWithdrawalRequestsCollection() {
  try {
    console.log('📦 إنشاء withdrawalRequests collection...');
    
    const collection = await databases.createCollection(
      DATABASE_ID,
      'withdrawalRequests',
      'withdrawalRequests',
      [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.users()),
        sdk.Permission.update(sdk.Role.team('admin')),
        sdk.Permission.delete(sdk.Role.team('admin')),
      ]
    );

    console.log('✅ withdrawalRequests collection created');

    // Create Attributes
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'userId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'userName', 255, true);
    await databases.createEnumAttribute(
      DATABASE_ID,
      'withdrawalRequests',
      'userType',
      ['affiliate', 'merchant'],
      true
    );
    await databases.createFloatAttribute(DATABASE_ID, 'withdrawalRequests', 'amount', true);
    await databases.createEnumAttribute(
      DATABASE_ID,
      'withdrawalRequests',
      'method',
      ['vodafone', 'instapay', 'bank', 'fawry'],
      true
    );
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'accountDetails', 500, true);
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'phoneNumber', 20, false);
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'bankName', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'accountNumber', 100, false);
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'accountHolder', 255, false);
    await databases.createEnumAttribute(
      DATABASE_ID,
      'withdrawalRequests',
      'status',
      ['pending', 'processing', 'completed', 'rejected'],
      true,
      'pending'
    );
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'rejectionReason', 1000, false);
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'paymentProof', 2000, false);
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'transactionId', 255, false);
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'notes', 1000, false);
    await databases.createDatetimeAttribute(DATABASE_ID, 'withdrawalRequests', 'createdAt', true);
    await databases.createDatetimeAttribute(DATABASE_ID, 'withdrawalRequests', 'processedAt', false);
    await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'processedBy', 255, false);

    console.log('✅ withdrawalRequests attributes created');

    // Wait for attributes to be available
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create Indexes
    await databases.createIndex(
      DATABASE_ID,
      'withdrawalRequests',
      'userId_idx',
      'key',
      ['userId'],
      ['asc']
    );

    await databases.createIndex(
      DATABASE_ID,
      'withdrawalRequests',
      'status_idx',
      'key',
      ['status'],
      ['asc']
    );

    await databases.createIndex(
      DATABASE_ID,
      'withdrawalRequests',
      'userType_idx',
      'key',
      ['userType'],
      ['asc']
    );

    await databases.createIndex(
      DATABASE_ID,
      'withdrawalRequests',
      'createdAt_idx',
      'key',
      ['createdAt'],
      ['desc']
    );

    console.log('✅ withdrawalRequests indexes created\n');
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  withdrawalRequests collection already exists\n');
    } else {
      console.error('❌ Error creating withdrawalRequests:', error.message);
      throw error;
    }
  }
}

/**
 * Create payment-proofs Storage Bucket
 */
async function createPaymentProofsBucket() {
  try {
    console.log('📦 إنشاء payment-proofs storage bucket...');
    
    const bucket = await storage.createBucket(
      'payment-proofs',
      'payment-proofs',
      [
        sdk.Permission.read(sdk.Role.any()),
        sdk.Permission.create(sdk.Role.users()),
        sdk.Permission.update(sdk.Role.team('admin')),
        sdk.Permission.delete(sdk.Role.team('admin')),
      ],
      false, // fileSecurity
      true,  // enabled
      5242880, // maxFileSize (5MB)
      ['jpg', 'jpeg', 'png', 'webp', 'pdf'], // allowedFileExtensions
      'gzip', // compression
      true,  // encryption
      true   // antivirus
    );

    console.log('✅ payment-proofs bucket created\n');
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  payment-proofs bucket already exists\n');
    } else {
      console.error('❌ Error creating payment-proofs bucket:', error.message);
      throw error;
    }
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    // Create Collections
    await createMerchantPaymentsCollection();
    await createWithdrawalRequestsCollection();
    
    // Create Storage Bucket
    await createPaymentProofsBucket();

    console.log('─────────────────────────────────────────');
    console.log('🎉 تم إنشاء جميع Collections بنجاح!\n');
    console.log('📋 الملخص:');
    console.log('  ✅ merchantPayments collection');
    console.log('  ✅ withdrawalRequests collection');
    console.log('  ✅ payment-proofs storage bucket\n');
    console.log('✨ يمكنك الآن استخدام النظام المالي!\n');
    console.log('🔗 الخطوات التالية:');
    console.log('  1. تحقق من Collections في Appwrite Console');
    console.log('  2. اختبر الصفحات المالية');
    console.log('  3. قم بإنشاء Server Routes');
    console.log('─────────────────────────────────────────\n');
  } catch (error) {
    console.error('\n❌ فشل في إنشاء بعض المكونات');
    console.error('تفاصيل الخطأ:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
