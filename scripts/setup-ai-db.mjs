import { Client, Databases, ID, Permission, Role } from 'node-appwrite';

// Configuration
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68d8b9db00134c41e7c8';
const APPWRITE_API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const APPWRITE_DATABASE_ID = '68de037e003bd03c4d45';

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

async function setup() {
    console.log('🚀 Setting up AI Task Configurations...');

    const COLLECTION_NAME = 'ai_task_configs';
    let collectionId = '';

    // 1. Check/Create Collection
    try {
        const collections = await databases.listCollections(APPWRITE_DATABASE_ID);
        const existing = collections.collections.find(c => c.name === COLLECTION_NAME);

        if (existing) {
            console.log('✅ Collection exists:', existing.$id);
            collectionId = existing.$id;
        } else {
            console.log('🆕 Creating collection...');
            const col = await databases.createCollection(
                APPWRITE_DATABASE_ID,
                ID.unique(),
                COLLECTION_NAME,
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.users()),
                    Permission.create(Role.users()),
                    Permission.delete(Role.users())
                ]
            );
            collectionId = col.$id;
            console.log('✅ Collection created:', collectionId);
        }
    } catch (error) {
        console.error('❌ Error checking/creating collection:', error.message);
        return;
    }

    // 2. Create Attributes
    const attributes = [
        { key: 'taskId', type: 'string', size: 50, required: true }, // description, chat, image, categorization
        { key: 'primaryKeyId', type: 'string', size: 50, required: false },
        { key: 'fallbackKeyId', type: 'string', size: 50, required: false },
        { key: 'model', type: 'string', size: 100, required: false },
        { key: 'provider', type: 'string', size: 50, required: false } // To store provider name for quick access
    ];

    for (const attr of attributes) {
        try {
            console.log(`   - Creating attribute: ${attr.key}...`);
            await databases.createStringAttribute(
                APPWRITE_DATABASE_ID,
                collectionId,
                attr.key,
                attr.size,
                attr.required
            );
            console.log(`     ✅ Created ${attr.key}`);
        } catch (error) {
            if (error.message.includes('already exists')) {
                console.log(`     ⚠️ Attribute ${attr.key} already exists`);
            } else {
                console.error(`     ❌ Error creating ${attr.key}:`, error.message);
            }
        }
        // Wait a bit between attributes to avoid race conditions
        await new Promise(r => setTimeout(r, 1000));
    }

    // 3. Create Default Configs
    const defaultTasks = ['description', 'chat', 'image', 'categorization'];

    console.log('\n📦 Creating default configurations...');
    for (const task of defaultTasks) {
        try {
            const existing = await databases.listDocuments(
                APPWRITE_DATABASE_ID,
                collectionId,
                // We can't query by taskId yet if index isn't ready, so we'll just list all and filter in memory for this setup script
                []
            );

            const found = existing.documents.find(d => d.taskId === task);

            if (!found) {
                await databases.createDocument(
                    APPWRITE_DATABASE_ID,
                    collectionId,
                    ID.unique(),
                    {
                        taskId: task,
                        model: 'default'
                    }
                );
                console.log(`   ✅ Created config for: ${task}`);
            } else {
                console.log(`   ℹ️ Config exists for: ${task}`);
            }
        } catch (error) {
            console.error(`   ❌ Error creating config for ${task}:`, error.message);
        }
    }

    console.log('\n🎉 Setup Complete!');
    console.log('NOTE: You may need to wait for indexes to build if you added any.');
}

setup();
