import { Client, Databases } from 'node-appwrite';
import { config } from 'dotenv';

config();

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID || '';
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || process.env.VITE_APPWRITE_API_KEY || '';
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || process.env.VITE_APPWRITE_DATABASE_ID || '';

if (!APPWRITE_PROJECT_ID || !APPWRITE_API_KEY || !DATABASE_ID) {
  console.error('❌ Missing Appwrite configuration. Please set VITE_APPWRITE_PROJECT_ID, APPWRITE_API_KEY and VITE_APPWRITE_DATABASE_ID in .env');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

const COLLECTION_ID = 'openai_keys';

async function createOpenAIKeysCollection() {
  console.log('📦 Creating OpenAI Keys collection...');

  try {
    await databases.createCollection(
      DATABASE_ID,
      COLLECTION_ID,
      'OpenAI Keys',
      [] // No direct client access; server-side only via API key
    );

    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'label', 255, true);
    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'apiKey', 512, true);
    await databases.createEnumAttribute(DATABASE_ID, COLLECTION_ID, 'status', ['active', 'inactive', 'error'], true);
    await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'priority', true, 0, 10000);
    await databases.createBooleanAttribute(DATABASE_ID, COLLECTION_ID, 'isDefault', true, false);
    await databases.createDatetimeAttribute(DATABASE_ID, COLLECTION_ID, 'lastTestedAt', false);
    await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'lastError', 1024, false);

    await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'status_idx', 'key' as any, ['status']);
    await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'priority_idx', 'key' as any, ['priority']);
    await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'default_idx', 'key' as any, ['isDefault']);

    console.log('✅ OpenAI Keys collection created successfully');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  OpenAI Keys collection already exists');
    } else {
      console.error('❌ Error creating OpenAI Keys collection:', error.message || error);
      process.exit(1);
    }
  }
}

createOpenAIKeysCollection()
  .then(() => {
    console.log('✅ Setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
