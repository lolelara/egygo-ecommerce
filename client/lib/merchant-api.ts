import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';
import type { MerchantStats, MerchantProduct, MerchantOrder } from '../../shared/prisma-types';

// Re-export types for convenience
export type { MerchantStats, MerchantProduct, MerchantOrder };

const DATABASE_ID = appwriteConfig.databaseId;
const COLLECTIONS = appwriteConfig.collections;

/**
 * Get merchant statistics
 * إحصائيات التاجر الكاملة من قاعدة البيانات
 */
export async function getMerchantStats(userId: string): Promise<MerchantStats> {
  try {
    // 1. Get all merchant products
    const productsResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.products,
      [
        Query.equal('merchantId', userId),
        Query.limit(1000) // Get all products
      ]
    );

    const products = productsResponse.documents;
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    // 2. Get all orders for merchant's products
    const productIds = products.map(p => p.$id);
    
    let totalSales = 0;
    let totalRevenue = 0;
    let pendingOrders = 0;
    let completedOrders = 0;

    // Get order items for each product
    if (productIds.length > 0) {
      const orderItemsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.orderItems,
        [
          Query.equal('productId', productIds),
          Query.limit(1000)
        ]
      );

      // Calculate sales and revenue
      for (const item of orderItemsResponse.documents) {
        totalSales += item.quantity || 0;
        totalRevenue += (item.price || 0) * (item.quantity || 0);

        // Get order status
        try {
          const order = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.orders,
            item.orderId
          );

          if (order.status === 'pending' || order.status === 'processing') {
            pendingOrders++;
          } else if (order.status === 'delivered') {
            completedOrders++;
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      }
    }

    // 3. Calculate revenue change (last 30 days vs previous 30 days)
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    let recentRevenue = 0;
    let previousRevenue = 0;

    if (productIds.length > 0) {
      // Recent 30 days
      const recentOrderItems = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.orderItems,
        [
          Query.equal('productId', productIds),
          Query.greaterThan('$createdAt', last30Days.toISOString()),
          Query.limit(1000)
        ]
      );

      recentRevenue = recentOrderItems.documents.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      );

      // Previous 30 days
      const previousOrderItems = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.orderItems,
        [
          Query.equal('productId', productIds),
          Query.greaterThan('$createdAt', previous30Days.toISOString()),
          Query.lessThan('$createdAt', last30Days.toISOString()),
          Query.limit(1000)
        ]
      );

      previousRevenue = previousOrderItems.documents.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      );
    }

    const revenueChange = previousRevenue > 0
      ? ((recentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    // 4. Calculate average rating and total reviews
    let avgRating = 0;
    let totalReviews = 0;

    if (productIds.length > 0) {
      const reviewsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.reviews,
        [
          Query.equal('productId', productIds),
          Query.limit(1000)
        ]
      );

      totalReviews = reviewsResponse.documents.length;
      
      if (totalReviews > 0) {
        const totalRating = reviewsResponse.documents.reduce(
          (sum, review) => sum + (review.rating || 0),
          0
        );
        avgRating = totalRating / totalReviews;
      }
    }

    return {
      totalProducts,
      activeProducts,
      outOfStock,
      totalSales,
      totalRevenue,
      revenueChange,
      pendingOrders,
      completedOrders,
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalReviews,
    };
  } catch (error) {
    console.error('Error fetching merchant stats:', error);
    throw error;
  }
}

/**
 * Get merchant products with statistics
 * منتجات التاجر مع إحصائيات كل منتج
 */
