
import { Client, Databases, Permission, Role } from "node-appwrite";

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("68d8b9db00134c41e7c8")
    .setKey("standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5");

const databases = new Databases(client);
const DATABASE_ID = "68de037e003bd03c4d45";

// Collection IDs
const SITE_SETTINGS_COLLECTION_ID = "site_settings";
const OPENAI_KEYS_COLLECTION_ID = "openai_keys";

async function fixCollections() {
    try {
        console.log("Starting Appwrite Collections Fix...");

        // 1. Fix site_settings
        console.log("Checking site_settings collection...");
        try {
            await databases.deleteCollection(DATABASE_ID, SITE_SETTINGS_COLLECTION_ID);
            console.log("🗑️ Deleted existing site_settings collection (to reset schema).");
        } catch (error) {
            console.log("ℹ️ Collection didn't exist or couldn't be deleted:", error.message);
        }

        console.log("Creating site_settings collection...");
        await databases.createCollection(
            DATABASE_ID,
            SITE_SETTINGS_COLLECTION_ID,
            "Site Settings",
            [
                Permission.read(Role.any()),
                Permission.update(Role.label("admin")),
                Permission.create(Role.label("admin")),
            ]
        );
        console.log("✅ Created site_settings collection.");

        // Define site_settings attributes
        const siteSettingsAttributes = [
            { key: "siteName", type: "string", size: 255, required: false },
            { key: "siteDescription", type: "string", size: 1000, required: false },
            { key: "logo", type: "string", size: 1000, required: false },
            { key: "favicon", type: "string", size: 1000, required: false },
            { key: "primaryColor", type: "string", size: 50, required: false },
            { key: "secondaryColor", type: "string", size: 50, required: false },
            { key: "accentColor", type: "string", size: 50, required: false },
            { key: "contactEmail", type: "string", size: 255, required: false },
            { key: "contactPhone", type: "string", size: 50, required: false },
            { key: "address", type: "string", size: 500, required: false },
            { key: "currency", type: "string", size: 10, required: false },
            { key: "timezone", type: "string", size: 100, required: false },
            { key: "language", type: "string", size: 10, required: false },
            { key: "taxRate", type: "double", required: false },
            { key: "shippingCost", type: "double", required: false },
            { key: "freeShippingThreshold", type: "double", required: false },
            { key: "config", type: "string", size: 10000, required: false }, // Consolidated JSON for features, security, notifications, seo, socialMedia
        ];

        console.log("Ensuring site_settings attributes...");
        for (const attr of siteSettingsAttributes) {
            try {
                if (attr.type === "string") {
                    await databases.createStringAttribute(DATABASE_ID, SITE_SETTINGS_COLLECTION_ID, attr.key, attr.size, attr.required);
                } else if (attr.type === "double") {
                    await databases.createFloatAttribute(DATABASE_ID, SITE_SETTINGS_COLLECTION_ID, attr.key, attr.required);
                }
                console.log(`✅ Added/Verified attribute: ${attr.key}`);
            } catch (error) {
                // Ignore if already exists
                if (error.code !== 409) {
                    console.error(`❌ Error adding attribute ${attr.key}:`, error.message);
                }
            }
        }

        // 2. Fix openai_keys
        console.log("Checking openai_keys collection...");
        // We assume it exists, but let's check attributes for the 400 error
        // The error likely comes from missing attributes or type mismatch
        const openAIKeysAttributes = [
            { key: "label", type: "string", size: 255, required: true },
            { key: "key", type: "string", size: 1000, required: true },
            { key: "provider", type: "string", size: 50, required: true },
            { key: "isActive", type: "boolean", required: false, default: true },
            { key: "isDefault", type: "boolean", required: false, default: false },
            { key: "priority", type: "integer", required: false, default: 100 },
            { key: "usageCount", type: "integer", required: false, default: 0 },
            { key: "lastUsed", type: "datetime", required: false },
            { key: "quotaExceeded", type: "boolean", required: false, default: false },
            { key: "errorCount", type: "integer", required: false, default: 0 },
            { key: "keyStatus", type: "string", size: 50, required: false, default: "active" },
            { key: "lastError", type: "string", size: 1000, required: false },
            { key: "lastTestedAt", type: "datetime", required: false },
        ];

        console.log("Ensuring openai_keys attributes...");
        for (const attr of openAIKeysAttributes) {
            try {
                if (attr.type === "string") {
                    await databases.createStringAttribute(DATABASE_ID, OPENAI_KEYS_COLLECTION_ID, attr.key, attr.size, attr.required, attr.default);
                } else if (attr.type === "boolean") {
                    await databases.createBooleanAttribute(DATABASE_ID, OPENAI_KEYS_COLLECTION_ID, attr.key, attr.required, attr.default);
                } else if (attr.type === "integer") {
                    await databases.createIntegerAttribute(DATABASE_ID, OPENAI_KEYS_COLLECTION_ID, attr.key, attr.required, 0, 2147483647, attr.default);
                } else if (attr.type === "datetime") {
                    await databases.createDatetimeAttribute(DATABASE_ID, OPENAI_KEYS_COLLECTION_ID, attr.key, attr.required);
                }
                console.log(`✅ Added/Verified attribute: ${attr.key}`);
            } catch (error) {
                if (error.code !== 409) {
                    console.error(`❌ Error adding attribute ${attr.key}:`, error.message);
                }
            }
        }

        console.log("✅ Fix complete!");

    } catch (error) {
        console.error("Error fixing collections:", error);
    }
}

fixCollections();
