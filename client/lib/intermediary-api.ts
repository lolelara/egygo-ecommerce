/**
 * Product Scraper API
 * Extract product data from external URLs
 */

import { databases, storage, account } from './appwrite';
import { ID, Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;
const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_ID || 'product-images';

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
 * Extract product data from URL
 * This is a client-side scraper that uses CORS proxy or Open Graph tags
 */
export async function scrapeProductFromUrl(url: string): Promise<ScrapedProduct> {
  try {
    // For security and CORS reasons, we'll use a proxy or meta tags
    // In production, this should be a server-side API
    
    // Try to fetch Open Graph meta tags via CORS proxy
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    const html = data.contents;
    
    // Parse HTML to extract product data
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract Open Graph tags
    const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
    const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content');
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const ogPrice = doc.querySelector('meta[property="product:price:amount"]')?.getAttribute('content');
    
    // Try to extract from common e-commerce structures
    const title = ogTitle || 
                  doc.querySelector('h1')?.textContent?.trim() ||
                  doc.querySelector('.product-title')?.textContent?.trim() ||
                  doc.title;
    
    const description = ogDescription ||
                       doc.querySelector('.product-description')?.textContent?.trim() ||
                       doc.querySelector('[itemprop="description"]')?.textContent?.trim();
    
    const priceText = ogPrice ||
                     doc.querySelector('.price')?.textContent?.trim() ||
                     doc.querySelector('[itemprop="price"]')?.getAttribute('content');
    
    // Parse price (remove currency symbols and convert to number)
    const price = priceText ? parseFloat(priceText.replace(/[^\d.]/g, '')) : 0;
    
    // Extract images
    const images: string[] = [];
    if (ogImage) images.push(ogImage);
    
    // Try to find product images
    doc.querySelectorAll('img[src*="product"], img[class*="product"], img[data-zoom]').forEach((img) => {
      const src = img.getAttribute('src') || img.getAttribute('data-src');
      if (src && !images.includes(src)) {
        images.push(src.startsWith('http') ? src : new URL(src, url).href);
      }
    });
    
    return {
      name: title || 'منتج مستورد',
      price: price || 0,
      description: description || '',
      images: images.slice(0, 5), // Limit to 5 images
      category: 'imported'
    };
  } catch (error) {
    console.error('Error scraping product:', error);
    throw new Error('فشل استخراج بيانات المنتج من الرابط');
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
    
    // Create product in database
    const productData = {
      name: scrapedData.name,
      description: scrapedData.description || '',
      price: Math.round(finalPrice * 100) / 100, // Round to 2 decimal places
      originalPrice: scrapedData.price,
      priceMarkup: typeof priceMarkup === 'number' ? priceMarkup : priceMarkup.value,
      priceMarkupType: typeof priceMarkup === 'number' ? 'fixed' : priceMarkup.type,
      sourceUrl: url,
      images: uploadedImages.length > 0 ? uploadedImages : ['https://via.placeholder.com/400'],
      category: categoryId || scrapedData.category || 'imported',
      stock: 999, // Default high stock for imported products
      isActive: true,
      intermediaryId: user.$id,
      intermediaryName: user.name,
      $createdAt: new Date().toISOString()
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
