#!/usr/bin/env tsx

/**
 * Setup Intermediary Product Attributes in Appwrite
 * Adds required attributes for intermediary product management
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
const productsCollectionId = 'products';

async function addIntermediaryAttributes() {
  console.log('🔧 Adding intermediary attributes to products collection...\n');

  const attributes = [
    // Intermediary Info
    { key: 'intermediaryId', type: 'string', size: 255, required: false },
    { key: 'intermediaryName', type: 'string', size: 255, required: false },
    
    // Source & Pricing
    { key: 'sourceUrl', type: 'string', size: 2000, required: false },
    { key: 'sourceUrlHash', type: 'string', size: 50, required: false },
    { key: 'originalPrice', type: 'float', required: false },
    { key: 'priceMarkup', type: 'float', required: false },
    { key: 'priceMarkupType', type: 'string', size: 20, required: false }, // 'percentage' or 'fixed'
    { key: 'priceOverride', type: 'float', required: false },
    
    // Description Management
    { key: 'originalDescription', type: 'string', size: 10000, required: false },
    { key: 'customDescription', type: 'string', size: 10000, required: false },
    
    // Auto-Sync
    { key: 'autoSyncEnabled', type: 'boolean', required: false },
    { key: 'syncIntervalMinutes', type: 'integer', required: false },
    { key: 'lastSyncedAt', type: 'datetime', required: false },
  ];

  for (const attr of attributes) {
    try {
      console.log(`  📝 Adding attribute: ${attr.key}...`);
      
      if (attr.type === 'string') {
        await databases.createStringAttribute(
          databaseId,
          productsCollectionId,
          attr.key,
          attr.size!,
          attr.required
        );
      } else if (attr.type === 'float') {
        await databases.createFloatAttribute(
          databaseId,
          productsCollectionId,
          attr.key,
          attr.required
        );
      } else if (attr.type === 'integer') {
        await databases.createIntegerAttribute(
          databaseId,
          productsCollectionId,
          attr.key,
          attr.required
        );
      } else if (attr.type === 'boolean') {
        await databases.createBooleanAttribute(
          databaseId,
          productsCollectionId,
          attr.key,
          attr.required
        );
      } else if (attr.type === 'datetime') {
        await databases.createDatetimeAttribute(
          databaseId,
          productsCollectionId,
          attr.key,
          attr.required
        );
      }
      
      console.log(`  ✅ ${attr.key} added`);
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`  ⚠️  ${attr.key} already exists`);
      } else {
        console.error(`  ❌ Error adding ${attr.key}:`, error.message);
      }
    }
  }

  console.log('\n  ⏳ Waiting for attributes to be ready...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Add indexes
  console.log('\n🔍 Adding indexes...\n');
  
  const indexes = [
    { key: 'intermediaryId_index', type: 'key', attributes: ['intermediaryId'] },
    { key: 'sourceUrlHash_index', type: 'key', attributes: ['sourceUrlHash'] },
    { key: 'autoSyncEnabled_index', type: 'key', attributes: ['autoSyncEnabled'] },
  ];

  for (const index of indexes) {
    try {
      console.log(`  📝 Adding index: ${index.key}...`);
      await databases.createIndex(
        databaseId,
        productsCollectionId,
        index.key,
        index.type as any,
        index.attributes
      );
      console.log(`  ✅ ${index.key} added`);
    } catch (error: any) {
      if (error.code === 409) {
        console.log(`  ⚠️  ${index.key} already exists`);
      } else {
        console.error(`  ❌ Error adding ${index.key}:`, error.message);
      }
    }
  }

  console.log('\n✅ All intermediary attributes and indexes added successfully!');
}

async function verifyAttributes() {
  console.log('\n🔍 Verifying products collection...\n');

  try {
    const collection = await databases.getCollection(databaseId, productsCollectionId);
    console.log('✅ Products collection exists');
    console.log(`   Attributes: ${collection.attributes.length}`);
    console.log('\n   Intermediary-related attributes:');
    
    const intermediaryAttrs = collection.attributes.filter((attr: any) => 
      ['intermediaryId', 'intermediaryName', 'sourceUrl', 'originalPrice', 
       'priceMarkup', 'priceMarkupType', 'priceOverride', 'originalDescription',
       'customDescription', 'autoSyncEnabled', 'syncIntervalMinutes', 'lastSyncedAt'
      ].includes(attr.key)
    );
    
    intermediaryAttrs.forEach((attr: any) => {
      console.log(`     ✓ ${attr.key} (${attr.type})`);
    });

    console.log('\n✅ Verification complete!');
  } catch (error: any) {
    console.error('❌ Error verifying collection:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting Intermediary Attributes Setup...\n');
  
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY not found in environment variables');
    process.exit(1);
  }

  await addIntermediaryAttributes();
  await verifyAttributes();
  
  console.log('\n🎉 Done!');
}

main();
