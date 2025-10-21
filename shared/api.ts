/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Product related types
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  affiliateCommission: number; // Percentage commission for affiliates
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
  description?: string;
}

/**
 * Cart types
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

/**
 * User types
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Affiliate Program types
 */
export interface AffiliateUser {
  id: string;
  email: string;
  name: string;
  affiliateCode: string;
  commissionRate: number;
  totalEarnings: number;
  pendingEarnings: number;
  referralCount: number;
  joinedAt: string;
}

export interface AffiliateLink {
  id: string;
  affiliateId: string;
  productId?: string;
  originalUrl: string;
  affiliateUrl: string;
  clicks: number;
  conversions: number;
  earnings: number;
}

export interface Commission {
  id: string;
  affiliateId: string;
  orderId: string;
  productId: string;
  amount: number;
  status: "pending" | "approved" | "paid";
  createdAt: string;
}

/**
 * API Response types
 */
export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface AffiliateStatsResponse {
  totalEarnings: number;
  pendingEarnings: number;
  thisMonthEarnings: number;
  clicksThisMonth: number;
  conversionsThisMonth: number;
  topProducts: Array<{
    product: Product;
    earnings: number;
    conversions: number;
  }>;
}

/**
 * Order types
 */
export interface Order {
  id: string;
  orderNumber: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  shippingAddress: any;
  billingAddress?: any;
  paymentMethod?: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  total: number;
  productId: string;
  product: Product;
}

/**
 * Admin Dashboard types
 */
export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalAffiliates: number;
  pendingCommissions: number;
  thisMonthRevenue: number;
  thisMonthOrders: number;
  topSellingProducts: Array<{
    product: Product;
    soldQuantity: number;
    revenue: number;
  }>;
  recentOrders: Order[];
}

export interface AdminProductCreate {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  images: string[];
  tags: string[];
  stockQuantity: number;
  affiliateCommission: number;
}

export interface AdminProductUpdate extends Partial<AdminProductCreate> {
  id: string;
  status?: 'pending' | 'approved' | 'rejected';
}
