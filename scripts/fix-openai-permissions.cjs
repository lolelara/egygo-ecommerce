
const sdk = require('node-appwrite');

// Configuration
const client = new sdk.Client();
const databases = new sdk.Databases(client);

const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const DATABASE_ID = '68de037e003bd03c4d45';
const COLLECTION_NAME = 'openai_keys';

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

async function updatePermissions() {
    try {
        console.log(`Updating permissions for collection ${COLLECTION_NAME}...`);

        // Get the collection to find its ID (using name as ID in our setup)
        // Note: In previous script we used name as ID.
        const collectionId = COLLECTION_NAME;

        // Define permissions: Allow any user to read/write for now to unblock dev
        // In production, this should be restricted to specific teams or roles
        const permissions = [
            sdk.Permission.read(sdk.Role.any()),
            sdk.Permission.create(sdk.Role.any()),
            sdk.Permission.update(sdk.Role.any()),
            sdk.Permission.delete(sdk.Role.any()),
        ];

        await databases.updateCollection(
            DATABASE_ID,
            collectionId,
            COLLECTION_NAME,
            permissions
        );

        console.log(`Permissions updated successfully for ${COLLECTION_NAME}.`);

    } catch (error) {
        console.error('Error updating permissions:', error);
    }
}

updatePermissions();
