
import { Client, Databases, ID, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('68d8b9db00134c41e7c8')
    .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';
const CATEGORIES_COLLECTION_ID = 'categories';

const CATEGORY_IMAGES = {
    "men-fashion": "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80",
    "women-fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    "kids": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&q=80",
    "accessories": "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=800&q=80",
    "electronics": "https://images.unsplash.com/photo-1498049860654-af1a5c5668ba?w=800&q=80",
    "home-living": "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80",
    "shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
};

async function main() {
    try {
        console.log('Fetching existing categories...');
        const existingCategories = await databases.listDocuments(
            DATABASE_ID,
            CATEGORIES_COLLECTION_ID,
            [Query.limit(100)]
        );

        const existingSlugs = existingCategories.documents.map(c => c.slug);
        console.log('Existing slugs:', existingSlugs);

        // 1. Add "Shoes" if missing
        if (!existingSlugs.includes('shoes')) {
            console.log('Creating "Shoes" category...');
            await databases.createDocument(
                DATABASE_ID,
                CATEGORIES_COLLECTION_ID,
                ID.unique(),
                {
                    name: 'Shoes',
                    slug: 'shoes',
                    image: CATEGORY_IMAGES['shoes'],
                    description: 'أحدث صيحات الأحذية للرجال والنساء والأطفال',
                    isActive: true
                }
            );
            console.log('Created "Shoes" category.');
        }

        // 2. Update "Men's Fashion" name if needed
        const mensFashion = existingCategories.documents.find(c => c.slug === 'men-fashion');
        if (mensFashion && mensFashion.name !== "Men's Fashion") {
            console.log('Updating "Men\'s Fashion" name...');
            await databases.updateDocument(
                DATABASE_ID,
                CATEGORIES_COLLECTION_ID,
                mensFashion.$id,
                {
                    name: "Men's Fashion"
                }
            );
            console.log('Updated "Men\'s Fashion" name.');
        }

        // 3. Update images for existing categories
        console.log('Updating category images...');
        for (const doc of existingCategories.documents) {
            const slug = doc.slug;
            const newImage = CATEGORY_IMAGES[slug];

            if (newImage && (!doc.image || doc.image === '/placeholder.png' || doc.image.includes('placeholder'))) {
                console.log(`Updating image for ${doc.name} (${slug})...`);
                await databases.updateDocument(
                    DATABASE_ID,
                    CATEGORIES_COLLECTION_ID,
                    doc.$id,
                    {
                        image: newImage
                    }
                );
                console.log(`Updated ${doc.name}.`);
            }
        }

        console.log('Category update complete.');

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
