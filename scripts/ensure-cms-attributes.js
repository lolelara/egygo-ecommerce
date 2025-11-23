
import { Client, Databases } from "node-appwrite";

// Configuration
const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const DATABASE_ID = '68de037e003bd03c4d45';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function ensureAttributes() {
    console.log("🚀 Ensuring CMS attributes...");

    const createAttr = async (collectionId, type, key, size, required, def, array) => {
        try {
            if (type === 'string') {
                await databases.createStringAttribute(DATABASE_ID, collectionId, key, size, required, def, array);
            } else if (type === 'boolean') {
                await databases.createBooleanAttribute(DATABASE_ID, collectionId, key, required, def, array);
            } else if (type === 'enum') {
                await databases.createEnumAttribute(DATABASE_ID, collectionId, key, size, required, def, array); // size is elements here
            }
            console.log(`✅ Created attribute ${key} in ${collectionId}`);
        } catch (error) {
            if (error.code === 409) {
                console.log(`⚠️ Attribute ${key} already exists in ${collectionId}`);
            } else {
                console.error(`❌ Error creating ${key} in ${collectionId}:`, error.message);
            }
        }
    };

    // Pages Attributes
    await createAttr("pages", "string", "title", 255, true);
    await createAttr("pages", "string", "slug", 255, true);
    await createAttr("pages", "string", "content", 100000, true);
    await createAttr("pages", "boolean", "isPublished", false, false);
    await createAttr("pages", "string", "metaTitle", 255, false);
    await createAttr("pages", "string", "metaDescription", 1000, false);

    // Notifications Attributes
    await createAttr("notifications", "string", "title", 255, true);
    await createAttr("notifications", "string", "message", 5000, true);
    await createAttr("notifications", "enum", "type", ["info", "success", "warning", "error"], true);
    await createAttr("notifications", "string", "targetUser", 255, false);
    await createAttr("notifications", "boolean", "isRead", false, false);
    await createAttr("notifications", "string", "link", 1000, false);

    console.log("🎉 Attributes check completed!");
}

ensureAttributes();
