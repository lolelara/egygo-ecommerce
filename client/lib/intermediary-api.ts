/**
 * Product Scraper API
 * Extract product data from external URLs
 */

import { databases, storage, account, appwriteConfig } from './appwrite';
import { ID, Query } from 'appwrite';
import { advancedScraper } from './advanced-scraper';

const DATABASE_ID = appwriteConfig.databaseId;
const PRODUCTS_COLLECTION_ID = appwriteConfig.collections.products;
const PRODUCT_DESCRIPTIONS_COLLECTION_ID = 'product_descriptions';
const STORAGE_BUCKET_ID = appwriteConfig.storageId;

// Cache for scraped data (5 minutes)
const scrapingCache = new Map<string, { data: ScrapedProduct; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Generate hash for URL (for indexing)
 */
function hashUrl(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export interface ScrapedProduct {
  name: string;
  price: number;
  description?: string;
  images?: string[];
  category?: string;
  specifications?: Record<string, any>;
}

export interface ProductImportResult {
  success: boolean;
  productId?: string;
  error?: string;
  scrapedData?: ScrapedProduct;
}

/**
 * Extract product data from URL with advanced scraping
 * Uses multiple strategies: JSON-LD, Meta Tags, Selectors, Site-Specific
 */
export async function scrapeProductFromUrl(url: string, useCache: boolean = true): Promise<ScrapedProduct> {
  try {
    console.log('🔍 Starting advanced scraping for:', url);
    
    // Use the advanced scraper
    const scrapedData = await advancedScraper.scrape(url, useCache);
    
    // Validate data
    if (!scrapedData.name || scrapedData.name === 'منتج مستورد') {
      throw new Error('لم يتم العثور على اسم المنتج');
    }
    
    console.log('✅ Successfully scraped:', scrapedData.name);
    
    return {
      name: scrapedData.name,
      price: scrapedData.price || 0,
      description: scrapedData.description || '',
      images: scrapedData.images || [],
      category: scrapedData.category || 'imported',
      specifications: {
        brand: scrapedData.brand,
        sku: scrapedData.sku,
        availability: scrapedData.availability,
        rating: scrapedData.rating,
        reviewCount: scrapedData.reviewCount
      }
    };
  } catch (error) {
    console.error('❌ Error scraping product:', error);
    throw new Error('فشل استخراج بيانات المنتج: ' + (error as Error).message);
  }
}

/**
 * Download and upload image to Appwrite storage
 */
async function downloadAndUploadImage(imageUrl: string): Promise<string> {
  try {
    // Download image
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create File object
    const filename = `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
    const file = new File([blob], filename, { type: blob.type });
    
    // Upload to Appwrite storage
    const uploadedFile = await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file
    );
    
    // Return file URL
    return storage.getFileView(STORAGE_BUCKET_ID, uploadedFile.$id).toString();
  } catch (error) {
    console.error('Error uploading image:', error);
    return ''; // Return empty string on error
  }
}

/**
 * Import product from URL and save to database
 */
export async function importProductFromUrl(
  url: string,
  priceMarkup: number | { type: 'percentage' | 'fixed'; value: number },
  categoryId?: string
): Promise<ProductImportResult> {
  try {
    // Get current user (intermediary)
    const user = await account.get();
    
    // Scrape product data
    const scrapedData = await scrapeProductFromUrl(url);
    
    // Calculate final price with markup
    let finalPrice: number;
    if (typeof priceMarkup === 'number') {
      // Fixed amount
      finalPrice = scrapedData.price + priceMarkup;
    } else if (priceMarkup.type === 'percentage') {
      // Percentage markup
      finalPrice = scrapedData.price * (1 + priceMarkup.value / 100);
    } else {
      // Fixed markup
      finalPrice = scrapedData.price + priceMarkup.value;
    }
    
    // Upload images to storage
    const uploadedImages: string[] = [];
    if (scrapedData.images && scrapedData.images.length > 0) {
      for (const imageUrl of scrapedData.images) {
        try {
          const uploadedUrl = await downloadAndUploadImage(imageUrl);
          if (uploadedUrl) uploadedImages.push(uploadedUrl);
        } catch (error) {
          console.error('Error uploading image:', imageUrl, error);
        }
      }
    }
    
    // Get default category if not provided
    let finalCategoryId = categoryId;
    if (!finalCategoryId) {
      try {
        // Try to find "Imported Products" category
        const categoriesResponse = await databases.listDocuments(
          DATABASE_ID,
          appwriteConfig.collections.categories,
          [Query.equal('name', 'منتجات مستوردة'), Query.limit(1)]
        );
        
        if (categoriesResponse.documents.length > 0) {
          finalCategoryId = categoriesResponse.documents[0].$id;
        } else {
          // Create default category if it doesn't exist
          const newCategory = await databases.createDocument(
            DATABASE_ID,
            appwriteConfig.collections.categories,
            ID.unique(),
            {
              name: 'منتجات مستوردة',
              slug: 'imported-products',
              description: 'منتجات تم استيرادها من مواقع أخرى',
              isActive: true
            }
          );
          finalCategoryId = newCategory.$id;
        }
      } catch (error) {
        console.error('Error getting/creating category:', error);
        throw new Error('فشل في تحديد التصنيف. يرجى المحاولة مرة أخرى.');
      }
    }
    
    // Create product in database
    const productData = {
      name: scrapedData.name,
      description: scrapedData.description || '',
      price: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
      originalPrice: scrapedData.price,
      priceMarkup: typeof priceMarkup === 'number' ? priceMarkup : priceMarkup.value,
      priceMarkupType: typeof priceMarkup === 'number' ? 'fixed' : priceMarkup.type,
      sourceUrl: url,
      sourceUrlHash: hashUrl(url), // Add hash for faster lookups
      images: uploadedImages.length > 0 ? uploadedImages : ['https://via.placeholder.com/400'],
      categoryId: finalCategoryId, // Use categoryId instead of category
      stock: 999, // Default high stock for imported products
      isActive: true,
      merchantId: user.$id, // Required field
      merchantName: user.name,
      intermediaryId: user.$id,
      intermediaryName: user.name
    };
    
    const product = await databases.createDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      ID.unique(),
      productData
    );
    
    return {
      success: true,
      productId: product.$id,
      scrapedData
    };
  } catch (error) {
    console.error('Error importing product:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'حدث خطأ أثناء استيراد المنتج'
    };
  }
}

/**
 * Bulk import products from multiple URLs
 */
export async function bulkImportProducts(
  urls: string[],
  defaultMarkup: number | { type: 'percentage' | 'fixed'; value: number },
  categoryId?: string
): Promise<{
  success: number;
  failed: number;
  results: ProductImportResult[];
}> {
  const results: ProductImportResult[] = [];
  let successCount = 0;
  let failedCount = 0;
  
  for (const url of urls) {
    try {
      const result = await importProductFromUrl(url, defaultMarkup, categoryId);
      results.push(result);
      
      if (result.success) {
        successCount++;
      } else {
        failedCount++;
      }
    } catch (error) {
      results.push({
        success: false,
        error: `فشل استيراد ${url}: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      });
      failedCount++;
    }
  }
  
  return {
    success: successCount,
    failed: failedCount,
    results
  };
}

