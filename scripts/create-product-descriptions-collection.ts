#!/usr/bin/env tsx

/**
 * Create Product Descriptions Collection
 * Separate collection for managing product descriptions
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function createProductDescriptionsCollection() {
  console.log('🚀 Creating Product Descriptions Collection...\n');

  try {
    // Create collection
    console.log('📦 Creating collection: product_descriptions');
    const collection = await databases.createCollection(
      databaseId,
      'product_descriptions',
      'Product Descriptions',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log('✅ Collection created\n');

    // Add attributes
    const attributes = [
      { key: 'productId', type: 'string', size: 255, required: true },
      { key: 'originalDescription', type: 'string', size: 50000, required: false },
      { key: 'customDescription', type: 'string', size: 50000, required: false },
      { key: 'intermediaryId', type: 'string', size: 255, required: false },
    ];

    for (const attr of attributes) {
      try {
        console.log(`  📝 Creating attribute: ${attr.key}...`);
        await databases.createStringAttribute(
          databaseId,
          'product_descriptions',
          attr.key,
          attr.size,
          attr.required
        );
        console.log(`  ✅ ${attr.key} created`);
      } catch (error: any) {
        console.error(`  ❌ Error: ${error.message}`);
      }
    }

    console.log('\n  ⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create indexes
    console.log('\n🔍 Creating indexes...\n');
    
    try {
      console.log('  📝 Creating productId_index (unique)...');
      await databases.createIndex(
        databaseId,
        'product_descriptions',
        'productId_index',
        'unique' as any,
        ['productId']
      );
      console.log('  ✅ productId_index created');
    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
    }

    try {
      console.log('  📝 Creating intermediaryId_index...');
      await databases.createIndex(
        databaseId,
        'product_descriptions',
        'intermediaryId_index',
        'key' as any,
        ['intermediaryId']
      );
      console.log('  ✅ intermediaryId_index created');
    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
    }

    console.log('\n✅ Product Descriptions Collection setup complete!');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Collection already exists');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

async function main() {
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY not found');
    process.exit(1);
  }

  await createProductDescriptionsCollection();
  console.log('\n🎉 Done!');
}

main();
