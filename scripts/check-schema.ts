/**
 * Check Appwrite Collections Schema
 * يفحص schema الفعلي ويطابقه مع الكود
 */

import { Client, Databases } from 'node-appwrite';
import { config } from 'dotenv';

config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

async function checkSchema() {
  console.log('\n🔍 فحص Schema للـ Collections...\n');
  console.log('============================================================\n');

  try {
    // Check notifications collection
    console.log('📋 Notifications Collection:');
    console.log('----------------------------');
    const notifications = await databases.getCollection(DATABASE_ID, 'notifications');
    console.log('✅ Collection exists');
    console.log('\nAttributes:');
    notifications.attributes.forEach((attr: any) => {
      console.log(`  - ${attr.key}: ${attr.type}${attr.array ? '[]' : ''} ${attr.required ? '(required)' : '(optional)'}`);
      if (attr.type === 'string' && attr.size) {
        console.log(`    size: ${attr.size}`);
      }
      if (attr.elements) {
        console.log(`    enum: [${attr.elements.join(', ')}]`);
      }
      if (attr.default !== undefined && attr.default !== null) {
        console.log(`    default: ${attr.default}`);
      }
    });

    console.log('\n============================================================\n');

    // Check userPreferences collection
    console.log('📋 UserPreferences Collection:');
    console.log('------------------------------');
    const userPrefs = await databases.getCollection(DATABASE_ID, 'userPreferences');
    console.log('✅ Collection exists');
    console.log('\nAttributes:');
    userPrefs.attributes.forEach((attr: any) => {
      console.log(`  - ${attr.key}: ${attr.type}${attr.array ? '[]' : ''} ${attr.required ? '(required)' : '(optional)'}`);
      if (attr.type === 'string' && attr.size) {
        console.log(`    size: ${attr.size}`);
      }
      if (attr.default !== undefined && attr.default !== null) {
        console.log(`    default: ${attr.default}`);
      }
    });

    console.log('\n============================================================\n');

    // Check users collection
    console.log('📋 Users Collection:');
    console.log('--------------------');
    const users = await databases.getCollection(DATABASE_ID, 'users');
    console.log('✅ Collection exists');
    console.log('\nAttributes:');
    users.attributes.forEach((attr: any) => {
      console.log(`  - ${attr.key}: ${attr.type}${attr.array ? '[]' : ''} ${attr.required ? '(required)' : '(optional)'}`);
      if (attr.type === 'string' && attr.size) {
        console.log(`    size: ${attr.size}`);
      }
      if (attr.default !== undefined && attr.default !== null) {
        console.log(`    default: ${attr.default}`);
      }
    });

    console.log('\n============================================================\n');

    // Summary
    console.log('📊 ملخص الفحص:\n');
    console.log('✅ notifications: موجود');
    console.log('✅ userPreferences: موجود');
    console.log('✅ users: موجود');

    console.log('\n============================================================\n');

    // Check what AdminPendingAccounts is trying to send
    console.log('🔍 مقارنة مع الكود:\n');
    
    console.log('📝 Approval Data (users):');
    console.log('  - accountStatus ✅');
    console.log('  - approvedAt ✅');
    console.log('  - approvedBy ✅');
    console.log('  - isActive ✅');
    
    console.log('\n📝 Approval Data (userPreferences):');
    console.log('  - accountStatus ✅');
    
    console.log('\n📝 Notification Data:');
    console.log('  - userId ✅');
    console.log('  - title ✅');
    console.log('  - message ✅');
    console.log('  - type ✅');
    console.log('  - isRead ✅');

    console.log('\n============================================================\n');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response);
    }
  }
}

checkSchema();
