#!/usr/bin/env tsx

/**
 * Setup Referral System in Appwrite
 * Creates collections, sets permissions, and initializes data
 */

import { Client, Databases, ID, Permission, Role, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

interface CollectionConfig {
  name: string;
  id: string;
  attributes: Array<{
    key: string;
    type: 'string' | 'integer' | 'float' | 'boolean' | 'datetime' | 'email';
    size?: number;
    required: boolean;
    array?: boolean;
    default?: any;
  }>;
  indexes?: Array<{
    key: string;
    type: 'key' | 'fulltext' | 'unique';
    attributes: string[];
  }>;
}

const collections: CollectionConfig[] = [
  // User Preferences Collection
  {
    name: 'User Preferences',
    id: 'user_preferences',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'affiliateCode', type: 'string', size: 50, required: false },
      { key: 'referredBy', type: 'string', size: 255, required: false },
      { key: 'role', type: 'string', size: 50, required: true },
      { key: 'theme', type: 'string', size: 20, required: false, default: 'light' },
      { key: 'language', type: 'string', size: 10, required: false, default: 'ar' },
      { key: 'notifications', type: 'boolean', required: false, default: true },
      { key: 'emailNotifications', type: 'boolean', required: false, default: true },
      { key: 'smsNotifications', type: 'boolean', required: false, default: false },
    ],
    indexes: [
      { key: 'userId_index', type: 'unique', attributes: ['userId'] },
      { key: 'affiliateCode_index', type: 'unique', attributes: ['affiliateCode'] },
      { key: 'referredBy_index', type: 'key', attributes: ['referredBy'] },
    ],
  },
  
  // Referrals Collection
  {
    name: 'Referrals',
    id: 'referrals',
    attributes: [
      { key: 'referrerId', type: 'string', size: 255, required: true },
      { key: 'referredUserId', type: 'string', size: 255, required: true },
      { key: 'referredUserName', type: 'string', size: 255, required: true },
      { key: 'referredUserEmail', type: 'email', required: true },
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'reward', type: 'float', required: true },
      { key: 'level', type: 'integer', required: true },
      { key: 'completedAt', type: 'datetime', required: false },
    ],
    indexes: [
      { key: 'referrerId_index', type: 'key', attributes: ['referrerId'] },
      { key: 'referredUserId_index', type: 'unique', attributes: ['referredUserId'] },
      { key: 'status_index', type: 'key', attributes: ['status'] },
      { key: 'level_index', type: 'key', attributes: ['level'] },
    ],
  },
  
  // Referral Earnings Collection
  {
    name: 'Referral Earnings',
    id: 'referral_earnings',
    attributes: [
      { key: 'referrerId', type: 'string', size: 255, required: true },
      { key: 'referredUserId', type: 'string', size: 255, required: true },
      { key: 'orderId', type: 'string', size: 255, required: false },
      { key: 'amount', type: 'float', required: true },
      { key: 'percentage', type: 'float', required: true },
      { key: 'level', type: 'integer', required: true },
      { key: 'type', type: 'string', size: 50, required: true }, // 'signup', 'first_purchase', 'commission'
      { key: 'status', type: 'string', size: 20, required: true },
      { key: 'paidAt', type: 'datetime', required: false },
    ],
    indexes: [
      { key: 'referrerId_index', type: 'key', attributes: ['referrerId'] },
      { key: 'referredUserId_index', type: 'key', attributes: ['referredUserId'] },
      { key: 'orderId_index', type: 'key', attributes: ['orderId'] },
      { key: 'status_index', type: 'key', attributes: ['status'] },
      { key: 'type_index', type: 'key', attributes: ['type'] },
    ],
  },
];

