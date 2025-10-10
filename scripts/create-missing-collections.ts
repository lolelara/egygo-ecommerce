/**
 * Script to create missing Appwrite collections
 * Run: pnpm tsx scripts/create-missing-collections.ts
 */

import { Client, Databases, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '');

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '';

async function createCollections() {
  console.log('🚀 بدء إنشاء Collections المفقودة...\n');

  try {
    // 1. affiliate_clicks
    console.log('📊 إنشاء collection: affiliate_clicks');
    try {
      const clicksCollection = await databases.createCollection(
        DATABASE_ID,
        'affiliate_clicks',
        'Affiliate Clicks',
        undefined,
        true
      );
      
      // Add attributes
      await databases.createStringAttribute(DATABASE_ID, clicksCollection.$id, 'affiliateId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, clicksCollection.$id, 'linkId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, clicksCollection.$id, 'productId', 255, false);
      await databases.createStringAttribute(DATABASE_ID, clicksCollection.$id, 'ipAddress', 45, false);
      await databases.createStringAttribute(DATABASE_ID, clicksCollection.$id, 'userAgent', 500, false);
      await databases.createStringAttribute(DATABASE_ID, clicksCollection.$id, 'referrer', 500, false);
      await databases.createDatetimeAttribute(DATABASE_ID, clicksCollection.$id, 'clickedAt', true);
      
      console.log('✅ تم إنشاء affiliate_clicks\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  affiliate_clicks موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 2. affiliate_conversions
    console.log('💰 إنشاء collection: affiliate_conversions');
    try {
      const conversionsCollection = await databases.createCollection(
        DATABASE_ID,
        'affiliate_conversions',
        'Affiliate Conversions',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, conversionsCollection.$id, 'affiliateId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, conversionsCollection.$id, 'orderId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, conversionsCollection.$id, 'productId', 255, true);
      await databases.createFloatAttribute(DATABASE_ID, conversionsCollection.$id, 'amount', true);
      await databases.createFloatAttribute(DATABASE_ID, conversionsCollection.$id, 'commission', true);
      await databases.createStringAttribute(DATABASE_ID, conversionsCollection.$id, 'status', 50, true);
      await databases.createDatetimeAttribute(DATABASE_ID, conversionsCollection.$id, 'convertedAt', true);
      
      console.log('✅ تم إنشاء affiliate_conversions\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  affiliate_conversions موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 3. affiliate_withdrawals
    console.log('💸 إنشاء collection: affiliate_withdrawals');
    try {
      const withdrawalsCollection = await databases.createCollection(
        DATABASE_ID,
        'affiliate_withdrawals',
        'Affiliate Withdrawals',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, withdrawalsCollection.$id, 'affiliateId', 255, true);
      await databases.createFloatAttribute(DATABASE_ID, withdrawalsCollection.$id, 'amount', true);
      await databases.createStringAttribute(DATABASE_ID, withdrawalsCollection.$id, 'method', 100, true);
      await databases.createStringAttribute(DATABASE_ID, withdrawalsCollection.$id, 'details', 1000, true);
      await databases.createStringAttribute(DATABASE_ID, withdrawalsCollection.$id, 'status', 50, true);
      await databases.createDatetimeAttribute(DATABASE_ID, withdrawalsCollection.$id, 'requestedAt', true);
      await databases.createDatetimeAttribute(DATABASE_ID, withdrawalsCollection.$id, 'processedAt', false);
      
      console.log('✅ تم إنشاء affiliate_withdrawals\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  affiliate_withdrawals موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 4. coupons
    console.log('🎟️  إنشاء collection: coupons');
    try {
      const couponsCollection = await databases.createCollection(
        DATABASE_ID,
        'coupons',
        'Coupons',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, couponsCollection.$id, 'code', 50, true);
      await databases.createStringAttribute(DATABASE_ID, couponsCollection.$id, 'type', 20, true); // percentage, fixed
      await databases.createFloatAttribute(DATABASE_ID, couponsCollection.$id, 'value', true);
      await databases.createFloatAttribute(DATABASE_ID, couponsCollection.$id, 'minAmount', false);
      await databases.createIntegerAttribute(DATABASE_ID, couponsCollection.$id, 'maxUses', false);
      await databases.createIntegerAttribute(DATABASE_ID, couponsCollection.$id, 'usedCount', true, 0);
      await databases.createDatetimeAttribute(DATABASE_ID, couponsCollection.$id, 'validFrom', true);
      await databases.createDatetimeAttribute(DATABASE_ID, couponsCollection.$id, 'validUntil', true);
      await databases.createBooleanAttribute(DATABASE_ID, couponsCollection.$id, 'isActive', true, true);
      
      console.log('✅ تم إنشاء coupons\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  coupons موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 5. ab_tests
    console.log('🧪 إنشاء collection: ab_tests');
    try {
      const abTestsCollection = await databases.createCollection(
        DATABASE_ID,
        'ab_tests',
        'A/B Tests',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, abTestsCollection.$id, 'name', 255, true);
      await databases.createStringAttribute(DATABASE_ID, abTestsCollection.$id, 'description', 1000, false);
      await databases.createStringAttribute(DATABASE_ID, abTestsCollection.$id, 'status', 50, true);
      await databases.createStringAttribute(DATABASE_ID, abTestsCollection.$id, 'variantA', 500, true);
      await databases.createStringAttribute(DATABASE_ID, abTestsCollection.$id, 'variantB', 500, true);
      await databases.createIntegerAttribute(DATABASE_ID, abTestsCollection.$id, 'trafficSplit', true, 50);
      await databases.createDatetimeAttribute(DATABASE_ID, abTestsCollection.$id, 'startDate', true);
      await databases.createDatetimeAttribute(DATABASE_ID, abTestsCollection.$id, 'endDate', false);
      
      console.log('✅ تم إنشاء ab_tests\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  ab_tests موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 6. smart_contracts
    console.log('📜 إنشاء collection: smart_contracts');
    try {
      const contractsCollection = await databases.createCollection(
        DATABASE_ID,
        'smart_contracts',
        'Smart Contracts',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, contractsCollection.$id, 'userId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, contractsCollection.$id, 'type', 50, true);
      await databases.createStringAttribute(DATABASE_ID, contractsCollection.$id, 'status', 50, true);
      await databases.createStringAttribute(DATABASE_ID, contractsCollection.$id, 'terms', 5000, true);
      await databases.createFloatAttribute(DATABASE_ID, contractsCollection.$id, 'value', true);
      await databases.createDatetimeAttribute(DATABASE_ID, contractsCollection.$id, 'startDate', true);
      await databases.createDatetimeAttribute(DATABASE_ID, contractsCollection.$id, 'endDate', false);
      await databases.createDatetimeAttribute(DATABASE_ID, contractsCollection.$id, 'createdAt', true);
      
      console.log('✅ تم إنشاء smart_contracts\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  smart_contracts موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 7. supply_chain
    console.log('🚚 إنشاء collection: supply_chain');
    try {
      const supplyChainCollection = await databases.createCollection(
        DATABASE_ID,
        'supply_chain',
        'Supply Chain',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, supplyChainCollection.$id, 'supplierId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, supplyChainCollection.$id, 'productId', 255, true);
      await databases.createIntegerAttribute(DATABASE_ID, supplyChainCollection.$id, 'quantity', true);
      await databases.createFloatAttribute(DATABASE_ID, supplyChainCollection.$id, 'cost', true);
      await databases.createStringAttribute(DATABASE_ID, supplyChainCollection.$id, 'status', 50, true);
      await databases.createDatetimeAttribute(DATABASE_ID, supplyChainCollection.$id, 'orderDate', true);
      await databases.createDatetimeAttribute(DATABASE_ID, supplyChainCollection.$id, 'deliveryDate', false);
      
      console.log('✅ تم إنشاء supply_chain\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  supply_chain موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 8. ar_models
    console.log('🥽 إنشاء collection: ar_models');
    try {
      const arModelsCollection = await databases.createCollection(
        DATABASE_ID,
        'ar_models',
        'AR Models',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, arModelsCollection.$id, 'productId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, arModelsCollection.$id, 'modelUrl', 500, true);
      await databases.createStringAttribute(DATABASE_ID, arModelsCollection.$id, 'thumbnailUrl', 500, false);
      await databases.createStringAttribute(DATABASE_ID, arModelsCollection.$id, 'format', 50, true); // glb, usdz
      await databases.createIntegerAttribute(DATABASE_ID, arModelsCollection.$id, 'fileSize', true);
      await databases.createBooleanAttribute(DATABASE_ID, arModelsCollection.$id, 'isActive', true, true);
      await databases.createDatetimeAttribute(DATABASE_ID, arModelsCollection.$id, 'createdAt', true);
      
      console.log('✅ تم إنشاء ar_models\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  ar_models موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    // 9. family_accounts
    console.log('👨‍👩‍👧‍👦 إنشاء collection: family_accounts');
    try {
      const familyAccountsCollection = await databases.createCollection(
        DATABASE_ID,
        'family_accounts',
        'Family Accounts',
        undefined,
        true
      );
      
      await databases.createStringAttribute(DATABASE_ID, familyAccountsCollection.$id, 'name', 255, true);
      await databases.createStringAttribute(DATABASE_ID, familyAccountsCollection.$id, 'ownerId', 255, true);
      await databases.createStringAttribute(DATABASE_ID, familyAccountsCollection.$id, 'memberIds', 2000, true); // JSON array
      await databases.createFloatAttribute(DATABASE_ID, familyAccountsCollection.$id, 'spendingLimit', false);
      await databases.createBooleanAttribute(DATABASE_ID, familyAccountsCollection.$id, 'isActive', true, true);
      await databases.createDatetimeAttribute(DATABASE_ID, familyAccountsCollection.$id, 'createdAt', true);
      
      console.log('✅ تم إنشاء family_accounts\n');
    } catch (error: any) {
      if (error.code === 409) {
        console.log('⚠️  family_accounts موجود بالفعل\n');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 تم إنشاء جميع Collections بنجاح!');
    console.log('\n📋 ملخص Collections المنشأة:');
    console.log('   1. affiliate_clicks - لتتبع النقرات');
    console.log('   2. affiliate_conversions - لتتبع التحويلات');
    console.log('   3. affiliate_withdrawals - لطلبات السحب');
    console.log('   4. coupons - للكوبونات');
    console.log('   5. ab_tests - لاختبارات A/B');
    console.log('   6. smart_contracts - للعقود الذكية');
    console.log('   7. supply_chain - لسلسلة التوريد');
    console.log('   8. ar_models - لنماذج AR');
    console.log('   9. family_accounts - للحسابات العائلية');
    
  } catch (error) {
    console.error('\n❌ خطأ في إنشاء Collections:', error);
    process.exit(1);
  }
}

// Run the script
createCollections()
  .then(() => {
    console.log('\n✅ تم الانتهاء بنجاح!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ فشل التنفيذ:', error);
    process.exit(1);
  });
