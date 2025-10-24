/**
 * Create Commission and Financial Collections
 * إنشاء collections العمولات والمعاملات المالية
 */

import { Client, Databases, Permission, Role } from 'node-appwrite';
import { config } from 'dotenv';
config();

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

console.log('🚀 Creating Financial Collections\n');
console.log('📍 Database:', DATABASE_ID);
console.log('=' .repeat(50) + '\n');

/**
 * 1. Create affiliate_commissions Collection
 */
async function createAffiliateCommissionsCollection() {
    try {
        console.log('📦 Creating affiliate_commissions collection...');
        
        const collection = await databases.createCollection(
            DATABASE_ID,
            'affiliate_commissions',
            'Affiliate Commissions',
            [
                Permission.read(Role.users()),
                Permission.create(Role.users()),
                Permission.update(Role.label('admin')),
                Permission.delete(Role.label('admin'))
            ],
            true
        );
        
        console.log('✅ Collection created');
        
        // String attributes
        await databases.createStringAttribute(DATABASE_ID, 'affiliate_commissions', 'affiliateId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'affiliate_commissions', 'orderId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'affiliate_commissions', 'productId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'affiliate_commissions', 'productName', 500, true);
        await databases.createStringAttribute(DATABASE_ID, 'affiliate_commissions', 'approvedBy', 255, false);
        
        console.log('  ✓ String attributes');
        
        // Float attributes
        await databases.createFloatAttribute(DATABASE_ID, 'affiliate_commissions', 'orderTotal', true, 0);
        await databases.createFloatAttribute(DATABASE_ID, 'affiliate_commissions', 'commissionAmount', true, 0);
        await databases.createFloatAttribute(DATABASE_ID, 'affiliate_commissions', 'commissionRate', true, 0);
        
        console.log('  ✓ Float attributes');
        
        // Enum attribute
        await databases.createEnumAttribute(
            DATABASE_ID,
            'affiliate_commissions',
            'status',
            ['pending', 'approved', 'paid', 'rejected'],
            true
        );
        
        console.log('  ✓ Enum attribute');
        
        // Boolean attributes
        await databases.createBooleanAttribute(DATABASE_ID, 'affiliate_commissions', 'paymentCollected', false, false);
        await databases.createBooleanAttribute(DATABASE_ID, 'affiliate_commissions', 'deliveryConfirmed', false, false);
        
        console.log('  ✓ Boolean attributes');
        
        // DateTime attributes
        await databases.createDatetimeAttribute(DATABASE_ID, 'affiliate_commissions', 'createdAt', false);
        await databases.createDatetimeAttribute(DATABASE_ID, 'affiliate_commissions', 'approvedAt', false);
        await databases.createDatetimeAttribute(DATABASE_ID, 'affiliate_commissions', 'paidAt', false);
        
        console.log('  ✓ DateTime attributes');
        
        // Wait for attributes
        console.log('⏳ Waiting for attributes...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Create indexes
        await databases.createIndex(
            DATABASE_ID,
            'affiliate_commissions',
            'affiliateId_idx',
            'key',
            ['affiliateId'],
            ['DESC']
        );
        
        await databases.createIndex(
            DATABASE_ID,
            'affiliate_commissions',
            'status_idx',
            'key',
            ['status'],
            ['ASC']
        );
        
        await databases.createIndex(
            DATABASE_ID,
            'affiliate_commissions',
            'orderId_idx',
            'key',
            ['orderId'],
            ['DESC']
        );
        
        console.log('  ✓ Indexes created');
        console.log('✅ affiliate_commissions complete!\n');
        
    } catch (error) {
        if (error.code === 409) {
            console.log('ℹ️  affiliate_commissions already exists\n');
        } else {
            console.error('❌ Error:', error.message);
            throw error;
        }
    }
}

/**
 * 2. Create merchant_earnings Collection
 */
async function createMerchantEarningsCollection() {
    try {
        console.log('📦 Creating merchant_earnings collection...');
        
        const collection = await databases.createCollection(
            DATABASE_ID,
            'merchant_earnings',
            'Merchant Earnings',
            [
                Permission.read(Role.users()),
                Permission.create(Role.users()),
                Permission.update(Role.label('admin')),
                Permission.delete(Role.label('admin'))
            ],
            true
        );
        
        console.log('✅ Collection created');
        
        // String attributes
        await databases.createStringAttribute(DATABASE_ID, 'merchant_earnings', 'merchantId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'merchant_earnings', 'orderId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'merchant_earnings', 'productId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'merchant_earnings', 'productName', 500, true);
        
        console.log('  ✓ String attributes');
        
        // Float attributes
        await databases.createFloatAttribute(DATABASE_ID, 'merchant_earnings', 'saleAmount', true, 0);
        await databases.createFloatAttribute(DATABASE_ID, 'merchant_earnings', 'merchantEarning', true, 0);
        await databases.createFloatAttribute(DATABASE_ID, 'merchant_earnings', 'platformFee', true, 0);
        
        console.log('  ✓ Float attributes');
        
        // Enum attribute
        await databases.createEnumAttribute(
            DATABASE_ID,
            'merchant_earnings',
            'status',
            ['pending', 'approved', 'paid'],
            true
        );
        
        console.log('  ✓ Enum attribute');
        
        // Boolean attribute
        await databases.createBooleanAttribute(DATABASE_ID, 'merchant_earnings', 'deliveryConfirmed', false, false);
        
        console.log('  ✓ Boolean attribute');
        
        // DateTime attributes
        await databases.createDatetimeAttribute(DATABASE_ID, 'merchant_earnings', 'createdAt', false);
        await databases.createDatetimeAttribute(DATABASE_ID, 'merchant_earnings', 'approvedAt', false);
        await databases.createDatetimeAttribute(DATABASE_ID, 'merchant_earnings', 'paidAt', false);
        
        console.log('  ✓ DateTime attributes');
        
        // Wait for attributes
        console.log('⏳ Waiting for attributes...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Create indexes
        await databases.createIndex(
            DATABASE_ID,
            'merchant_earnings',
            'merchantId_idx',
            'key',
            ['merchantId'],
            ['DESC']
        );
        
        await databases.createIndex(
            DATABASE_ID,
            'merchant_earnings',
            'status_idx',
            'key',
            ['status'],
            ['ASC']
        );
        
        await databases.createIndex(
            DATABASE_ID,
            'merchant_earnings',
            'orderId_idx',
            'key',
            ['orderId'],
            ['DESC']
        );
        
        console.log('  ✓ Indexes created');
        console.log('✅ merchant_earnings complete!\n');
        
    } catch (error) {
        if (error.code === 409) {
            console.log('ℹ️  merchant_earnings already exists\n');
        } else {
            console.error('❌ Error:', error.message);
            throw error;
        }
    }
}

/**
 * 3. Create platform_revenue Collection
 */
async function createPlatformRevenueCollection() {
    try {
        console.log('📦 Creating platform_revenue collection...');
        
        const collection = await databases.createCollection(
            DATABASE_ID,
            'platform_revenue',
            'Platform Revenue',
            [
                Permission.read(Role.label('admin')),
                Permission.create(Role.users()),
                Permission.update(Role.label('admin')),
                Permission.delete(Role.label('admin'))
            ],
            true
        );
        
        console.log('✅ Collection created');
        
        // String attributes
        await databases.createStringAttribute(DATABASE_ID, 'platform_revenue', 'orderId', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'platform_revenue', 'source', 255, true);
        await databases.createStringAttribute(DATABASE_ID, 'platform_revenue', 'description', 1000, false);
        
        console.log('  ✓ String attributes');
        
        // Float attribute
        await databases.createFloatAttribute(DATABASE_ID, 'platform_revenue', 'amount', true, 0);
        
        console.log('  ✓ Float attribute');
        
        // Enum attribute
        await databases.createEnumAttribute(
            DATABASE_ID,
            'platform_revenue',
            'revenueType',
            ['platform_fee', 'ad_revenue', 'subscription', 'other'],
            true
        );
        
        console.log('  ✓ Enum attribute');
        
        // DateTime attribute
        await databases.createDatetimeAttribute(DATABASE_ID, 'platform_revenue', 'date', true);
        
        console.log('  ✓ DateTime attribute');
        
        // Wait for attributes
        console.log('⏳ Waiting for attributes...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Create indexes
        await databases.createIndex(
            DATABASE_ID,
            'platform_revenue',
            'date_idx',
            'key',
            ['date'],
            ['DESC']
        );
        
        await databases.createIndex(
            DATABASE_ID,
            'platform_revenue',
            'type_idx',
            'key',
            ['revenueType'],
            ['ASC']
        );
        
        await databases.createIndex(
            DATABASE_ID,
            'platform_revenue',
            'orderId_idx',
            'key',
            ['orderId'],
            ['DESC']
        );
        
        console.log('  ✓ Indexes created');
        console.log('✅ platform_revenue complete!\n');
        
    } catch (error) {
        if (error.code === 409) {
            console.log('ℹ️  platform_revenue already exists\n');
        } else {
            console.error('❌ Error:', error.message);
            throw error;
        }
    }
}

/**
 * Verify all collections
 */
async function verifyCollections() {
    console.log('🔍 Verifying all collections...\n');
    
    try {
        const collections = ['affiliate_commissions', 'merchant_earnings', 'platform_revenue'];
        
        for (const collId of collections) {
            const coll = await databases.getCollection(DATABASE_ID, collId);
            console.log(`✅ ${coll.name}`);
            console.log(`   Attributes: ${coll.attributes.length}`);
            console.log(`   Indexes: ${coll.indexes.length}\n`);
        }
        
        console.log('🎉 All collections verified!\n');
        
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    }
}

/**
 * Main
 */
async function main() {
    try {
        await createAffiliateCommissionsCollection();
        await createMerchantEarningsCollection();
        await createPlatformRevenueCollection();
        await verifyCollections();
        
        console.log('✨ Setup complete!\n');
        console.log('📋 Next steps:');
        console.log('   1. Test commission creation');
        console.log('   2. Test merchant earnings');
        console.log('   3. Integrate with orders\n');
        
        process.exit(0);
    } catch (error) {
        console.error('\n💥 Setup failed:', error);
        process.exit(1);
    }
}

main();
