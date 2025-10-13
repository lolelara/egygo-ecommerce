#!/usr/bin/env tsx

/**
 * Create Demo Intermediary Account
 */

import { Client, Account, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const account = new Account(client);
const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function createDemoIntermediary() {
  console.log('🎯 Creating Demo Intermediary Account...\n');

  const demoAccount = {
    email: 'intermediary@demo.egygo.me',
    password: 'Demo123456',
    name: 'وسيط تجريبي',
    phone: '+201234567890'
  };

  try {
    // 1. Create Auth account
    console.log('📝 Creating Auth account...');
    let userId: string;
    
    try {
      const user = await account.create(
        ID.unique(),
        demoAccount.email,
        demoAccount.password,
        demoAccount.name
      );
      userId = user.$id;
      console.log(`✅ Auth account created: ${userId}`);
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  Account already exists, fetching...');
        // Get existing user
        const { Query } = await import('node-appwrite');
        const users = await databases.listDocuments(
          databaseId,
          'userPreferences',
          [Query.equal('email', demoAccount.email)]
        );
        
        if (users.documents.length > 0) {
          userId = users.documents[0].userId;
          console.log(`✅ Found existing user: ${userId}`);
        } else {
          throw new Error('Account exists but not found in userPreferences');
        }
      } else {
        throw error;
      }
    }

    // 2. Update Auth labels
    console.log('\n📝 Updating Auth labels...');
    const { Users } = await import('node-appwrite');
    const users = new Users(client);
    
    try {
      await users.updateLabels(userId, ['intermediary']);
      console.log('✅ Auth labels updated');
    } catch (error: any) {
      console.log('⚠️  Could not update labels:', error.message);
    }

    // 3. Create/Update userPreferences
    console.log('\n📝 Creating userPreferences...');
    
    const intermediaryCode = `INT${Date.now()}`;
    const prefsData = {
      userId: userId,
      email: demoAccount.email,
      name: demoAccount.name,
      phone: demoAccount.phone,
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

    try {
      // Check if exists
      const { Query } = await import('node-appwrite');
      const existing = await databases.listDocuments(
        databaseId,
        'userPreferences',
        [Query.equal('userId', userId)]
      );

      if (existing.documents.length > 0) {
        // Update existing
        await databases.updateDocument(
          databaseId,
          'userPreferences',
          existing.documents[0].$id,
          prefsData
        );
        console.log('✅ userPreferences updated');
      } else {
        // Create new
        await databases.createDocument(
          databaseId,
          'userPreferences',
          ID.unique(),
          prefsData
        );
        console.log('✅ userPreferences created');
      }
    } catch (error: any) {
      console.error('❌ Error with userPreferences:', error.message);
    }

    // 4. Create welcome notification
    console.log('\n📝 Creating welcome notification...');
    
    try {
      await databases.createDocument(
        databaseId,
        'notifications',
        ID.unique(),
        {
          userId: userId,
          title: '🎉 مرحباً في حساب الوسيط التجريبي',
          message: `كود الوسيط الخاص بك: ${intermediaryCode}\nنسبة الهامش الافتراضية: 25%\nيمكنك الآن إنشاء روابط خاصة بك وإضافة هامش ربح على المنتجات.`,
          type: 'info',
          isRead: false,
          link: '/intermediary/dashboard'
        }
      );
      console.log('✅ Welcome notification created');
    } catch (error: any) {
      console.log('⚠️  Could not create notification:', error.message);
    }

    console.log('\n✅ Demo Intermediary Account Created Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', demoAccount.email);
    console.log('🔑 Password: ', demoAccount.password);
    console.log('👤 Name:     ', demoAccount.name);
    console.log('🆔 User ID:  ', userId);
    console.log('🔖 Code:     ', intermediaryCode);
    console.log('📊 Markup:   ', '25%');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 Login at: https://egygo.me/#/login');
    console.log('📱 Dashboard: https://egygo.me/#/intermediary/dashboard\n');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
    process.exit(1);
  }
}

async function main() {
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ Error: APPWRITE_API_KEY not found in .env');
    process.exit(1);
  }

  await createDemoIntermediary();
  console.log('🎉 Done!\n');
}

main();
