
const { Client, Databases, ID } = require('node-appwrite');

// Initialize Appwrite SDK
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67366c66003c00427845') // Project ID from previous context
    .setKey(process.env.APPWRITE_API_KEY); // Ensure this env var is set

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45'; // Database ID from previous context
const CATEGORIES_COLLECTION_ID = 'categories';

async function updateSchema() {
    try {
        console.log('Adding parentId attribute to categories collection...');

        // Add parentId attribute (string, nullable)
        // size: 36 (standard ID length), required: false
        await databases.createStringAttribute(
            DATABASE_ID,
            CATEGORIES_COLLECTION_ID,
            'parentId',
            36,
            false
        );

        console.log('Successfully added parentId attribute.');

        // Wait a bit for attribute to be created
        console.log('Waiting for attribute to be available...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Schema update complete.');
    } catch (error) {
        if (error.code === 409) {
            console.log('Attribute parentId already exists.');
        } else {
            console.error('Error updating schema:', error);
        }
    }
}

updateSchema();
