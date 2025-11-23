import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';
const COLLECTION_ID = 'products';

async function increaseDescriptionSize() {
    try {
        console.log('🔍 Checking description attribute...');

        // Get collection details
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);

        // Check if description attribute exists
        const descriptionAttr = collection.attributes.find(attr => attr.key === 'description');

        if (!descriptionAttr) {
            console.log('❌ Description attribute not found!');
            return;
        }

        console.log(`ℹ️ Current size: ${descriptionAttr.size}`);

        if (descriptionAttr.size >= 10000) {
            console.log('✅ Description size is already sufficient (>= 10000).');
            return;
        }

        console.log('⚠️  Increasing description size to 10000...');

        // Update the attribute
        await databases.updateStringAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'description',
            10000,       // New max size
            false,       // Not required
            null         // No default value
        );

        console.log('✅ Description attribute updated successfully!');
        console.log('⏳ Please wait a few seconds for Appwrite to process the update...');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

increaseDescriptionSize();
