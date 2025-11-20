
const sdk = require('node-appwrite');

// Configuration
const client = new sdk.Client();
const databases = new sdk.Databases(client);

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const DATABASE_ID = '68de037e003bd03c4d45';
const COLLECTION_NAME = 'openai_keys';

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

async function updateCollection() {
    try {
        console.log(`Checking collection ${COLLECTION_NAME}...`);

        try {
            await databases.getCollection(DATABASE_ID, COLLECTION_NAME);
            console.log(`Collection ${COLLECTION_NAME} found.`);
        } catch (error) {
            console.error(`Collection ${COLLECTION_NAME} not found!`);
            return;
        }

        console.log('Adding provider attribute...');

        try {
            // Add provider attribute: 'openai' or 'gemini'
            await databases.createStringAttribute(
                DATABASE_ID,
                COLLECTION_NAME,
                'provider',
                50,
                false,
                'openai' // Default to openai for existing keys
            );
            console.log('Created attribute: provider');
        } catch (error) {
            if (error.code === 409) {
                console.log('Attribute provider already exists.');
            } else {
                console.error('Error creating attribute provider:', error.message);
            }
        }

        console.log('Update complete!');
    } catch (error) {
        console.error('Error:', error);
    }
}

updateCollection();
