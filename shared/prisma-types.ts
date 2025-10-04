import {
  Product as PrismaProduct,
  Category as PrismaCategory,
  User as PrismaUser,
  AffiliateUser as PrismaAffiliateUser,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  CartItem as PrismaCartItem,
  Review as PrismaReview,
  Commission as PrismaCommission,
  AffiliateLink as PrismaAffiliateLink,
  ProductImage,
  ProductTag,
} from "@prisma/client";

// Product with relations
export type ProductWithRelations = PrismaProduct & {
  category: PrismaCategory;
  images: ProductImage[];
  tags: ProductTag[];
  reviews: PrismaReview[];
  _count?: {
    reviews: number;
  };
};

// Category with product count
export type CategoryWithCount = PrismaCategory;

// User with relations
export type UserWithRelations = PrismaUser & {
  affiliate?: PrismaAffiliateUser;
};

// Cart item with product
export type CartItemWithProduct = PrismaCartItem & {
  product: ProductWithRelations;
};

// Order with relations
export type OrderWithRelations = PrismaOrder & {
  items: (PrismaOrderItem & {
    product: PrismaProduct;
  })[];
  user: PrismaUser;
};

// Affiliate with relations
export type AffiliateWithRelations = PrismaAffiliateUser & {
  user: PrismaUser;
  links: PrismaAffiliateLink[];
  commissions: PrismaCommission[];
};

// Review with relations
export type ReviewWithUser = PrismaReview & {
  user: PrismaUser;
};

// Commission with relations
export type CommissionWithRelations = PrismaCommission & {
  affiliate: PrismaAffiliateUser & {
    user: PrismaUser;
  };
  order: PrismaOrder;
};

// API Response types
export interface ProductListResponse {
  products: ProductWithRelations[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryListResponse {
  categories: CategoryWithCount[];
}

export interface CartResponse {
  items: CartItemWithProduct[];
  total: number;
  itemCount: number;
}

export interface AffiliateStatsResponse {
  totalEarnings: number;
  pendingEarnings: number;
  thisMonthEarnings: number;
  clicksThisMonth: number;
  conversionsThisMonth: number;
  topProducts: Array<{
    product: ProductWithRelations;
    earnings: number;
    conversions: number;
  }>;
}

// Filter and search types
export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
  searchQuery?: string;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "featured";
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// Merchant types for dashboard
export interface MerchantStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  totalSales: number;
  totalRevenue: number;
  revenueChange: number;
  pendingOrders: number;
  completedOrders: number;
  avgRating: number;
  totalReviews: number;
}

export interface MerchantProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  sales: number;
  revenue: number;
  views: number;
  rating: number;
  status: 'active' | 'out_of_stock' | 'draft';
  categoryId?: string;
  description?: string;
  merchantId: string;
}

export interface MerchantOrder {
  id: string;
  product: string;
  customer: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  orderId: string;
}