/**
 * Get all products imported by an intermediary
 */
export async function getIntermediaryProducts(intermediaryId: string) {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal('intermediaryId', intermediaryId),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]
    );
    
    return response.documents;
  } catch (error) {
    console.error('Error fetching intermediary products:', error);
    throw error;
  }
}

/**
 * Update product price with new markup
 */
export async function updateProductMarkup(
  productId: string,
  newMarkup: number | { type: 'percentage' | 'fixed'; value: number }
) {
  try {
    // Get product
    const product = await databases.getDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId
    );
    
    const originalPrice = product.originalPrice || product.price;
    
    // Calculate new price
    let newPrice: number;
    if (typeof newMarkup === 'number') {
      newPrice = originalPrice + newMarkup;
    } else if (newMarkup.type === 'percentage') {
      newPrice = originalPrice * (1 + newMarkup.value / 100);
    } else {
      newPrice = originalPrice + newMarkup.value;
    }
    
    // Update product
    await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      {
        price: Math.round(newPrice * 100) / 100,
        priceMarkup: typeof newMarkup === 'number' ? newMarkup : newMarkup.value,
        priceMarkupType: typeof newMarkup === 'number' ? 'fixed' : newMarkup.type
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating product markup:', error);
    throw error;
  }
}

/**
 * Update product custom price (override calculated price)
 */
