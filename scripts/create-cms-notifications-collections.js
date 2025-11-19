
import { Client, Databases, Permission, Role } from "node-appwrite";
import dotenv from "dotenv";

dotenv.config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = "68de037e003bd03c4d45"; // Using the correct database ID

async function createCollections() {
    try {
        console.log("🚀 Starting CMS & Notifications setup...");

        // 1. Create Pages Collection
        console.log("📄 Creating 'pages' collection...");
        try {
            await databases.createCollection(
                DATABASE_ID,
                "pages",
                "Pages",
                [
                    Permission.read(Role.any()), // Public read access
                    Permission.write(Role.label("admin")), // Admin write access
                    Permission.update(Role.label("admin")),
                    Permission.delete(Role.label("admin")),
                ]
            );
            console.log("✅ Pages collection created");

            // Attributes for Pages
            await databases.createStringAttribute(DATABASE_ID, "pages", "title", 255, true);
            await databases.createStringAttribute(DATABASE_ID, "pages", "slug", 255, true);
            await databases.createStringAttribute(DATABASE_ID, "pages", "content", 100000, true); // Long text
            await databases.createBooleanAttribute(DATABASE_ID, "pages", "isPublished", true, false);
            await databases.createStringAttribute(DATABASE_ID, "pages", "metaTitle", 255, false);
            await databases.createStringAttribute(DATABASE_ID, "pages", "metaDescription", 1000, false);

            // Index for slug
            // await databases.createIndex(DATABASE_ID, "pages", "unique_slug", "unique", ["slug"]);

            console.log("✅ Pages attributes created");
        } catch (error) {
            if (error.code === 409) {
                console.log("⚠️ Pages collection already exists");
            } else {
                throw error;
            }
        }

        // 2. Create Notifications Collection
        console.log("🔔 Creating 'notifications' collection...");
        try {
            await databases.createCollection(
                DATABASE_ID,
                "notifications",
                "Notifications",
                [
                    Permission.read(Role.users()), // Authenticated users can read
                    Permission.write(Role.label("admin")), // Only admin can create
                    Permission.update(Role.users()), // Users can update (mark as read)
                    Permission.delete(Role.label("admin")),
                ]
            );
            console.log("✅ Notifications collection created");

            // Attributes for Notifications
            await databases.createStringAttribute(DATABASE_ID, "notifications", "title", 255, true);
            await databases.createStringAttribute(DATABASE_ID, "notifications", "message", 5000, true);
            await databases.createEnumAttribute(DATABASE_ID, "notifications", "type", ["info", "success", "warning", "error"], true);
            await databases.createStringAttribute(DATABASE_ID, "notifications", "targetUser", 255, false); // Null for broadcast
            await databases.createBooleanAttribute(DATABASE_ID, "notifications", "isRead", true, false);
            await databases.createStringAttribute(DATABASE_ID, "notifications", "link", 1000, false);

            console.log("✅ Notifications attributes created");
        } catch (error) {
            if (error.code === 409) {
                console.log("⚠️ Notifications collection already exists");
            } else {
                throw error;
            }
        }

        console.log("🎉 Setup completed successfully!");
    } catch (error) {
        console.error("❌ Error:", error);
    }
}

createCollections();
