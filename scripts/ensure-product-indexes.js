
import { Client, Databases } from "node-appwrite";

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

async function ensureIndexes() {
    console.log("🚀 Checking product indexes...");

    try {
        // Check if index exists
        // We can't easily check if it exists without listing, but createIndex throws if it exists (usually)
        // or we can list attributes/indexes.

        // Let's just try to create it and catch the error.
        console.log("Creating index for 'sku'...");
        await databases.createIndex(
            DATABASE_ID,
            PRODUCTS_COLLECTION_ID,
            "unique_sku",
            "unique",
            ["sku"]
        );
        console.log("✅ Index 'unique_sku' created successfully.");
    } catch (error) {
        if (error.code === 409) {
            console.log("⚠️ Index 'unique_sourceUrl' already exists.");
        } else {
            console.error("❌ Error creating index:", error.message);
            // It might fail if the collection ID is wrong.
            // I need to verify the collection ID.
        }
    }
}

ensureIndexes();
