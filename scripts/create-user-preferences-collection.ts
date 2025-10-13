#!/usr/bin/env tsx

/**
 * Create User Preferences Collection
 * For managing user roles and preferences
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

async function createUserPreferencesCollection() {
  console.log('🚀 Creating User Preferences Collection...\n');

  try {
    // Create collection
    console.log('📦 Creating collection: userPreferences');
    const collection = await databases.createCollection(
      databaseId,
      'userPreferences',
      'User Preferences',
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
      // Basic Info
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'email', type: 'string', size: 255, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'phone', type: 'string', size: 50, required: false },
      
      // Role & Status
      { key: 'role', type: 'string', size: 50, required: true },
      { key: 'accountStatus', type: 'string', size: 50, required: false },
      
      // Role Flags
      { key: 'isAdmin', type: 'boolean', required: false },
      { key: 'isAffiliate', type: 'boolean', required: false },
      { key: 'isMerchant', type: 'boolean', required: false },
      { key: 'isIntermediary', type: 'boolean', required: false },
      
      // Codes
      { key: 'affiliateCode', type: 'string', size: 100, required: false },
      { key: 'intermediaryCode', type: 'string', size: 100, required: false },
      
      // Business Settings
      { key: 'defaultMarkupPercentage', type: 'float', required: false },
      { key: 'commissionRate', type: 'float', required: false },
      
      // Additional Info
      { key: 'businessName', type: 'string', size: 255, required: false },
      { key: 'businessAddress', type: 'string', size: 500, required: false },
      { key: 'taxId', type: 'string', size: 100, required: false },
    ];

    for (const attr of attributes) {
      try {
        console.log(`  📝 Creating attribute: ${attr.key}...`);
        
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            databaseId,
            'userPreferences',
            attr.key,
            attr.size!,
            attr.required
          );
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(
            databaseId,
            'userPreferences',
            attr.key,
            attr.required
          );
        } else if (attr.type === 'float') {
          await databases.createFloatAttribute(
            databaseId,
            'userPreferences',
            attr.key,
            attr.required
          );
        }
        
        console.log(`  ✅ ${attr.key} created`);
      } catch (error: any) {
        console.error(`  ❌ Error: ${error.message}`);
      }
    }

    console.log('\n  ⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create indexes
    console.log('\n🔍 Creating indexes...\n');
    
    const indexes = [
      { key: 'userId_index', type: 'unique', attributes: ['userId'] },
      { key: 'email_index', type: 'key', attributes: ['email'] },
      { key: 'role_index', type: 'key', attributes: ['role'] },
      { key: 'affiliateCode_index', type: 'key', attributes: ['affiliateCode'] },
      { key: 'intermediaryCode_index', type: 'key', attributes: ['intermediaryCode'] },
    ];

    for (const index of indexes) {
      try {
        console.log(`  📝 Creating index: ${index.key}...`);
        await databases.createIndex(
          databaseId,
          'userPreferences',
          index.key,
          index.type as any,
          index.attributes
        );
        console.log(`  ✅ ${index.key} created`);
      } catch (error: any) {
        if (error.code === 409) {
          console.log(`  ⚠️  ${index.key} already exists`);
        } else {
          console.error(`  ❌ Error: ${error.message}`);
        }
      }
    }

    console.log('\n✅ User Preferences Collection setup complete!');
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

  await createUserPreferencesCollection();
  console.log('\n🎉 Done!');
}

main();
