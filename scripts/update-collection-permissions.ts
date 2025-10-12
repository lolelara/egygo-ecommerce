/**
 * Update Collection Permissions Script
 * 
 * يحدث permissions للـ collections الموجودة
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';
import { config } from 'dotenv';

// Load environment variables
config();

// Appwrite Configuration
const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || '';
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// Collection IDs
const COLLECTIONS = {
  FAVORITES: 'favorites',
  PRODUCT_VIEWS: 'product_views',
  AFFILIATE_ACTIVITIES: 'affiliate_activities',
  AFFILIATE_CLICKS: 'affiliate_clicks',
  AFFILIATE_STATS: 'affiliate_stats',
  WITHDRAWAL_REQUESTS: 'withdrawal_requests',
  NOTIFICATIONS: 'notifications',
};

async function updateCollectionPermissions() {
  console.log('🔐 Updating Collection Permissions...\n');

  if (!APPWRITE_API_KEY) {
    console.error('❌ APPWRITE_API_KEY is required');
    process.exit(1);
  }

  if (!DATABASE_ID) {
    console.error('❌ DATABASE_ID is required');
    process.exit(1);
  }

  try {
    // Update Favorites Collection
    console.log('📦 Updating Favorites Collection permissions...');
    try {
      await databases.updateCollection(
        DATABASE_ID,
        COLLECTIONS.FAVORITES,
        'Favorites',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        false, // documentSecurity
        true   // enabled
      );
      console.log('✅ Favorites permissions updated');
    } catch (error: any) {
      console.error('❌ Error updating Favorites:', error.message);
    }

    // Update Product Views Collection
    console.log('📦 Updating Product Views Collection permissions...');
    try {
      await databases.updateCollection(
        DATABASE_ID,
        COLLECTIONS.PRODUCT_VIEWS,
        'Product Views',
        [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
        ],
        false,
        true
      );
      console.log('✅ Product Views permissions updated');
    } catch (error: any) {
      console.error('❌ Error updating Product Views:', error.message);
    }

    // Update Affiliate Activities Collection
    console.log('📦 Updating Affiliate Activities Collection permissions...');
    try {
      await databases.updateCollection(
        DATABASE_ID,
        COLLECTIONS.AFFILIATE_ACTIVITIES,
        'Affiliate Activities',
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
        ],
        false,
        true
      );
      console.log('✅ Affiliate Activities permissions updated');
    } catch (error: any) {
      console.error('❌ Error updating Affiliate Activities:', error.message);
    }

    // Update Affiliate Clicks Collection
    console.log('📦 Updating Affiliate Clicks Collection permissions...');
    try {
      await databases.updateCollection(
        DATABASE_ID,
        COLLECTIONS.AFFILIATE_CLICKS,
        'Affiliate Clicks',
        [
          Permission.read(Role.users()),
          Permission.create(Role.any()),
        ],
        false,
        true
      );
      console.log('✅ Affiliate Clicks permissions updated');
    } catch (error: any) {
      console.error('❌ Error updating Affiliate Clicks:', error.message);
    }

    // Update Affiliate Stats Collection
    console.log('📦 Updating Affiliate Stats Collection permissions...');
    try {
      await databases.updateCollection(
        DATABASE_ID,
        COLLECTIONS.AFFILIATE_STATS,
        'Affiliate Stats',
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
        ],
        false,
        true
      );
      console.log('✅ Affiliate Stats permissions updated');
    } catch (error: any) {
      console.error('❌ Error updating Affiliate Stats:', error.message);
    }

    // Update Withdrawal Requests Collection
    console.log('📦 Updating Withdrawal Requests Collection permissions...');
    try {
      await databases.updateCollection(
        DATABASE_ID,
        COLLECTIONS.WITHDRAWAL_REQUESTS,
        'Withdrawal Requests',
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
        ],
        false,
        true
      );
      console.log('✅ Withdrawal Requests permissions updated');
    } catch (error: any) {
      console.error('❌ Error updating Withdrawal Requests:', error.message);
    }

    // Update Notifications Collection
    console.log('📦 Updating Notifications Collection permissions...');
    try {
      await databases.updateCollection(
        DATABASE_ID,
        COLLECTIONS.NOTIFICATIONS,
        'Notifications',
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
        ],
        false,
        true
      );
      console.log('✅ Notifications permissions updated');
    } catch (error: any) {
      console.error('❌ Error updating Notifications:', error.message);
    }

    console.log('\n✅ All permissions updated successfully!');
    console.log('\n📝 Note: If you still have permission issues, check:');
    console.log('1. User is logged in');
    console.log('2. Collection exists in Appwrite dashboard');
    console.log('3. API key has correct permissions');
  } catch (error) {
    console.error('\n❌ Update failed:', error);
    process.exit(1);
  }
}

// Run the update
updateCollectionPermissions();
