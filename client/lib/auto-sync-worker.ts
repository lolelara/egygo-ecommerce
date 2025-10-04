/**
 * Auto-Sync Background Worker
 * Runs every 10 minutes to sync products with auto-sync enabled
 */

import { databases } from './appwrite';
import { Query } from 'appwrite';
import { syncProductFromSource, getProductsNeedingSync } from './intermediary-api';

const SYNC_INTERVAL = 10 * 60 * 1000; // 10 minutes
let syncTimer: NodeJS.Timeout | null = null;
let isRunning = false;

/**
 * Start the auto-sync worker
 */
export function startAutoSyncWorker() {
  if (isRunning) {
    console.log('Auto-sync worker already running');
    return;
  }

  console.log('Starting auto-sync worker...');
  isRunning = true;

  // Run immediately on start
  runSync();

  // Then run every 10 minutes
  syncTimer = setInterval(runSync, SYNC_INTERVAL);
}

/**
 * Stop the auto-sync worker
 */
export function stopAutoSyncWorker() {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
  isRunning = false;
  console.log('Auto-sync worker stopped');
}

/**
 * Check if worker is running
 */
export function isAutoSyncRunning() {
  return isRunning;
}

/**
 * Run sync operation
 */
async function runSync() {
  try {
    console.log('[Auto-Sync] Checking for products needing sync...');
    
    const products = await getProductsNeedingSync();
    
    if (products.length === 0) {
      console.log('[Auto-Sync] No products need syncing');
      return;
    }

    console.log(`[Auto-Sync] Found ${products.length} products to sync`);

    let synced = 0;
    let failed = 0;

    for (const product of products) {
      try {
        await syncProductFromSource(product.$id);
        synced++;
        console.log(`[Auto-Sync] ✅ Synced: ${product.name}`);
      } catch (error) {
        failed++;
        console.error(`[Auto-Sync] ❌ Failed to sync ${product.name}:`, error);
      }

      // Small delay between syncs to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`[Auto-Sync] Completed: ${synced} synced, ${failed} failed`);
  } catch (error) {
    console.error('[Auto-Sync] Error running sync:', error);
  }
}

/**
 * Manually trigger sync (useful for testing)
 */
export async function manualSync() {
  await runSync();
}
