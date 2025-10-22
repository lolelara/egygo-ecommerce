/**
 * Cleanup Affiliate Stats
 * حذف الحقول الزائدة من affiliate_stats لحل مشكلة conversionRate
 */

import * as sdk from 'node-appwrite';

// Configuration
const config = {
  endpoint: 'https://fra.cloud.appwrite.io/v1',
  projectId: '68d8b9db00134c41e7c8',
  databaseId: '68de037e003bd03c4d45',
  apiKey: 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5',
};

const client = new sdk.Client();
const databases = new sdk.Databases(client);

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setKey(config.apiKey);

async function cleanupAffiliateStats() {
  try {
    console.log('🧹 Starting cleanup of affiliate_stats...\n');

    // Get all affiliate stats
    const response = await databases.listDocuments(
      config.databaseId,
      'affiliate_stats',
      [sdk.Query.limit(1000)]
    );

    console.log(`Found ${response.documents.length} affiliate stats documents\n`);

    let cleaned = 0;
    let errors = 0;

    for (const doc of response.documents) {
      try {
        console.log(`Processing ${doc.$id}...`);
        
        // Create a clean copy with only the fields we want
        const cleanData = {
          affiliateId: doc.affiliateId,
          totalSales: doc.totalSales || 0,
          todaySales: doc.todaySales || 0,
          weekSales: doc.weekSales || 0,
          monthSales: doc.monthSales || 0,
          currentStreak: doc.currentStreak || 0,
          level: doc.level || 1,
          points: doc.points || 0,
          totalEarnings: doc.totalEarnings || 0,
          totalClicks: doc.totalClicks || 0,
          totalOrders: doc.totalOrders || 0,
          pendingEarnings: doc.pendingEarnings || 0,
          thisMonthEarnings: doc.thisMonthEarnings || 0,
          lastSaleDate: doc.lastSaleDate || '',
        };

        // Delete the old document
        await databases.deleteDocument(
          config.databaseId,
          'affiliate_stats',
          doc.$id
        );
        
        console.log(`  ✅ Deleted old document`);

        // Create a new clean document with the same ID
        await databases.createDocument(
          config.databaseId,
          'affiliate_stats',
          doc.$id,
          cleanData
        );
        
        console.log(`  ✅ Created clean document`);
        cleaned++;

      } catch (error) {
        console.error(`  ❌ Error processing ${doc.$id}:`, error.message);
        errors++;
      }
    }

    console.log(`\n✅ Cleanup complete!`);
    console.log(`   - Cleaned: ${cleaned} documents`);
    console.log(`   - Errors: ${errors} documents`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run
cleanupAffiliateStats();
