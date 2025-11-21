
import { Client, Databases } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
    .setProject("68d8b9db00134c41e7c8")
    .setKey("standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5");

if (false) { // Skip env var check
    client.setKey(process.env.VITE_APPWRITE_API_KEY);
}

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || "68de037e003bd03c4d45";
const PRODUCTS_COLLECTION_ID = "products";

async function checkAttributes() {
    try {
        console.log("Checking attributes for collection:", PRODUCTS_COLLECTION_ID);
        const response = await databases.listAttributes(DATABASE_ID, PRODUCTS_COLLECTION_ID);

        const attributes = response.attributes.map(a => a.key);
        console.log("Attributes found:", attributes);

        const isFeaturedExists = attributes.includes("isFeatured");
        const isFeaturedInHeroExists = attributes.includes("isFeaturedInHero");

        console.log("isFeatured exists:", isFeaturedExists);
        console.log("isFeaturedInHero exists:", isFeaturedInHeroExists);

        if (!isFeaturedExists || !isFeaturedInHeroExists) {
            console.error("❌ Missing attributes!");
        } else {
            console.log("✅ All attributes present.");
        }

    } catch (error) {
        console.error("Error checking attributes:", error);
    }
}

checkAttributes();
