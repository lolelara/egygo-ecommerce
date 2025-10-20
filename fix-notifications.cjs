const { Client, Databases } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('68d8b9db00134c41e7c8')
  .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';

async function fixNotifications() {
  console.log('🔧 Fixing notifications collection...\n');

  try {
    // Add relatedId attribute
    console.log('📝 Adding relatedId attribute...');
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        'notifications',
        'relatedId',
        255,
        false // optional
      );
      console.log('✅ relatedId attribute added\n');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  relatedId already exists\n');
      } else {
        console.error('❌ Error adding relatedId:', error.message);
      }
    }

    console.log('✅ Notifications collection fixed!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixNotifications();
