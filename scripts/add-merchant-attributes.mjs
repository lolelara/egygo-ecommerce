
import { Client, Databases } from "node-appwrite";

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("68d8b9db00134c41e7c8")
    .setKey("standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5");

const databases = new Databases(client);
const DATABASE_ID = "68de037e003bd03c4d45";
const USER_PREFERENCES_COLLECTION_ID = "userPreferences";

async function addMerchantAttributes() {
    try {
        console.log("Adding merchant attributes to userPreferences collection...");

        const attributes = [
            { key: "isFeatured", type: "boolean", required: false, default: false },
            { key: "storeBanner", type: "string", size: 2000, required: false },
            { key: "storeDescription", type: "string", size: 5000, required: false },
            { key: "storeLogo", type: "string", size: 2000, required: false },
        ];

        for (const attr of attributes) {
            try {
                if (attr.type === "boolean") {
                    await databases.createBooleanAttribute(DATABASE_ID, USER_PREFERENCES_COLLECTION_ID, attr.key, attr.required, attr.default);
                } else if (attr.type === "string") {
                    await databases.createStringAttribute(DATABASE_ID, USER_PREFERENCES_COLLECTION_ID, attr.key, attr.size, attr.required);
                }
                console.log(`✅ Added attribute: ${attr.key}`);
            } catch (error) {
                if (error.code === 409) {
                    console.log(`ℹ️ Attribute ${attr.key} already exists.`);
                } else {
                    console.error(`❌ Error adding attribute ${attr.key}:`, error.message);
                }
            }
        }

        console.log("✅ Merchant attributes setup complete!");

    } catch (error) {
        console.error("Error setting up attributes:", error);
    }
}

addMerchantAttributes();
