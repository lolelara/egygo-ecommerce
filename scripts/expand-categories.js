
import { Client, Databases, ID, Query } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('68d8b9db00134c41e7c8')
    .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';
const CATEGORIES_COLLECTION_ID = 'categories';
const PRODUCTS_COLLECTION_ID = 'products';

const NEW_CATEGORIES = [
    {
        name: "Beauty & Personal Care",
        slug: "beauty-personal-care",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800&q=80",
        description: "منتجات الجمال والعناية الشخصية",
        keywords: ["beauty", "makeup", "skin", "hair", "care", "perfume", "cosmetic", "cream", "lotion", "soap", "shampoo"]
    },
    {
        name: "Sports & Outdoors",
        slug: "sports-outdoors",
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80",
        description: "معدات رياضية وأنشطة خارجية",
        keywords: ["sport", "gym", "fitness", "outdoor", "camping", "hiking", "running", "yoga", "ball", "racket", "swim"]
    },
    {
        name: "Toys & Games",
        slug: "toys-games",
        image: "https://images.unsplash.com/photo-1566576912902-4b61e3781527?w=800&q=80",
        description: "ألعاب للأطفال والكبار",
        keywords: ["toy", "game", "puzzle", "doll", "action figure", "lego", "board game", "card", "kids", "child", "baby"]
    },
    {
        name: "Automotive",
        slug: "automotive",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
        description: "اكسسوارات وقطع غيار السيارات",
        keywords: ["car", "auto", "vehicle", "motor", "bike", "accessory", "tire", "oil", "cleaner", "seat", "cover"]
    },
    {
        name: "Books & Stationery",
        slug: "books-stationery",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
        description: "كتب وأدوات مكتبية وقرطاسية",
        keywords: ["book", "paper", "pen", "pencil", "notebook", "office", "school", "read", "write", "desk"]
    },
    {
        name: "Pets",
        slug: "pets",
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80",
        description: "مستلزمات الحيوانات الأليفة",
        keywords: ["pet", "dog", "cat", "food", "leash", "collar", "bed", "toy", "fish", "bird"]
    },
    {
        name: "Office Supplies",
        slug: "office-supplies",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80",
        description: "تجهيزات ومستلزمات المكاتب",
        keywords: ["office", "desk", "chair", "printer", "paper", "organizer", "file", "folder", "stapler"]
    },
    {
        name: "Garden & Outdoors",
        slug: "garden-outdoors",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
        description: "مستلزمات الحدائق والمساحات الخارجية",
        keywords: ["garden", "plant", "flower", "pot", "tool", "hose", "lawn", "mower", "outdoor", "patio"]
    },
    {
        name: "Tools & Home Improvement",
        slug: "tools-home-improvement",
        image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80",
        description: "أدوات ومعدات تحسين المنزل",
        keywords: ["tool", "drill", "hammer", "saw", "screw", "paint", "repair", "home", "improvement", "diy"]
    },
    {
        name: "Health & Wellness",
        slug: "health-wellness",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
        description: "منتجات الصحة والعافية",
        keywords: ["health", "wellness", "vitamin", "supplement", "mask", "thermometer", "pressure", "medical", "care"]
    }
];

async function main() {
    try {
        console.log('Fetching existing categories...');
        const existingCategories = await databases.listDocuments(
            DATABASE_ID,
            CATEGORIES_COLLECTION_ID,
            [Query.limit(100)]
        );
        const existingSlugs = existingCategories.documents.map(c => c.slug);
        const categoryMap = new Map(); // slug -> id

        existingCategories.documents.forEach(c => categoryMap.set(c.slug, c.$id));

        // 1. Create new categories
        for (const cat of NEW_CATEGORIES) {
            if (!existingSlugs.includes(cat.slug)) {
                console.log(`Creating category: ${cat.name}...`);
                const newCat = await databases.createDocument(
                    DATABASE_ID,
                    CATEGORIES_COLLECTION_ID,
                    ID.unique(),
                    {
                        name: cat.name,
                        slug: cat.slug,
                        image: cat.image,
                        description: cat.description,
                        isActive: true
                    }
                );
                categoryMap.set(cat.slug, newCat.$id);
                console.log(`Created ${cat.name}.`);
            } else {
                console.log(`Category ${cat.name} already exists.`);
                // Ensure map has the ID
                const existing = existingCategories.documents.find(c => c.slug === cat.slug);
                if (existing) categoryMap.set(cat.slug, existing.$id);
            }
        }

        // 2. Fetch all products
        console.log('Fetching products...');
        let allProducts = [];
        let cursor = null;

        while (true) {
            const queries = [Query.limit(100)];
            if (cursor) queries.push(Query.cursorAfter(cursor));

            const response = await databases.listDocuments(
                DATABASE_ID,
                PRODUCTS_COLLECTION_ID,
                queries
            );

            allProducts.push(...response.documents);

            if (response.documents.length < 100) break;
            cursor = response.documents[response.documents.length - 1].$id;
        }
        console.log(`Fetched ${allProducts.length} products.`);

        // 3. Distribute products
        console.log('Distributing products...');
        for (const product of allProducts) {
            let currentCategoryIds = product.categoryIds || [];
            // Ensure it's an array
            if (typeof currentCategoryIds === 'string') {
                try {
                    currentCategoryIds = JSON.parse(currentCategoryIds);
                } catch (e) {
                    currentCategoryIds = [currentCategoryIds];
                }
            }
            if (!Array.isArray(currentCategoryIds)) currentCategoryIds = [];

            const name = (product.name || '').toLowerCase();
            const description = (product.description || '').toLowerCase();
            const text = `${name} ${description}`;

            let addedCategories = false;

            for (const cat of NEW_CATEGORIES) {
                // Check if product matches keywords
                const matches = cat.keywords.some(k => text.includes(k));
                if (matches) {
                    const catId = categoryMap.get(cat.slug);
                    if (catId && !currentCategoryIds.includes(catId)) {
                        currentCategoryIds.push(catId);
                        addedCategories = true;
                        console.log(`Assigning "${product.name}" to ${cat.name}`);
                    }
                }
            }

            // If no new categories added, maybe assign randomly to one if it has NO categories?
            // Or just leave it. The user said "distribute them", implying relevant distribution.
            // But also "Scraped products in their category and show them elsewhere".
            // Let's just stick to keyword matching for relevance.

            if (addedCategories) {
                await databases.updateDocument(
                    DATABASE_ID,
                    PRODUCTS_COLLECTION_ID,
                    product.$id,
                    {
                        categoryIds: currentCategoryIds
                    }
                );
            }
        }

        console.log('Done.');

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
