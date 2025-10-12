/**
 * Analytics API for Admin Dashboard
 * Provides comprehensive analytics data for sales, orders, products, and users
 */

import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

const DATABASE_ID = appwriteConfig.databaseId;
const ORDERS_COLLECTION_ID = appwriteConfig.collections.orders;
const PRODUCTS_COLLECTION_ID = appwriteConfig.collections.products;
const USERS_COLLECTION_ID = appwriteConfig.collections.users;
const ORDER_ITEMS_COLLECTION_ID = appwriteConfig.collections.orderItems;

export interface DailySalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface OrderStatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface UserGrowthData {
  date: string;
  totalUsers: number;
  newUsers: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueGrowth: number;
  ordersGrowth: number;
  avgOrderValue: number;
}

/**
 * Get daily sales data for a date range
 */
export async function getDailySales(days: number = 30): Promise<DailySalesData[]> {
  try {
    const endDate = new Date();
    const startDate = subDays(endDate, days);

    // Get all orders in the date range
    const ordersResponse = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [
        Query.greaterThanEqual('$createdAt', startDate.toISOString()),
        Query.lessThanEqual('$createdAt', endDate.toISOString()),
        Query.limit(1000)
      ]
    );

    // Group by date
    const dailyData = new Map<string, { sales: number; orders: number; revenue: number }>();

    ordersResponse.documents.forEach((order: any) => {
      const date = format(new Date(order.$createdAt), 'yyyy-MM-dd');
      const current = dailyData.get(date) || { sales: 0, orders: 0, revenue: 0 };

      current.orders += 1;
      current.revenue += order.totalAmount || 0;
      current.sales += order.totalAmount || 0;

      dailyData.set(date, current);
    });

    // Fill in missing dates with zero values
    const result: DailySalesData[] = [];
    for (let i = 0; i < days; i++) {
      const date = format(subDays(endDate, days - i - 1), 'yyyy-MM-dd');
      const data = dailyData.get(date) || { sales: 0, orders: 0, revenue: 0 };
      result.push({ date, ...data });
    }

    return result;
  } catch (error) {
    console.error('Error fetching daily sales:', error);
    throw error;
  }
}

/**
 * Get product performance data
 */
export async function getProductPerformance(limit: number = 10): Promise<ProductPerformance[]> {
  try {
    // Get all order items
    const orderItemsResponse = await databases.listDocuments(
      DATABASE_ID,
      ORDER_ITEMS_COLLECTION_ID,
      [Query.limit(1000)]
    );

    // Group by product
    const productMap = new Map<string, ProductPerformance>();

    orderItemsResponse.documents.forEach((item: any) => {
      const productId = item.productId;
      const current = productMap.get(productId) || {
        productId,
        productName: item.productName || 'Unknown Product',
        totalSales: 0,
        totalRevenue: 0,
        totalOrders: 0
      };

      current.totalSales += item.quantity || 0;
      current.totalRevenue += (item.price || 0) * (item.quantity || 0);
      current.totalOrders += 1;

      productMap.set(productId, current);
    });

    // Convert to array and sort by revenue
    const products = Array.from(productMap.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);

    return products;
  } catch (error) {
    console.error('Error fetching product performance:', error);
    throw error;
  }
}

/**
 * Get order status distribution
 */
export async function getOrderStatusDistribution(): Promise<OrderStatusDistribution[]> {
  try {
    const ordersResponse = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.limit(1000)]
    );

    // Count by status
    const statusMap = new Map<string, number>();
    let total = 0;

    ordersResponse.documents.forEach((order: any) => {
      const status = order.status || 'pending';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
      total += 1;
    });

    // Convert to array with percentages
    const distribution: OrderStatusDistribution[] = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }));

    return distribution;
  } catch (error) {
    console.error('Error fetching order status distribution:', error);
    throw error;
  }
}

/**
 * Get user growth data
 */
export async function getUserGrowth(days: number = 30): Promise<UserGrowthData[]> {
  try {
    const endDate = new Date();
    const startDate = subDays(endDate, days);

    // Get all users
    const usersResponse = await databases.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.limit(1000)]
    );

    // Group by date
    const dailyUsers = new Map<string, number>();
    let cumulativeUsers = 0;

    usersResponse.documents.forEach((user: any) => {
      const userDate = new Date(user.$createdAt);
      if (userDate >= startDate) {
        const date = format(userDate, 'yyyy-MM-dd');
        dailyUsers.set(date, (dailyUsers.get(date) || 0) + 1);
      }
    });

    // Build cumulative data
    const result: UserGrowthData[] = [];
    for (let i = 0; i < days; i++) {
      const date = format(subDays(endDate, days - i - 1), 'yyyy-MM-dd');
      const newUsers = dailyUsers.get(date) || 0;
      cumulativeUsers += newUsers;
      result.push({ date, totalUsers: cumulativeUsers, newUsers });
    }

    return result;
  } catch (error) {
    console.error('Error fetching user growth:', error);
    throw error;
  }
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    // Get current period data
    const [currentOrders, previousOrders, products, users] = await Promise.all([
      databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
        Query.greaterThanEqual('$createdAt', thirtyDaysAgo.toISOString()),
        Query.limit(1000)
      ]),
      databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
        Query.greaterThanEqual('$createdAt', sixtyDaysAgo.toISOString()),
        Query.lessThan('$createdAt', thirtyDaysAgo.toISOString()),
        Query.limit(1000)
      ]),
      databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID, [Query.limit(1000)]),
      databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [Query.limit(1000)])
    ]);

    // Calculate totals
    const currentRevenue = currentOrders.documents.reduce((sum: number, order: any) => 
      sum + (order.totalAmount || 0), 0
    );
    const previousRevenue = previousOrders.documents.reduce((sum: number, order: any) => 
      sum + (order.totalAmount || 0), 0
    );

    const currentOrdersCount = currentOrders.documents.length;
    const previousOrdersCount = previousOrders.documents.length;

    const revenueGrowth = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    const ordersGrowth = previousOrdersCount > 0
      ? ((currentOrdersCount - previousOrdersCount) / previousOrdersCount) * 100
      : 0;

    const avgOrderValue = currentOrdersCount > 0 
      ? currentRevenue / currentOrdersCount 
      : 0;

    return {
      totalRevenue: currentRevenue,
      totalOrders: currentOrdersCount,
      totalProducts: products.total,
      totalUsers: users.total,
      revenueGrowth,
      ordersGrowth,
      avgOrderValue
    };
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    throw error;
  }
}

/**
 * Get revenue by category
 */
export async function getRevenueByCategory(): Promise<{ category: string; revenue: number }[]> {
  try {
    const [orderItems, products] = await Promise.all([
      databases.listDocuments(DATABASE_ID, ORDER_ITEMS_COLLECTION_ID, [Query.limit(1000)]),
      databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID, [Query.limit(1000)])
    ]);

    // Create product map for quick lookup
    const productMap = new Map(
      products.documents.map((p: any) => [p.$id, p.category || 'Uncategorized'])
    );

    // Group revenue by category
    const categoryRevenue = new Map<string, number>();

    orderItems.documents.forEach((item: any) => {
      const category = productMap.get(item.productId) || 'Uncategorized';
      const revenue = (item.price || 0) * (item.quantity || 0);
      categoryRevenue.set(category, (categoryRevenue.get(category) || 0) + revenue);
    });

    return Array.from(categoryRevenue.entries())
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue);
  } catch (error) {
    console.error('Error fetching revenue by category:', error);
    throw error;
  }
}
