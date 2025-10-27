/**
 * Database Indexing Strategy for Appwrite
 * استراتيجية تحسين Indexes في Appwrite
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
 * تعريف Indexes لكل Collection
 */
const indexesConfig = {
  // Products Collection
  products: [
    {
      key: 'search_index',
      type: 'fulltext',
      attributes: ['name', 'description'],
      orders: ['asc', 'asc']
    },
    {
      key: 'category_price_index',
      type: 'key',
      attributes: ['category', 'price', 'isActive'],
      orders: ['asc', 'asc', 'desc']
    },
    {
      key: 'popularity_index',
      type: 'key',
      attributes: ['viewCount', 'purchaseCount'],
      orders: ['desc', 'desc']
    },
    {
      key: 'merchant_status_index',
      type: 'key',
      attributes: ['merchantId', 'status', 'createdAt'],
      orders: ['asc', 'asc', 'desc']
    },
    {
      key: 'featured_active_index',
      type: 'key',
      attributes: ['isFeatured', 'isActive', 'createdAt'],
      orders: ['desc', 'desc', 'desc']
    }
  ],
  
  // Orders Collection
  orders: [
    {
      key: 'user_status_index',
      type: 'key',
      attributes: ['userId', 'status', 'createdAt'],
      orders: ['asc', 'asc', 'desc']
    },
    {
      key: 'merchant_status_index',
      type: 'key',
      attributes: ['merchantId', 'status', 'createdAt'],
      orders: ['asc', 'asc', 'desc']
    },
    {
      key: 'date_range_index',
      type: 'key',
      attributes: ['createdAt', 'totalAmount'],
      orders: ['desc', 'desc']
    },
    {
      key: 'payment_status_index',
      type: 'key',
      attributes: ['paymentStatus', 'status'],
      orders: ['asc', 'asc']
    }
  ],
  
  // Affiliate Clicks Collection
  affiliate_clicks: [
    {
      key: 'affiliate_date_index',
      type: 'key',
      attributes: ['affiliateId', 'createdAt'],
      orders: ['asc', 'desc']
    },
    {
      key: 'product_affiliate_index',
      type: 'key',
      attributes: ['productId', 'affiliateId', 'createdAt'],
      orders: ['asc', 'asc', 'desc']
    },
    {
      key: 'conversion_index',
      type: 'key',
      attributes: ['converted', 'affiliateId'],
      orders: ['desc', 'asc']
    }
  ],
  
  // Affiliate Stats Collection
  affiliate_stats: [
    {
      key: 'affiliate_month_index',
      type: 'key',
      attributes: ['affiliateId', 'month', 'year'],
      orders: ['asc', 'asc', 'desc']
    },
    {
      key: 'earnings_index',
      type: 'key',
      attributes: ['totalEarnings', 'month'],
      orders: ['desc', 'desc']
    }
  ],
  
  // Reviews Collection
  reviews: [
    {
      key: 'product_rating_index',
      type: 'key',
      attributes: ['productId', 'rating', 'createdAt'],
      orders: ['asc', 'desc', 'desc']
    },
    {
      key: 'user_product_index',
      type: 'key',
      attributes: ['userId', 'productId'],
      orders: ['asc', 'asc']
    },
    {
      key: 'verified_rating_index',
      type: 'key',
      attributes: ['isVerified', 'rating'],
      orders: ['desc', 'desc']
    }
  ],
  
  // Notifications Collection
  notifications: [
    {
      key: 'user_read_index',
      type: 'key',
      attributes: ['userId', 'isRead', 'createdAt'],
      orders: ['asc', 'asc', 'desc']
    },
    {
      key: 'type_user_index',
      type: 'key',
      attributes: ['type', 'userId', 'createdAt'],
      orders: ['asc', 'asc', 'desc']
    }
  ],
  
  // Banners Collection
  banners: [
    {
      key: 'location_active_order',
      type: 'key',
      attributes: ['location', 'isActive', 'order'],
      orders: ['asc', 'desc', 'asc']
    }
  ],
  
  // Favorites Collection
  favorites: [
    {
      key: 'user_product_index',
      type: 'key',
      attributes: ['userId', 'productId'],
      orders: ['asc', 'asc']
    },
    {
      key: 'user_date_index',
      type: 'key',
      attributes: ['userId', 'createdAt'],
      orders: ['asc', 'desc']
    }
  ],
  
  // Withdrawal Requests Collection
  withdrawal_requests: [
    {
      key: 'affiliate_status_index',
      type: 'key',
      attributes: ['affiliateId', 'status', 'createdAt'],
      orders: ['asc', 'asc', 'desc']
    },
    {
      key: 'status_date_index',
      type: 'key',
      attributes: ['status', 'requestDate'],
      orders: ['asc', 'desc']
    }
  ]
};

/**
 * إنشاء أو تحديث Index
 */
