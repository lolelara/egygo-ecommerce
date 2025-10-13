#!/usr/bin/env tsx

/**
 * Fix Demo Intermediary - Add userPreferences manually
 */

import { Client, Databases, ID, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function fixDemoIntermediary() {
  console.log('🔧 Fixing Demo Intermediary Account...\n');

  const userId = '68ed7d0a001bc33a99e0';
  const email = 'intermediary@demo.egygo.me';
  const intermediaryCode = `INT${Date.now()}`;

  try {
    // Check if userPreferences exists
    console.log('🔍 Checking for existing userPreferences...');
    const existing = await databases.listDocuments(
      databaseId,
      'userPreferences',
      [Query.equal('userId', userId)]
    );

    const prefsData = {
      userId: userId,
      email: email,
      name: 'وسيط تجريبي',
      phone: '+201234567890',
      role: 'intermediary',
      accountStatus: 'approved',
      isAdmin: false,
      isAffiliate: false,
      isMerchant: false,
      isIntermediary: true,
      affiliateCode: '',
      intermediaryCode: intermediaryCode,
      defaultMarkupPercentage: 25,
      commissionRate: 0,
      businessName: 'شركة الوسيط التجريبي',
      businessAddress: 'القاهرة، مصر',
      taxId: ''
    };

    if (existing.documents.length > 0) {
      console.log('📝 Updating existing userPreferences...');
      await databases.updateDocument(
        databaseId,
        'userPreferences',
        existing.documents[0].$id,
        prefsData
      );
      console.log('✅ userPreferences updated');
    } else {
      console.log('📝 Creating new userPreferences...');
      await databases.createDocument(
        databaseId,
        'userPreferences',
        ID.unique(),
        prefsData
      );
      console.log('✅ userPreferences created');
    }

    // Update Auth labels
    console.log('\n📝 Updating Auth labels...');
    const { Users } = await import('node-appwrite');
    const users = new Users(client);
    
    try {
      await users.updateLabels(userId, ['intermediary']);
      console.log('✅ Auth labels updated to [intermediary]');
    } catch (error: any) {
      console.log('⚠️  Could not update labels:', error.message);
    }

    console.log('\n✅ Demo Intermediary Fixed Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', email);
    console.log('🔑 Password: ', 'Demo123456');
    console.log('🆔 User ID:  ', userId);
    console.log('🔖 Code:     ', intermediaryCode);
    console.log('📊 Markup:   ', '25%');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 Login at: https://egygo.me/#/login');
    console.log('📱 Dashboard: https://egygo.me/#/intermediary/dashboard\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response, null, 2));
    }
    process.exit(1);
  }
}

async function main() {
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY not found in .env');
    process.exit(1);
  }

  await fixDemoIntermediary();
  console.log('🎉 Done!\n');
}

main();
