/**
 * Setup Financial Collections in Appwrite
 * Creates merchantPayments, withdrawalRequests collections and payment-proofs bucket
 */

const { Client, Databases, Storage, Permission, Role, ID } = require('node-appwrite');

// Appwrite Configuration
const client = new Client();
client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '66d8b9db00134c41e7c8')
  .setKey(process.env.APPWRITE_API_KEY || ''); // You need to set this

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = '68d8b9db00134c41e7c8';

async function setupFinancialCollections() {
  console.log('🚀 Starting Financial Collections Setup...\n');

  try {
    // ============================================
    // 1. Create merchantPayments Collection
    // ============================================
    console.log('📦 Creating merchantPayments collection...');
    
    try {
      const merchantPaymentsCollection = await databases.createCollection(
        DATABASE_ID,
        'merchantPayments',
        'Merchant Payments',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.team('admin')),
          Permission.delete(Role.team('admin')),
        ]
      );

      console.log('✅ merchantPayments collection created:', merchantPaymentsCollection.$id);

      // Create attributes
      await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'merchantId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'merchantName', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'orderId', 255, true);
      await databases.createFloatAttribute(DATABASE_ID, 'merchantPayments', 'totalAmount', true);
      await databases.createFloatAttribute(DATABASE_ID, 'merchantPayments', 'commissionAmount', true);
      await databases.createFloatAttribute(DATABASE_ID, 'merchantPayments', 'platformFee', true);
      await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'transferProof', 2000, false);
      await databases.createStringAttribute(DATABASE_ID, 'merchantPayments', 'notes', 1000, false);
      await databases.createEnumAttribute(DATABASE_ID, 'merchantPayments', 'status', ['pending', 'verified', 'rejected'], true);
      await databases.createDatetimeAttribute(DATABASE_ID, 'merchantPayments', 'createdAt', true);
      await databases.createDatetimeAttribute(DATABASE_ID, 'merchantPayments', 'verifiedAt', false);

      console.log('✅ merchantPayments attributes created');

      // Create indexes
      await databases.createIndex(DATABASE_ID, 'merchantPayments', 'merchantId_idx', 'key', ['merchantId']);
      await databases.createIndex(DATABASE_ID, 'merchantPayments', 'orderId_idx', 'key', ['orderId']);
      await databases.createIndex(DATABASE_ID, 'merchantPayments', 'status_idx', 'key', ['status']);
      await databases.createIndex(DATABASE_ID, 'merchantPayments', 'createdAt_idx', 'key', ['createdAt'], ['DESC']);

      console.log('✅ merchantPayments indexes created\n');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  merchantPayments collection already exists\n');
      } else {
        throw error;
      }
    }

    // ============================================
    // 2. Create withdrawalRequests Collection
    // ============================================
    console.log('📦 Creating withdrawalRequests collection...');
    
    try {
      const withdrawalRequestsCollection = await databases.createCollection(
        DATABASE_ID,
        'withdrawalRequests',
        'Withdrawal Requests',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.team('admin')),
          Permission.delete(Role.team('admin')),
        ]
      );

      console.log('✅ withdrawalRequests collection created:', withdrawalRequestsCollection.$id);

      // Create attributes
      await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'userId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'userName', 255, true);
      await databases.createEnumAttribute(DATABASE_ID, 'withdrawalRequests', 'userType', ['affiliate', 'merchant'], true);
      await databases.createFloatAttribute(DATABASE_ID, 'withdrawalRequests', 'amount', true);
      await databases.createEnumAttribute(DATABASE_ID, 'withdrawalRequests', 'method', ['vodafone', 'instapay'], true);
      await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'accountDetails', 255, true);
      await databases.createEnumAttribute(DATABASE_ID, 'withdrawalRequests', 'status', ['pending', 'processing', 'completed', 'rejected'], true);
      await databases.createDatetimeAttribute(DATABASE_ID, 'withdrawalRequests', 'createdAt', true);
      await databases.createDatetimeAttribute(DATABASE_ID, 'withdrawalRequests', 'processedAt', false);
      await databases.createStringAttribute(DATABASE_ID, 'withdrawalRequests', 'rejectionReason', 500, false);

      console.log('✅ withdrawalRequests attributes created');

      // Create indexes
      await databases.createIndex(DATABASE_ID, 'withdrawalRequests', 'userId_idx', 'key', ['userId']);
      await databases.createIndex(DATABASE_ID, 'withdrawalRequests', 'userType_idx', 'key', ['userType']);
      await databases.createIndex(DATABASE_ID, 'withdrawalRequests', 'status_idx', 'key', ['status']);
      await databases.createIndex(DATABASE_ID, 'withdrawalRequests', 'createdAt_idx', 'key', ['createdAt'], ['DESC']);

      console.log('✅ withdrawalRequests indexes created\n');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  withdrawalRequests collection already exists\n');
      } else {
        throw error;
      }
    }

    // ============================================
    // 3. Create payment-proofs Storage Bucket
    // ============================================
    console.log('📦 Creating payment-proofs storage bucket...');
    
    try {
      const bucket = await storage.createBucket(
        'payment-proofs',
        'Payment Proofs',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.team('admin')),
          Permission.delete(Role.team('admin')),
        ],
        false, // fileSecurity
        true,  // enabled
        5242880, // maxFileSize (5MB)
        ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], // allowedFileExtensions
        'gzip', // compression
        true, // encryption
        true  // antivirus
      );

      console.log('✅ payment-proofs bucket created:', bucket.$id);
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  payment-proofs bucket already exists');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Financial Collections Setup Complete!\n');
    console.log('📋 Summary:');
    console.log('  ✅ merchantPayments collection');
    console.log('  ✅ withdrawalRequests collection');
    console.log('  ✅ payment-proofs storage bucket');
    console.log('\n✨ You can now use the financial management system!\n');

  } catch (error) {
    console.error('❌ Error setting up collections:', error);
    process.exit(1);
  }
}

// Run setup
setupFinancialCollections();
