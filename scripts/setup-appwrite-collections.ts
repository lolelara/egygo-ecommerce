/**
 * Appwrite Database Setup Script
 * 
 * هذا السكريبت ينشئ جميع الـ Collections المطلوبة في Appwrite
 * مع جميع الـ Attributes والـ Indexes
 */

import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import { config } from 'dotenv';

// Load environment variables
config();

// Appwrite Configuration
const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || ''; // Admin API Key
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
  LEADERBOARD: 'leaderboard',
  WITHDRAWAL_REQUESTS: 'withdrawal_requests',
  NOTIFICATIONS: 'notifications',
};

/**
 * Create Favorites Collection
 */
async function createFavoritesCollection() {
  console.log('📦 Creating Favorites Collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.FAVORITES,
      'Favorites',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.FAVORITES, 'userId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.FAVORITES, 'productId', 255, true);
    await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.FAVORITES, 'createdAt', true);

    // Indexes
    await databases.createIndex(DATABASE_ID, COLLECTIONS.FAVORITES, 'userId_idx', 'key', ['userId']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.FAVORITES, 'productId_idx', 'key', ['productId']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.FAVORITES, 'user_product_idx', 'unique', ['userId', 'productId']);

    console.log('✅ Favorites Collection created successfully');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Favorites Collection already exists');
    } else {
      console.error('❌ Error creating Favorites Collection:', error.message);
    }
  }
}

/**
 * Create Product Views Collection
 */
async function createProductViewsCollection() {
  console.log('📦 Creating Product Views Collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.PRODUCT_VIEWS,
      'Product Views',
      [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.users()),
      ]
    );

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PRODUCT_VIEWS, 'productId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PRODUCT_VIEWS, 'userId', 255, false);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.PRODUCT_VIEWS, 'sessionId', 255, false);
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.PRODUCT_VIEWS, 'viewCount', true, 0, 999999);
    await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.PRODUCT_VIEWS, 'lastViewedAt', true);
    await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.PRODUCT_VIEWS, 'createdAt', true);

    // Indexes
    await databases.createIndex(DATABASE_ID, COLLECTIONS.PRODUCT_VIEWS, 'productId_idx', 'key', ['productId']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.PRODUCT_VIEWS, 'userId_idx', 'key', ['userId']);

    console.log('✅ Product Views Collection created successfully');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Product Views Collection already exists');
    } else {
      console.error('❌ Error creating Product Views Collection:', error.message);
    }
  }
}

/**
 * Create Affiliate Activities Collection
 */
async function createAffiliateActivitiesCollection() {
  console.log('📦 Creating Affiliate Activities Collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.AFFILIATE_ACTIVITIES,
      'Affiliate Activities',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
      ]
    );

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_ACTIVITIES, 'affiliateId', 255, true);
    await databases.createEnumAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_ACTIVITIES, 'type', ['sale', 'click', 'link_created', 'earning'], true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_ACTIVITIES, 'title', 255, true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_ACTIVITIES, 'description', 1000, false);
    await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_ACTIVITIES, 'amount', false);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_ACTIVITIES, 'productId', 255, false);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_ACTIVITIES, 'productName', 255, false);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_ACTIVITIES, 'createdAt', 50, true);

    // Indexes
    await databases.createIndex(DATABASE_ID, COLLECTIONS.AFFILIATE_ACTIVITIES, 'affiliateId_idx', 'key', ['affiliateId']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.AFFILIATE_ACTIVITIES, 'type_idx', 'key', ['type']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.AFFILIATE_ACTIVITIES, 'createdAt_idx', 'key', ['createdAt'], ['DESC']);

    console.log('✅ Affiliate Activities Collection created successfully');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Affiliate Activities Collection already exists');
    } else {
      console.error('❌ Error creating Affiliate Activities Collection:', error.message);
    }
  }
}

/**
 * Create Affiliate Clicks Collection
 */
async function createAffiliateClicksCollection() {
  console.log('📦 Creating Affiliate Clicks Collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.AFFILIATE_CLICKS,
      'Affiliate Clicks',
      [
        Permission.read(Role.users()),
        Permission.create(Role.any()),
      ]
    );

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_CLICKS, 'affiliateId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_CLICKS, 'productId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_CLICKS, 'ipAddress', 45, false);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_CLICKS, 'userAgent', 500, false);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_CLICKS, 'referrer', 500, false);
    await databases.createBooleanAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_CLICKS, 'converted', false, false);
    await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_CLICKS, 'createdAt', true);

    // Indexes
    await databases.createIndex(DATABASE_ID, COLLECTIONS.AFFILIATE_CLICKS, 'affiliateId_idx', 'key', ['affiliateId']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.AFFILIATE_CLICKS, 'productId_idx', 'key', ['productId']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.AFFILIATE_CLICKS, 'createdAt_idx', 'key', ['createdAt'], ['DESC']);

    console.log('✅ Affiliate Clicks Collection created successfully');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Affiliate Clicks Collection already exists');
    } else {
      console.error('❌ Error creating Affiliate Clicks Collection:', error.message);
    }
  }
}

