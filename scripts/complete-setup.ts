/**
 * Complete Appwrite Setup - All Collections
 * تشغيل: npm run setup:complete
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const collections = [
  'addresses',
  'products', 
  'categories',
  'orders',
  'cart',
  'reviews',
  'wishlist',
  'coupons',
  'notifications',
  'commissions',
  'withdrawals',
  'favorites',
  'product_views',
  'affiliate_activities',
  'affiliate_clicks',
  'affiliate_stats',
  'leaderboard',
];

console.log('🚀 بدء إعداد جميع Collections...\n');

async function main() {
  // Run existing scripts
  console.log('📦 تشغيل setup-appwrite-database...');
  await execAsync('tsx scripts/setup-appwrite-database.ts');
  
  console.log('\n📦 تشغيل setup-appwrite-collections...');
  await execAsync('tsx scripts/setup-appwrite-collections.ts');
  
  console.log('\n✅ تم الإعداد بنجاح!');
  console.log('\n📋 Collections المطلوبة:');
  collections.forEach(c => console.log(`   - ${c}`));
}

main().catch(console.error);
