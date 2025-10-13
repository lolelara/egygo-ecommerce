/**
 * Auto-Sync Worker for Intermediary Products
 * Automatically syncs products from their source URLs
 */

import { getProductsNeedingSync, syncProductFromSource } from './intermediary-api';

export class IntermediaryAutoSyncWorker {
  private intervalId: number | null = null;
  private isRunning = false;
  private intermediaryId: string;
  private checkIntervalMinutes: number;
  private onSyncComplete?: (results: SyncResults) => void;
  private onError?: (error: Error) => void;

  constructor(
    intermediaryId: string,
    checkIntervalMinutes: number = 5,
    callbacks?: {
      onSyncComplete?: (results: SyncResults) => void;
      onError?: (error: Error) => void;
    }
  ) {
    this.intermediaryId = intermediaryId;
    this.checkIntervalMinutes = checkIntervalMinutes;
    this.onSyncComplete = callbacks?.onSyncComplete;
    this.onError = callbacks?.onError;
  }

  /**
   * Start the auto-sync worker
   */
  start() {
    if (this.isRunning) {
      console.log('⚠️  Auto-sync worker is already running');
      return;
    }

    console.log(`🚀 Starting auto-sync worker (checking every ${this.checkIntervalMinutes} minutes)`);
    this.isRunning = true;

    // Run immediately
    this.syncProducts();

    // Then run at intervals
    this.intervalId = window.setInterval(
      () => this.syncProducts(),
      this.checkIntervalMinutes * 60 * 1000
    );
  }

  /**
   * Stop the auto-sync worker
   */
  stop() {
    if (!this.isRunning) {
      console.log('⚠️  Auto-sync worker is not running');
      return;
    }

    console.log('🛑 Stopping auto-sync worker');
    this.isRunning = false;

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Check if worker is running
   */
  isActive(): boolean {
    return this.isRunning;
  }

  /**
   * Sync products that need syncing
   */
  private async syncProducts() {
    try {
      console.log('🔄 Checking for products that need syncing...');

      const products = await getProductsNeedingSync(this.intermediaryId);

      if (products.length === 0) {
        console.log('✅ No products need syncing');
        return;
      }

      console.log(`📦 Found ${products.length} products to sync`);

      const results: SyncResults = {
        total: products.length,
        synced: 0,
        failed: 0,
        errors: [],
        syncedProducts: []
      };

      for (const product of products) {
        try {
          console.log(`  🔄 Syncing: ${product.name}`);
          const syncResult = await syncProductFromSource(product.$id);
          
          results.synced++;
          results.syncedProducts.push({
            productId: product.$id,
            productName: product.name,
            changes: syncResult.changes
          });

          console.log(`  ✅ Synced: ${product.name}`);
        } catch (error) {
          results.failed++;
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          results.errors.push(`${product.name}: ${errorMessage}`);
          console.error(`  ❌ Failed to sync ${product.name}:`, errorMessage);
        }

        // Small delay between syncs to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`✅ Sync complete: ${results.synced} synced, ${results.failed} failed`);

      // Call callback if provided
      if (this.onSyncComplete) {
        this.onSyncComplete(results);
      }
    } catch (error) {
      console.error('❌ Error in auto-sync worker:', error);
      if (this.onError && error instanceof Error) {
        this.onError(error);
      }
    }
  }

  /**
   * Manually trigger a sync
   */
  async triggerSync(): Promise<SyncResults> {
    console.log('🔄 Manually triggering sync...');
    
    const products = await getProductsNeedingSync(this.intermediaryId);
    
    const results: SyncResults = {
      total: products.length,
      synced: 0,
      failed: 0,
      errors: [],
      syncedProducts: []
    };

    for (const product of products) {
      try {
        const syncResult = await syncProductFromSource(product.$id);
        results.synced++;
        results.syncedProducts.push({
          productId: product.$id,
          productName: product.name,
          changes: syncResult.changes
        });
      } catch (error) {
        results.failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.errors.push(`${product.name}: ${errorMessage}`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
}

export interface SyncResults {
  total: number;
  synced: number;
  failed: number;
  errors: string[];
  syncedProducts: Array<{
    productId: string;
    productName: string;
    changes: {
      priceChanged: boolean;
      descriptionUpdated: boolean;
      nameUpdated: boolean;
    };
  }>;
}

/**
 * Create and start a global auto-sync worker
 */
let globalWorker: IntermediaryAutoSyncWorker | null = null;

export function startGlobalAutoSync(
  intermediaryId: string,
  checkIntervalMinutes: number = 5,
  callbacks?: {
    onSyncComplete?: (results: SyncResults) => void;
    onError?: (error: Error) => void;
  }
) {
  if (globalWorker) {
    console.log('⚠️  Global auto-sync worker already exists, stopping old one');
    globalWorker.stop();
  }

  globalWorker = new IntermediaryAutoSyncWorker(
    intermediaryId,
    checkIntervalMinutes,
    callbacks
  );
  globalWorker.start();

  return globalWorker;
}

export function stopGlobalAutoSync() {
  if (globalWorker) {
    globalWorker.stop();
    globalWorker = null;
  }
}

export function getGlobalAutoSyncWorker(): IntermediaryAutoSyncWorker | null {
  return globalWorker;
}
