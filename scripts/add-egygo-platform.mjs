/**
 * إضافة دومين egygo.me إلى Appwrite تلقائياً
 */

import 'dotenv/config';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '68d8b9db00134c41e7c8';
const API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';

async function listPlatforms() {
    const url = `${APPWRITE_ENDPOINT}/projects/${PROJECT_ID}/platforms`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch platforms');
    }

    const data = await response.json();
    return data.platforms || [];
}

async function addPlatform(hostname, name) {
    const url = `${APPWRITE_ENDPOINT}/projects/${PROJECT_ID}/platforms`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Appwrite-Project': PROJECT_ID,
            'X-Appwrite-Key': API_KEY
        },
        body: JSON.stringify({
            type: 'web',
            name: name,
            hostname: hostname
        })
    });

    if (!response.ok) {
        const error = await response.json();
        if (error.code === 409) {
            console.log(`ℹ️  Platform "${hostname}" already exists!`);
            return null;
        }
        throw new Error(`Failed to add platform: ${error.message}`);
    }

    return response.json();
}

async function main() {
    console.log('🌐 Adding egygo.me to Appwrite platforms...\n');

    try {
        // List existing platforms
        console.log('📋 Current platforms:');
        const platforms = await listPlatforms();

        if (platforms.length === 0) {
            console.log('  ⚠️  No platforms yet\n');
        } else {
            platforms.forEach((platform, index) => {
                console.log(`  ${index + 1}. ${platform.name} → ${platform.hostname}`);
            });
            console.log('');
        }

        // Add egygo.me
        console.log('⏳ Adding egygo.me...');
        const result = await addPlatform('egygo.me', 'EgyGo Production');

        if (result) {
            console.log('\n✅ Platform added successfully!');
            console.log(`\n📋 Details:`);
            console.log(`  ID: ${result.$id}`);
            console.log(`  Name: ${result.name}`);
            console.log(`  Hostname: ${result.hostname}`);
            console.log(`  Type: ${result.type}`);
            console.log('\n🎉 Now you can access Appwrite API from https://egygo.me!');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the script
main();
