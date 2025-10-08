import { databases } from "./appwrite";
import { Query } from "appwrite";
import {
  ProductListResponse,
  CategoryListResponse,
  ProductWithRelations,
  CategoryWithCount,
  ProductFilters,
  PaginationParams,
} from "@shared/prisma-types";
import { fallbackProductsApi, fallbackCategoriesApi } from "./api-fallback";
import { getImageUrl } from "./storage";

// Appwrite configuration
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "68de037e003bd03c4d45";
const COLLECTIONS = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  ORDERS: "orders",
  REVIEWS: "reviews",
  WISHLIST: "wishlist",
  USERS: "users",
};

// Helper function to check if Appwrite is configured
const isAppwriteConfigured = (): boolean => {
  try {
    return !!DATABASE_ID;
  } catch {
    return false;
  }
};

// Products API using Appwrite
export const productsApi = {
  getAll: async (
    filters?: ProductFilters & PaginationParams,
  ): Promise<ProductListResponse> => {
    try {
      if (!isAppwriteConfigured()) {
        console.log("Appwrite not configured, using fallback data");
        return fallbackProductsApi.getAll(filters);
      }

      const queries = [];
      
      // Add filters
      if (filters?.categoryId) {
        queries.push(Query.equal("categoryId", filters.categoryId));
      }
      if (filters?.inStock !== undefined) {
        queries.push(Query.equal("inStock", filters.inStock));
      }
      if (filters?.minPrice !== undefined) {
        queries.push(Query.greaterThanEqual("price", filters.minPrice));
      }
      if (filters?.maxPrice !== undefined) {
        queries.push(Query.lessThanEqual("price", filters.maxPrice));
      }
      if (filters?.searchQuery) {
        queries.push(Query.search("name", filters.searchQuery));
      }

      // Add pagination
      const limit = filters?.limit || 20;
      const page = filters?.page || 1;
      const offset = (page - 1) * limit;
      queries.push(Query.limit(limit));
      queries.push(Query.offset(offset));

      // Add sorting
      queries.push(Query.orderDesc("$createdAt"));

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        queries
      );

      // Transform Appwrite documents to our format
      // @ts-ignore - Adding default values for missing fields
      const products = response.documents.map((doc: any) => ({
        id: doc.$id,
        name: doc.name,
        description: doc.description,
        price: doc.price,
        originalPrice: doc.originalPrice,
        sku: doc.sku || `SKU-${doc.$id.slice(0, 8)}`,
        inStock: doc.inStock,
        stockQuantity: doc.stockQuantity || 0,
        rating: doc.rating || 0,
        reviewCount: doc.reviewCount || 0,
        affiliateCommission: doc.affiliateCommission || 0,
        images: Array.isArray(doc.images)
          ? doc.images.map((img: any) => {
              if (typeof img === 'string') {
                return { url: getImageUrl(img) };
              }
              return img;
            })
          : [],
        tags: doc.tags || [],
        reviews: doc.reviews || [],
        categoryId: doc.categoryId,
        category: doc.category,
        createdAt: new Date(doc.$createdAt),
        updatedAt: new Date(doc.$updatedAt),
      }));

      return {
        products,
        total: response.total,
        page,
        limit,
      };
    } catch (error) {
      console.error("Error fetching products from Appwrite:", error);
      return fallbackProductsApi.getAll(filters);
    }
  },

  getById: async (id: string): Promise<ProductWithRelations | null> => {
    try {
      if (!isAppwriteConfigured()) {
        return fallbackProductsApi.getById(id);
      }

      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        id
      );

      // Fetch category if exists
      let category = null;
      if (doc.categoryId) {
        try {
          const categoryDoc = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.CATEGORIES,
            doc.categoryId
          );
          category = {
            id: categoryDoc.$id,
            name: categoryDoc.name,
            slug: categoryDoc.slug,
          };
        } catch (err) {
          console.log("Category not found:", err);
        }
      }

      // @ts-ignore - Adding default values
      return {
        id: doc.$id,
        name: doc.name,
        description: doc.description,
        price: doc.price,
        originalPrice: doc.originalPrice,
        sku: doc.sku || `SKU-${doc.$id.slice(0, 8)}`,
        inStock: doc.inStock,
        stockQuantity: doc.stockQuantity || 0,
        rating: doc.rating || 0,
        reviewCount: doc.reviewCount || 0,
        affiliateCommission: doc.affiliateCommission || 0,
        images: Array.isArray(doc.images) 
          ? doc.images.map((img: any) => {
              if (typeof img === 'string') {
                // Convert file ID to URL
                return { url: getImageUrl(img) };
              }
              return img; // Already an object with url
            })
          : [],
        tags: doc.tags || [],
        reviews: doc.reviews || [],
        categoryId: doc.categoryId,
        category,
        createdAt: new Date(doc.$createdAt),
        updatedAt: new Date(doc.$updatedAt),
      };
    } catch (error) {
      console.error("Error fetching product from Appwrite:", error);
      return fallbackProductsApi.getById(id);
    }
  },
};

