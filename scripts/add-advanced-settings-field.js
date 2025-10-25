/**
 * Add advancedSettings field to landing_pages collection
 * 
 * Usage:
 * node scripts/add-advanced-settings-field.js
 */

const sdk = require('node-appwrite');

// Configuration
const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const DATABASE_ID = '68de037e003bd03c4d45';
const COLLECTION_ID = 'landing_pages';
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';

async function addAdvancedSettingsField() {
  console.log('🚀 Starting Appwrite schema update...\n');

  // Initialize Appwrite client
  const client = new sdk.Client();
  client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

  const databases = new sdk.Databases(client);

  try {
    console.log('📊 Database ID:', DATABASE_ID);
    console.log('📦 Collection ID:', COLLECTION_ID);
    console.log('');

    // Check if field already exists
    console.log('🔍 Checking if advancedSettings field exists...');
    try {
      const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
      
      const existingField = collection.attributes.find(
        attr => attr.key === 'advancedSettings'
      );

      if (existingField) {
        console.log('✅ Field "advancedSettings" already exists!');
        console.log('   Type:', existingField.type);
        console.log('   Size:', existingField.size);
        console.log('   Required:', existingField.required);
        console.log('');
        console.log('✅ No action needed. Schema is up to date!');
        return;
      }
    } catch (error) {
      console.log('⚠️  Could not check existing fields:', error.message);
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
      null,                // default value
      false                // array
    );

    console.log('✅ SUCCESS! Field "advancedSettings" created successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Wait a few seconds for Appwrite to index the new field');
    console.log('   2. Refresh your browser');
    console.log('   3. Try creating a landing page again');
    console.log('');
    console.log('🎉 You can now use advanced settings for landing pages!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('💡 Possible solutions:');
    console.error('   1. Check if the API key has "Databases" write permissions');
    console.error('   2. Verify the database and collection IDs are correct');
    console.error('   3. Try adding the field manually in Appwrite Console');
    console.error('');
    console.error('📖 Manual steps:');
    console.error('   1. Go to: https://cloud.appwrite.io/console');
    console.error('   2. Select your project');
    console.error('   3. Go to Databases → landing_pages → Attributes');
    console.error('   4. Click "Create Attribute" → String');
    console.error('   5. Key: advancedSettings');
    console.error('   6. Size: 10000');
    console.error('   7. Required: No');
    console.error('   8. Click Create');
    process.exit(1);
  }
}

// Run the script
addAdvancedSettingsField();
