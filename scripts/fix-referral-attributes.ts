#!/usr/bin/env tsx

/**
 * Fix Missing Attributes in Referral Collections
 */

import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function addMissingAttributes() {
  console.log('🔧 Adding missing attributes to referral collections...\n');

  try {
    // Add missing attributes to referrals collection
    console.log('📦 Fixing referrals collection...');
    
    try {
      console.log('  📝 Adding status attribute...');
      await databases.createStringAttribute(
        databaseId,
        'referrals',
        'status',
        20,
        true
      );
      console.log('  ✅ status attribute added');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('  ⚠️  status attribute already exists');
      } else {
        console.error('  ❌ Error:', error.message);
      }
    }

    try {
      console.log('  📝 Adding reward attribute...');
      await databases.createFloatAttribute(
        databaseId,
        'referrals',
        'reward',
        true
      );
      console.log('  ✅ reward attribute added');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('  ⚠️  reward attribute already exists');
      } else {
        console.error('  ❌ Error:', error.message);
      }
    }

    try {
      console.log('  📝 Adding level attribute...');
      await databases.createIntegerAttribute(
        databaseId,
        'referrals',
        'level',
        true
      );
      console.log('  ✅ level attribute added');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('  ⚠️  level attribute already exists');
      } else {
        console.error('  ❌ Error:', error.message);
      }
    }

    // Wait for attributes to be ready
    console.log('\n  ⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Add missing indexes
    console.log('\n  🔍 Adding missing indexes...');
    
    try {
      console.log('  📝 Adding status_index...');
      await databases.createIndex(
        databaseId,
        'referrals',
        'status_index',
        'key' as any,
        ['status']
      );
      console.log('  ✅ status_index added');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('  ⚠️  status_index already exists');
      } else {
        console.error('  ❌ Error:', error.message);
      }
    }

    try {
      console.log('  📝 Adding level_index...');
      await databases.createIndex(
        databaseId,
        'referrals',
        'level_index',
        'key' as any,
        ['level']
      );
      console.log('  ✅ level_index added');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('  ⚠️  level_index already exists');
      } else {
        console.error('  ❌ Error:', error.message);
      }
    }

    // Fix referral_earnings collection
    console.log('\n📦 Fixing referral_earnings collection...');
    
    try {
      console.log('  📝 Adding status attribute...');
      await databases.createStringAttribute(
        databaseId,
        'referral_earnings',
        'status',
        20,
        true
      );
      console.log('  ✅ status attribute added');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('  ⚠️  status attribute already exists');
      } else {
        console.error('  ❌ Error:', error.message);
      }
    }

    // Wait for attributes to be ready
    console.log('\n  ⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      console.log('  📝 Adding status_index...');
      await databases.createIndex(
        databaseId,
        'referral_earnings',
        'status_index',
        'key' as any,
        ['status']
      );
      console.log('  ✅ status_index added');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('  ⚠️  status_index already exists');
      } else {
        console.error('  ❌ Error:', error.message);
      }
    }

    console.log('\n✅ All missing attributes and indexes added successfully!');
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

async function verifyCollections() {
  console.log('\n🔍 Verifying collections...\n');

  try {
    // Verify user_preferences
    const userPrefs = await databases.getCollection(databaseId, 'user_preferences');
    console.log('✅ user_preferences collection exists');
    console.log(`   Attributes: ${userPrefs.attributes.length}`);

    // Verify referrals
    const referrals = await databases.getCollection(databaseId, 'referrals');
    console.log('✅ referrals collection exists');
    console.log(`   Attributes: ${referrals.attributes.length}`);
    console.log('   Attributes list:');
    referrals.attributes.forEach((attr: any) => {
      console.log(`     - ${attr.key} (${attr.type})`);
    });

    // Verify referral_earnings
    const earnings = await databases.getCollection(databaseId, 'referral_earnings');
    console.log('✅ referral_earnings collection exists');
    console.log(`   Attributes: ${earnings.attributes.length}`);
    console.log('   Attributes list:');
    earnings.attributes.forEach((attr: any) => {
      console.log(`     - ${attr.key} (${attr.type})`);
    });

    console.log('\n✅ All collections verified successfully!');
    
  } catch (error: any) {
    console.error('❌ Error verifying collections:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Referral System Fix...\n');
  
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY not found in environment variables');
    process.exit(1);
  }

  await addMissingAttributes();
  await verifyCollections();
  
  console.log('\n🎉 Done!');
}

main();
