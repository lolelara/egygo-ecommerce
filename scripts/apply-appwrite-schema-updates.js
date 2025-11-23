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

async function applyUpdates() {
    try {
        console.log('🚀 Starting Appwrite Schema Updates...');

        // 1. Increase Description Size
        console.log('\n🔍 Checking description attribute...');
        try {
            const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
            const descriptionAttr = collection.attributes.find(attr => attr.key === 'description');

            if (descriptionAttr) {
                console.log(`ℹ️ Current description size: ${descriptionAttr.size}`);
                if (descriptionAttr.size < 10000) {
                    console.log('⚠️  Increasing description size to 10000...');
                    await databases.updateStringAttribute(
                        DATABASE_ID,
                        COLLECTION_ID,
                        'description',
                        10000,
                        false,
                        null
                    );
                    console.log('✅ Description attribute updated successfully!');
                } else {
                    console.log('✅ Description size is already sufficient.');
                }
            } else {
                console.log('❌ Description attribute not found!');
            }
        } catch (error) {
            console.error('❌ Error checking/updating description:', error.message);
        }

        // 2. Ensure mediaLinks Attribute
        console.log('\n🔍 Checking mediaLinks attribute...');
        try {
            const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
            const mediaLinksAttr = collection.attributes.find(attr => attr.key === 'mediaLinks');

            if (mediaLinksAttr) {
                console.log('✅ mediaLinks attribute already exists!');
            } else {
                console.log('⚠️  mediaLinks attribute not found. Creating...');
                await databases.createStringAttribute(
                    DATABASE_ID,
                    COLLECTION_ID,
                    'mediaLinks',
                    2000,
                    false,
                    null,
                    true // Is Array
                );
                console.log('✅ mediaLinks attribute created successfully!');
            }
        } catch (error) {
            console.error('❌ Error checking/creating mediaLinks:', error.message);
        }

        console.log('\n🎉 All updates processed!');

    } catch (error) {
        console.error('❌ Fatal Error:', error);
    }
}

applyUpdates();
