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

async function ensureMediaLinksAttribute() {
    try {
        console.log('🔍 Checking for mediaLinks attribute...');

        // Get collection details
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);

        // Check if mediaLinks attribute exists
        const mediaLinksAttr = collection.attributes.find(attr => attr.key === 'mediaLinks');

        if (mediaLinksAttr) {
            console.log('✅ mediaLinks attribute already exists!');
            console.log('   Type:', mediaLinksAttr.type);
            console.log('   Array:', mediaLinksAttr.array);
            console.log('   Size:', mediaLinksAttr.size);
            return;
        }

        console.log('⚠️  mediaLinks attribute not found. Creating...');

        // Create the attribute
        await databases.createStringAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'mediaLinks',
            2000,        // Max size for each URL
            false,       // Not required
            null,        // No default value
            true         // Array = true
        );

        console.log('✅ mediaLinks attribute created successfully!');
        console.log('⏳ Please wait a few seconds for Appwrite to process the attribute...');

        // Wait for attribute to be available
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log('✅ Done! You can now use mediaLinks in your products.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.code === 409) {
            console.log('ℹ️  Attribute might already exist or is being created.');
        }
        process.exit(1);
    }
}

ensureMediaLinksAttribute();
