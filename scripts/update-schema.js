
import { Client, Databases } from 'node-appwrite';

// Configuration
const ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8'; // Provided by user
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const DATABASE_ID = '68de037e003bd03c4d45'; // egygo database
const COLLECTION_ID = 'products';

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function addAttribute() {
    try {
        console.log('Adding isFeaturedInHero attribute...');
        await databases.createBooleanAttribute(
            DATABASE_ID,
            COLLECTION_ID,
            'isFeaturedInHero',
            false, // required
            false, // default value
            false  // array
        );
        console.log('Success! Attribute isFeaturedInHero added.');
    } catch (error) {
        console.error('Error adding attribute:', error.message);
    }
}

addAttribute();
