
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('68d8b9db00134c41e7c8')
    .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';
const CATEGORIES_COLLECTION_ID = 'categories';

const STANDARD_CATEGORIES = [
    { name: "Men's Fashion", slug: 'men-fashion', image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80' },
    { name: "Women's Fashion", slug: 'women-fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80' },
    { name: "Kids", slug: 'kids', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=400&q=80' },
    { name: "Accessories", slug: 'accessories', image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=400&q=80' },
    { name: "Electronics", slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=400&q=80' },
    { name: "Home & Living", slug: 'home-living', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&q=80' }
];

async function main() {
    try {
        console.log('Fetching existing categories...');
        const response = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID);
        const existingCategories = response.documents;

        // 1. Hide Vendoor Products
        const vendoorCat = existingCategories.find(c => c.name === 'Vendoor Products' || c.slug === 'vendoor-products');
        if (vendoorCat) {
            console.log(`Hiding category: ${vendoorCat.name}`);
            await databases.updateDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, vendoorCat.$id, {
                isActive: false
            });
        } else {
            console.log('Vendoor Products category not found.');
        }

        // 2. Seed Standard Categories
        for (const cat of STANDARD_CATEGORIES) {
            const exists = existingCategories.find(c => c.slug === cat.slug);
            if (!exists) {
                console.log(`Creating category: ${cat.name}`);
                await databases.createDocument(
                    DATABASE_ID,
                    CATEGORIES_COLLECTION_ID,
                    ID.unique(),
                    {
                        name: cat.name,
                        slug: cat.slug,
                        description: `Shop the latest in ${cat.name}`,
                        image: cat.image,
                        isActive: true
                    },
                    [Permission.read(Role.any())]
                );
            } else {
                console.log(`Category already exists: ${cat.name}`);
                // Optional: Ensure it's active
                if (exists.isActive === false) {
                    console.log(`Re-activating category: ${cat.name}`);
                    await databases.updateDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, exists.$id, {
                        isActive: true
                    });
                }
            }
        }

        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