// Categories API using Appwrite
export const categoriesApi = {
  getAll: async (): Promise<CategoryListResponse> => {
    try {
      if (!isAppwriteConfigured()) {
        console.log("Appwrite not configured, using fallback data");
        return fallbackCategoriesApi.getAll();
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        [Query.orderAsc("name")]
      );

      const categories = response.documents.map((doc: any) => ({
        id: doc.$id,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        image: doc.image,
        productCount: doc.productCount || 0,
        createdAt: new Date(doc.$createdAt),
        updatedAt: new Date(doc.$updatedAt),
      }));

      // @ts-ignore - CategoryListResponse expects only categories
      return {
        categories,
      };
    } catch (error) {
      console.error("Error fetching categories from Appwrite:", error);
      return fallbackCategoriesApi.getAll();
    }
  },

  getBySlug: async (slug: string): Promise<CategoryWithCount | null> => {
    try {
      if (!isAppwriteConfigured()) {
        return fallbackCategoriesApi.getBySlug(slug);
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        [Query.equal("slug", slug), Query.limit(1)]
      );

      if (response.documents.length === 0) {
        return null;
      }

      const doc = response.documents[0];
      return {
        id: doc.$id,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        image: doc.image,
        productCount: doc.productCount || 0,
        createdAt: new Date(doc.$createdAt),
        updatedAt: new Date(doc.$updatedAt),
      };
    } catch (error) {
      console.error("Error fetching category from Appwrite:", error);
      return fallbackCategoriesApi.getBySlug(slug);
    }
  },

  getProductsByCategory: async (
    slug: string,
    filters?: ProductFilters & PaginationParams,
  ): Promise<ProductListResponse> => {
    try {
      if (!isAppwriteConfigured()) {
        // Return empty list instead of calling non-existent method
        return {
          products: [],
          total: 0,
          page: 1,
          limit: filters?.limit || 20,
        };
      }

      // First get category by slug
      const categoryResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        [Query.equal("slug", slug), Query.limit(1)]
      );

      if (categoryResponse.documents.length === 0) {
        return { products: [], total: 0, page: 1, limit: 20 };
      }

      const categoryId = categoryResponse.documents[0].$id;

      // Then get products for this category
      return productsApi.getAll({ ...filters, categoryId });
    } catch (error) {
      console.error("Error fetching products by category from Appwrite:", error);
      // Return empty list on error
      return {
        products: [],
        total: 0,
        page: 1,
        limit: filters?.limit || 20,
      };
    }
  },
};

// Query keys for React Query
export const queryKeys = {
  products: ["products"] as const,
  product: (id: string) => ["products", id] as const,
  categories: ["categories"] as const,
  category: (slug: string) => ["categories", slug] as const,
  categoryProducts: (slug: string) => ["categories", slug, "products"] as const,
  orders: (userId: string) => ["orders", userId] as const,
  order: (id: string) => ["orders", id] as const,
  reviews: (productId: string) => ["reviews", productId] as const,
  wishlist: (userId: string) => ["wishlist", userId] as const,
  wishlistCheck: (userId: string, productId: string) => ["wishlist-check", userId, productId] as const,
};

