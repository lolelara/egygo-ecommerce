
import { Client, Databases, ID, Permission, Role, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('68d8b9db00134c41e7c8')
    .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';
const CATEGORIES_COLLECTION_ID = 'categories';

const UPDATES = [
    { slug: 'men-fashion', name: 'ملابس رجالي' },
    { slug: 'women-fashion', name: 'ملابس نسائي' },
    { slug: 'kids', name: 'ملابس اطفال' },
    { slug: 'accessories', name: 'اكسسوارات هواتف' },
];

const NEW_CATEGORIES = [
    { name: 'عطور', slug: 'perfumes', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80' },
    { name: 'منتجات عنايه بالبشره', slug: 'skin-care', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
    { name: 'ملابس رياضيه', slug: 'sports-wear', image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&q=80' },
];

async function main() {
    try {
        console.log('Fetching existing categories...');
        const response = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID, [
            Query.limit(100)
        ]);
        const existingCategories = response.documents;

        // 1. Update existing categories
        for (const update of UPDATES) {
            const category = existingCategories.find(c => c.slug === update.slug);
            if (category) {
                console.log(`Updating category: ${category.name} -> ${update.name}`);
                await databases.updateDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, category.$id, {
                    name: update.name
                });
            } else {
                console.log(`Category with slug '${update.slug}' not found for update.`);
            }
        }

        // 2. Create new categories
        for (const cat of NEW_CATEGORIES) {
            const exists = existingCategories.find(c => c.slug === cat.slug || c.name === cat.name);
            if (!exists) {
                console.log(`Creating category: ${cat.name}`);
                await databases.createDocument(
                    DATABASE_ID,
                    CATEGORIES_COLLECTION_ID,
                    ID.unique(),
                    {
                        name: cat.name,
                        slug: cat.slug,
                        description: `تسوق أفضل ${cat.name}`,
                        image: cat.image,
                        isActive: true
                    },
                    [Permission.read(Role.any())]
                );
            } else {
                console.log(`Category already exists: ${cat.name}`);
            }
        }

        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
