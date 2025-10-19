/**
 * Simple Financial Collections Setup
 * Run with: node scripts/setup-financial-collections-simple.js YOUR_API_KEY
 */

const { Client, Databases, Storage, Permission, Role } = require('node-appwrite');

// Get API key from command line argument
const apiKey = process.argv[2];

if (!apiKey) {
  console.log('❌ Error: API Key required!');
  console.log('\n📋 Usage:');
  console.log('  node scripts/setup-financial-collections-simple.js YOUR_API_KEY');
  console.log('\n🔑 Get your API Key:');
  console.log('  1. Go to: https://cloud.appwrite.io/console');
  console.log('  2. Select your project');
  console.log('  3. Settings → API Keys → Create API Key');
  console.log('  4. Select ALL scopes');
  console.log('  5. Copy the key and run this script again\n');
  process.exit(1);
}

const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('66d8b9db00134c41e7c8')
  .setKey(apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = '68d8b9db00134c41e7c8';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setupFinancialCollections() {
  console.log('🚀 Starting Financial Collections Setup...\n');

  try {
    // ============================================
    // 1. Create merchantPayments Collection
    // ============================================
    console.log('📦 Creating merchantPayments collection...');
    
    let merchantPaymentsId;
    try {
      const merchantPaymentsCollection = await databases.createCollection(
        DATABASE_ID,
        'merchantPayments',
        'Merchant Payments',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      merchantPaymentsId = merchantPaymentsCollection.$id;
      console.log('✅ merchantPayments collection created:', merchantPaymentsId);
      await sleep(2000); // Wait for collection to be ready
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  merchantPayments collection already exists');
        merchantPaymentsId = 'merchantPayments';
      } else {
        throw error;
      }
    }

    // Create attributes for merchantPayments
    if (merchantPaymentsId) {
      try {
        console.log('📝 Creating merchantPayments attributes...');
        
        await databases.createStringAttribute(DATABASE_ID, merchantPaymentsId, 'merchantId', 255, true);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, merchantPaymentsId, 'merchantName', 255, true);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, merchantPaymentsId, 'orderId', 255, true);
        await sleep(1000);
        
        await databases.createFloatAttribute(DATABASE_ID, merchantPaymentsId, 'totalAmount', true);
        await sleep(1000);
        
        await databases.createFloatAttribute(DATABASE_ID, merchantPaymentsId, 'commissionAmount', true);
        await sleep(1000);
        
        await databases.createFloatAttribute(DATABASE_ID, merchantPaymentsId, 'platformFee', true);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, merchantPaymentsId, 'transferProof', 2000, false);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, merchantPaymentsId, 'notes', 1000, false);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, merchantPaymentsId, 'status', 50, true, 'pending');
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, merchantPaymentsId, 'createdAt', 50, true);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, merchantPaymentsId, 'verifiedAt', 50, false);
        await sleep(1000);

        console.log('✅ merchantPayments attributes created\n');
      } catch (error) {
        if (error.code === 409) {
          console.log('⚠️  merchantPayments attributes already exist\n');
        } else {
          console.log('⚠️  Error creating attributes:', error.message, '\n');
        }
      }
    }

    // ============================================
    // 2. Create withdrawalRequests Collection
    // ============================================
    console.log('📦 Creating withdrawalRequests collection...');
    
    let withdrawalRequestsId;
    try {
      const withdrawalRequestsCollection = await databases.createCollection(
        DATABASE_ID,
        'withdrawalRequests',
        'Withdrawal Requests',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      withdrawalRequestsId = withdrawalRequestsCollection.$id;
      console.log('✅ withdrawalRequests collection created:', withdrawalRequestsId);
      await sleep(2000);
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  withdrawalRequests collection already exists');
        withdrawalRequestsId = 'withdrawalRequests';
      } else {
        throw error;
      }
    }

    // Create attributes for withdrawalRequests
    if (withdrawalRequestsId) {
      try {
        console.log('📝 Creating withdrawalRequests attributes...');
        
        await databases.createStringAttribute(DATABASE_ID, withdrawalRequestsId, 'userId', 255, true);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, withdrawalRequestsId, 'userName', 255, true);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, withdrawalRequestsId, 'userType', 50, true);
        await sleep(1000);
        
        await databases.createFloatAttribute(DATABASE_ID, withdrawalRequestsId, 'amount', true);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, withdrawalRequestsId, 'method', 50, true);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, withdrawalRequestsId, 'accountDetails', 255, true);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, withdrawalRequestsId, 'status', 50, true, 'pending');
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, withdrawalRequestsId, 'createdAt', 50, true);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, withdrawalRequestsId, 'processedAt', 50, false);
        await sleep(1000);
        
        await databases.createStringAttribute(DATABASE_ID, withdrawalRequestsId, 'rejectionReason', 500, false);
        await sleep(1000);

        console.log('✅ withdrawalRequests attributes created\n');
      } catch (error) {
        if (error.code === 409) {
          console.log('⚠️  withdrawalRequests attributes already exist\n');
        } else {
          console.log('⚠️  Error creating attributes:', error.message, '\n');
        }
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
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        false,
        true,
        5242880,
        ['jpg', 'jpeg', 'png', 'webp'],
        'gzip',
        true,
        true
      );

      console.log('✅ payment-proofs bucket created:', bucket.$id);
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  payment-proofs bucket already exists');
      } else {
        console.log('⚠️  Error creating bucket:', error.message);
      }
    }

    console.log('\n🎉 Financial Collections Setup Complete!\n');
    console.log('📋 Summary:');
    console.log('  ✅ merchantPayments collection');
    console.log('  ✅ withdrawalRequests collection');
    console.log('  ✅ payment-proofs storage bucket');
    console.log('\n✨ You can now use the financial management system!\n');
    console.log('🔗 Access the pages:');
    console.log('  - Admin: /admin/financial');
    console.log('  - Affiliate: /affiliate/earnings');
    console.log('  - Merchant: /merchant/financial\n');

  } catch (error) {
    console.error('\n❌ Error setting up collections:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

// Run setup
setupFinancialCollections();
