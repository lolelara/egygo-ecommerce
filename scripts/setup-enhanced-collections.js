/**
 * Setup Enhanced Collections
 * Creates all new collections for enhanced features
 */

import { Client, Databases, Storage, Permission, Role } from 'node-appwrite';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';
const API_KEY = process.env.APPWRITE_API_KEY;

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);

const databases = new Databases(client);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setupCollections() {
  console.log('🚀 Setting up Enhanced Collections...\n');

  try {
    // 1. Subscriptions Collection
    console.log('📦 Creating subscriptions collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'subscriptions',
        'Subscriptions',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      await sleep(2000);

      const subAttrs = [
        { key: 'merchantId', size: 255, required: true },
        { key: 'merchantName', size: 255, required: true },
        { key: 'planType', size: 50, required: true },
        { key: 'productLimit', type: 'integer', required: true },
        { key: 'currentProducts', type: 'integer', required: true },
        { key: 'price', type: 'float', required: true },
        { key: 'startDate', size: 50, required: true },
        { key: 'endDate', size: 50, required: true },
        { key: 'status', size: 50, required: true },
        { key: 'autoRenew', type: 'boolean', required: true },
        { key: 'paymentProof', size: 2000, required: false },
      ];

      for (const attr of subAttrs) {
        try {
          if (attr.type === 'integer') {
            await databases.createIntegerAttribute(DATABASE_ID, 'subscriptions', attr.key, attr.required);
          } else if (attr.type === 'float') {
            await databases.createFloatAttribute(DATABASE_ID, 'subscriptions', attr.key, attr.required);
          } else if (attr.type === 'boolean') {
            await databases.createBooleanAttribute(DATABASE_ID, 'subscriptions', attr.key, attr.required);
          } else {
            await databases.createStringAttribute(DATABASE_ID, 'subscriptions', attr.key, attr.size, attr.required);
          }
          await sleep(1000);
        } catch (e) {
          if (e.code !== 409) console.log(`  ⚠️  ${attr.key}: ${e.message}`);
        }
      }
      console.log('✅ subscriptions collection created\n');
    } catch (e) {
      if (e.code === 409) console.log('⚠️  subscriptions already exists\n');
      else console.log(`❌ ${e.message}\n`);
    }

    // 2. Advertisements Collection
    console.log('📦 Creating advertisements collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'advertisements',
        'Advertisements',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      await sleep(2000);

      const adAttrs = [
        { key: 'merchantId', size: 255, required: true },
        { key: 'merchantName', size: 255, required: true },
        { key: 'productId', size: 255, required: true },
        { key: 'productName', size: 255, required: true },
        { key: 'productImage', size: 2000, required: true },
        { key: 'adType', size: 100, required: true },
        { key: 'placement', size: 50, required: true },
        { key: 'duration', type: 'integer', required: true },
        { key: 'price', type: 'float', required: true },
        { key: 'startDate', size: 50, required: true },
        { key: 'endDate', size: 50, required: true },
        { key: 'status', size: 50, required: true },
        { key: 'clicks', type: 'integer', required: true },
        { key: 'impressions', type: 'integer', required: true },
        { key: 'paymentProof', size: 2000, required: false },
        { key: 'createdAt', size: 50, required: true },
      ];

      for (const attr of adAttrs) {
        try {
          if (attr.type === 'integer') {
            await databases.createIntegerAttribute(DATABASE_ID, 'advertisements', attr.key, attr.required);
          } else if (attr.type === 'float') {
            await databases.createFloatAttribute(DATABASE_ID, 'advertisements', attr.key, attr.required);
          } else {
            await databases.createStringAttribute(DATABASE_ID, 'advertisements', attr.key, attr.size, attr.required);
          }
          await sleep(1000);
        } catch (e) {
          if (e.code !== 409) console.log(`  ⚠️  ${attr.key}: ${e.message}`);
        }
      }
      console.log('✅ advertisements collection created\n');
    } catch (e) {
      if (e.code === 409) console.log('⚠️  advertisements already exists\n');
      else console.log(`❌ ${e.message}\n`);
    }

    // 3. User Points Collection
    console.log('📦 Creating user_points collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'user_points',
        'User Points',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      await sleep(2000);

      const pointsAttrs = [
        { key: 'userId', size: 255, required: true },
        { key: 'userName', size: 255, required: true },
        { key: 'totalPoints', type: 'integer', required: true },
        { key: 'availablePoints', type: 'integer', required: true },
        { key: 'level', type: 'integer', required: true },
        { key: 'nextLevelPoints', type: 'integer', required: true },
        { key: 'streak', type: 'integer', required: true },
        { key: 'lastActivityDate', size: 50, required: true },
        { key: 'achievements', size: 5000, required: false },
        { key: 'redeemedRewards', size: 5000, required: false },
      ];

      for (const attr of pointsAttrs) {
        try {
          if (attr.type === 'integer') {
            await databases.createIntegerAttribute(DATABASE_ID, 'user_points', attr.key, attr.required);
          } else {
            await databases.createStringAttribute(DATABASE_ID, 'user_points', attr.key, attr.size, attr.required);
          }
          await sleep(1000);
        } catch (e) {
          if (e.code !== 409) console.log(`  ⚠️  ${attr.key}: ${e.message}`);
        }
      }
      console.log('✅ user_points collection created\n');
    } catch (e) {
      if (e.code === 409) console.log('⚠️  user_points already exists\n');
      else console.log(`❌ ${e.message}\n`);
    }

    // 4. Points Transactions Collection
    console.log('📦 Creating points_transactions collection...');
    try {
      await databases.createCollection(
        DATABASE_ID,
        'points_transactions',
        'Points Transactions',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      await sleep(2000);

      const transAttrs = [
        { key: 'userId', size: 255, required: true },
        { key: 'type', size: 50, required: true },
        { key: 'action', size: 100, required: true },
        { key: 'points', type: 'integer', required: true },
        { key: 'description', size: 500, required: true },
        { key: 'metadata', size: 2000, required: false },
        { key: 'createdAt', size: 50, required: true },
      ];

      for (const attr of transAttrs) {
        try {
          if (attr.type === 'integer') {
            await databases.createIntegerAttribute(DATABASE_ID, 'points_transactions', attr.key, attr.required);
          } else {
            await databases.createStringAttribute(DATABASE_ID, 'points_transactions', attr.key, attr.size, attr.required);
          }
          await sleep(1000);
        } catch (e) {
          if (e.code !== 409) console.log(`  ⚠️  ${attr.key}: ${e.message}`);
        }
      }
      console.log('✅ points_transactions collection created\n');
    } catch (e) {
      if (e.code === 409) console.log('⚠️  points_transactions already exists\n');
      else console.log(`❌ ${e.message}\n`);
    }

    console.log('\n🎉 Enhanced Collections Setup Complete!\n');
    console.log('📋 Collections Created:');
    console.log('  ✅ subscriptions - Merchant subscription management');
    console.log('  ✅ advertisements - Paid advertising system');
    console.log('  ✅ user_points - Points & rewards system');
    console.log('  ✅ points_transactions - Points transaction history\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

setupCollections();
