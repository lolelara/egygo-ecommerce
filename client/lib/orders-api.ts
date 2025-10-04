import { databases, appwriteConfig } from './appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = appwriteConfig.databaseId;
const COLLECTIONS = appwriteConfig.collections;

// Order Types
export interface ShippingAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  $id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  notes?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface CreateOrderData {
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
}

/**
 * Create a new order
 */
export async function createOrder(data: CreateOrderData): Promise<Order> {
  try {
    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
    const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500 EGP
    const tax = subtotal * 0.14; // 14% VAT
    const total = subtotal + shipping + tax;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create order document
    const order = await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.orders,
      'unique()',
      {
        userId: data.userId,
        orderNumber,
        items: data.items,
        subtotal,
        shipping,
        tax,
        total,
        status: 'pending',
        paymentMethod: data.paymentMethod,
        shippingAddress: data.shippingAddress,
        notes: data.notes || '',
      }
    );

    // Create order items in separate collection
    for (const item of data.items) {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.orderItems,
        'unique()',
        {
          orderId: order.$id,
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
        }
      );
    }

    // Update product stock
    for (const item of data.items) {
      try {
        const product = await databases.getDocument(
          DATABASE_ID,
          COLLECTIONS.products,
          item.productId
        );

        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.products,
          item.productId,
          {
            stock: Math.max(0, (product.stock || 0) - item.quantity),
          }
        );
      } catch (error) {
        console.error(`Error updating stock for product ${item.productId}:`, error);
      }
    }

    return order as unknown as Order;
  } catch (error: any) {
    console.error('Error creating order:', error);
    throw new Error(error.message || 'فشل في إنشاء الطلب');
  }
}

/**
 * Get user orders
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.orders,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]
    );

    return response.documents as unknown as Order[];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

/**
 * Get order details
 */
export async function getOrderDetails(orderId: string): Promise<Order | null> {
  try {
    const order = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.orders,
      orderId
    );

    return order as unknown as Order;
  } catch (error) {
    console.error('Error fetching order details:', error);
    return null;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  trackingNumber?: string
): Promise<Order> {
  try {
    const updateData: any = { status };
    
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    const order = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.orders,
      orderId,
      updateData
    );

    return order as unknown as Order;
  } catch (error: any) {
    console.error('Error updating order status:', error);
    throw new Error(error.message || 'فشل في تحديث حالة الطلب');
  }
}

/**
 * Cancel order
 */
export async function cancelOrder(orderId: string): Promise<Order> {
  try {
    // Get order details
    const order = await databases.getDocument(
      DATABASE_ID,
      COLLECTIONS.orders,
      orderId
    );

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      throw new Error('لا يمكن إلغاء هذا الطلب');
    }

    // Restore product stock
    const items = order.items || [];
    for (const item of items) {
      try {
        const product = await databases.getDocument(
          DATABASE_ID,
          COLLECTIONS.products,
          item.productId
        );

        await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.products,
          item.productId,
          {
            stock: (product.stock || 0) + item.quantity,
          }
        );
      } catch (error) {
        console.error(`Error restoring stock for product ${item.productId}:`, error);
      }
    }

    // Update order status
    const updatedOrder = await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.orders,
      orderId,
      {
        status: 'cancelled',
      }
    );

    return updatedOrder as unknown as Order;
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    throw new Error(error.message || 'فشل في إلغاء الطلب');
  }
}

/**
 * Track shipment
 */
export async function trackShipment(orderId: string): Promise<{
  order: Order;
  timeline: Array<{ status: string; date: string; description: string }>;
}> {
  try {
    const order = await getOrderDetails(orderId);
    
    if (!order) {
      throw new Error('الطلب غير موجود');
    }

    // Generate timeline based on order status
    const timeline = [];
    
    timeline.push({
      status: 'pending',
      date: order.$createdAt,
      description: 'تم استلام الطلب',
    });

    if (['processing', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'processing',
        date: order.$updatedAt,
        description: 'جاري تجهيز الطلب',
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'shipped',
        date: order.$updatedAt,
        description: 'تم شحن الطلب',
      });
    }

    if (order.status === 'delivered') {
      timeline.push({
        status: 'delivered',
        date: order.$updatedAt,
        description: 'تم تسليم الطلب',
      });
    }

    if (order.status === 'cancelled') {
      timeline.push({
        status: 'cancelled',
        date: order.$updatedAt,
        description: 'تم إلغاء الطلب',
      });
    }

    return { order, timeline };
  } catch (error: any) {
    console.error('Error tracking shipment:', error);
    throw new Error(error.message || 'فشل في تتبع الشحنة');
  }
}

/**
 * Get order statistics
 */
export async function getOrderStatistics(userId: string) {
  try {
    const orders = await getUserOrders(userId);

    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalSpent: orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0),
    };

    return stats;
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    return {
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalSpent: 0,
    };
  }
}