export async function updateProductPrice(
  productId: string,
  newPrice: number
) {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      {
        price: Math.round(newPrice * 100) / 100,
        priceOverride: Math.round(newPrice * 100) / 100
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating product price:', error);
    throw error;
  }
}

/**
 * Update product custom description (using separate collection)
 */
export async function updateProductDescription(
  productId: string,
  customDescription: string
) {
  try {
    const product = await databases.getDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId
    );
    
    // Check if description document exists
    let descriptionDoc;
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PRODUCT_DESCRIPTIONS_COLLECTION_ID,
        [Query.equal('productId', productId), Query.limit(1)]
      );
      descriptionDoc = response.documents[0];
    } catch (error) {
      descriptionDoc = null;
    }
    
    if (descriptionDoc) {
      // Update existing description
      await databases.updateDocument(
        DATABASE_ID,
        PRODUCT_DESCRIPTIONS_COLLECTION_ID,
        descriptionDoc.$id,
        {
          customDescription: customDescription
        }
      );
    } else {
      // Create new description document
      await databases.createDocument(
        DATABASE_ID,
        PRODUCT_DESCRIPTIONS_COLLECTION_ID,
        ID.unique(),
        {
          productId: productId,
          originalDescription: product.description || '',
          customDescription: customDescription,
          intermediaryId: product.intermediaryId
        }
      );
    }
    
    // Update product description field
    await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      {
        description: customDescription
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating product description:', error);
    throw error;
  }
}

/**
 * Restore original description (from separate collection)
 */
export async function restoreOriginalDescription(productId: string) {
  try {
    // Get description document
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCT_DESCRIPTIONS_COLLECTION_ID,
      [Query.equal('productId', productId), Query.limit(1)]
    );
    
    if (response.documents.length === 0) {
      throw new Error('لا يوجد وصف أصلي محفوظ');
    }
    
    const descriptionDoc = response.documents[0];
    const originalDescription = descriptionDoc.originalDescription;
    
    if (!originalDescription) {
      throw new Error('لا يوجد وصف أصلي محفوظ');
    }
    
    // Restore original description in product
    await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      {
        description: originalDescription
      }
    );
    
    // Clear custom description
    await databases.updateDocument(
      DATABASE_ID,
      PRODUCT_DESCRIPTIONS_COLLECTION_ID,
      descriptionDoc.$id,
      {
        customDescription: null
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error restoring original description:', error);
    throw error;
  }
}

/**
 * Sync product data from source URL
 */
export async function syncProductFromSource(productId: string) {
  try {
    const product = await databases.getDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId
    );
    
    if (!product.sourceUrl) {
      throw new Error('لا يوجد رابط مصدر للمنتج');
    }
    
    // Scrape fresh data from source
    const scrapedData = await scrapeProductFromUrl(product.sourceUrl);
    
    // Prepare update data
    const updateData: any = {
      lastSyncedAt: new Date().toISOString()
    };
    
    // Update original price if changed
    if (scrapedData.price && scrapedData.price !== product.originalPrice) {
      updateData.originalPrice = scrapedData.price;
      
      // Recalculate final price based on markup (if no price override)
      if (!product.priceOverride) {
        if (product.priceMarkupType === 'percentage') {
          updateData.price = scrapedData.price * (1 + (product.priceMarkup || 0) / 100);
        } else {
          updateData.price = scrapedData.price + (product.priceMarkup || 0);
        }
        updateData.price = Math.round(updateData.price * 100) / 100;
      }
    }
    
    // Update original description if no custom description
    if (scrapedData.description && !product.customDescription) {
      updateData.originalDescription = scrapedData.description;
      updateData.description = scrapedData.description;
    } else if (scrapedData.description) {
      // Just update originalDescription, keep custom
      updateData.originalDescription = scrapedData.description;
    }
    
    // Update name if changed significantly
    if (scrapedData.name && scrapedData.name !== product.name) {
      // Only update if the product doesn't have a custom name
      // We can check if name was modified by comparing with a stored original name
      updateData.name = scrapedData.name;
    }
    
    await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      updateData
    );
    
    return { 
      success: true, 
      changes: {
        priceChanged: !!updateData.originalPrice,
        descriptionUpdated: !!updateData.originalDescription,
        nameUpdated: !!updateData.name
      }
    };
  } catch (error) {
    console.error('Error syncing product:', error);
    throw error;
  }
}

