
import { Client, Databases } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('68d8b9db00134c41e7c8')
    .setKey('standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5');

const databases = new Databases(client);
const DATABASE_ID = '68de037e003bd03c4d45';
const CATEGORIES_COLLECTION_ID = 'categories';

function generateSlug(name) {
    return name
        .toLowerCase()
        .trim()
        .replace(/[أ-ي\s]+/g, '-')
        .replace(/[^a-z0-9\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function main() {
    try {
        // 1. Add slug attribute
        console.log('Adding slug attribute...');
        try {
            await databases.createStringAttribute(DATABASE_ID, CATEGORIES_COLLECTION_ID, 'slug', 255, false);
            console.log('Slug attribute created. Waiting for it to be available...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for attribute creation
        } catch (error) {
            if (error.code === 409) {
                console.log('Slug attribute already exists.');
            } else {
                throw error;
            }
        }

        // 2. Update existing categories
        console.log('Updating existing categories...');
        const response = await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID);

        for (const doc of response.documents) {
            let name = doc.name;
            // Fix " Products" name if exists
            if (name.startsWith(' ')) {
                name = name.trim();
                console.log(`Fixing name for "${doc.name}" -> "${name}"`);
            }

            const slug = generateSlug(name);
            console.log(`Updating category "${name}" with slug "${slug}"...`);

            await databases.updateDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, doc.$id, {
                slug: slug,
                name: name // Update name in case we trimmed it
            });
        }

        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