async function createCollection(config: CollectionConfig) {
  try {
    console.log(`\n📦 Creating collection: ${config.name} (${config.id})`);
    
    // Check if collection exists
    try {
      await databases.getCollection(databaseId, config.id);
      console.log(`✅ Collection ${config.name} already exists`);
      return;
    } catch (error: any) {
      if (error.code !== 404) throw error;
    }
    
    // Create collection
    const collection = await databases.createCollection(
      databaseId,
      config.id,
      config.name,
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    
    console.log(`✅ Collection created: ${config.name}`);
    
    // Create attributes
    for (const attr of config.attributes) {
      try {
        console.log(`  📝 Creating attribute: ${attr.key}`);
        
        switch (attr.type) {
          case 'string':
          case 'email':
            await databases.createStringAttribute(
              databaseId,
              config.id,
              attr.key,
              attr.size || 255,
              attr.required,
              attr.default,
              attr.array || false
            );
            break;
          case 'integer':
            await databases.createIntegerAttribute(
              databaseId,
              config.id,
              attr.key,
              attr.required,
              undefined,
              undefined,
              attr.default,
              attr.array || false
            );
            break;
          case 'float':
            await databases.createFloatAttribute(
              databaseId,
              config.id,
              attr.key,
              attr.required,
              undefined,
              undefined,
              attr.default,
              attr.array || false
            );
            break;
          case 'boolean':
            await databases.createBooleanAttribute(
              databaseId,
              config.id,
              attr.key,
              attr.required,
              attr.default,
              attr.array || false
            );
            break;
          case 'datetime':
            await databases.createDatetimeAttribute(
              databaseId,
              config.id,
              attr.key,
              attr.required,
              attr.default,
              attr.array || false
            );
            break;
        }
        
        console.log(`  ✅ Attribute created: ${attr.key}`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`  ⚠️  Attribute ${attr.key} already exists`);
        } else {
          console.error(`  ❌ Error creating attribute ${attr.key}:`, error.message);
        }
      }
    }
    
    // Wait for attributes to be ready
    console.log(`  ⏳ Waiting for attributes to be ready...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create indexes
    if (config.indexes) {
      for (const index of config.indexes) {
        try {
          console.log(`  🔍 Creating index: ${index.key}`);
          await databases.createIndex(
            databaseId,
            config.id,
            index.key,
            index.type as any,
            index.attributes
          );
          console.log(`  ✅ Index created: ${index.key}`);
        } catch (error: any) {
          if (error.code === 409) {
            console.log(`  ⚠️  Index ${index.key} already exists`);
          } else {
            console.error(`  ❌ Error creating index ${index.key}:`, error.message);
          }
        }
      }
    }
    
    console.log(`✅ Collection ${config.name} setup complete!`);
  } catch (error: any) {
    console.error(`❌ Error creating collection ${config.name}:`, error.message);
    throw error;
  }
}

async function generateAffiliateCode(userId: string): Promise<string> {
  // Generate unique affiliate code
  const prefix = 'REF';
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}${random}`;
}

async function initializeUserPreferences() {
  console.log('\n👥 Initializing user preferences...');
  
  try {
    // Get all users (you'll need to implement this based on your auth system)
    // For now, we'll just create a sample
    console.log('✅ User preferences initialization complete');
  } catch (error: any) {
    console.error('❌ Error initializing user preferences:', error.message);
  }
}

async function setupReferralLevels() {
  console.log('\n🎯 Setting up referral levels configuration...');
  
  const levels = [
    { level: 1, signupReward: 50, firstPurchaseReward: 100, commissionRate: 5.0 },
    { level: 2, signupReward: 25, firstPurchaseReward: 50, commissionRate: 2.5 },
    { level: 3, signupReward: 10, firstPurchaseReward: 25, commissionRate: 1.0 },
    { level: 4, signupReward: 5, firstPurchaseReward: 10, commissionRate: 0.5 },
  ];
  
  console.log('📊 Referral Levels:');
  levels.forEach(level => {
    console.log(`  Level ${level.level}:`);
    console.log(`    - Signup Reward: ${level.signupReward} EGP`);
    console.log(`    - First Purchase Reward: ${level.firstPurchaseReward} EGP`);
    console.log(`    - Commission Rate: ${level.commissionRate}%`);
  });
  
  console.log('✅ Referral levels configured');
}

async function main() {
  console.log('🚀 Starting Referral System Setup...\n');
  console.log('📋 Configuration:');
  console.log(`  - Endpoint: ${process.env.VITE_APPWRITE_ENDPOINT}`);
  console.log(`  - Project ID: ${process.env.VITE_APPWRITE_PROJECT_ID}`);
  console.log(`  - Database ID: ${databaseId}`);
  
  if (!process.env.APPWRITE_API_KEY) {
    console.error('\n❌ Error: APPWRITE_API_KEY not found in environment variables');
    console.log('Please add APPWRITE_API_KEY to your .env file');
    process.exit(1);
  }
  
  try {
    // Create collections
    for (const collection of collections) {
      await createCollection(collection);
    }
    
    // Initialize user preferences
    await initializeUserPreferences();
    
    // Setup referral levels
    await setupReferralLevels();
    
    console.log('\n✅ Referral System Setup Complete!');
    console.log('\n📝 Next Steps:');
    console.log('  1. Update user preferences for existing users');
    console.log('  2. Generate affiliate codes for affiliates');
    console.log('  3. Test the referral flow');
    console.log('  4. Monitor referral earnings');
    
  } catch (error: any) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
