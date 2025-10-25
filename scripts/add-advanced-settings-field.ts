/**
 * Add advancedSettings field to landing_pages collection
 * 
 * Usage:
 * npm run add-advanced-settings
 */

import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

// Configuration (with hardcoded fallbacks from your .env)
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '68d8b9db00134c41e7c8';
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';
const COLLECTION_ID = 'landing_pages';
const API_KEY = process.env.APPWRITE_API_KEY || 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';

async function addAdvancedSettingsField() {
  console.log('🚀 Starting Appwrite schema update...\n');
  console.log('📍 Endpoint:', ENDPOINT);
  console.log('📦 Project:', PROJECT_ID);
  console.log('🗄️  Database:', DATABASE_ID);
  console.log('📋 Collection:', COLLECTION_ID);
  console.log('🔑 API Key:', API_KEY ? '✅ Found' : '❌ Missing');
  console.log('');

  // Initialize Appwrite client
  const client = new Client();
  client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  const databases = new Databases(client);

  try {
    console.log('📊 Database ID:', DATABASE_ID);
    console.log('📦 Collection ID:', COLLECTION_ID);
    console.log('');

    // Check if field already exists
    console.log('🔍 Checking if advancedSettings field exists...');
    try {
      const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
      
      const existingField = collection.attributes.find(
        (attr: any) => attr.key === 'advancedSettings'
      );

      if (existingField) {
        console.log('✅ Field "advancedSettings" already exists!');
        console.log('   Type:', existingField.type);
        console.log('   Size:', existingField.size);
        console.log('   Required:', existingField.required);
        console.log('');
        console.log('✅ No action needed. Schema is up to date!');
        return;
      } else {
        console.log('ℹ️  Field not found. Creating new field...');
        console.log('');
      }
    } catch (error: any) {
      console.log('⚠️  Could not check existing fields:', error.message);
      console.log('   Proceeding with field creation...');
      console.log('');
    }

    // Create the advancedSettings field
    console.log('➕ Creating advancedSettings field...');
    console.log('   Type: String');
    console.log('   Size: 10000 characters');
    console.log('   Required: No');
    console.log('   Array: No');
    console.log('');

    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'advancedSettings',  // key
      10000,               // size (10KB for JSON string)
      false,               // required
      undefined,           // default value
      false                // array
    );

    console.log('✅ SUCCESS! Field "advancedSettings" created successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. ⏳ Wait 5-10 seconds for Appwrite to index the new field');
    console.log('   2. 🔄 Refresh your browser (Ctrl + Shift + R)');
    console.log('   3. ✨ Try creating a landing page with advanced settings');
    console.log('');
    console.log('🎉 You can now use advanced settings for landing pages!');
    console.log('');
    console.log('📝 Advanced settings features:');
    console.log('   • Custom colors');
    console.log('   • Custom fonts (Cairo, Tajawal, Almarai, IBM Plex)');
    console.log('   • Font sizes (Small, Medium, Large)');
    console.log('   • Button styles (Rounded, Square, Pill)');
    console.log('   • Custom images and videos');
    console.log('   • Price display with discounts');
    console.log('   • Custom badges');
    console.log('   • Social proof messages');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('');
    
    if (error.code === 401) {
      console.error('💡 Authentication error - API key is invalid or expired');
      console.error('   Please check APPWRITE_API_KEY in .env file');
    } else if (error.code === 404) {
      console.error('💡 Collection not found');
      console.error('   Please verify the collection "landing_pages" exists');
    } else if (error.message?.includes('attribute already exists')) {
      console.log('ℹ️  Field already exists (this is OK)');
      console.log('   You can proceed with creating landing pages');
      return;
    } else {
      console.error('💡 Possible solutions:');
      console.error('   1. Check if the API key has "Databases" write permissions');
      console.error('   2. Verify the database and collection IDs are correct');
      console.error('   3. Try adding the field manually in Appwrite Console');
    }
    
    console.error('');
    console.error('📖 Manual steps (Alternative):');
    console.error('   1. Go to: https://cloud.appwrite.io/console');
    console.error('   2. Select your project');
    console.error('   3. Go to Databases → landing_pages → Attributes');
    console.error('   4. Click "Create Attribute" → String');
    console.error('   5. Attribute ID: advancedSettings');
    console.error('   6. Size: 10000');
    console.error('   7. Required: No');
    console.error('   8. Click Create');
    process.exit(1);
  }
}

// Run the script
addAdvancedSettingsField();
