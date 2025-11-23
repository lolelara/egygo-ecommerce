
import { Client, Databases, Query } from "node-appwrite";

// Configuration
const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const DATABASE_ID = '68de037e003bd03c4d45';
const PRODUCTS_COLLECTION_ID = 'products';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

function generateStableSKU(link) {
    if (!link) return null;
    try {
        // Extract ID from URL like https://aff.ven-door.com/product/12345
        const match = link.match(/\/product\/(\d+)/);
        if (match && match[1]) {
            return `V-${match[1]}`;
        }
        // Fallback to hash if no ID found
        let hash = 0;
        for (let i = 0; i < link.length; i++) {
            const char = link.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `V-HASH-${Math.abs(hash)}`;
    } catch (e) {
        return null;
    }
}

async function migrateSKUs() {
    console.log("🚀 Starting SKU migration...");
    let offset = 0;
    const limit = 100;
    let totalUpdated = 0;
    let totalSkipped = 0;

    while (true) {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                PRODUCTS_COLLECTION_ID,
                [
                    Query.limit(limit),
                    Query.offset(offset)
                ]
            );

            if (response.documents.length === 0) break;

            console.log(`Processing batch ${offset} - ${offset + response.documents.length}...`);

            for (const doc of response.documents) {
                const newSKU = generateStableSKU(doc.sourceUrl);

                if (newSKU && newSKU !== doc.sku) {
                    try {
                        await databases.updateDocument(
                            DATABASE_ID,
                            PRODUCTS_COLLECTION_ID,
                            doc.$id,
                            { sku: newSKU }
                        );
                        console.log(`✅ Updated ${doc.name}: ${doc.sku} -> ${newSKU}`);
                        totalUpdated++;
                    } catch (e) {
                        if (e.code === 409) {
                            console.log(`⚠️ Duplicate SKU for ${doc.name} (${newSKU}). Skipping/Deleting?`);
                            // If duplicate exists, it means we have two products with same source URL.
                            // We should probably delete this one if it's a duplicate?
                            // For now, just skip.
                        } else {
                            console.error(`❌ Failed to update ${doc.$id}:`, e.message);
                        }
                    }
                } else {
                    totalSkipped++;
                }
            }

            offset += limit;
            if (offset >= response.total) break;
        } catch (e) {
            console.error("❌ Error listing documents:", e.message);
            break;
        }
    }

    console.log(`🎉 Migration complete! Updated: ${totalUpdated}, Skipped: ${totalSkipped}`);
}

migrateSKUs();
