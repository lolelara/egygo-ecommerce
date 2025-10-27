/**
 * Add Missing Attributes for Indexes
 * إضافة الـ attributes الناقصة للـ indexes
 */

import * as sdk from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();

const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
  .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
  .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;

/**
 * تعريف الـ attributes المفقودة
 */
const missingAttributes = {
  // Products
  products: [
    { key: 'viewCount', type: 'integer', required: false, default: 0 },
    { key: 'purchaseCount', type: 'integer', required: false, default: 0 },
    { key: 'createdAt', type: 'datetime', required: false }
  ],
  
  // Orders
  orders: [
    { key: 'merchantId', type: 'string', size: 255, required: false },
    { key: 'paymentStatus', type: 'string', size: 50, required: false, default: 'pending' },
    { key: 'createdAt', type: 'datetime', required: false }
  ],
  
  // Affiliate Clicks
  affiliate_clicks: [
    { key: 'converted', type: 'boolean', required: false, default: false },
    { key: 'createdAt', type: 'datetime', required: false }
  ],
  
  // Affiliate Stats
  affiliate_stats: [
    { key: 'month', type: 'integer', required: false },
    { key: 'year', type: 'integer', required: false }
  ],
  
  // Reviews
  reviews: [
    { key: 'isVerified', type: 'boolean', required: false, default: false },
    { key: 'createdAt', type: 'datetime', required: false }
  ],
  
  // Notifications
  notifications: [
    { key: 'createdAt', type: 'datetime', required: false }
  ],
  
  // Withdrawal Requests
  withdrawal_requests: [
    { key: 'status', type: 'enum', elements: ['pending', 'approved', 'rejected', 'completed'], required: false, default: 'pending' },
    { key: 'createdAt', type: 'datetime', required: false }
  ]
};

/**
 * إنشاء attribute
 */
async function createAttribute(collectionId, attrConfig) {
  try {
    switch (attrConfig.type) {
      case 'string':
        await databases.createStringAttribute(
          DATABASE_ID,
          collectionId,
          attrConfig.key,
          attrConfig.size,
          attrConfig.required,
          attrConfig.default
        );
        break;
        
      case 'integer':
        await databases.createIntegerAttribute(
          DATABASE_ID,
          collectionId,
          attrConfig.key,
          attrConfig.required,
          undefined, // min
          undefined, // max
          attrConfig.default
        );
        break;
        
      case 'boolean':
        await databases.createBooleanAttribute(
          DATABASE_ID,
          collectionId,
          attrConfig.key,
          attrConfig.required,
          attrConfig.default
        );
        break;
        
      case 'datetime':
        await databases.createDatetimeAttribute(
          DATABASE_ID,
          collectionId,
          attrConfig.key,
          attrConfig.required
        );
        break;
        
      case 'enum':
        await databases.createEnumAttribute(
          DATABASE_ID,
          collectionId,
          attrConfig.key,
          attrConfig.elements,
          attrConfig.required,
          attrConfig.default
        );
        break;
    }
    
    console.log(`  ✅ Created: ${attrConfig.key} (${attrConfig.type})`);
    return true;
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ⚠️  Already exists: ${attrConfig.key}`);
    } else {
      console.error(`  ❌ Error creating ${attrConfig.key}:`, error.message);
    }
    return false;
  }
}

/**
 * إضافة جميع الـ attributes الناقصة
 */
async function addMissingAttributes() {
  console.log('🔧 Adding Missing Attributes...\n');
  
  let totalAdded = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  for (const [collectionId, attributes] of Object.entries(missingAttributes)) {
    console.log(`📦 Processing collection: ${collectionId}`);
    
    // التحقق من وجود الـ collection
    try {
      await databases.getCollection(DATABASE_ID, collectionId);
    } catch (error) {
      console.log(`  ⚠️  Collection not found: ${collectionId}\n`);
      continue;
    }
    
    // إضافة الـ attributes
    for (const attrConfig of attributes) {
      const success = await createAttribute(collectionId, attrConfig);
      
      if (success) {
        totalAdded++;
      } else if (error?.code === 409) {
        totalSkipped++;
      } else {
        totalErrors++;
      }
      
      // تأخير لتجنب rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('');
  }
  
  console.log('✨ Completed!\n');
  console.log('📊 Summary:');
  console.log(`  ✅ Added: ${totalAdded}`);
  console.log(`  ⚠️  Skipped (already exist): ${totalSkipped}`);
  console.log(`  ❌ Errors: ${totalErrors}\n`);
  
  if (totalAdded > 0) {
    console.log('⏳ Please wait a few moments for attributes to be ready...');
    console.log('   Then run: npm run optimize-indexes\n');
  }
}

/**
 * عرض معلومات
 */
function showInfo() {
  console.log(`
📚 Missing Attributes Info:

This script will add the following attributes:

📦 Products:
  - viewCount (integer) - عدد المشاهدات
  - purchaseCount (integer) - عدد المبيعات
  - createdAt (datetime) - تاريخ الإنشاء

📦 Orders:
  - merchantId (string) - معرف التاجر
  - paymentStatus (string) - حالة الدفع
  - createdAt (datetime) - تاريخ الإنشاء

📦 Affiliate Clicks:
  - converted (boolean) - تم التحويل؟
  - createdAt (datetime) - تاريخ النقرة

📦 Affiliate Stats:
  - month (integer) - الشهر
  - year (integer) - السنة

📦 Reviews:
  - isVerified (boolean) - مراجعة موثقة؟
  - createdAt (datetime) - تاريخ المراجعة

📦 Notifications:
  - createdAt (datetime) - تاريخ الإنشاء

📦 Withdrawal Requests:
  - status (enum) - الحالة
  - createdAt (datetime) - تاريخ الطلب

⚠️  Note: This will NOT affect existing data.
         All attributes are optional (required: false).

Continue? (Ctrl+C to cancel)
  `);
}

// Main execution
const command = process.argv[2];

if (command === 'info') {
  showInfo();
} else if (command === 'add') {
  addMissingAttributes();
} else {
  console.log(`
📚 Usage:
  node scripts/add-missing-attributes.js [command]

Commands:
  info  - Show what will be added
  add   - Add missing attributes

Examples:
  node scripts/add-missing-attributes.js info
  node scripts/add-missing-attributes.js add
  `);
}
