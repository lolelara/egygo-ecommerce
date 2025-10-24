/**
 * Complete Withdrawals Collection Setup
 * إكمال الـ attributes والـ indexes الناقصة
 */

import { Client, Databases } from 'node-appwrite';
import { config } from 'dotenv';
config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = 'withdrawalRequests';

async function addMissingAttributes() {
    console.log('\n📝 Adding missing attributes...\n');
    
    const attributesToAdd = [
        { key: 'phoneNumber', type: 'string', size: 20, required: false },
        { key: 'bankName', type: 'string', size: 200, required: false },
        { key: 'accountNumber', type: 'string', size: 100, required: false },
        { key: 'accountHolder', type: 'string', size: 255, required: false },
        { key: 'rejectionReason', type: 'string', size: 1000, required: false },
        { key: 'paymentProof', type: 'string', size: 500, required: false },
        { key: 'transactionId', type: 'string', size: 255, required: false },
        { key: 'notes', type: 'string', size: 2000, required: false },
        { key: 'processedAt', type: 'string', size: 50, required: false },
        { key: 'processedBy', type: 'string', size: 255, required: false }
    ];
    
    for (const attr of attributesToAdd) {
        try {
            await databases.createStringAttribute(
                DATABASE_ID, 
                COLLECTION_ID, 
                attr.key, 
                attr.size, 
                attr.required
            );
            console.log(`  ✅ Added: ${attr.key}`);
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            if (error.code === 409) {
                console.log(`  ℹ️  ${attr.key} already exists`);
            } else {
                console.log(`  ❌ Error adding ${attr.key}:`, error.message);
            }
        }
    }
}

async function addMissingIndexes() {
    console.log('\n📊 Adding missing indexes...\n');
    
    const indexesToAdd = [
        { key: 'userId_index', type: 'key', attributes: ['userId'], orders: ['DESC'] },
        { key: 'status_index', type: 'key', attributes: ['status'], orders: ['ASC'] },
        { key: 'created_at_index', type: 'key', attributes: ['$createdAt'], orders: ['DESC'] },
        { key: 'userType_index', type: 'key', attributes: ['userType'], orders: ['ASC'] }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    for (const index of indexesToAdd) {
        try {
            await databases.createIndex(
                DATABASE_ID,
                COLLECTION_ID,
                index.key,
                index.type,
                index.attributes,
                index.orders
            );
            console.log(`  ✅ Added: ${index.key}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            if (error.code === 409) {
                console.log(`  ℹ️  ${index.key} already exists`);
            } else {
                console.log(`  ❌ Error adding ${index.key}:`, error.message);
            }
        }
    }
}

async function verifyCompletion() {
    console.log('\n🔍 Verifying completion...\n');
    
    try {
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
        console.log('📋 Collection Status:');
        console.log(`   Attributes: ${collection.attributes.length}/17`);
        console.log(`   Indexes: ${collection.indexes.length}/4`);
        
        if (collection.attributes.length >= 17 && collection.indexes.length >= 4) {
            console.log('\n✅ Collection is complete!');
        } else {
            console.log('\n⚠️  Collection is still incomplete');
        }
    } catch (error) {
        console.error('❌ Error verifying:', error.message);
    }
}

async function main() {
    console.log('🚀 Completing Withdrawals Collection Setup\n');
    console.log('=' .repeat(50));
    
    try {
        await addMissingAttributes();
        await addMissingIndexes();
        await verifyCompletion();
        
        console.log('\n✨ Process completed!\n');
        process.exit(0);
    } catch (error) {
        console.error('\n💥 Error:', error);
        process.exit(1);
    }
}

main();
