#!/usr/bin/env tsx

/**
 * Sync Existing Users to User Preferences Collection
 */

import { Client, Databases, Users, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const users = new Users(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function syncExistingUsers() {
  console.log('🔄 Syncing Existing Users to User Preferences...\n');

  try {
    // Get all users from Auth
    console.log('📥 Fetching users from Auth...');
    const authUsers = await users.list();
    console.log(`   Found ${authUsers.total} users\n`);

    // Get existing preferences
    console.log('📥 Fetching existing preferences...');
    const existingPrefs = await databases.listDocuments(
      databaseId,
      'userPreferences'
    );
    const existingUserIds = new Set(existingPrefs.documents.map((d: any) => d.userId));
    console.log(`   Found ${existingPrefs.total} existing preferences\n`);

    let created = 0;
    let skipped = 0;
    let errors = 0;

    console.log('🔄 Processing users...\n');

    for (const user of authUsers.users) {
      try {
        // Skip if already exists
        if (existingUserIds.has(user.$id)) {
          console.log(`  ⏭️  Skipping ${user.email} (already exists)`);
          skipped++;
          continue;
        }

        // Determine role from labels
        let role = 'customer';
        let isAdmin = false;
        let isAffiliate = false;
        let isMerchant = false;
        let isIntermediary = false;

        if (user.labels && user.labels.length > 0) {
          if (user.labels.includes('admin')) {
            role = 'admin';
            isAdmin = true;
          } else if (user.labels.includes('merchant')) {
            role = 'merchant';
            isMerchant = true;
          } else if (user.labels.includes('affiliate')) {
            role = 'affiliate';
            isAffiliate = true;
          } else if (user.labels.includes('intermediary')) {
            role = 'intermediary';
            isIntermediary = true;
          }
        }

        // Create preference document
        await databases.createDocument(
          databaseId,
          'userPreferences',
          ID.unique(),
          {
            userId: user.$id,
            email: user.email,
            name: user.name || 'مستخدم',
            phone: user.phone || '',
            role: role,
            accountStatus: 'approved',
            isAdmin: isAdmin,
            isAffiliate: isAffiliate,
            isMerchant: isMerchant,
            isIntermediary: isIntermediary,
            affiliateCode: isAffiliate ? `AFF${Date.now()}${Math.random().toString(36).substr(2, 4)}` : '',
            intermediaryCode: isIntermediary ? `INT${Date.now()}${Math.random().toString(36).substr(2, 4)}` : '',
            defaultMarkupPercentage: isIntermediary ? 20 : 0,
            commissionRate: isAffiliate ? 10 : 0,
            businessName: '',
            businessAddress: '',
            taxId: ''
          }
        );

        console.log(`  ✅ Created preference for ${user.email} (${role})`);
        created++;

      } catch (error: any) {
        console.error(`  ❌ Error for ${user.email}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Created: ${created}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);
    console.log(`   📝 Total: ${authUsers.total}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY not found');
    process.exit(1);
  }

  await syncExistingUsers();
  console.log('\n🎉 Done!');
}

main();
