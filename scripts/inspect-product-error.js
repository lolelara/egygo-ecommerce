import { Client, Databases } from 'node-appwrite';

// Credentials provided by user
const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const DATABASE_ID = '68de037e003bd03c4d45';
const COLLECTION_ID = 'products';
const PRODUCT_ID = '69227e71001b9748a658'; // From error message

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function inspectProduct() {
    try {
        console.log(`🔍 Inspecting product ${PRODUCT_ID}...`);
        const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, PRODUCT_ID);

        console.log('\n📋 Product Data:');
        console.log('Name:', doc.name);
        console.log('Description Length:', doc.description?.length);
        console.log('Images:', JSON.stringify(doc.images, null, 2));
        console.log('MediaLinks:', JSON.stringify(doc.mediaLinks, null, 2));
        console.log('CategoryIds:', JSON.stringify(doc.categoryIds, null, 2));

        // Check for potential issues
        if (doc.images && doc.images.some(img => typeof img !== 'string')) {
            console.error('❌ ERROR: Images array contains non-string values!');
        }
        if (doc.mediaLinks && doc.mediaLinks.some(link => typeof link !== 'string')) {
            console.error('❌ ERROR: MediaLinks array contains non-string values!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

inspectProduct();
