
import { Client, Databases } from "node-appwrite";

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("68d8b9db00134c41e7c8")
    .setKey("standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5");

const databases = new Databases(client);
const DATABASE_ID = "68de037e003bd03c4d45";
const PRODUCTS_COLLECTION_ID = "products";

async function addAttributes() {
    try {
        console.log("Adding missing attributes...");

        try {
            await databases.createBooleanAttribute(DATABASE_ID, PRODUCTS_COLLECTION_ID, "isFeaturedInHero", false, false);
            console.log("✅ Added isFeaturedInHero attribute");
        } catch (e) {
            console.log("ℹ️ isFeaturedInHero might already exist or error:", e.message);
        }

        // Wait for attribute to be available
        console.log("Waiting for attribute to be processed...");
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create index for isFeatured if it doesn't exist (needed for sorting)
        try {
            // Check if index exists first
            const response = await databases.listIndexes(DATABASE_ID, PRODUCTS_COLLECTION_ID);
            const indexExists = response.indexes.some(idx => idx.key === "idx_featured");

            if (!indexExists) {
                await databases.createIndex(DATABASE_ID, PRODUCTS_COLLECTION_ID, "idx_featured", "key", ["isFeatured"], ["DESC"]);
                console.log("✅ Created index for isFeatured");
            } else {
                console.log("ℹ️ Index for isFeatured already exists");
            }
        } catch (e) {
            console.log("⚠️ Error creating index (might be fine if not needed yet):", e.message);
        }

    } catch (error) {
        console.error("Error adding attributes:", error);
    }
}

addAttributes();
