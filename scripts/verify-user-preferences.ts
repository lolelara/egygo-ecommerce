#!/usr/bin/env tsx

/**
 * Verify User Preferences Collection
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

async function verifyUserPreferences() {
  console.log('🔍 Verifying User Preferences Collection...\n');

  try {
    const collection = await databases.getCollection(databaseId, 'userPreferences');
    
    console.log('✅ Collection exists');
    console.log(`   Total attributes: ${collection.attributes.length}\n`);
    
    console.log('📋 Attributes:');
    collection.attributes.forEach((attr: any) => {
      console.log(`   - ${attr.key} (${attr.type})`);
    });

    console.log('\n📊 Indexes:');
    collection.indexes.forEach((index: any) => {
      console.log(`   - ${index.key}: [${index.attributes.join(', ')}]`);
    });

    // Check for required attributes
    const requiredAttrs = [
      'userId', 'email', 'name', 'phone', 'role',
      'isAdmin', 'isAffiliate', 'isMerchant', 'isIntermediary',
      'affiliateCode', 'intermediaryCode', 'defaultMarkupPercentage',
      'commissionRate', 'accountStatus'
    ];

    console.log('\n✅ Required Attributes Check:');
    const existingAttrs = collection.attributes.map((a: any) => a.key);
    
    requiredAttrs.forEach(attr => {
      const exists = existingAttrs.includes(attr);
      console.log(`   ${exists ? '✅' : '❌'} ${attr}`);
    });

    // List some documents
    console.log('\n📄 Sample Documents:');
    const docs = await databases.listDocuments(databaseId, 'userPreferences', []);
    console.log(`   Total documents: ${docs.total}`);
    
    if (docs.documents.length > 0) {
      const sample = docs.documents[0];
      console.log('\n   Sample document:');
      console.log(`   - userId: ${sample.userId}`);
      console.log(`   - email: ${sample.email}`);
      console.log(`   - name: ${sample.name}`);
      console.log(`   - role: ${sample.role}`);
      console.log(`   - isAdmin: ${sample.isAdmin}`);
      console.log(`   - isAffiliate: ${sample.isAffiliate}`);
      console.log(`   - isMerchant: ${sample.isMerchant}`);
      console.log(`   - isIntermediary: ${sample.isIntermediary}`);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY not found');
    process.exit(1);
  }

  await verifyUserPreferences();
  console.log('\n🎉 Done!');
}

main();