// Orders API using Appwrite
export const ordersApi = {
  getUserOrders: async (userId: string): Promise<any[]> => {
    try {
      if (!isAppwriteConfigured()) {
        console.log("Appwrite not configured for orders");
        return [];
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        orderNumber: doc.orderNumber,
        status: doc.status,
        total: doc.total,
        subtotal: doc.subtotal,
        shipping: doc.shipping || 0,
        discount: doc.discount || 0,
        items: doc.items || [],
        shippingAddress: doc.shippingAddress,
        paymentMethod: doc.paymentMethod,
        paymentStatus: doc.paymentStatus,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching orders from Appwrite:", error);
      return [];
    }
  },

  getOrderById: async (id: string, userId: string): Promise<any> => {
    try {
      if (!isAppwriteConfigured()) {
        return null;
      }

      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        id
      );

      if (doc.userId !== userId) {
        throw new Error("Unauthorized");
      }

      return {
        id: doc.$id,
        orderNumber: doc.orderNumber,
        status: doc.status,
        total: doc.total,
        subtotal: doc.subtotal,
        shipping: doc.shipping || 0,
        discount: doc.discount || 0,
        items: doc.items || [],
        shippingAddress: doc.shippingAddress,
        billingAddress: doc.billingAddress,
        paymentMethod: doc.paymentMethod,
        paymentStatus: doc.paymentStatus,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      };
    } catch (error) {
      console.error("Error fetching order details from Appwrite:", error);
      return null;
    }
  },
};

// Reviews API using Appwrite
export const reviewsApi = {
  getProductReviews: async (productId: string): Promise<any> => {
    try {
      if (!isAppwriteConfigured()) {
        return { reviews: [], stats: { totalReviews: 0, averageRating: 0, ratingDistribution: [] } };
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        [Query.equal("productId", productId), Query.orderDesc("$createdAt")]
      );

      const reviews = response.documents.map((doc: any) => ({
        id: doc.$id,
        userId: doc.userId,
        userName: doc.userName || "مستخدم",
        userAvatar: doc.userAvatar,
        rating: doc.rating,
        comment: doc.comment,
        createdAt: doc.$createdAt,
      }));

      // Calculate stats
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews
        : 0;

      const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
        rating,
        count: reviews.filter((r: any) => r.rating === rating).length,
      }));

      return {
        reviews,
        stats: {
          totalReviews,
          averageRating,
          ratingDistribution,
        },
      };
    } catch (error) {
      console.error("Error fetching reviews from Appwrite:", error);
      return { reviews: [], stats: { totalReviews: 0, averageRating: 0, ratingDistribution: [] } };
    }
  },

  createReview: async (data: {
    productId: string;
    userId: string;
    rating: number;
    comment?: string;
  }): Promise<any> => {
    try {
      if (!isAppwriteConfigured()) {
        throw new Error("Appwrite not configured");
      }

      // Check if user already reviewed this product
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        [
          Query.equal("productId", data.productId),
          Query.equal("userId", data.userId),
        ]
      );

      if (existing.documents.length > 0) {
        throw new Error("لقد قمت بتقييم هذا المنتج بالفعل");
      }

      const review = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        "unique()",
        data
      );

      return {
        id: review.$id,
        ...data,
        createdAt: review.$createdAt,
      };
    } catch (error: any) {
      throw new Error(error.message || "فشل في إضافة المراجعة");
    }
  },

  updateReview: async (
    id: string,
    data: {
      userId: string;
      rating?: number;
      comment?: string;
    }
  ): Promise<any> => {
    try {
      if (!isAppwriteConfigured()) {
        throw new Error("Appwrite not configured");
      }

      // Verify ownership
      const existing = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        id
      );

      if (existing.userId !== data.userId) {
        throw new Error("غير مصرح لك بتعديل هذه المراجعة");
      }

      const updateData: any = {};
      if (data.rating !== undefined) updateData.rating = data.rating;
      if (data.comment !== undefined) updateData.comment = data.comment;

      const review = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        id,
        updateData
      );

      return {
        id: review.$id,
        rating: review.rating,
        comment: review.comment,
        updatedAt: review.$updatedAt,
      };
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث المراجعة");
    }
  },

  deleteReview: async (id: string, userId: string): Promise<void> => {
    try {
      if (!isAppwriteConfigured()) {
        throw new Error("Appwrite not configured");
      }

      // Verify ownership
      const existing = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        id
      );

      if (existing.userId !== userId) {
        throw new Error("غير مصرح لك بحذف هذه المراجعة");
      }

      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.REVIEWS,
        id
      );
    } catch (error: any) {
      throw new Error(error.message || "فشل في حذف المراجعة");
    }
  },
};

