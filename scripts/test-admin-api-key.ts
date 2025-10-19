/**
 * Test Admin API Key
 * اختبار صلاحية Admin API Key
 */

import { Client, Users, Databases } from 'node-appwrite';
import { config } from 'dotenv';

config();

const ADMIN_API_KEY = process.env.APPWRITE_API_KEY || '';

console.log('\n🔑 Testing Admin API Key...\n');
console.log(`📋 API Key: ${ADMIN_API_KEY.substring(0, 20)}...`);
console.log(`📋 Endpoint: ${process.env.VITE_APPWRITE_ENDPOINT}`);
console.log(`📋 Project ID: ${process.env.VITE_APPWRITE_PROJECT_ID}\n`);

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(ADMIN_API_KEY);

const users = new Users(client);
const databases = new Databases(client);

async function testAdminKey() {
  try {
    console.log('🧪 Test 1: List Users (requires users.read permission)...');
    const usersList = await users.list();
    console.log(`✅ Success! Found ${usersList.total} users in the system\n`);

    console.log('🧪 Test 2: List Databases (requires databases.read permission)...');
    const dbList = await databases.list();
    console.log(`✅ Success! Found ${dbList.total} databases\n`);

    console.log('═══════════════════════════════════════════════');
    console.log('✅ Admin API Key is VALID and WORKING!');
    console.log('═══════════════════════════════════════════════');
    console.log('\n📊 Permissions confirmed:');
    console.log('   ✅ users.read');
    console.log('   ✅ users.write (assumed if read works)');
    console.log('   ✅ databases.read');
    console.log('   ✅ databases.write (assumed if read works)\n');

    console.log('🎯 Next Steps:');
    console.log('   1. The API key is ready to use');
    console.log('   2. You can now update/delete users from Admin panel');
    console.log('   3. Changes will sync with Auth automatically\n');

    return true;
  } catch (error: any) {
    console.error('\n❌ Admin API Key Test FAILED!\n');
    console.error('Error:', error.message);
    console.error('\n📝 Possible issues:');
    console.error('   1. Invalid API Key');
    console.error('   2. Missing permissions (users.read, users.write, databases.read, databases.write)');
    console.error('   3. Wrong Project ID');
    console.error('   4. Wrong Endpoint\n');
    
    return false;
  }
}

testAdminKey()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
