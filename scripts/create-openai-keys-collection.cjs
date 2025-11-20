
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

async function createCollection() {
    try {
        console.log(`Checking if collection ${COLLECTION_NAME} exists...`);

        try {
            await databases.getCollection(DATABASE_ID, COLLECTION_NAME);
            console.log(`Collection ${COLLECTION_NAME} already exists.`);
        } catch (error) {
            if (error.code === 404) {
                console.log(`Creating collection ${COLLECTION_NAME}...`);
                await databases.createCollection(
                    DATABASE_ID,
                    COLLECTION_NAME,
                    COLLECTION_NAME,
                    [] // Permissions: empty for now, will be managed via dashboard or default
                );
                console.log(`Collection ${COLLECTION_NAME} created.`);
            } else {
                throw error;
            }
        }

        console.log('Checking attributes...');

        const attributes = [
            { key: 'label', type: 'string', size: 255, required: true },
            { key: 'apiKey', type: 'string', size: 1024, required: true }, // Encrypted or masked in real app, but here simple string
            { key: 'priority', type: 'integer', required: false, default: 0 },
            { key: 'isDefault', type: 'boolean', required: false, default: false },
            { key: 'status', type: 'string', size: 50, required: false, default: 'active' },
            { key: 'lastTestedAt', type: 'datetime', required: false },
            { key: 'lastError', type: 'string', size: 1000, required: false }
        ];

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(DATABASE_ID, COLLECTION_NAME, attr.key, attr.size, attr.required, attr.default);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_NAME, attr.key, attr.required, 0, 1000, attr.default);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(DATABASE_ID, COLLECTION_NAME, attr.key, attr.required, attr.default);
                } else if (attr.type === 'datetime') {
                    await databases.createDatetimeAttribute(DATABASE_ID, COLLECTION_NAME, attr.key, attr.required, attr.default);
                }
                console.log(`Created attribute: ${attr.key}`);
                // Wait a bit to avoid rate limits
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                if (error.code === 409) {
                    console.log(`Attribute ${attr.key} already exists.`);
                } else {
                    console.error(`Error creating attribute ${attr.key}:`, error.message);
                }
            }
        }

        console.log('Setup complete!');
    } catch (error) {
        console.error('Error:', error);
    }
}

createCollection();