/**
 * Create Affiliate Stats Collection
 */
async function createAffiliateStatsCollection() {
  console.log('📦 Creating Affiliate Stats Collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.AFFILIATE_STATS,
      'Affiliate Stats',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
      ]
    );

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'affiliateId', 255, true);
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'totalClicks', true, 0, 999999999);
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'totalOrders', true, 0, 999999);
    await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'totalEarnings', true, 0);
    await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'pendingEarnings', true, 0);
    await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'thisMonthEarnings', true, 0);
    await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'conversionRate', true, 0);
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'rank', false);
    await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'updatedAt', true);

    // Indexes
    await databases.createIndex(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'affiliateId_idx', 'unique', ['affiliateId']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'totalEarnings_idx', 'key', ['totalEarnings'], ['DESC']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.AFFILIATE_STATS, 'rank_idx', 'key', ['rank']);

    console.log('✅ Affiliate Stats Collection created successfully');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Affiliate Stats Collection already exists');
    } else {
      console.error('❌ Error creating Affiliate Stats Collection:', error.message);
    }
  }
}

/**
 * Create Withdrawal Requests Collection
 */
async function createWithdrawalRequestsCollection() {
  console.log('📦 Creating Withdrawal Requests Collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.WITHDRAWAL_REQUESTS,
      'Withdrawal Requests',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
      ]
    );

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'affiliateId', 255, true);
    await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'amount', true);
    await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'fee', true);
    await databases.createFloatAttribute(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'netAmount', true);
    await databases.createEnumAttribute(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'paymentMethod', ['bank', 'vodafone', 'instapay', 'paypal'], true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'accountDetails', 500, true);
    await databases.createEnumAttribute(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'status', ['pending', 'processing', 'completed', 'rejected'], false, 'pending');
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'notes', 1000, false);
    await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'createdAt', true);
    await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'processedAt', false);

    // Indexes
    await databases.createIndex(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'affiliateId_idx', 'key', ['affiliateId']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'status_idx', 'key', ['status']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.WITHDRAWAL_REQUESTS, 'createdAt_idx', 'key', ['createdAt'], ['DESC']);

    console.log('✅ Withdrawal Requests Collection created successfully');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Withdrawal Requests Collection already exists');
    } else {
      console.error('❌ Error creating Withdrawal Requests Collection:', error.message);
    }
  }
}

/**
 * Create Notifications Collection
 */
async function createNotificationsCollection() {
  console.log('📦 Creating Notifications Collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTIONS.NOTIFICATIONS,
      'Notifications',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
      ]
    );

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'userId', 255, true);
    await databases.createEnumAttribute(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'type', ['opportunity', 'achievement', 'tip', 'warning', 'promotion'], true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'title', 255, true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'message', 1000, true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'actionLabel', 100, false);
    await databases.createStringAttribute(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'actionLink', 500, false);
    await databases.createBooleanAttribute(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'isRead', true, false);
    await databases.createBooleanAttribute(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'isNew', true, true);
    await databases.createDatetimeAttribute(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'createdAt', true);

    // Indexes
    await databases.createIndex(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'userId_idx', 'key', ['userId']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'isRead_idx', 'key', ['isRead']);
    await databases.createIndex(DATABASE_ID, COLLECTIONS.NOTIFICATIONS, 'createdAt_idx', 'key', ['createdAt'], ['DESC']);

    console.log('✅ Notifications Collection created successfully');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Notifications Collection already exists');
    } else {
      console.error('❌ Error creating Notifications Collection:', error.message);
    }
  }
}

/**
 * Main Setup Function
 */
async function setupAppwriteCollections() {
  console.log('🚀 Starting Appwrite Collections Setup...\n');

  if (!APPWRITE_API_KEY) {
    console.error('❌ APPWRITE_API_KEY is required. Please set it in your .env file');
    process.exit(1);
  }

  if (!DATABASE_ID) {
    console.error('❌ DATABASE_ID is required. Please set VITE_APPWRITE_DATABASE_ID in your .env file');
    process.exit(1);
  }

  try {
    await createFavoritesCollection();
    await createProductViewsCollection();
    await createAffiliateActivitiesCollection();
    await createAffiliateClicksCollection();
    await createAffiliateStatsCollection();
    await createWithdrawalRequestsCollection();
    await createNotificationsCollection();

    console.log('\n✅ All collections setup completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('1. Update your appwriteConfig in client/lib/appwrite.ts with these collection IDs');
    console.log('2. Run the seed script to populate initial data');
    console.log('3. Test the application');
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupAppwriteCollections();
