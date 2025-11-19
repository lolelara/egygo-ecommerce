import { Client, Projects } from 'node-appwrite';

// Configuration
const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const projects = new Projects(client);

async function addPlatform() {
    try {
        console.log('Adding https://egygo.me platform...');

        const platform = await projects.createPlatform(
            PROJECT_ID,
            'web',
            'EgyGo Production',
            'egygo.me',
            ''
        );

        console.log('✅ Success! Platform added:');
        console.log('   ID:', platform.$id);
        console.log('   Name:', platform.name);
        console.log('   Hostname:', platform.hostname);

    } catch (error) {
        if (error.code === 409) {
            console.log('ℹ️  Platform already exists!');
        } else {
            console.error('❌ Error adding platform:', error.message);
        }
    }
}

addPlatform();
