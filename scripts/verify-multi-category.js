
import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('68d8b9db00134c41e7c8')
    .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';
const PRODUCTS_COLLECTION_ID = 'products';
const CATEGORIES_COLLECTION_ID = 'categories';

async function main() {
    try {
        console.log('Fetching categories...');
        const categories = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID);
        if (categories.documents.length < 2) {
            console.error('Not enough categories to test multi-category support.');
            return;
        }

        const cat1 = categories.documents[0];
        const cat2 = categories.documents[1];
        console.log(`Selected categories: ${cat1.name} (${cat1.$id}), ${cat2.name} (${cat2.$id})`);

        const productData = {
            name: 'Multi-Category Test Product',
            description: 'This is a test product with multiple categories.',
            price: 100,
            categoryId: cat1.$id, // Primary
            categoryIds: [cat1.$id, cat2.$id], // Multiple
            images: [],
            isActive: true
        };

        console.log('Creating product...');
        const product = await databases.createDocument(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            ID.unique(),
            productData
        );

        console.log('Product created:', product.$id);
        console.log('Product CategoryIds:', product.categoryIds);

        if (product.categoryIds.length === 2 && product.categoryIds.includes(cat1.$id) && product.categoryIds.includes(cat2.$id)) {
            console.log('SUCCESS: Product has multiple categories.');
        } else {
            console.error('FAILURE: Product does not have expected categories.');
        }

        // Clean up
        console.log('Cleaning up...');
        await databases.deleteDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, product.$id);
        console.log('Test product deleted.');

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
