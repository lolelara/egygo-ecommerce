/**
 * Fix Financial Collections Attributes
 * Adds missing attributes without default values
 */

import { Client, Databases } from 'node-appwrite';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env') });

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '68de037e003bd03c4d45';
const API_KEY = process.env.APPWRITE_API_KEY;

const client = new Client();
client.setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);

const databases = new Databases(client);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fixAttributes() {
  console.log('🔧 Fixing Financial Collections Attributes...\n');

  try {
    // Fix merchantPayments attributes
    console.log('📝 Adding merchantPayments attributes...');
    
    const merchantAttrs = [
      { key: 'merchantId', size: 255, required: true },
      { key: 'merchantName', size: 255, required: true },
      { key: 'orderId', size: 255, required: true },
      { key: 'transferProof', size: 2000, required: false },
      { key: 'notes', size: 1000, required: false },
      { key: 'status', size: 50, required: true },
      { key: 'createdAt', size: 50, required: true },
      { key: 'verifiedAt', size: 50, required: false },
    ];

    for (const attr of merchantAttrs) {
      try {
        await databases.createStringAttribute(
          DATABASE_ID,
          'merchantPayments',
          attr.key,
          attr.size,
          attr.required
        );
        console.log(`  ✅ ${attr.key}`);
        await sleep(1000);
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  ${attr.key} already exists`);
        } else {
          console.log(`  ❌ ${attr.key}: ${error.message}`);
        }
      }
    }

    // Add float attributes
    const merchantFloats = [
      { key: 'totalAmount', required: true },
      { key: 'commissionAmount', required: true },
      { key: 'platformFee', required: true },
    ];

    for (const attr of merchantFloats) {
      try {
        await databases.createFloatAttribute(
          DATABASE_ID,
          'merchantPayments',
          attr.key,
          attr.required
        );
        console.log(`  ✅ ${attr.key}`);
        await sleep(1000);
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  ${attr.key} already exists`);
        } else {
          console.log(`  ❌ ${attr.key}: ${error.message}`);
        }
      }
    }

    console.log('\n📝 Adding withdrawalRequests attributes...');
    
    const withdrawalAttrs = [
      { key: 'userId', size: 255, required: true },
      { key: 'userName', size: 255, required: true },
      { key: 'userType', size: 50, required: true },
      { key: 'method', size: 50, required: true },
      { key: 'accountDetails', size: 255, required: true },
      { key: 'status', size: 50, required: true },
      { key: 'createdAt', size: 50, required: true },
      { key: 'processedAt', size: 50, required: false },
      { key: 'rejectionReason', size: 500, required: false },
    ];

    for (const attr of withdrawalAttrs) {
      try {
        await databases.createStringAttribute(
          DATABASE_ID,
          'withdrawalRequests',
          attr.key,
          attr.size,
          attr.required
        );
        console.log(`  ✅ ${attr.key}`);
        await sleep(1000);
      } catch (error) {
        if (error.code === 409) {
          console.log(`  ⚠️  ${attr.key} already exists`);
        } else {
          console.log(`  ❌ ${attr.key}: ${error.message}`);
        }
      }
    }

    // Add float attribute for amount
    try {
      await databases.createFloatAttribute(
        DATABASE_ID,
        'withdrawalRequests',
        'amount',
        true
      );
      console.log(`  ✅ amount`);
    } catch (error) {
      if (error.code === 409) {
        console.log(`  ⚠️  amount already exists`);
      } else {
        console.log(`  ❌ amount: ${error.message}`);
      }
    }

    console.log('\n✅ All attributes fixed!\n');
    console.log('🎉 Financial system is ready to use!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAttributes();
