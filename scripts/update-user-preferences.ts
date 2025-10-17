/**
 * Update User Preferences Collection
 * 
 * يضيف حقل affiliateCode لجميع المستخدمين في user_preferences
 */

import { Client, Databases, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || '')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || '';

/**
 * Generate unique affiliate code
 */
function generateAffiliateCode(userId: string, index: number): string {
  // استخدام أول 4 أحرف من userId + رقم عشوائي
  const userPart = userId.substring(0, 4).toUpperCase();
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${userPart}${randomPart}`;
}

/**
 * Add affiliateCode attribute to user_preferences collection
 */
async function addAffiliateCodeAttribute() {
  console.log('📝 Adding affiliateCode attribute to user_preferences...');
  
  try {
    await databases.createStringAttribute(
      databaseId,
      'user_preferences',
      'affiliateCode',
      20,
      false // optional
    );
    
    console.log('✅ affiliateCode attribute added');
    
    // Wait for attribute to be available
    console.log('⏳ Waiting for attribute to be available...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Create index
    await databases.createIndex(
      databaseId,
      'user_preferences',
      'affiliateCode_idx',
      'key' as any, // Appwrite uses 'key' for regular indexes
      ['affiliateCode'],
      ['asc']
    );
    
    console.log('✅ Unique index created for affiliateCode\n');
    
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  affiliateCode attribute already exists\n');
    } else {
      console.error('❌ Error adding attribute:', error.message);
      throw error;
    }
  }
}

/**
 * Generate affiliate codes for existing users
 */
async function generateAffiliateCodes() {
  console.log('🔄 Generating affiliate codes for existing users...');
  
  try {
    // Get all user preferences without affiliate code
    let allPreferences: any[] = [];
    let lastId: string | undefined;
    
    // Fetch all documents (pagination)
    while (true) {
      const queries = lastId 
        ? [Query.cursorAfter(lastId), Query.limit(100)]
        : [Query.limit(100)];
      
      const response = await databases.listDocuments(
        databaseId,
        'user_preferences',
        queries
      );
      
      allPreferences = [...allPreferences, ...response.documents];
      
      if (response.documents.length < 100) break;
      lastId = response.documents[response.documents.length - 1].$id;
    }
    
    console.log(`📊 Found ${allPreferences.length} user preferences`);
    
    // Filter users without affiliate code
    const withoutCode = allPreferences.filter(pref => !pref.affiliateCode);
    console.log(`🔍 ${withoutCode.length} users need affiliate codes\n`);
    
    if (withoutCode.length === 0) {
      console.log('✅ All users already have affiliate codes!');
      return;
    }
    
    // Generate and update codes
    let updated = 0;
    let failed = 0;
    
    for (let i = 0; i < withoutCode.length; i++) {
      const pref = withoutCode[i];
      
      try {
        // Generate unique code
        let code = generateAffiliateCode(pref.userId, i);
        let attempts = 0;
        let isUnique = false;
        
        // Try to find unique code
        while (!isUnique && attempts < 10) {
          const existing = await databases.listDocuments(
            databaseId,
            'user_preferences',
            [Query.equal('affiliateCode', code), Query.limit(1)]
          );
          
          if (existing.documents.length === 0) {
            isUnique = true;
          } else {
            code = generateAffiliateCode(pref.userId, i + attempts);
            attempts++;
          }
        }
        
        if (!isUnique) {
          console.log(`  ⚠️  Could not generate unique code for ${pref.userId}`);
          failed++;
          continue;
        }
        
        // Update document
        await databases.updateDocument(
          databaseId,
          'user_preferences',
          pref.$id,
          { affiliateCode: code }
        );
        
        updated++;
        console.log(`  ✓ ${updated}/${withoutCode.length} - ${code} → ${pref.userId}`);
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error: any) {
        console.error(`  ❌ Error updating ${pref.userId}:`, error.message);
        failed++;
      }
    }
    
    console.log(`\n✅ Updated: ${updated}`);
    console.log(`❌ Failed: ${failed}\n`);
    
  } catch (error: any) {
    console.error('❌ Error generating affiliate codes:', error.message);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting User Preferences Update\n');
  console.log('📍 Database:', databaseId);
  console.log('\n');
  
  try {
    // Step 1: Add attribute
    await addAffiliateCodeAttribute();
    
    // Step 2: Generate codes for existing users
    await generateAffiliateCodes();
    
    console.log('🎉 User preferences update complete!');
    console.log('\n✅ Next steps:');
    console.log('1. Verify affiliate codes in Appwrite Console');
    console.log('2. Test referral link generation in app');
    console.log('3. Share referral links with users\n');
    
  } catch (error) {
    console.error('💥 Update failed:', error);
    process.exit(1);
  }
}

// Run the update
main();
