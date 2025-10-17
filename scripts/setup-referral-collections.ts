/**
 * Setup Referral System Collections in Appwrite
 * 
 * يقوم بإنشاء وتهيئة collections الخاصة بنظام الإحالة:
 * - referrals
 * - referral_earnings
 */

import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || '')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

/**
 * Create Referrals Collection
 */
async function createReferralsCollection() {
  console.log('📦 Creating referrals collection...');
  
  try {
    // Create collection
    const collection = await databases.createCollection(
      databaseId,
      'referrals',
      'referrals',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    
    console.log('✅ Referrals collection created:', collection.$id);
    
    // Add attributes
    console.log('📝 Adding attributes to referrals collection...');
    
    // referrerId - ID of the referrer (user who shared the link)
    await databases.createStringAttribute(
      databaseId,
      'referrals',
      'referrerId',
      255,
      true
    );
    console.log('  ✓ referrerId');
    
    // referredUserId - ID of the referred user (new user who used the link)
    await databases.createStringAttribute(
      databaseId,
      'referrals',
      'referredUserId',
      255,
      true
    );
    console.log('  ✓ referredUserId');
    
    // referredUserName - Name of the referred user
    await databases.createStringAttribute(
      databaseId,
      'referrals',
      'referredUserName',
      255,
      true
    );
    console.log('  ✓ referredUserName');
    
    // referredUserEmail - Email of the referred user
    await databases.createStringAttribute(
      databaseId,
      'referrals',
      'referredUserEmail',
      255,
      true
    );
    console.log('  ✓ referredUserEmail');
    
    // referralCode - The referral code used
    await databases.createStringAttribute(
      databaseId,
      'referrals',
      'referralCode',
      50,
      true
    );
    console.log('  ✓ referralCode');
    
    // status - pending, active, completed
    await databases.createEnumAttribute(
      databaseId,
      'referrals',
      'status',
      ['pending', 'active', 'completed'],
      true,
      'pending'
    );
    console.log('  ✓ status');
    
    // reward - Reward amount in EGP
    await databases.createFloatAttribute(
      databaseId,
      'referrals',
      'reward',
      true,
      0
    );
    console.log('  ✓ reward');
    
    // level - Referral level (1 = direct, 2 = second level, etc.)
    await databases.createIntegerAttribute(
      databaseId,
      'referrals',
      'level',
      true,
      1
    );
    console.log('  ✓ level');
    
    // createdAt - Timestamp when referral was created
    await databases.createStringAttribute(
      databaseId,
      'referrals',
      'createdAt',
      50,
      true
    );
    console.log('  ✓ createdAt');
    
    // completedAt - Timestamp when referral was completed (optional)
    await databases.createStringAttribute(
      databaseId,
      'referrals',
      'completedAt',
      50,
      false
    );
    console.log('  ✓ completedAt');
    
    // Wait for attributes to be available
    console.log('⏳ Waiting for attributes to be available...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Create indexes
    console.log('📊 Creating indexes...');
    
    await databases.createIndex(
      databaseId,
      'referrals',
      'referrerId_idx',
      'key',
      ['referrerId'],
      ['asc']
    );
    console.log('  ✓ referrerId_idx');
    
    await databases.createIndex(
      databaseId,
      'referrals',
      'referredUserId_idx',
      'key',
      ['referredUserId'],
      ['asc']
    );
    console.log('  ✓ referredUserId_idx');
    
    await databases.createIndex(
      databaseId,
      'referrals',
      'status_idx',
      'key',
      ['status'],
      ['asc']
    );
    console.log('  ✓ status_idx');
    
    console.log('✅ Referrals collection setup complete!\n');
    
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Referrals collection already exists\n');
    } else {
      console.error('❌ Error creating referrals collection:', error.message);
      throw error;
    }
  }
}

/**
 * Create Referral Earnings Collection
 */
async function createReferralEarningsCollection() {
  console.log('📦 Creating referral_earnings collection...');
  
  try {
    // Create collection
    const collection = await databases.createCollection(
      databaseId,
      'referral_earnings',
      'referral_earnings',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    
    console.log('✅ Referral earnings collection created:', collection.$id);
    
    // Add attributes
    console.log('📝 Adding attributes to referral_earnings collection...');
    
    // referrerId - ID of the user who will receive the earning
    await databases.createStringAttribute(
      databaseId,
      'referral_earnings',
      'referrerId',
      255,
      true
    );
    console.log('  ✓ referrerId');
    
    // referredUserId - ID of the user who generated this earning
    await databases.createStringAttribute(
      databaseId,
      'referral_earnings',
      'referredUserId',
      255,
      true
    );
    console.log('  ✓ referredUserId');
    
    // orderId - ID of the order that generated this earning (optional)
    await databases.createStringAttribute(
      databaseId,
      'referral_earnings',
      'orderId',
      255,
      false
    );
    console.log('  ✓ orderId');
    
    // amount - Earning amount in EGP
    await databases.createFloatAttribute(
      databaseId,
      'referral_earnings',
      'amount',
      true
    );
    console.log('  ✓ amount');
    
    // percentage - Commission percentage
    await databases.createFloatAttribute(
      databaseId,
      'referral_earnings',
      'percentage',
      true,
      0
    );
    console.log('  ✓ percentage');
    
    // level - Referral level
    await databases.createIntegerAttribute(
      databaseId,
      'referral_earnings',
      'level',
      true,
      1
    );
    console.log('  ✓ level');
    
    // type - signup, first_purchase, commission
    await databases.createEnumAttribute(
      databaseId,
      'referral_earnings',
      'type',
      ['signup', 'first_purchase', 'commission'],
      true
    );
    console.log('  ✓ type');
    
    // status - pending, completed, paid
    await databases.createEnumAttribute(
      databaseId,
      'referral_earnings',
      'status',
      ['pending', 'completed', 'paid'],
      true,
      'pending'
    );
    console.log('  ✓ status');
    
    // createdAt - Timestamp when earning was created
    await databases.createStringAttribute(
      databaseId,
      'referral_earnings',
      'createdAt',
      50,
      true
    );
    console.log('  ✓ createdAt');
    
    // paidAt - Timestamp when earning was paid (optional)
    await databases.createStringAttribute(
      databaseId,
      'referral_earnings',
      'paidAt',
      50,
      false
    );
    console.log('  ✓ paidAt');
    
    // Wait for attributes to be available
    console.log('⏳ Waiting for attributes to be available...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Create indexes
    console.log('📊 Creating indexes...');
    
    await databases.createIndex(
      databaseId,
      'referral_earnings',
      'referrerId_idx',
      'key',
      ['referrerId'],
      ['asc']
    );
    console.log('  ✓ referrerId_idx');
    
    await databases.createIndex(
      databaseId,
      'referral_earnings',
      'status_idx',
      'key',
      ['status'],
      ['asc']
    );
    console.log('  ✓ status_idx');
    
    await databases.createIndex(
      databaseId,
      'referral_earnings',
      'type_idx',
      'key',
      ['type'],
      ['asc']
    );
    console.log('  ✓ type_idx');
    
    console.log('✅ Referral earnings collection setup complete!\n');
    
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Referral earnings collection already exists\n');
    } else {
      console.error('❌ Error creating referral earnings collection:', error.message);
      throw error;
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Appwrite Referral Collections Setup\n');
  console.log('📍 Endpoint:', process.env.VITE_APPWRITE_ENDPOINT);
  console.log('📍 Project:', process.env.VITE_APPWRITE_PROJECT_ID);
  console.log('📍 Database:', databaseId);
  console.log('\n');
  
  try {
    await createReferralsCollection();
    await createReferralEarningsCollection();
    
    console.log('🎉 All collections created successfully!');
    console.log('\n✅ Next steps:');
    console.log('1. Check Appwrite Console to verify collections');
    console.log('2. Test referral system in the app');
    console.log('3. Monitor referral_earnings for commission tracking\n');
    
  } catch (error) {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
main();
