/**
 * Appwrite Withdrawals Collection Setup Script
 * 
 * يقوم هذا السكريبت بإنشاء:
 * 1. withdrawalRequests Collection
 * 2. payment-proofs Storage Bucket
 * 
 * الاستخدام:
 * node scripts/setup-withdrawals-collection.js
 */

import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';
import { config } from 'dotenv';
config();

// Appwrite Configuration
const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // Admin API Key required

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = 'withdrawalRequests';
const BUCKET_ID = 'payment-proofs';

/**
 * إنشاء withdrawalRequests Collection
 */
async function createWithdrawalsCollection() {
    try {
        console.log('🔧 Creating withdrawalRequests collection...');
        
        // Create Collection
        const collection = await databases.createCollection(
            DATABASE_ID,
            COLLECTION_ID,
            'Withdrawal Requests',
            [
                Permission.read(Role.users()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.label('admin'))
            ],
            true // documentSecurity
        );
        
        console.log('✅ Collection created:', collection.$id);
        
        // Create Attributes
        console.log('\n📝 Creating attributes...');
        
        // Required String Attributes
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'userId', 255, true);
        console.log('  ✓ userId');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'userName', 255, true);
        console.log('  ✓ userName');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'userType', 50, true);
        console.log('  ✓ userType');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'method', 100, true);
        console.log('  ✓ method');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'accountDetails', 1000, true);
        console.log('  ✓ accountDetails');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'status', 50, true, 'pending');
        console.log('  ✓ status');
        
        // Float Attribute
        await databases.createFloatAttribute(DATABASE_ID, COLLECTION_ID, 'amount', true, 0);
        console.log('  ✓ amount');
        
        // Optional String Attributes
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'phoneNumber', 20, false);
        console.log('  ✓ phoneNumber');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'bankName', 200, false);
        console.log('  ✓ bankName');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'accountNumber', 100, false);
        console.log('  ✓ accountNumber');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'accountHolder', 255, false);
        console.log('  ✓ accountHolder');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'rejectionReason', 1000, false);
        console.log('  ✓ rejectionReason');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'paymentProof', 500, false);
        console.log('  ✓ paymentProof');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'transactionId', 255, false);
        console.log('  ✓ transactionId');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'notes', 2000, false);
        console.log('  ✓ notes');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'processedAt', 50, false);
        console.log('  ✓ processedAt');
        
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'processedBy', 255, false);
        console.log('  ✓ processedBy');
        
        console.log('\n⏳ Waiting for attributes to be available...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Create Indexes
        console.log('\n📊 Creating indexes...');
        
        await databases.createIndex(
            DATABASE_ID,
            COLLECTION_ID,
            'userId_index',
            'key',
            ['userId'],
            ['DESC']
        );
        console.log('  ✓ userId_index');
        
        await databases.createIndex(
            DATABASE_ID,
            COLLECTION_ID,
            'status_index',
            'key',
            ['status'],
            ['ASC']
        );
        console.log('  ✓ status_index');
        
        await databases.createIndex(
            DATABASE_ID,
            COLLECTION_ID,
            'created_at_index',
            'key',
            ['$createdAt'],
            ['DESC']
        );
        console.log('  ✓ created_at_index');
        
        await databases.createIndex(
            DATABASE_ID,
            COLLECTION_ID,
            'userType_index',
            'key',
            ['userType'],
            ['ASC']
        );
        console.log('  ✓ userType_index');
        
        console.log('\n✅ withdrawalRequests collection created successfully!\n');
        
    } catch (error) {
        if (error.code === 409) {
            console.log('ℹ️  Collection already exists, skipping...\n');
        } else {
            console.error('❌ Error creating collection:', error.message);
            throw error;
        }
    }
}

/**
 * إنشاء payment-proofs Storage Bucket
 */
async function createPaymentProofsBucket() {
    try {
        console.log('🗂️  Creating payment-proofs bucket...');
        
        const bucket = await storage.createBucket(
            BUCKET_ID,
            'Payment Proofs',
            [
                Permission.read(Role.users()),
                Permission.create(Role.users()),
                Permission.update(Role.label('admin')),
                Permission.delete(Role.label('admin'))
            ],
            false, // fileSecurity
            true,  // enabled
            10485760, // 10MB max file size
            ['jpg', 'jpeg', 'png', 'pdf', 'webp'], // allowed extensions
            'gzip', // compression
            true,  // encryption
            false  // antivirus
        );
        
        console.log('✅ Bucket created:', bucket.$id);
        console.log('   Max File Size: 10MB');
        console.log('   Allowed: jpg, jpeg, png, pdf, webp\n');
        
    } catch (error) {
        if (error.code === 409) {
            console.log('ℹ️  Bucket already exists, skipping...\n');
        } else {
            console.error('❌ Error creating bucket:', error.message);
            throw error;
        }
    }
}

/**
 * التحقق من الإعداد
 */
async function verifySetup() {
    try {
        console.log('🔍 Verifying setup...');
        
        // Check collection
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
        console.log('✅ Collection exists:', collection.name);
        console.log('   Attributes:', collection.attributes.length);
        console.log('   Indexes:', collection.indexes.length);
        
        // Check bucket
        const bucket = await storage.getBucket(BUCKET_ID);
        console.log('✅ Bucket exists:', bucket.name);
        console.log('   Max Size:', bucket.maximumFileSize / 1048576, 'MB');
        
        console.log('\n🎉 Setup completed successfully!');
        console.log('\n📋 Next Steps:');
        console.log('   1. Visit: https://egygo.me/#/admin/withdrawals');
        console.log('   2. Test creating a withdrawal request');
        console.log('   3. Test processing a request\n');
        
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
        throw error;
    }
}

/**
 * Main Setup Function
 */
async function main() {
    console.log('🚀 Starting Appwrite Withdrawals Setup\n');
    console.log('📍 Endpoint:', process.env.VITE_APPWRITE_ENDPOINT);
    console.log('📁 Database:', DATABASE_ID);
    console.log('🆔 Collection:', COLLECTION_ID);
    console.log('🗂️  Bucket:', BUCKET_ID);
    console.log('\n' + '='.repeat(50) + '\n');
    
    try {
        // Step 1: Create Collection
        await createWithdrawalsCollection();
        
        // Step 2: Create Bucket
        await createPaymentProofsBucket();
        
        // Step 3: Verify
        await verifySetup();
        
        console.log('✨ All done!\n');
        process.exit(0);
        
    } catch (error) {
        console.error('\n💥 Setup failed:', error);
        console.log('\n📝 Please check:');
        console.log('   1. APPWRITE_API_KEY is set in .env');
        console.log('   2. API Key has admin permissions');
        console.log('   3. Database ID is correct');
        console.log('   4. Network connection to Appwrite\n');
        process.exit(1);
    }
}

// Run the script
main();
