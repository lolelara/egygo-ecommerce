/**
 * Script to create affiliate_links collection
 * Run: pnpm tsx scripts/create-affiliate-links-collection.ts
 */

import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function createAffiliateLinksCollection() {
  console.log('🚀 إنشاء collection: affiliate_links\n');

  try {
    const collection = await databases.createCollection(
      DATABASE_ID,
      'affiliate_links',
      'Affiliate Links',
      undefined,
      true
    );
    
    console.log('✅ تم إنشاء Collection\n');
    console.log('📝 إضافة Attributes...\n');

    // Add attributes
    await databases.createStringAttribute(DATABASE_ID, collection.$id, 'affiliateId', 255, true);
    console.log('  ✓ affiliateId');
    
    await databases.createStringAttribute(DATABASE_ID, collection.$id, 'linkCode', 50, true);
    console.log('  ✓ linkCode');
    
    await databases.createStringAttribute(DATABASE_ID, collection.$id, 'url', 1000, true);
    console.log('  ✓ url');
    
    await databases.createStringAttribute(DATABASE_ID, collection.$id, 'productId', 255, false);
    console.log('  ✓ productId');
    
    await databases.createIntegerAttribute(DATABASE_ID, collection.$id, 'clicks', false, 0);
    console.log('  ✓ clicks');
    
    await databases.createIntegerAttribute(DATABASE_ID, collection.$id, 'conversions', false, 0);
    console.log('  ✓ conversions');
    
    await databases.createFloatAttribute(DATABASE_ID, collection.$id, 'earnings', false, 0);
    console.log('  ✓ earnings');
    
    await databases.createDatetimeAttribute(DATABASE_ID, collection.$id, 'createdAt', true);
    console.log('  ✓ createdAt');
    
    console.log('\n🎉 تم إنشاء affiliate_links بنجاح!');
    console.log('\n📋 الـ Attributes:');
    console.log('   - affiliateId (string, required)');
    console.log('   - linkCode (string, required)');
    console.log('   - url (string, required)');
    console.log('   - productId (string, optional)');
    console.log('   - clicks (integer, default: 0)');
    console.log('   - conversions (integer, default: 0)');
    console.log('   - earnings (float, default: 0)');
    console.log('   - createdAt (datetime, required)');
    
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  affiliate_links موجود بالفعل');
    } else {
      console.error('\n❌ خطأ:', error.message);
      throw error;
    }
  }
}

// Run the script
createAffiliateLinksCollection()
  .then(() => {
    console.log('\n✅ تم الانتهاء بنجاح!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ فشل التنفيذ:', error);
    process.exit(1);
  });
