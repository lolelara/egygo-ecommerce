#!/usr/bin/env tsx

/**
 * Fix Coupons Collection - Add Missing Attributes
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
const collectionId = 'coupons';

async function fixCouponsCollection() {
  console.log('🔧 Fixing Coupons Collection...\n');

  try {
    // Get existing collection
    const collection = await databases.getCollection(databaseId, collectionId);
    console.log('✅ Collection found:', collection.name);
    
    const existingAttrs = collection.attributes.map((a: any) => a.key);
    console.log('📋 Existing attributes:', existingAttrs.join(', '));

    // Define required attributes
    const requiredAttributes = [
      { key: 'code', type: 'string', size: 50, required: true },
      { key: 'discountType', type: 'string', size: 20, required: true },
      { key: 'discountValue', type: 'float', required: true },
      { key: 'minAmount', type: 'float', required: false },
      { key: 'maxDiscount', type: 'float', required: false },
      { key: 'usageLimit', type: 'integer', required: false },
      { key: 'usedCount', type: 'integer', required: false },
      { key: 'expiryDate', type: 'string', size: 50, required: false },
      { key: 'isActive', type: 'boolean', required: false },
      { key: 'applicableProducts', type: 'string', size: 10000, required: false },
      { key: 'applicableCategories', type: 'string', size: 5000, required: false },
      { key: 'description', type: 'string', size: 500, required: false },
    ];

    console.log('\n🔍 Checking for missing attributes...\n');

    for (const attr of requiredAttributes) {
      if (existingAttrs.includes(attr.key)) {
        console.log(`  ✅ ${attr.key} - already exists`);
        continue;
      }

      try {
        console.log(`  📝 Creating ${attr.key}...`);
        
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            databaseId,
            collectionId,
            attr.key,
            attr.size!,
            attr.required
          );
        } else if (attr.type === 'float') {
          await databases.createFloatAttribute(
            databaseId,
            collectionId,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            databaseId,
            collectionId,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            databaseId,
            collectionId,
            attr.key,
            attr.required
          );
        }
        
        console.log(`  ✅ ${attr.key} created`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`  ⚠️  ${attr.key} already exists`);
        } else {
          console.error(`  ❌ Error creating ${attr.key}:`, error.message);
        }
      }
    }

    console.log('\n⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create indexes if needed
    console.log('\n🔍 Creating indexes...\n');
    
    const indexes = [
      { key: 'code_index', type: 'unique', attributes: ['code'] },
      { key: 'isActive_index', type: 'key', attributes: ['isActive'] },
    ];

    for (const index of indexes) {
      try {
        console.log(`  📝 Creating index: ${index.key}...`);
        await databases.createIndex(
          databaseId,
          collectionId,
          index.key,
          index.type as any,
          index.attributes
        );
        console.log(`  ✅ ${index.key} created`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`  ⚠️  ${index.key} already exists`);
        } else {
          console.error(`  ❌ Error creating ${index.key}:`, error.message);
        }
      }
    }

    console.log('\n✅ Coupons Collection fixed successfully!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY not found');
    process.exit(1);
  }

  await fixCouponsCollection();
  console.log('\n🎉 Done!');
}

main();
