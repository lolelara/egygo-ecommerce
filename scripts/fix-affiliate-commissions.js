/**
 * Fix affiliate_commissions collection
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

async function fixAffiliateCommissions() {
    console.log('🔧 Fixing affiliate_commissions collection\n');
    
    try {
        // Check current state
        const collection = await databases.getCollection(DATABASE_ID, 'affiliate_commissions');
        console.log(`Current state: ${collection.attributes.length} attributes\n`);
        
        // Add missing String attributes
        const stringAttrs = [
            { key: 'orderId', size: 255, required: true },
            { key: 'productId', size: 255, required: true },
            { key: 'productName', size: 500, required: true },
            { key: 'approvedBy', size: 255, required: false }
        ];
        
        for (const attr of stringAttrs) {
            try {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    'affiliate_commissions',
                    attr.key,
                    attr.size,
                    attr.required
                );
                console.log(`✅ Added: ${attr.key}`);
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                if (error.code === 409) {
                    console.log(`ℹ️  ${attr.key} already exists`);
                } else {
                    console.error(`❌ Error adding ${attr.key}:`, error.message);
                }
            }
        }
        
        // Add missing Float attributes
        const floatAttrs = [
            { key: 'orderTotal', required: true, min: 0 },
            { key: 'commissionAmount', required: true, min: 0 },
            { key: 'commissionRate', required: true, min: 0 }
        ];
        
        for (const attr of floatAttrs) {
            try {
                await databases.createFloatAttribute(
                    DATABASE_ID,
                    'affiliate_commissions',
                    attr.key,
                    attr.required,
                    attr.min
                );
                console.log(`✅ Added: ${attr.key}`);
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                if (error.code === 409) {
                    console.log(`ℹ️  ${attr.key} already exists`);
                } else {
                    console.error(`❌ Error adding ${attr.key}:`, error.message);
                }
            }
        }
        
        // Add Enum attribute
        try {
            await databases.createEnumAttribute(
                DATABASE_ID,
                'affiliate_commissions',
                'status',
                ['pending', 'approved', 'paid', 'rejected'],
                true
            );
            console.log(`✅ Added: status`);
        } catch (error) {
            if (error.code === 409) {
                console.log(`ℹ️  status already exists`);
            } else {
                console.error(`❌ Error adding status:`, error.message);
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add Boolean attributes
        const boolAttrs = [
            { key: 'paymentCollected', required: false, default: false },
            { key: 'deliveryConfirmed', required: false, default: false }
        ];
        
        for (const attr of boolAttrs) {
            try {
                await databases.createBooleanAttribute(
                    DATABASE_ID,
                    'affiliate_commissions',
                    attr.key,
                    attr.required,
                    attr.default
                );
                console.log(`✅ Added: ${attr.key}`);
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                if (error.code === 409) {
                    console.log(`ℹ️  ${attr.key} already exists`);
                } else {
                    console.error(`❌ Error adding ${attr.key}:`, error.message);
                }
            }
        }
        
        // Add DateTime attributes
        const dateAttrs = [
            { key: 'createdAt', required: false },
            { key: 'approvedAt', required: false },
            { key: 'paidAt', required: false }
        ];
        
        for (const attr of dateAttrs) {
            try {
                await databases.createDatetimeAttribute(
                    DATABASE_ID,
                    'affiliate_commissions',
                    attr.key,
                    attr.required
                );
                console.log(`✅ Added: ${attr.key}`);
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                if (error.code === 409) {
                    console.log(`ℹ️  ${attr.key} already exists`);
                } else {
                    console.error(`❌ Error adding ${attr.key}:`, error.message);
                }
            }
        }
        
        // Wait for all attributes to be ready
        console.log('\n⏳ Waiting for attributes to be ready...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Add indexes
        const indexes = [
            { key: 'affiliateId_idx', attributes: ['affiliateId'], orders: ['DESC'] },
            { key: 'status_idx', attributes: ['status'], orders: ['ASC'] },
            { key: 'orderId_idx', attributes: ['orderId'], orders: ['DESC'] }
        ];
        
        for (const index of indexes) {
            try {
                await databases.createIndex(
                    DATABASE_ID,
                    'affiliate_commissions',
                    index.key,
                    'key',
                    index.attributes,
                    index.orders
                );
                console.log(`✅ Index added: ${index.key}`);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                if (error.code === 409) {
                    console.log(`ℹ️  ${index.key} already exists`);
                } else {
                    console.error(`❌ Error adding ${index.key}:`, error.message);
                }
            }
        }
        
        // Verify final state
        const finalCollection = await databases.getCollection(DATABASE_ID, 'affiliate_commissions');
        console.log(`\n✅ Final state:`);
        console.log(`   Attributes: ${finalCollection.attributes.length}`);
        console.log(`   Indexes: ${finalCollection.indexes.length}\n`);
        
        console.log('🎉 affiliate_commissions fixed!\n');
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixAffiliateCommissions().then(() => process.exit(0));
