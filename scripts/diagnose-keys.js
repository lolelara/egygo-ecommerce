
import { Client, Databases } from 'node-appwrite';

// Configuration
const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const DATABASE_ID = '68de037e003bd03c4d45';
const COLLECTION_ID = 'openai_keys';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function diagnose() {
    try {
        console.log('Fetching collection attributes...');
        const collection = await databases.listAttributes(DATABASE_ID, COLLECTION_ID);
        console.log('Attributes:', collection.attributes.map(a => `${a.key} (${a.type}, array:${a.array}, required:${a.required})`));

        console.log('\nTrying to create a test document...');
        try {
            const doc = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                'unique()',
                {
                    label: 'Test Key',
                    provider: 'openai',
                    apiKey: 'sk-test',
                    key: 'sk-test',
                    isDefault: false,
                    status: 'active',
                    keyStatus: 'active',
                    model: 'gpt-3.5-turbo',
                    capabilities: ['text']
                }
            );
            console.log('Success! Document created:', doc.$id);
            // Clean up
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, doc.$id);
            console.log('Test document deleted.');
        } catch (createError) {
            console.error('Creation failed:', createError.message);
            console.error('Full error:', JSON.stringify(createError, null, 2));
        }

    } catch (error) {
        console.error('Diagnosis failed:', error.message);
    }
}

diagnose();