/**
 * Enable/disable auto-sync for a product
 */
export async function toggleProductAutoSync(
  productId: string,
  enabled: boolean,
  intervalMinutes: number = 10
) {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      productId,
      {
        autoSyncEnabled: enabled,
        syncIntervalMinutes: intervalMinutes
      }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling auto-sync:', error);
    throw error;
  }
}

/**
 * Get products that need syncing
 */
export async function getProductsNeedingSync(intermediaryId?: string) {
  try {
    const now = new Date();
    const queries = [
      Query.equal('autoSyncEnabled', true),
      Query.isNotNull('sourceUrl'),
      Query.limit(100)
    ];
    
    if (intermediaryId) {
      queries.push(Query.equal('intermediaryId', intermediaryId));
    }
    
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      queries
    );
    
    // Filter products that need syncing based on interval
    const productsNeedingSync = response.documents.filter(product => {
      if (!product.lastSyncedAt) return true; // Never synced
      
      const lastSync = new Date(product.lastSyncedAt);
      const intervalMs = (product.syncIntervalMinutes || 10) * 60 * 1000;
      const nextSync = new Date(lastSync.getTime() + intervalMs);
      
      return now >= nextSync;
    });
    
    return productsNeedingSync;
  } catch (error) {
    console.error('Error getting products needing sync:', error);
    throw error;
  }
}

/**
 * Bulk sync all products for an intermediary
 */
export async function bulkSyncProducts(intermediaryId: string) {
  try {
    const products = await getProductsNeedingSync(intermediaryId);
    
    const results = {
      total: products.length,
      synced: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    for (const product of products) {
      try {
        await syncProductFromSource(product.$id);
        results.synced++;
      } catch (error) {
        results.failed++;
        results.errors.push(`${product.name}: ${(error as Error).message}`);
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error bulk syncing products:', error);
    throw error;
  }
}

/**
 * Bulk update prices for multiple products
 */
export async function bulkUpdatePrices(
  productIds: string[],
  priceUpdate: { type: 'percentage' | 'fixed'; value: number } | number
) {
  const results = {
    total: productIds.length,
    updated: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const productId of productIds) {
    try {
      if (typeof priceUpdate === 'number') {
        await updateProductPrice(productId, priceUpdate);
      } else {
        await updateProductMarkup(productId, priceUpdate);
      }
      results.updated++;
    } catch (error) {
      results.failed++;
      results.errors.push(`${productId}: ${(error as Error).message}`);
    }
  }

  return results;
}

/**
 * Bulk update descriptions for multiple products
 */
export async function bulkUpdateDescriptions(
  updates: Array<{ productId: string; description: string }>
) {
  const results = {
    total: updates.length,
    updated: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const update of updates) {
    try {
      await updateProductDescription(update.productId, update.description);
      results.updated++;
    } catch (error) {
      results.failed++;
      results.errors.push(`${update.productId}: ${(error as Error).message}`);
    }
  }

  return results;
}

/**
 * Bulk delete products
 */
export async function bulkDeleteProducts(productIds: string[]) {
  const results = {
    total: productIds.length,
    deleted: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const productId of productIds) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId
      );
      results.deleted++;
    } catch (error) {
      results.failed++;
      results.errors.push(`${productId}: ${(error as Error).message}`);
    }
  }

  return results;
}

/**
 * Bulk toggle auto-sync for multiple products
 */
export async function bulkToggleAutoSync(
  productIds: string[],
  enabled: boolean,
  intervalMinutes: number = 10
) {
  const results = {
    total: productIds.length,
    updated: 0,
    failed: 0,
    errors: [] as string[]
  };

  for (const productId of productIds) {
    try {
      await toggleProductAutoSync(productId, enabled, intervalMinutes);
      results.updated++;
    } catch (error) {
      results.failed++;
      results.errors.push(`${productId}: ${(error as Error).message}`);
    }
  }

  return results;
}
