import { Client, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('68de037e003bd03c4d45')
  .setKey(process.env.APPWRITE_API_KEY || ''); // Set via environment variable

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';
const COLLECTION_ID = 'users';

async function addIsMerchantAttribute() {
  try {
    console.log('🔧 Adding isMerchant attribute to users collection...');
    
    // Create boolean attribute with default value false
    const attribute = await databases.createBooleanAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'isMerchant',      // key
      false,             // required
      false,             // default value
      false              // array
    );
    
    console.log('✅ isMerchant attribute created successfully!');
    console.log('📋 Attribute details:', JSON.stringify(attribute, null, 2));
    console.log('\n⏳ Waiting 5 seconds for attribute to be available...');
    
    // Wait for attribute to be available
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('✅ Done! The attribute should now be available.');
    console.log('\n📝 Note: You may need to wait a few more seconds for the attribute to fully sync.');
    
  } catch (error) {
    if (error.code === 409) {
      console.log('ℹ️  Attribute "isMerchant" already exists.');
    } else {
      console.error('❌ Error creating attribute:', error);
      throw error;
    }
  }
}

// Run the script
addIsMerchantAttribute()
  .then(() => {
    console.log('\n✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