export async function getMerchantProducts(userId: string): Promise<MerchantProduct[]> {
  try {
    // Get all merchant products
    const productsResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.products,
      [
        Query.equal('merchantId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]
    );

    const merchantProducts: MerchantProduct[] = [];

    for (const product of productsResponse.documents) {
      // Get sales and revenue for each product
      const orderItemsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.orderItems,
        [
          Query.equal('productId', product.$id),
          Query.limit(1000)
        ]
      );

      const sales = orderItemsResponse.documents.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );

      const revenue = orderItemsResponse.documents.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      );

      // Get reviews and rating
      const reviewsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.reviews,
        [
          Query.equal('productId', product.$id),
          Query.limit(1000)
        ]
      );

      const rating = reviewsResponse.documents.length > 0
        ? reviewsResponse.documents.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsResponse.documents.length
        : 0;

      // Determine status
      let status: 'active' | 'out_of_stock' | 'draft' = 'active';
      if (product.stock === 0) {
        status = 'out_of_stock';
      } else if (product.draft === true) {
        status = 'draft';
      }

      merchantProducts.push({
        id: product.$id,
        name: product.name || '',
        image: product.image || product.images?.[0] || '/placeholder.svg',
        price: product.price || 0,
        stock: product.stock || 0,
        sales,
        revenue,
        views: product.views || 0, // If you track views
        rating: parseFloat(rating.toFixed(1)),
        status,
        categoryId: product.categoryId,
        description: product.description,
        merchantId: product.merchantId,
      });
    }

    return merchantProducts;
  } catch (error) {
    console.error('Error fetching merchant products:', error);
    throw error;
  }
}

/**
 * Get orders for merchant's products
 * طلبات منتجات التاجر
 */
export async function getMerchantOrders(userId: string): Promise<MerchantOrder[]> {
  try {
    // Get all merchant products
    const productsResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.products,
      [
        Query.equal('merchantId', userId),
        Query.limit(1000)
      ]
    );

    const productIds = productsResponse.documents.map(p => p.$id);
    const productMap = new Map(
      productsResponse.documents.map(p => [p.$id, p.name])
    );

    if (productIds.length === 0) {
      return [];
    }

    // Get order items for merchant's products
    const orderItemsResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.orderItems,
      [
        Query.equal('productId', productIds),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]
    );

    const merchantOrders: MerchantOrder[] = [];

    for (const item of orderItemsResponse.documents) {
      try {
        // Get order details
        const order = await databases.getDocument(
          DATABASE_ID,
          COLLECTIONS.orders,
          item.orderId
        );

        // Get customer details
        let customerName = 'غير معروف';
        try {
          const customer = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.users,
            order.userId
          );
          customerName = customer.name || customer.email || 'غير معروف';
        } catch (error) {
          console.error('Error fetching customer:', error);
        }

        merchantOrders.push({
          id: item.$id,
          orderId: order.$id,
          product: productMap.get(item.productId) || 'منتج غير معروف',
          customer: customerName,
          amount: (item.price || 0) * (item.quantity || 0),
          status: order.status || 'pending',
          date: new Date(order.$createdAt).toISOString().split('T')[0],
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    }

    return merchantOrders;
  } catch (error) {
    console.error('Error fetching merchant orders:', error);
    throw error;
  }
}

/**
 * Get a single product with full details
 * الحصول على تفاصيل منتج واحد
 */
export async function getMerchantProduct(productId: string): Promise<MerchantProduct | null> {
  try {
    const product = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.products,
      productId
    );

    // Get sales and revenue
    const orderItemsResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.orderItems,
      [
        Query.equal('productId', productId),
        Query.limit(1000)
      ]
    );

    const sales = orderItemsResponse.documents.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    const revenue = orderItemsResponse.documents.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );

    // Get reviews and rating
    const reviewsResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.reviews,
      [
        Query.equal('productId', productId),
        Query.limit(1000)
      ]
    );

    const rating = reviewsResponse.documents.length > 0
      ? reviewsResponse.documents.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsResponse.documents.length
      : 0;

    let status: 'active' | 'out_of_stock' | 'draft' = 'active';
    if (product.stock === 0) {
      status = 'out_of_stock';
    } else if (product.draft === true) {
      status = 'draft';
    }

    return {
      id: product.$id,
      name: product.name || '',
      image: product.image || product.images?.[0] || '/placeholder.svg',
      price: product.price || 0,
      stock: product.stock || 0,
      sales,
      revenue,
      views: product.views || 0,
      rating: parseFloat(rating.toFixed(1)),
      status,
      categoryId: product.categoryId,
      description: product.description,
      merchantId: product.merchantId,
    };
  } catch (error) {
    console.error('Error fetching merchant product:', error);
    return null;
  }
}
