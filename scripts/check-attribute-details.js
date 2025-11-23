import { Client, Databases } from 'node-appwrite';

// Credentials provided by user
const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const DATABASE_ID = '68de037e003bd03c4d45';
const COLLECTION_ID = 'products';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function checkAttributes() {
    try {
        console.log('🔍 Checking attribute details...');
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);

        const mediaLinks = collection.attributes.find(attr => attr.key === 'mediaLinks');
        const description = collection.attributes.find(attr => attr.key === 'description');

        console.log('\n📋 Attribute Report:');

        if (mediaLinks) {
            console.log('✅ mediaLinks:');
            console.log(`   Type: ${mediaLinks.type}`);
            console.log(`   Is Array: ${mediaLinks.array}`);
            console.log(`   Size: ${mediaLinks.size}`);
        } else {
            console.log('❌ mediaLinks: NOT FOUND');
        }

        if (description) {
            console.log('✅ description:');
            console.log(`   Type: ${description.type}`);
            console.log(`   Size: ${description.size}`);
        } else {
            console.log('❌ description: NOT FOUND');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkAttributes();
