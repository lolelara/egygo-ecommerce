/**
 * Setup Commission Collections
 * إنشاء collections للعمولات والأرباح
 */

import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import { config } from 'dotenv';

config();

const client = new Client()
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';

async function createAffiliateCommissionsCollection() {
  console.log('📦 Creating Affiliate Commissions Collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      'affiliate_commissions',
      'Affiliate Commissions',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, 'affiliate_commissions', 'affiliateId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'affiliate_commissions', 'orderId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'affiliate_commissions', 'productId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'affiliate_commissions', 'productName', 500, true);
    await databases.createFloatAttribute(DATABASE_ID, 'affiliate_commissions', 'orderTotal', true);
    await databases.createFloatAttribute(DATABASE_ID, 'affiliate_commissions', 'commissionAmount', true);
    await databases.createFloatAttribute(DATABASE_ID, 'affiliate_commissions', 'commissionRate', true);
    await databases.createEnumAttribute(DATABASE_ID, 'affiliate_commissions', 'status', ['pending', 'approved', 'paid', 'rejected'], true);
    await databases.createBooleanAttribute(DATABASE_ID, 'affiliate_commissions', 'paymentCollected', true, false);
    await databases.createBooleanAttribute(DATABASE_ID, 'affiliate_commissions', 'deliveryConfirmed', true, false);
    await databases.createDatetimeAttribute(DATABASE_ID, 'affiliate_commissions', 'createdAt', true);
    await databases.createDatetimeAttribute(DATABASE_ID, 'affiliate_commissions', 'approvedAt', false);
    await databases.createDatetimeAttribute(DATABASE_ID, 'affiliate_commissions', 'paidAt', false);
    await databases.createStringAttribute(DATABASE_ID, 'affiliate_commissions', 'approvedBy', 255, false);

    // Indexes
    await databases.createIndex(DATABASE_ID, 'affiliate_commissions', 'affiliateId_idx', 'key' as any, ['affiliateId']);
    await databases.createIndex(DATABASE_ID, 'affiliate_commissions', 'orderId_idx', 'key' as any, ['orderId']);
    await databases.createIndex(DATABASE_ID, 'affiliate_commissions', 'status_idx', 'key' as any, ['status']);

    console.log('✅ Affiliate Commissions Collection created successfully');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Affiliate Commissions Collection already exists');
    } else {
      console.error('❌ Error creating Affiliate Commissions Collection:', error.message);
    }
  }
}

async function createMerchantEarningsCollection() {
  console.log('📦 Creating Merchant Earnings Collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      'merchant_earnings',
      'Merchant Earnings',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, 'merchant_earnings', 'merchantId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'merchant_earnings', 'orderId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'merchant_earnings', 'productId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'merchant_earnings', 'productName', 500, true);
    await databases.createFloatAttribute(DATABASE_ID, 'merchant_earnings', 'saleAmount', true);
    await databases.createFloatAttribute(DATABASE_ID, 'merchant_earnings', 'merchantEarning', true);
    await databases.createFloatAttribute(DATABASE_ID, 'merchant_earnings', 'platformFee', true);
    await databases.createEnumAttribute(DATABASE_ID, 'merchant_earnings', 'status', ['pending', 'approved', 'paid'], true);
    await databases.createBooleanAttribute(DATABASE_ID, 'merchant_earnings', 'deliveryConfirmed', true, false);
    await databases.createDatetimeAttribute(DATABASE_ID, 'merchant_earnings', 'createdAt', true);
    await databases.createDatetimeAttribute(DATABASE_ID, 'merchant_earnings', 'approvedAt', false);
    await databases.createDatetimeAttribute(DATABASE_ID, 'merchant_earnings', 'paidAt', false);
    await databases.createStringAttribute(DATABASE_ID, 'merchant_earnings', 'approvedBy', 255, false);

    // Indexes
    await databases.createIndex(DATABASE_ID, 'merchant_earnings', 'merchantId_idx', 'key' as any, ['merchantId']);
    await databases.createIndex(DATABASE_ID, 'merchant_earnings', 'orderId_idx', 'key' as any, ['orderId']);
    await databases.createIndex(DATABASE_ID, 'merchant_earnings', 'status_idx', 'key' as any, ['status']);

    console.log('✅ Merchant Earnings Collection created successfully');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Merchant Earnings Collection already exists');
    } else {
      console.error('❌ Error creating Merchant Earnings Collection:', error.message);
    }
  }
}

async function createLandingPageConversionsCollection() {
  console.log('📦 Creating Landing Page Conversions Collection...');
  
  try {
    await databases.createCollection(
      DATABASE_ID,
      'landing_page_conversions',
      'Landing Page Conversions',
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
      ]
    );

    // Attributes
    await databases.createStringAttribute(DATABASE_ID, 'landing_page_conversions', 'landingPageId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'landing_page_conversions', 'affiliateId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'landing_page_conversions', 'productId', 255, true);
    await databases.createStringAttribute(DATABASE_ID, 'landing_page_conversions', 'orderId', 255, true);
    await databases.createFloatAttribute(DATABASE_ID, 'landing_page_conversions', 'orderTotal', true);
    await databases.createDatetimeAttribute(DATABASE_ID, 'landing_page_conversions', 'convertedAt', true);

    // Indexes
    await databases.createIndex(DATABASE_ID, 'landing_page_conversions', 'landingPageId_idx', 'key' as any, ['landingPageId']);
    await databases.createIndex(DATABASE_ID, 'landing_page_conversions', 'affiliateId_idx', 'key' as any, ['affiliateId']);

    console.log('✅ Landing Page Conversions Collection created successfully');
  } catch (error: any) {
    if (error.code === 409) {
      console.log('⚠️  Landing Page Conversions Collection already exists');
    } else {
      console.error('❌ Error creating Landing Page Conversions Collection:', error.message);
    }
  }
}

async function setupCommissionCollections() {
  console.log('\n🚀 Setting up Commission Collections...\n');
  
  await createAffiliateCommissionsCollection();
  await createMerchantEarningsCollection();
  await createLandingPageConversionsCollection();
  
  console.log('\n✅ All Commission Collections setup complete!\n');
}

setupCommissionCollections();
