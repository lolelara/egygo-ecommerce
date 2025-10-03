import { Client, Databases, Permission, Role, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.VITE_APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function createAffiliateLinksCollection() {
  console.log('🔗 Creating Affiliate Links Collection...');
  
  try {
    const collection = await databases.createCollection(
      databaseId,
      'affiliate_links',
      'Affiliate Links',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );
    
    console.log('✅ Affiliate Links Collection created:', collection.$id);
    
    // Create attributes
    console.log('  Creating attributes...');
    
    await databases.createStringAttribute(
      databaseId,
      collection.$id,
      'affiliateId',
      255,
      true
    );
    console.log('  ✓ affiliateId');
    
    await databases.createStringAttribute(
      databaseId,
      collection.$id,
      'productId',
      255,
      true
    );
    console.log('  ✓ productId');
    
    await databases.createStringAttribute(
      databaseId,
      collection.$id,
      'linkCode',
      50,
      true
    );
    console.log('  ✓ linkCode');
    
    await databases.createIntegerAttribute(
      databaseId,
      collection.$id,
      'clicks',
      false,
      0
    );
    console.log('  ✓ clicks');
    
    await databases.createIntegerAttribute(
      databaseId,
      collection.$id,
      'conversions',
      false,
      0
    );
    console.log('  ✓ conversions');
    
    await databases.createFloatAttribute(
      databaseId,
      collection.$id,
      'revenue',
      false,
      0
    );
    console.log('  ✓ revenue');
    
    await databases.createDatetimeAttribute(
      databaseId,
      collection.$id,
      'createdAt',
      true
    );
    console.log('  ✓ createdAt');
    
    await databases.createDatetimeAttribute(
      databaseId,
      collection.$id,
      'lastClickAt',
      false
    );
    console.log('  ✓ lastClickAt');
    
    console.log('  ⏳ Waiting 10 seconds for attributes...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
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
    console.log('  ✓ affiliateId index');
    
    await databases.createIndex(
      databaseId,
      collection.$id,
      'linkCode_unique',
      'unique',
      ['linkCode'],
      ['asc']
    );
    console.log('  ✓ linkCode unique index');
    
    await databases.createIndex(
      databaseId,
      collection.$id,
      'productId_index',
      'key',
      ['productId'],
      ['asc']
    );
    console.log('  ✓ productId index');
    
    console.log('✅ Affiliate Links Collection fully configured!\n');
    
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  Affiliate Links Collection already exists\n');
    } else {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }
}

async function createCouponsCollection() {
  console.log('🎟️  Creating Coupons Collection...');
  
  try {
    const collection = await databases.createCollection(
      databaseId,
      'coupons',
      'Coupons',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
      ]
    );
    
    console.log('✅ Coupons Collection created:', collection.$id);
    
    console.log('  Creating attributes...');
    
    await databases.createStringAttribute(
      databaseId,
      collection.$id,
      'code',
      50,
      true
    );
    console.log('  ✓ code');
    
    await databases.createStringAttribute(
      databaseId,
      collection.$id,
      'affiliateId',
      255,
      false
    );
    console.log('  ✓ affiliateId');
    
    await databases.createEnumAttribute(
      databaseId,
      collection.$id,
      'type',
      ['percentage', 'fixed'],
      true
    );
    console.log('  ✓ type');
    
    await databases.createFloatAttribute(
      databaseId,
      collection.$id,
      'value',
      true
    );
    console.log('  ✓ value');
    
    await databases.createIntegerAttribute(
      databaseId,
      collection.$id,
      'usageLimit',
      false
    );
    console.log('  ✓ usageLimit');
    
    await databases.createIntegerAttribute(
      databaseId,
      collection.$id,
      'usageCount',
      false,
      0
    );
    console.log('  ✓ usageCount');
    
    await databases.createDatetimeAttribute(
      databaseId,
      collection.$id,
      'expiresAt',
      false
    );
    console.log('  ✓ expiresAt');
    
    await databases.createBooleanAttribute(
      databaseId,
      collection.$id,
      'active',
      false,
      true
    );
    console.log('  ✓ active');
    
    await databases.createDatetimeAttribute(
      databaseId,
      collection.$id,
      'createdAt',
      true
    );
    console.log('  ✓ createdAt');
    
    console.log('  ⏳ Waiting 10 seconds for attributes...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    console.log('  Creating indexes...');
    
    await databases.createIndex(
      databaseId,
      collection.$id,
      'code_unique',
      'unique',
      ['code'],
      ['asc']
    );
    console.log('  ✓ code unique index');
    
    await databases.createIndex(
      databaseId,
      collection.$id,
      'affiliateId_index',
      'key',
      ['affiliateId'],
      ['asc']
    );
    console.log('  ✓ affiliateId index');
    
    console.log('✅ Coupons Collection fully configured!\n');
    
  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️  Coupons Collection already exists\n');
    } else {
      console.error('❌ Error:', error.message);
      throw error;
    }
  }
}

async function main() {
  console.log('🚀 Creating Affiliate Marketing Features...\n');
  console.log(`📍 Endpoint: ${process.env.VITE_APPWRITE_ENDPOINT}`);
  console.log(`📍 Project: ${process.env.VITE_APPWRITE_PROJECT_ID}`);
  console.log(`📍 Database: ${databaseId}\n`);
  
  try {
    await createAffiliateLinksCollection();
    await createCouponsCollection();
    
    console.log('✅ All collections created successfully!');
    console.log('\n📋 Summary:');
    console.log('  ✓ affiliate_links (Tracking Links)');
    console.log('  ✓ coupons (Discount Coupons)');
    console.log('\n🎉 Affiliate marketing system is ready!');
    
  } catch (error) {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  }
}

main();
