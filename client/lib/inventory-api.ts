/**
 * Inventory Management API - Real Data from Appwrite
 */

import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = appwriteConfig.databaseId;
const PRODUCTS_COLLECTION = 'products';

export interface InventoryProduct {
  $id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  category: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
  merchantId: string;
  image?: string;
}

export interface InventoryStats {
  total: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
}

class InventoryAPI {
  /**
   * Get all products for a merchant
   */
  async getMerchantProducts(merchantId: string): Promise<InventoryProduct[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION,
        [
          Query.equal('merchantId', merchantId),
          Query.orderDesc('$updatedAt')
        ]
      );

      return response.documents.map((doc: any) => this.mapToInventoryProduct(doc));
    } catch (error) {
      console.error('Error fetching merchant products:', error);
      return [];
    }
  }

  /**
   * Update product stock
   */
  async updateStock(productId: string, newStock: number): Promise<boolean> {
    try {
      const status = this.getStockStatus(newStock);
      
      await databases.updateDocument(
        DATABASE_ID,
        PRODUCTS_COLLECTION,
        productId,
        {
          stock: newStock,
          status,
          lastUpdated: new Date().toISOString()
        }
      );

      return true;
    } catch (error) {
      console.error('Error updating stock:', error);
      return false;
    }
  }

  /**
   * Get inventory statistics
   */
  async getInventoryStats(merchantId: string): Promise<InventoryStats> {
    try {
      const products = await this.getMerchantProducts(merchantId);

      const stats: InventoryStats = {
        total: products.length,
        inStock: products.filter(p => p.status === 'in_stock').length,
        lowStock: products.filter(p => p.status === 'low_stock').length,
        outOfStock: products.filter(p => p.status === 'out_of_stock').length,
        totalValue: products.reduce((sum, p) => sum + (p.stock * p.price), 0)
      };

      return stats;
    } catch (error) {
      console.error('Error fetching inventory stats:', error);
      return {
        total: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0
      };
    }
  }

  /**
   * Search products
   */
  async searchProducts(
    merchantId: string,
    searchTerm: string
  ): Promise<InventoryProduct[]> {
    try {
      const allProducts = await this.getMerchantProducts(merchantId);
      
      if (!searchTerm) return allProducts;

      const term = searchTerm.toLowerCase();
      return allProducts.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term)
      );
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  /**
   * Filter products by status
   */
  async filterByStatus(
    merchantId: string,
    status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'all'
  ): Promise<InventoryProduct[]> {
    try {
      const allProducts = await this.getMerchantProducts(merchantId);
      
      if (status === 'all') return allProducts;

      return allProducts.filter(p => p.status === status);
    } catch (error) {
      console.error('Error filtering products:', error);
      return [];
    }
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(merchantId: string): Promise<InventoryProduct[]> {
    try {
      const products = await this.getMerchantProducts(merchantId);
      return products.filter(p => p.status === 'low_stock');
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  }

  /**
   * Export products to CSV format
   */
  exportToCSV(products: InventoryProduct[]): string {
    const headers = ['الاسم', 'SKU', 'المخزون', 'السعر', 'الفئة', 'الحالة'];
    const rows = products.map(p => [
      p.name,
      p.sku,
      p.stock.toString(),
      p.price.toString(),
      p.category,
      this.getStatusLabel(p.status)
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Bulk update stocks from CSV
   */
  async bulkUpdateFromCSV(
    merchantId: string,
    csvData: string
  ): Promise<{ success: number; failed: number }> {
    try {
      const lines = csvData.split('\n').slice(1); // Skip header
      let success = 0;
      let failed = 0;

      for (const line of lines) {
        const [name, sku, stock] = line.split(',');
        
        if (!sku || !stock) {
          failed++;
          continue;
        }

        // Find product by SKU
        const products = await this.getMerchantProducts(merchantId);
        const product = products.find(p => p.sku === sku.trim());

        if (product) {
          const updated = await this.updateStock(product.$id, parseInt(stock));
          if (updated) success++;
          else failed++;
        } else {
          failed++;
        }
      }

      return { success, failed };
    } catch (error) {
      console.error('Error bulk updating from CSV:', error);
      return { success: 0, failed: 0 };
    }
  }

  /**
   * Helper: Map document to InventoryProduct
   */
  private mapToInventoryProduct(doc: any): InventoryProduct {
    const stock = doc.stock || 0;
    const status = this.getStockStatus(stock);

    return {
      $id: doc.$id,
      name: doc.name || 'منتج بدون اسم',
      sku: doc.sku || doc.$id.substring(0, 8).toUpperCase(),
      stock,
      price: doc.price || 0,
      category: doc.category || 'غير مصنف',
      status,
      lastUpdated: doc.$updatedAt || doc.$createdAt,
      merchantId: doc.merchantId || '',
      image: doc.images?.[0] || doc.image || ''
    };
  }

  /**
   * Helper: Get stock status
   */
  private getStockStatus(stock: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
    if (stock === 0) return 'out_of_stock';
    if (stock < 10) return 'low_stock';
    return 'in_stock';
  }

  /**
   * Helper: Get status label in Arabic
   */
  private getStatusLabel(status: string): string {
    switch (status) {
      case 'in_stock': return 'متوفر';
      case 'low_stock': return 'مخزون منخفض';
      case 'out_of_stock': return 'نفذ المخزون';
      default: return 'غير معروف';
    }
  }
}

export const inventoryAPI = new InventoryAPI();