// Wishlist API using Appwrite
export const wishlistApi = {
  getUserWishlist: async (userId: string): Promise<any[]> => {
    try {
      if (!isAppwriteConfigured()) {
        return [];
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WISHLIST,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
      );

      const wishlistItems = await Promise.all(
        response.documents.map(async (item: any) => {
          try {
            const product = await databases.getDocument(
              DATABASE_ID,
              COLLECTIONS.PRODUCTS,
              item.productId
            );

            return {
              id: item.$id,
              productId: item.productId,
              addedAt: item.$createdAt,
              product: {
                id: product.$id,
                name: product.name,
                description: product.description,
                price: product.price,
                originalPrice: product.originalPrice,
                inStock: product.inStock,
                stockQuantity: product.stockQuantity || 0,
                rating: product.rating || 0,
                reviewCount: product.reviewCount || 0,
                images: product.images || [],
                category: product.category,
              },
            };
          } catch (error) {
            console.error(`Product ${item.productId} not found:`, error);
            return null;
          }
        })
      );

      return wishlistItems.filter((item) => item !== null);
    } catch (error) {
      console.error("Error fetching wishlist from Appwrite:", error);
      return [];
    }
  },

  addToWishlist: async (userId: string, productId: string): Promise<any> => {
    try {
      if (!isAppwriteConfigured()) {
        throw new Error("Appwrite not configured");
      }

      // Check if already in wishlist
      const existing = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WISHLIST,
        [Query.equal("userId", userId), Query.equal("productId", productId)]
      );

      if (existing.documents.length > 0) {
        throw new Error("المنتج موجود بالفعل في قائمة المفضلة");
      }

      const wishlistItem = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.WISHLIST,
        "unique()",
        {
          userId,
          productId,
        }
      );

      return {
        id: wishlistItem.$id,
        productId: wishlistItem.productId,
        addedAt: wishlistItem.$createdAt,
      };
    } catch (error: any) {
      throw new Error(error.message || "فشل في إضافة المنتج للمفضلة");
    }
  },

  removeFromWishlist: async (id: string, userId: string): Promise<void> => {
    try {
      if (!isAppwriteConfigured()) {
        throw new Error("Appwrite not configured");
      }

      // Verify ownership
      const item = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.WISHLIST,
        id
      );

      if (item.userId !== userId) {
        throw new Error("غير مصرح لك بحذف هذا العنصر");
      }

      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.WISHLIST,
        id
      );
    } catch (error: any) {
      throw new Error(error.message || "فشل في حذف المنتج من المفضلة");
    }
  },

  isInWishlist: async (userId: string, productId: string): Promise<{ inWishlist: boolean; wishlistItemId: string | null }> => {
    try {
      if (!isAppwriteConfigured()) {
        return { inWishlist: false, wishlistItemId: null };
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.WISHLIST,
        [
          Query.equal("userId", userId),
          Query.equal("productId", productId),
        ]
      );

      const inWishlist = response.documents.length > 0;
      const wishlistItemId = inWishlist ? response.documents[0].$id : null;

      return { inWishlist, wishlistItemId };
    } catch (error) {
      console.error("Error checking wishlist:", error);
      return { inWishlist: false, wishlistItemId: null };
    }
  },
};