async function createOrUpdateIndex(collectionId, indexConfig) {
  try {
    // محاولة إنشاء Index جديد
    await databases.createIndex(
      DATABASE_ID,
      collectionId,
      indexConfig.key,
      indexConfig.type,
      indexConfig.attributes,
      indexConfig.orders
    );
    console.log(`  ✅ Index created: ${indexConfig.key}`);
  } catch (error) {
    if (error.code === 409) {
      console.log(`  ⚠️  Index already exists: ${indexConfig.key}`);
      // يمكن حذفه وإعادة إنشائه إذا تغيرت التعريفات
      // await databases.deleteIndex(DATABASE_ID, collectionId, indexConfig.key);
      // await databases.createIndex(...);
    } else {
      console.error(`  ❌ Error creating index ${indexConfig.key}:`, error.message);
    }
  }
}

/**
 * تحسين جميع Indexes
 */
async function optimizeAllIndexes() {
  console.log('🚀 Starting Database Indexes Optimization...\n');
  
  for (const [collectionId, indexes] of Object.entries(indexesConfig)) {
    console.log(`📦 Processing collection: ${collectionId}`);
    
    // التحقق من وجود الـ collection
    try {
      await databases.getCollection(DATABASE_ID, collectionId);
    } catch (error) {
      console.log(`  ⚠️  Collection ${collectionId} not found, skipping...`);
      continue;
    }
    
    // إنشاء الـ indexes
    for (const indexConfig of indexes) {
      await createOrUpdateIndex(collectionId, indexConfig);
      // تأخير صغير لتجنب rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('');
  }
  
  console.log('✨ Optimization completed!\n');
}

/**
 * تحليل Indexes الحالية
 */
async function analyzeCurrentIndexes() {
  console.log('📊 Analyzing Current Indexes...\n');
  
  const report = {
    total: 0,
    byCollection: {},
    missing: [],
    extra: []
  };
  
  for (const [collectionId, expectedIndexes] of Object.entries(indexesConfig)) {
    try {
      const collection = await databases.getCollection(DATABASE_ID, collectionId);
      const currentIndexes = collection.indexes || [];
      
      report.byCollection[collectionId] = {
        current: currentIndexes.length,
        expected: expectedIndexes.length,
        indexes: currentIndexes.map(idx => idx.key)
      };
      
      report.total += currentIndexes.length;
      
      // إيجاد الـ indexes الناقصة
      const expectedKeys = expectedIndexes.map(idx => idx.key);
      const currentKeys = currentIndexes.map(idx => idx.key);
      
      const missing = expectedKeys.filter(key => !currentKeys.includes(key));
      if (missing.length > 0) {
        report.missing.push({ collection: collectionId, indexes: missing });
      }
      
      // إيجاد الـ indexes الزائدة
      const extra = currentKeys.filter(key => !expectedKeys.includes(key));
      if (extra.length > 0) {
        report.extra.push({ collection: collectionId, indexes: extra });
      }
      
    } catch (error) {
      console.log(`  ⚠️  Could not analyze ${collectionId}:`, error.message);
    }
  }
  
  console.log('📋 Report:');
  console.log(`  Total Indexes: ${report.total}`);
  console.log(`\n  By Collection:`);
  for (const [col, data] of Object.entries(report.byCollection)) {
    console.log(`    ${col}: ${data.current}/${data.expected}`);
  }
  
  if (report.missing.length > 0) {
    console.log(`\n  ⚠️  Missing Indexes:`);
    report.missing.forEach(item => {
      console.log(`    ${item.collection}: ${item.indexes.join(', ')}`);
    });
  }
  
  if (report.extra.length > 0) {
    console.log(`\n  ℹ️  Extra Indexes:`);
    report.extra.forEach(item => {
      console.log(`    ${item.collection}: ${item.indexes.join(', ')}`);
    });
  }
  
  console.log('');
}

/**
 * تنظيف Indexes القديمة
 */
async function cleanupOldIndexes() {
  console.log('🧹 Cleaning up old indexes...\n');
  
  for (const [collectionId] of Object.entries(indexesConfig)) {
    try {
      const collection = await databases.getCollection(DATABASE_ID, collectionId);
      const currentIndexes = collection.indexes || [];
      const expectedKeys = indexesConfig[collectionId].map(idx => idx.key);
      
      for (const index of currentIndexes) {
        if (!expectedKeys.includes(index.key)) {
          console.log(`  🗑️  Deleting old index: ${collectionId}.${index.key}`);
          // Uncomment to actually delete:
          // await databases.deleteIndex(DATABASE_ID, collectionId, index.key);
          // await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error(`  ❌ Error cleaning ${collectionId}:`, error.message);
    }
  }
  
  console.log('\n✨ Cleanup completed!\n');
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'optimize':
    optimizeAllIndexes();
    break;
  case 'analyze':
    analyzeCurrentIndexes();
    break;
  case 'cleanup':
    cleanupOldIndexes();
    break;
  default:
    console.log(`
📚 Usage:
  node scripts/optimize-appwrite-indexes.js [command]

Commands:
  optimize  - Create/update all indexes
  analyze   - Analyze current indexes
  cleanup   - Remove old indexes (commented out by default)

Examples:
  node scripts/optimize-appwrite-indexes.js optimize
  node scripts/optimize-appwrite-indexes.js analyze
    `);
}
