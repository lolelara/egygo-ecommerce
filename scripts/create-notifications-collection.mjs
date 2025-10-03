import { Client, Databases, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '68d8b9db00134c41e7c8')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';
const COLLECTION_ID = 'notifications';

async function createNotificationsCollection() {
  try {
    console.log('🔔 Creating notifications collection...');

    // Create the collection
    const collection = await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'Notifications',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ],
      true, // Document security
      true  // Enabled
    );

    console.log('✅ Collection created:', collection.$id);

    // Create attributes
    console.log('📝 Creating attributes...');

    // userId - string (required)
    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'userId',
      255,
      true // required
    );
    console.log('✓ userId attribute created');

    // Wait a bit for the attribute to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));

    // type - enum (required)
    await databases.createEnumAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'type',
      ['order', 'shipping', 'delivery', 'alert', 'info', 'commission', 'affiliate'],
      true // required
    );
    console.log('✓ type attribute created');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // title - string (required)
    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'title',
      500,
      true
    );
    console.log('✓ title attribute created');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // message - string (required)
    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'message',
      2000,
      true
    );
    console.log('✓ message attribute created');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // read - boolean (optional, default: false)
    await databases.createBooleanAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'read',
      false, // optional
      false // default value
    );
    console.log('✓ read attribute created');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // relatedId - string (optional)
    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'relatedId',
      255,
      false // not required
    );
    console.log('✓ relatedId attribute created');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // metadata - string (optional) - will store JSON
    await databases.createStringAttribute(
      DATABASE_ID,
      COLLECTION_ID,
      'metadata',
      5000,
      false // not required
    );
    console.log('✓ metadata attribute created');

    // Wait for all attributes to be ready
    console.log('⏳ Waiting for attributes to be ready...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Create indexes
    console.log('🔍 Creating indexes...');

    // Index for userId (for querying user's notifications)
    await databases.createIndex(
      DATABASE_ID,
      COLLECTION_ID,
      'userId_index',
      'key',
      ['userId'],
      ['asc']
    );
    console.log('✓ userId index created');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Index for read status (for querying unread notifications)
    await databases.createIndex(
      DATABASE_ID,
      COLLECTION_ID,
      'read_index',
      'key',
      ['read'],
      ['asc']
    );
    console.log('✓ read index created');

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Composite index for userId + createdAt (for sorting user's notifications)
    await databases.createIndex(
      DATABASE_ID,
      COLLECTION_ID,
      'userId_createdAt_index',
      'key',
      ['userId', '$createdAt'],
      ['asc', 'desc']
    );
    console.log('✓ userId + createdAt index created');

    console.log('\n✅ Notifications collection created successfully!');
    console.log(`📋 Collection ID: ${COLLECTION_ID}`);
    console.log('\n📝 Next steps:');
    console.log('1. The collection is ready to use');
    console.log('2. Notifications will be created automatically for orders');
    console.log('3. Users will see real-time notifications in the UI');

  } catch (error) {
    console.error('❌ Error creating notifications collection:', error);
    throw error;
  }
}

// Run the script
createNotificationsCollection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
