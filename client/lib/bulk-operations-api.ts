/**
 * Bulk Operations API
 * Provides bulk actions for products, orders, and users
 */

import { databases } from './appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const PRODUCTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID;
const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID;

export interface BulkOperationResult {
  success: number;
  failed: number;
  total: number;
  errors: { id: string; error: string }[];
}

/**
 * Bulk update product prices
 */
export async function bulkUpdatePrices(
  productIds: string[],
  priceChange: number | { type: 'percentage' | 'fixed'; value: number }
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    total: productIds.length,
    errors: []
  };

  for (const productId of productIds) {
    try {
      // Get current product
      const product = await databases.getDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId
      );

      let newPrice: number;

      if (typeof priceChange === 'number') {
        // Fixed amount change
        newPrice = product.price + priceChange;
      } else if (priceChange.type === 'percentage') {
        // Percentage change
        newPrice = product.price * (1 + priceChange.value / 100);
      } else {
        // Fixed new price
        newPrice = priceChange.value;
      }

      // Update product
      await databases.updateDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId,
        { price: newPrice }
      );

      result.success++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        id: productId,
        error: error.message || 'Unknown error'
      });
    }
  }

  return result;
}

/**
 * Bulk update product status (active/inactive)
 */
export async function bulkUpdateProductStatus(
  productIds: string[],
  isActive: boolean
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    total: productIds.length,
    errors: []
  };

  for (const productId of productIds) {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId,
        { isActive }
      );

      result.success++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        id: productId,
        error: error.message || 'Unknown error'
      });
    }
  }

  return result;
}

/**
 * Bulk delete products
 */
export async function bulkDeleteProducts(
  productIds: string[]
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    total: productIds.length,
    errors: []
  };

  for (const productId of productIds) {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId
      );

      result.success++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        id: productId,
        error: error.message || 'Unknown error'
      });
    }
  }

  return result;
}

/**
 * Bulk update product category
 */
export async function bulkUpdateCategory(
  productIds: string[],
  categoryId: string
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    total: productIds.length,
    errors: []
  };

  for (const productId of productIds) {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId,
        { categoryId }
      );

      result.success++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        id: productId,
        error: error.message || 'Unknown error'
      });
    }
  }

  return result;
}

/**
 * Bulk update product stock
 */
export async function bulkUpdateStock(
  productIds: string[],
  stockChange: number | { type: 'add' | 'set'; value: number }
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    total: productIds.length,
    errors: []
  };

  for (const productId of productIds) {
    try {
      // Get current product
      const product = await databases.getDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId
      );

      let newStock: number;

      if (typeof stockChange === 'number') {
        // Add/subtract stock
        newStock = product.stock + stockChange;
      } else if (stockChange.type === 'add') {
        // Add stock
        newStock = product.stock + stockChange.value;
      } else {
        // Set exact stock
        newStock = stockChange.value;
      }

      // Ensure stock is not negative
      newStock = Math.max(0, newStock);

      // Update product
      await databases.updateDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        productId,
        { stock: newStock }
      );

      result.success++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        id: productId,
        error: error.message || 'Unknown error'
      });
    }
  }

  return result;
}

/**
 * Bulk update order status
 */
export async function bulkUpdateOrderStatus(
  orderIds: string[],
  status: string
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    total: orderIds.length,
    errors: []
  };

  for (const orderId of orderIds) {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        ORDERS_COLLECTION_ID,
        orderId,
        { status }
      );

      result.success++;
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        id: orderId,
        error: error.message || 'Unknown error'
      });
    }
  }

  return result;
}

/**
 * Bulk export products to CSV
 */
export async function exportProductsToCSV(productIds?: string[]): Promise<string> {
  try {
    let products;

    if (productIds && productIds.length > 0) {
      // Export specific products
      products = await Promise.all(
        productIds.map(id =>
          databases.getDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id)
        )
      );
    } else {
      // Export all products
      const response = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [Query.limit(1000)]
      );
      products = response.documents;
    }

    // Build CSV
    const headers = ['ID', 'Name', 'Price', 'Stock', 'Category', 'Status', 'Created'];
    const rows = products.map((p: any) => [
      p.$id,
      p.name,
      p.price,
      p.stock,
      p.category || '',
      p.isActive ? 'Active' : 'Inactive',
      new Date(p.$createdAt).toLocaleDateString('ar-EG')
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  } catch (error) {
    console.error('Error exporting products:', error);
    throw error;
  }
}

/**
 * Bulk import products from CSV
 */
export async function importProductsFromCSV(csvContent: string): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    total: 0,
    errors: []
  };

  try {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      result.total++;

      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const product: any = {};

        headers.forEach((header, index) => {
          product[header.toLowerCase()] = values[index];
        });

        // Create product
        await databases.createDocument(
          DATABASE_ID,
          PRODUCTS_COLLECTION_ID,
          'unique()',
          {
            name: product.name,
            price: parseFloat(product.price) || 0,
            stock: parseInt(product.stock) || 0,
            category: product.category || '',
            isActive: product.status === 'Active',
            description: product.description || '',
            merchantId: product.merchantid || ''
          }
        );

        result.success++;
      } catch (error: any) {
        result.failed++;
        result.errors.push({
          id: `Line ${i + 1}`,
          error: error.message || 'Unknown error'
        });
      }
    }
  } catch (error: any) {
    result.failed = result.total;
    result.errors.push({
      id: 'CSV Parsing',
      error: error.message || 'Failed to parse CSV'
    });
  }

  return result;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'products.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
