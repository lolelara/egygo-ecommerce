/**
 * Intermediary Analytics API
 * Track and analyze intermediary performance
 */

import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = appwriteConfig.databaseId;
const PRODUCTS_COLLECTION_ID = appwriteConfig.collections.products;
const ORDERS_COLLECTION_ID = appwriteConfig.collections.orders;

export interface IntermediaryAnalytics {
  totalProducts: number;
  activeProducts: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
  }>;
  profitMargins: {
    totalCost: number;
    totalRevenue: number;
    totalProfit: number;
    averageMargin: number;
  };
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
}

/**
 * Get comprehensive analytics for an intermediary
 */
export async function getIntermediaryAnalytics(
  intermediaryId: string,
  startDate?: Date,
  endDate?: Date
): Promise<IntermediaryAnalytics> {
  try {
    // Get all products
    const productsResponse = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal('intermediaryId', intermediaryId),
        Query.limit(1000)
      ]
    );

    const products = productsResponse.documents;
    const productIds = products.map(p => p.$id);

    // Get orders for these products
    const ordersQueries = [
      Query.limit(1000),
      Query.orderDesc('$createdAt')
    ];

    if (startDate) {
      ordersQueries.push(Query.greaterThanEqual('$createdAt', startDate.toISOString()));
    }
    if (endDate) {
      ordersQueries.push(Query.lessThanEqual('$createdAt', endDate.toISOString()));
    }

    const ordersResponse = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      ordersQueries
    );

    // Filter orders that contain intermediary products
    const relevantOrders = ordersResponse.documents.filter((order: any) => {
      if (!order.items || !Array.isArray(order.items)) return false;
      return order.items.some((item: any) => productIds.includes(item.productId));
    });

    // Calculate metrics
    const totalProducts = products.length;
    const activeProducts = products.filter((p: any) => p.isActive).length;

    let totalRevenue = 0;
    let totalCost = 0;
    const productSales = new Map<string, { name: string; sales: number; revenue: number }>();
    const monthlyRevenue = new Map<string, { revenue: number; orders: number }>();

    relevantOrders.forEach((order: any) => {
      if (!order.items) return;

      order.items.forEach((item: any) => {
        if (!productIds.includes(item.productId)) return;

        const product = products.find((p: any) => p.$id === item.productId);
        if (!product) return;

        const itemRevenue = (item.price || 0) * (item.quantity || 0);
        const itemCost = (product.originalPrice || product.price) * (item.quantity || 0);

        totalRevenue += itemRevenue;
        totalCost += itemCost;

        // Track product sales
        if (!productSales.has(item.productId)) {
          productSales.set(item.productId, {
            name: product.name,
            sales: 0,
            revenue: 0
          });
        }
        const productStat = productSales.get(item.productId)!;
        productStat.sales += item.quantity || 0;
        productStat.revenue += itemRevenue;

        // Track monthly revenue
        const orderDate = new Date(order.$createdAt);
        const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyRevenue.has(monthKey)) {
          monthlyRevenue.set(monthKey, { revenue: 0, orders: 0 });
        }
        const monthStat = monthlyRevenue.get(monthKey)!;
        monthStat.revenue += itemRevenue;
        monthStat.orders += 1;
      });
    });

    // Calculate top products
    const topProducts = Array.from(productSales.entries())
      .map(([productId, stats]) => ({
        productId,
        productName: stats.name,
        sales: stats.sales,
        revenue: stats.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Calculate profit margins
    const totalProfit = totalRevenue - totalCost;
    const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    // Format monthly revenue
    const revenueByMonth = Array.from(monthlyRevenue.entries())
      .map(([month, stats]) => ({
        month,
        revenue: stats.revenue,
        orders: stats.orders
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalProducts,
      activeProducts,
      totalRevenue,
      totalOrders: relevantOrders.length,
      averageOrderValue: relevantOrders.length > 0 ? totalRevenue / relevantOrders.length : 0,
      topProducts,
      profitMargins: {
        totalCost,
        totalRevenue,
        totalProfit,
        averageMargin
      },
      revenueByMonth
    };
  } catch (error) {
    console.error('Error getting intermediary analytics:', error);
    throw error;
  }
}

/**
 * Get price comparison analytics
 */
export async function getPriceComparisonAnalytics(intermediaryId: string) {
  try {
    const productsResponse = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal('intermediaryId', intermediaryId),
        Query.isNotNull('originalPrice'),
        Query.limit(1000)
      ]
    );

    const products = productsResponse.documents;

    const priceAnalysis = products.map((product: any) => {
      const originalPrice = product.originalPrice || 0;
      const currentPrice = product.price || 0;
      const markup = currentPrice - originalPrice;
      const markupPercentage = originalPrice > 0 ? (markup / originalPrice) * 100 : 0;

      return {
        productId: product.$id,
        productName: product.name,
        originalPrice,
        currentPrice,
        markup,
        markupPercentage,
        markupType: product.priceMarkupType || 'unknown'
      };
    });

    // Calculate average markup
    const totalMarkup = priceAnalysis.reduce((sum, p) => sum + p.markupPercentage, 0);
    const averageMarkup = priceAnalysis.length > 0 ? totalMarkup / priceAnalysis.length : 0;

    // Find products with highest/lowest markup
    const sortedByMarkup = [...priceAnalysis].sort((a, b) => b.markupPercentage - a.markupPercentage);

    return {
      averageMarkup,
      highestMarkup: sortedByMarkup[0],
      lowestMarkup: sortedByMarkup[sortedByMarkup.length - 1],
      allProducts: priceAnalysis
    };
  } catch (error) {
    console.error('Error getting price comparison analytics:', error);
    throw error;
  }
}

/**
 * Get sync status analytics
 */
export async function getSyncStatusAnalytics(intermediaryId: string) {
  try {
    const productsResponse = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [
        Query.equal('intermediaryId', intermediaryId),
        Query.limit(1000)
      ]
    );

    const products = productsResponse.documents;
    const now = new Date();

    const syncStats = {
      totalProducts: products.length,
      autoSyncEnabled: 0,
      autoSyncDisabled: 0,
      neverSynced: 0,
      syncedToday: 0,
      syncedThisWeek: 0,
      syncedThisMonth: 0,
      needsSync: 0
    };

    products.forEach((product: any) => {
      if (product.autoSyncEnabled) {
        syncStats.autoSyncEnabled++;
      } else {
        syncStats.autoSyncDisabled++;
      }

      if (!product.lastSyncedAt) {
        syncStats.neverSynced++;
      } else {
        const lastSync = new Date(product.lastSyncedAt);
        const daysSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceSync < 1) syncStats.syncedToday++;
        if (daysSinceSync < 7) syncStats.syncedThisWeek++;
        if (daysSinceSync < 30) syncStats.syncedThisMonth++;

        // Check if needs sync
        const intervalMinutes = product.syncIntervalMinutes || 10;
        const minutesSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60);
        if (product.autoSyncEnabled && minutesSinceSync >= intervalMinutes) {
          syncStats.needsSync++;
        }
      }
    });

    return syncStats;
  } catch (error) {
    console.error('Error getting sync status analytics:', error);
    throw error;
  }
}
