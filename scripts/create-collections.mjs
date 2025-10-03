import { Client, Databases, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.VITE_APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function createWishlistCollection() {
  console.log('📦 Creating Wishlist Collection...');
  
  try {
    const collection = await databases.createCollection(
      databaseId,
      'wishlist', // Collection ID
      'Wishlist', // Collection Name
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );
    
    console.log('✅ Wishlist Collection created:', collection.$id);
    
    // Create attributes
    console.log('  Creating attributes...');
    
    await databases.createStringAttribute(
      databaseId,
      collection.$id,
      'userId',
      255,
      true
    );
    console.log('  ✓ userId attribute created');
    
    await databases.createStringAttribute(
      databaseId,
      collection.$id,
      'productId',
      255,
      true
    );
    console.log('  ✓ productId attribute created');
    
    await databases.createDatetimeAttribute(
      databaseId,
      collection.$id,
      'createdAt',
      true
    );
    console.log('  ✓ createdAt attribute created');
    
    // Wait for attributes to be ready
    console.log('  ⏳ Waiting 5 seconds for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Create indexes
    console.log('  Creating indexes...');
    
    await databases.createIndex(
      databaseId,
      collection.$id,
      'userId_index',
      'key',
      ['userId'],
      ['asc']
    );
    console.log('  ✓ userId index created');
    
    await databases.createIndex(
      databaseId,
      collection.$id,
      'productId_index',
      'key',
      ['productId'],
      ['asc']
    );
    console.log('  ✓ productId index created');
    
    await databases.createIndex(
      databaseId,
      collection.$id,
      'userId_productId_unique',
      'unique',
      ['userId', 'productId'],
      ['asc', 'asc']
    );
    console.log('  ✓ Unique compound index created');
    
    console.log('✅ Wishlist Collection fully configured!\n');
    
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  Wishlist Collection already exists\n');
    } else {
      console.error('❌ Error creating Wishlist Collection:', error.message);
      throw error;
    }
  }
}

async function createCommissionsCollection() {
  console.log('💰 Creating Commissions Collection...');
  
  try {
    const collection = await databases.createCollection(
      databaseId,
      'commissions', // Collection ID
      'Commissions', // Collection Name
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );
    
    console.log('✅ Commissions Collection created:', collection.$id);
    
    // Create attributes
    console.log('  Creating attributes...');
    
    await databases.createStringAttribute(
      databaseId,
      collection.$id,
      'affiliateId',
      255,
      true
    );
    console.log('  ✓ affiliateId attribute created');
    
    await databases.createStringAttribute(
      databaseId,
      collection.$id,
      'orderId',
      255,
      true
    );
    console.log('  ✓ orderId attribute created');
    
    await databases.createFloatAttribute(
      databaseId,
      collection.$id,
      'amount',
      true
    );
    console.log('  ✓ amount attribute created');
    
    await databases.createFloatAttribute(
      databaseId,
      collection.$id,
      'rate',
      true
    );
    console.log('  ✓ rate attribute created');
    
    await databases.createEnumAttribute(
      databaseId,
      collection.$id,
      'status',
      ['pending', 'approved', 'paid', 'cancelled'],
      false,
      'pending'
    );
    console.log('  ✓ status attribute created');
    
    await databases.createDatetimeAttribute(
      databaseId,
      collection.$id,
      'createdAt',
      true
    );
    console.log('  ✓ createdAt attribute created');
    
    await databases.createDatetimeAttribute(
      databaseId,
      collection.$id,
      'paidAt',
      false
    );
    console.log('  ✓ paidAt attribute created');
    
    // Wait for attributes to be ready
    console.log('  ⏳ Waiting 7 seconds for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 7000));
    
    // Create indexes
    console.log('  Creating indexes...');
    
    await databases.createIndex(
      databaseId,
      collection.$id,
      'affiliateId_index',
      'key',
      ['affiliateId'],
      ['asc']
    );
    console.log('  ✓ affiliateId index created');
    
    await databases.createIndex(
      databaseId,
      collection.$id,
      'orderId_index',
      'key',
      ['orderId'],
      ['asc']
    );
    console.log('  ✓ orderId index created');
    
    await databases.createIndex(
      databaseId,
      collection.$id,
      'status_index',
      'key',
      ['status'],
      ['asc']
    );
    console.log('  ✓ status index created');
    
    await databases.createIndex(
      databaseId,
      collection.$id,
      'createdAt_index',
      'key',
      ['createdAt'],
      ['desc']
    );
    console.log('  ✓ createdAt index created');
    
    console.log('✅ Commissions Collection fully configured!\n');
    
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  Commissions Collection already exists\n');
    } else {
      console.error('❌ Error creating Commissions Collection:', error.message);
      throw error;
    }
  }
}

async function main() {
  console.log('🚀 Starting Collections Creation...\n');
  console.log(`📍 Endpoint: ${process.env.VITE_APPWRITE_ENDPOINT}`);
  console.log(`📍 Project: ${process.env.VITE_APPWRITE_PROJECT_ID}`);
  console.log(`📍 Database: ${databaseId}\n`);
  
  try {
    await createWishlistCollection();
    await createCommissionsCollection();
    
    console.log('✅ All collections created successfully!');
    console.log('\n📋 Summary:');
    console.log('  ✓ Wishlist Collection (userId, productId, createdAt)');
    console.log('  ✓ Commissions Collection (affiliateId, orderId, amount, rate, status, createdAt, paidAt)');
    console.log('\n🎉 You can now use these collections in your application!');
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();
