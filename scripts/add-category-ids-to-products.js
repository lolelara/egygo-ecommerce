
import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('68d8b9db00134c41e7c8')
    .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';
const PRODUCTS_COLLECTION_ID = 'products';

async function main() {
    try {
        // 1. Add categoryIds attribute
        console.log('Adding categoryIds attribute...');
        try {
            await databases.createStringAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, 'categoryIds', 255, false, undefined, true); // Array: true
            console.log('categoryIds attribute created. Waiting for it to be available...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for attribute creation
        } catch (error) {
            if (error.code === 409) {
                console.log('categoryIds attribute already exists.');
            } else {
                throw error;
            }
        }

        // 2. Migrate existing categoryId to categoryIds
        console.log('Migrating existing products...');
        let offset = 0;
        let limit = 100;
        let hasMore = true;

        while (hasMore) {
            const response = await databases.listDocuments(
                DATABASE_ID,
                PRODUCTS_COLLECTION_ID,
                [
                    // Query.limit(limit), // Limit is not supported in listDocuments options array directly in some versions, but let's try standard pagination
                    // Query.offset(offset)
                ]
            );

            // Manual pagination if needed, but listDocuments returns all by default if no limit? No, default is 25.
            // Let's use the response to iterate.

            if (response.documents.length === 0) {
                hasMore = false;
                break;
            }

            for (const doc of response.documents) {
                if (doc.categoryId && (!doc.categoryIds || doc.categoryIds.length === 0)) {
                    console.log(`Migrating product "${doc.name}" (${doc.$id})...`);
                    try {
                        await databases.updateDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, doc.$id, {
                            categoryIds: [doc.categoryId]
                        });
                    } catch (err) {
                        console.error(`Failed to update product ${doc.$id}:`, err.message);
                    }
                }
            }

            if (response.documents.length < limit) {
                hasMore = false;
            } else {
                offset += limit;
            }

            // Safety break for now to avoid infinite loops if pagination logic is tricky without Query object import
            hasMore = false;
        }

        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
