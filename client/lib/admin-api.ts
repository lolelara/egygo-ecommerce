import { databases, appwriteConfig, account } from "./appwrite";
import { Query, ID } from "appwrite";

const DATABASE_ID = appwriteConfig.databaseId;
const COLLECTIONS = {
  PRODUCTS: appwriteConfig.collections.products,
  CATEGORIES: appwriteConfig.collections.categories,
  ORDERS: appwriteConfig.collections.orders,
  USERS: appwriteConfig.collections.users,
  REVIEWS: appwriteConfig.collections.reviews,
  COMMISSIONS: "commissions",
  NOTIFICATIONS: "notifications",
};

export interface AdminOpenAIKey {
  id: string;
  label: string;
  provider: "openai" | "gemini";
  key?: string;
  isActive: boolean;
  isDefault: boolean;
  priority: number;
  status: 'active' | 'quota_exceeded' | 'error';
  lastError?: string;
  lastTestedAt?: string;
}

// Admin Stats
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  totalAffiliates: number;
  pendingCommissions: number;
  thisMonthRevenue: number;
  thisMonthOrders: number;
  recentOrders: any[];
  topProducts: any[];
  conversionRate: number;
  averageOrderValue: number;
  customerSatisfaction: number;
}

// Admin Dashboard API
export const adminDashboardApi = {
  getStats: async (): Promise<AdminStats> => {
    try {
      // Get all orders
      const ordersResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.orderDesc("$createdAt"), Query.limit(100)]
      );

      // Get all products
      const productsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        [Query.limit(1000)]
      );

      // Get all users
      const usersResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.limit(1000)]
      );

      // Get affiliates (users with isAffiliate = true)
      let totalAffiliates = 0;
      try {
        const affiliatesResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [Query.equal("isAffiliate", true), Query.limit(1000)]
        );
        totalAffiliates = affiliatesResponse.total;
      } catch (error) {
        console.error("Error fetching affiliates:", error);
        // Fallback: count from all users
        const allUsers = usersResponse.documents;
        totalAffiliates = allUsers.filter((user: any) =>
          user.isAffiliate === true
        ).length;
      }

      // Get commissions
      const commissionsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMMISSIONS,
        [Query.limit(1000)]
      );

      // Calculate monthly stats
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const monthlyOrders = ordersResponse.documents.filter(
        (order: any) => new Date(order.$createdAt) >= firstDayOfMonth
      );

      const thisMonthRevenue = monthlyOrders
        .filter((order: any) => order.status !== "CANCELLED")
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0);

      // Calculate stats
      const totalRevenue = ordersResponse.documents
        .filter((order: any) => order.status !== "CANCELLED")
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0);

      const pendingOrders = ordersResponse.documents.filter(
        (order: any) => order.status === "PENDING"
      ).length;

      const pendingCommissions = commissionsResponse.documents
        .filter((comm: any) => comm.status === "PENDING")
        .reduce((sum: number, comm: any) => sum + (comm.amount || 0), 0);

      const recentOrders = ordersResponse.documents.slice(0, 10).map((order: any) => ({
        id: order.$id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.$createdAt,
        userId: order.userId,
      }));

      // Calculate top products (from order items - simplified version)
      const productSales: Record<string, { productId: string; quantity: number; revenue: number }> = {};

      // Note: This is a simplified version. In production, you'd query order_items collection
      ordersResponse.documents.forEach((order: any) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const productId = item.productId;
            if (!productSales[productId]) {
              productSales[productId] = { productId, quantity: 0, revenue: 0 };
            }
            productSales[productId].quantity += item.quantity || 0;
            productSales[productId].revenue += (item.price || 0) * (item.quantity || 0);
          });
        }
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

      // Calculate conversion rate (completed orders / total orders)
      const completedOrders = ordersResponse.documents.filter(
        (order: any) => order.status === "COMPLETED"
      ).length;
      const conversionRate = ordersResponse.total > 0
        ? (completedOrders / ordersResponse.total) * 100
        : 0;

      // Calculate average order value
      const averageOrderValue = ordersResponse.total > 0
        ? totalRevenue / ordersResponse.total
        : 0;

      // Calculate customer satisfaction from reviews (if reviews collection exists)
      let customerSatisfaction = 0;
      try {
        const reviewsResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.REVIEWS,
          [Query.limit(1000)]
        );
        if (reviewsResponse.total > 0) {
          const totalRating = reviewsResponse.documents.reduce(
            (sum: number, review: any) => sum + (review.rating || 0),
            0
          );
          customerSatisfaction = totalRating / reviewsResponse.total;
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // If no reviews, default to 0
        customerSatisfaction = 0;
      }

      return {
        totalRevenue,
        totalOrders: ordersResponse.total,
        totalProducts: productsResponse.total,
        totalUsers: usersResponse.total,
        pendingOrders,
        totalAffiliates,
        pendingCommissions,
        thisMonthRevenue,
        thisMonthOrders: monthlyOrders.length,
        recentOrders,
        topProducts,
        conversionRate,
        averageOrderValue,
        customerSatisfaction,
      };
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        pendingOrders: 0,
        totalAffiliates: 0,
        pendingCommissions: 0,
        thisMonthRevenue: 0,
        thisMonthOrders: 0,
        recentOrders: [],
        topProducts: [],
        conversionRate: 0,
        averageOrderValue: 0,
        customerSatisfaction: 0,
      };
    }
  },
};

// Admin Products API
export const adminProductsApi = {
  create: async (product: any, userId?: string): Promise<any> => {
    try {
      console.log("Creating product with data:", product);
      console.log("User ID (merchantId):", userId);

      // Prepare document data with optional merchantId, colors, and sizes
      const stockValue = product.stock || product.stockQuantity || 0;
      const documentData: any = {
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice || product.originalPrice || null,
        stock: stockValue,
        stockQuantity: stockValue, // Also set stockQuantity to match schema
        categoryId: product.categoryId || (product.categoryIds && product.categoryIds.length > 0 ? product.categoryIds[0] : null), // Deprecated but kept for compatibility
        categoryIds: product.categoryIds || (product.categoryId ? [product.categoryId] : []), // New field
        images: product.images || [],
        tags: product.tags || [],
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        isFeaturedInHero: product.isFeaturedInHero ?? false,
        rating: 0,
        reviewCount: 0,
        status: userId ? 'pending' : 'approved', // Merchant products need approval, admin products are auto-approved
      };

      // Add optional fields if they exist in the product data
      // These will be silently ignored if attributes don't exist in Appwrite
      // If userId is provided, use it as merchantId (for merchant users)
      // If product.merchantId is explicitly provided, use that instead (for admin)
      if (product.merchantId) {
        documentData.merchantId = product.merchantId;
      } else if (userId) {
        documentData.merchantId = userId;
        console.log("Auto-assigned merchantId:", userId);
      }

      if (product.colors && Array.isArray(product.colors)) documentData.colors = product.colors;
      if (product.sizes && Array.isArray(product.sizes)) documentData.sizes = product.sizes;
      // Add colorSizeInventory - even if empty, we want to store it
      if (product.colorSizeInventory) {
        documentData.colorSizeInventory = product.colorSizeInventory;
        console.log("📦 Saving colorSizeInventory:", product.colorSizeInventory);
      }

      try {
        const doc = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.PRODUCTS,
          "unique()",
          documentData
        );

        console.log("Product created successfully:", doc);

        return {
          id: doc.$id,
          name: doc.name,
          description: doc.description,
          price: doc.price,
          comparePrice: doc.comparePrice,
          stock: doc.stock,
          categoryId: doc.categoryId,
          categoryIds: doc.categoryIds || (doc.categoryId ? [doc.categoryId] : []),
          images: doc.images,
          tags: doc.tags,
          isActive: doc.isActive,
          isFeatured: doc.isFeatured,
          rating: doc.rating,
          reviewCount: doc.reviewCount,
          createdAt: doc.$createdAt,
        };
      } catch (error: any) {
        // If error is about unknown attribute, retry without optional fields
        if (error.message?.includes('Unknown attribute')) {
          console.warn('Retrying without optional attributes:', error.message);

          // Remove optional attributes that might not exist
          delete documentData.colorSizeInventory;
          delete documentData.merchantId;
          delete documentData.colors;
          delete documentData.sizes;

          const doc = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.PRODUCTS,
            "unique()",
            documentData
          );

          console.log("Product created successfully (without optional fields):", doc);

          return {
            id: doc.$id,
            name: doc.name,
            description: doc.description,
            price: doc.price,
            comparePrice: doc.comparePrice,
            stock: doc.stock,
            categoryId: doc.categoryId,
            images: doc.images,
            tags: doc.tags,
            isActive: doc.isActive,
            isFeatured: doc.isFeatured,
            rating: doc.rating,
            reviewCount: doc.reviewCount,
            createdAt: doc.$createdAt,
          };
        }

        throw error;
      }
    } catch (error: any) {
      console.error("Product creation error:", error);
      throw new Error(error.message || "فشل في إنشاء المنتج");
    }
  },

  update: async (product: any): Promise<any> => {
    try {
      const { id, ...updateData } = product;

      // Map fields to match schema
      const mappedData: any = {};
      if (updateData.name) mappedData.name = updateData.name;
      if (updateData.description) mappedData.description = updateData.description;
      if (updateData.price !== undefined) mappedData.price = updateData.price;
      if (updateData.comparePrice !== undefined || updateData.originalPrice !== undefined) {
        mappedData.comparePrice = updateData.comparePrice || updateData.originalPrice || null;
      }
      if (updateData.stock !== undefined || updateData.stockQuantity !== undefined) {
        const stockValue = updateData.stock ?? updateData.stockQuantity ?? 0;
        mappedData.stock = stockValue;
        mappedData.stockQuantity = stockValue; // Also set stockQuantity to match schema
      }
      if (updateData.categoryId) {
        mappedData.categoryId = updateData.categoryId;
        mappedData.categoryIds = [updateData.categoryId]; // Sync
      }
      if (updateData.categoryIds) {
        mappedData.categoryIds = updateData.categoryIds;
        if (updateData.categoryIds.length > 0) {
          mappedData.categoryId = updateData.categoryIds[0]; // Sync
        }
      }

      if (updateData.images) mappedData.images = updateData.images;
      if (updateData.tags) mappedData.tags = updateData.tags;
      if (updateData.isActive !== undefined) mappedData.isActive = updateData.isActive;
      if (updateData.isFeatured !== undefined) mappedData.isFeatured = updateData.isFeatured;
      if (updateData.isFeaturedInHero !== undefined) mappedData.isFeaturedInHero = updateData.isFeaturedInHero;
      if (updateData.isFlashDeal !== undefined) mappedData.isFlashDeal = updateData.isFlashDeal;
      if (updateData.rating !== undefined) mappedData.rating = updateData.rating;
      if (updateData.reviewCount !== undefined) mappedData.reviewCount = updateData.reviewCount;

      // Add optional fields (will be ignored if attributes don't exist)
      if (updateData.merchantId) mappedData.merchantId = updateData.merchantId;
      if (updateData.colors) mappedData.colors = updateData.colors;
      if (updateData.sizes) mappedData.sizes = updateData.sizes;
      if (updateData.colorSizeInventory !== undefined) {
        mappedData.colorSizeInventory = updateData.colorSizeInventory;
        console.log("📦 Updating colorSizeInventory:", updateData.colorSizeInventory);
      }

      try {
        const doc = await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.PRODUCTS,
          id,
          mappedData
        );

        return {
          id: doc.$id,
          name: doc.name,
          description: doc.description,
          price: doc.price,
          comparePrice: doc.comparePrice,
          stock: doc.stock,
          categoryId: doc.categoryId,
          categoryIds: doc.categoryIds || (doc.categoryId ? [doc.categoryId] : []),
          images: doc.images,
          tags: doc.tags,
          isActive: doc.isActive,
          isFeatured: doc.isFeatured,
          rating: doc.rating,
          reviewCount: doc.reviewCount,
          updatedAt: doc.$updatedAt,
        };
      } catch (error: any) {
        // If error is about unknown attribute, retry without optional fields
        if (error.message?.includes('Unknown attribute')) {
          console.warn('Retrying update without optional attributes:', error.message);

          // Remove optional attributes that might not exist
          delete mappedData.colorSizeInventory;
          delete mappedData.merchantId;
          delete mappedData.colors;
          delete mappedData.sizes;

          const doc = await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.PRODUCTS,
            id,
            mappedData
          );

          return {
            id: doc.$id,
            name: doc.name,
            description: doc.description,
            price: doc.price,
            comparePrice: doc.comparePrice,
            stock: doc.stock,
            categoryId: doc.categoryId,
            images: doc.images,
            tags: doc.tags,
            isActive: doc.isActive,
            isFeatured: doc.isFeatured,
            rating: doc.rating,
            reviewCount: doc.reviewCount,
            updatedAt: doc.$updatedAt,
          };
        }

        throw error;
      }
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث المنتج");
    }
  },

  delete: async (id: string): Promise<{ message: string }> => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        id
      );

      return { message: "تم حذف المنتج بنجاح" };
    } catch (error: any) {
      throw new Error(error.message || "فشل في حذف المنتج");
    }
  },
};

// Admin Categories API
// Admin Categories API
export const adminCategoriesApi = {
  create: async (category: any): Promise<any> => {
    try {
      // Generate slug from name if not provided
      const slug = category.slug || category.name
        .toLowerCase()
        .replace(/[أ-ي\s]+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

      const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        "unique()",
        {
          name: category.name,
          slug: slug,
          description: category.description || "",
          image: category.image || "",
          isActive: category.isActive ?? true,
          parentId: category.parentId || null,
        }
      );

      return {
        id: doc.$id,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        image: doc.image,
        productCount: 0,
        isActive: doc.isActive,
        parentId: doc.parentId,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      };
    } catch (error: any) {
      console.error("Category creation error:", error);
      throw new Error(error.message || "فشل في إنشاء الفئة");
    }
  },

  update: async (id: string, category: any): Promise<any> => {
    try {
      const updateData: any = {
        name: category.name,
        description: category.description,
        image: category.image,
        isActive: category.isActive,
        parentId: category.parentId || null,
      };

      if (category.slug) {
        updateData.slug = category.slug;
      }

      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        id,
        updateData
      );

      return {
        id: doc.$id,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        image: doc.image,
        productCount: doc.productCount || 0,
        isActive: doc.isActive,
        parentId: doc.parentId,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      };
    } catch (error: any) {
      console.error("Category update error:", error);
      throw new Error(error.message || "فشل في تحديث الفئة");
    }
  },

  delete: async (id: string): Promise<{ message: string }> => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        id
      );

      return { message: "تم حذف الفئة بنجاح" };
    } catch (error: any) {
      throw new Error(error.message || "فشل في حذف الفئة");
    }
  },
};

// Admin Users API
export const adminUsersApi = {
  getAll: async (): Promise<any[]> => {
    try {
      console.log("Fetching all users from Appwrite Auth...");

      // First try to get users from Appwrite Auth
      try {
        // Get current session to ensure we have admin privileges
        const currentUser = await account.get();
        console.log("Current user:", currentUser);

        // Try to get users from the users collection if it exists
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [Query.orderDesc("$createdAt"), Query.limit(1000)]
        );

        console.log("Users from collection:", response);

        if (response.documents.length > 0) {
          return response.documents.map((doc: any) => ({
            id: doc.$id,
            email: doc.email || doc.userEmail || '',
            name: doc.name || doc.userName || doc.email?.split('@')[0] || 'مستخدم',
            avatar: doc.avatar || doc.profileImage || "",
            role: doc.role || (doc.isAdmin ? "ADMIN" : "USER"),
            isActive: doc.isActive !== false,
            isAffiliate: doc.isAffiliate === true,
            isMerchant: doc.isMerchant === true,
            createdAt: doc.$createdAt,
            updatedAt: doc.$updatedAt,
          }));
        }
      } catch (collectionError: any) {
        console.log("Users collection error:", collectionError);

        // Try to get users from Appwrite Auth using Teams API
        try {
          // This requires proper server-side API setup
          // For now, we'll try alternative methods
          console.log("Attempting to fetch users via alternative method...");
        } catch (authError) {
          console.error("Auth API error:", authError);
        }
      }

      // If absolutely no users found, return empty array instead of mock data
      console.warn("⚠️ No users collection found. Please create 'users' collection in Appwrite.");
      console.warn("📝 Collection should have attributes: email, name, avatar, role, isActive, isAffiliate, isMerchant");

      // Return empty array - no mock data
      return [];
    } catch (error: any) {
      console.error("Error fetching users:", error);
      // Return empty array on error
      return [];
    }
  },

  getAllAffiliates: async (): Promise<any[]> => {
    try {
      // Try to get affiliates from users collection
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [Query.equal("isAffiliate", true), Query.limit(1000)]
        );

        if (response.documents.length > 0) {
          return response.documents.map((doc: any) => ({
            id: doc.$id,
            email: doc.email || doc.userEmail || '',
            name: doc.name || doc.userName || doc.email?.split('@')[0] || 'شريك',
            affiliateCode: doc.affiliateCode || `AFF${doc.$id.substring(0, 6).toUpperCase()}`,
            commissionRate: doc.commissionRate || 15,
            totalEarnings: doc.totalEarnings || 0,
            pendingEarnings: doc.pendingEarnings || 0,
            referralCount: doc.referralCount || 0,
            joinedAt: doc.$createdAt,
            user: {
              id: doc.$id,
              email: doc.email || doc.userEmail || '',
              name: doc.name || doc.userName || doc.email?.split('@')[0] || 'شريك',
              avatar: doc.avatar || "",
              role: "USER",
              isActive: doc.isActive !== false,
              createdAt: doc.$createdAt,
              updatedAt: doc.$updatedAt,
            },
          }));
        }
      } catch (error) {
        console.log("Error fetching affiliates from collection:", error);
      }

      // If no affiliates found, return empty array
      console.warn("⚠️ No affiliates found in users collection.");
      console.warn("📝 Make sure users with isAffiliate=true exist in the database.");

      // Return empty array - no mock data
      return [];
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      return [];
    }
  },

  updateRole: async (id: string, role: string): Promise<any> => {
    try {
      // Note: Role management should be done through Appwrite's Teams/Roles system
      // For now, we'll just update the user document if there's a role field
      // In a real system, you'd use Appwrite's permissions and teams
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        id,
        { role: role }
      );

      return {
        id: doc.$id,
        role: doc.role || "USER",
        updatedAt: doc.$updatedAt,
      };
    } catch (error: any) {
      console.error("Error updating role:", error);
      throw new Error(error.message || "فشل في تحديث دور المستخدم");
    }
  },

  updateStatus: async (id: string, isActive: boolean): Promise<any> => {
    try {
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        id,
        { isActive }
      );

      return {
        id: doc.$id,
        isActive: doc.isActive,
        updatedAt: doc.$updatedAt,
      };
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث حالة المستخدم");
    }
  },
};

// Admin Orders API
export const adminOrdersApi = {
  getAll: async (): Promise<any[]> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.orderDesc("$createdAt")]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        orderNumber: doc.orderNumber,
        status: doc.status,
        total: doc.total,
        userId: doc.userId,
        createdAt: doc.$createdAt,
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  updateStatus: async (id: string, status: string): Promise<any> => {
    try {
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        id,
        { status }
      );

      return {
        id: doc.$id,
        status: doc.status,
        updatedAt: doc.$updatedAt,
      };
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث حالة الطلب");
    }
  },
};

// Admin Commissions API
export const adminCommissionsApi = {
  getAll: async (): Promise<any[]> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMMISSIONS,
        [Query.orderDesc("$createdAt")]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        amount: doc.amount,
        status: doc.status,
        affiliateId: doc.affiliateId,
        orderId: doc.orderId,
        createdAt: doc.$createdAt,
      }));
    } catch (error) {
      console.error("Error fetching commissions:", error);
      return [];
    }
  },

  updateStatus: async (id: string, status: string): Promise<any> => {
    try {
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.COMMISSIONS,
        id,
        { status }
      );

      return {
        id: doc.$id,
        status: doc.status,
        updatedAt: doc.$updatedAt,
      };
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث حالة العمولة");
    }
  },
};

// Admin OpenAI Keys API
export const openAIKeysApi = {
  list: async (): Promise<AdminOpenAIKey[]> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        [Query.orderDesc("$createdAt")]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        label: doc.label,
        provider: doc.provider || "openai",
        key: doc.apiKey,
        isActive: doc.status === 'active', // Legacy support
        isDefault: doc.isDefault || false,
        priority: doc.priority || 0,
        status: doc.keyStatus || (doc.status === 'active' ? 'active' : 'error'), // Map DB status to UI status
        lastError: doc.lastError,
        lastTestedAt: doc.lastTestedAt,
        createdAt: doc.$createdAt,
      }));
    } catch (error) {
      console.error("Error fetching OpenAI keys:", error);
      return [];
    }
  },

  getActive: async (): Promise<AdminOpenAIKey | null> => {
    try {
      // 1. Try to find a default key first
      const defaultKeys = await databases.listDocuments(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        [
          Query.equal("isDefault", true),
          Query.limit(1)
        ]
      );

      if (defaultKeys.documents.length > 0) {
        const doc = defaultKeys.documents[0];
        return {
          id: doc.$id,
          label: doc.label,
          provider: doc.provider || "openai",
          key: doc.key || doc.apiKey,
          isActive: true,
          isDefault: true,
          priority: doc.priority || 0,
          status: doc.keyStatus || 'active',
        } as AdminOpenAIKey;
      }

      // 2. If no default, find any active key
      const activeKeys = await databases.listDocuments(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        [
          Query.equal("status", "active"),
          Query.limit(1)
        ]
      );

      if (activeKeys.documents.length > 0) {
        const doc = activeKeys.documents[0];
        return {
          id: doc.$id,
          label: doc.label,
          provider: doc.provider || "openai",
          key: doc.key || doc.apiKey,
          isActive: true,
          isDefault: false,
          priority: doc.priority || 0,
          status: doc.keyStatus || 'active',
        } as AdminOpenAIKey;
      }

      return null;
    } catch (error) {
      console.error("Error fetching active OpenAI key:", error);
      return null;
    }
  },


  create: async (payload: { label: string; key: string; provider: "openai" | "gemini"; priority?: number; isDefault?: boolean }): Promise<AdminOpenAIKey> => {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        ID.unique(),
        {
          label: payload.label,
          apiKey: payload.key, // Legacy
          key: payload.key,    // New
          provider: payload.provider,
          status: 'active',    // Legacy
          keyStatus: 'active', // New
          priority: payload.priority || 0,
          isDefault: payload.isDefault || false,
          isActive: true,
          usageCount: 0,
          errorCount: 0
        }
      );

      return {
        id: doc.$id,
        label: doc.label,
        provider: doc.provider,
        isActive: true,
        isDefault: doc.isDefault,
        priority: doc.priority,
        status: 'active',
      } as AdminOpenAIKey;
    } catch (error: any) {
      throw new Error(error.message || "فشل في إضافة مفتاح API");
    }
  },

  update: async (id: string, payload: Partial<{ label: string; key: string; isActive: boolean; provider: "openai" | "gemini" }>): Promise<AdminOpenAIKey> => {
    try {
      const updatePayload: any = { ...payload };

      // Sync duplicate fields
      if (payload.key) {
        updatePayload.apiKey = payload.key;
      }

      // Map isActive to status/keyStatus if needed
      if (payload.isActive !== undefined) {
        const status = payload.isActive ? 'active' : 'inactive';
        updatePayload.status = status;
        updatePayload.keyStatus = status;
      }

      const doc = await databases.updateDocument(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        id,
        updatePayload
      );

      return {
        id: doc.$id,
        label: doc.label,
        provider: doc.provider,
        isActive: doc.isActive,
        isDefault: doc.isDefault,
        priority: doc.priority,
        status: doc.keyStatus || doc.status || 'active',
      } as AdminOpenAIKey;
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث مفتاح API");
    }
  },

  remove: async (id: string): Promise<void> => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        id
      );
    } catch (error: any) {
      throw new Error(error.message || "فشل في حذف مفتاح API");
    }
  },

  test: async (id: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      // 1. Get the key from Appwrite
      const doc = await databases.getDocument(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        id
      );

      const apiKey = doc.key || doc.apiKey; // Try both
      let provider = doc.provider || "openai";

      // Auto-detect provider based on key prefix
      if (apiKey && apiKey.startsWith('sk-')) {
        provider = 'openai';
      } else if (apiKey && apiKey.startsWith('AIza')) {
        provider = 'gemini';
      }

      if (!apiKey) {
        return { ok: false, error: "المفتاح غير موجود" };
      }

      let isValid = false;
      let errorMessage = "";

      // 2. Test based on provider
      if (provider === "gemini") {
        // Test Gemini Key
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (response.ok) {
          isValid = true;
        } else {
          const errorData = await response.json().catch(() => ({}));
          errorMessage = errorData.error?.message || `Gemini Error: ${response.status}`;
        }
      } else {
        // Test OpenAI Key
        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });

        if (response.ok) {
          isValid = true;
        } else {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 429) {
            errorMessage = "تم تجاوز حد الاستخدام (Quota Exceeded) - الرصيد غير كافي";
          } else if (response.status === 401) {
            errorMessage = "المفتاح غير صحيح (Unauthorized)";
          } else {
            errorMessage = errorData.error?.message || `OpenAI Error: ${response.status}`;
          }
        }
      }

      // 3. Update key status in DB
      await databases.updateDocument(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        id,
        {
          lastTestedAt: new Date().toISOString(),
          lastError: isValid ? null : errorMessage,
          keyStatus: isValid ? 'active' : (errorMessage.includes('Quota') ? 'quota_exceeded' : 'error'),
          status: isValid ? 'active' : (errorMessage.includes('Quota') ? 'quota_exceeded' : 'error') // Sync legacy
        }
      );

      if (isValid) {
        return { ok: true };
      } else {
        return { ok: false, error: errorMessage };
      }
    } catch (error: any) {
      return { ok: false, error: error.message || "حدث خطأ أثناء اختبار المفتاح" };
    }
  },

  activate: async (id: string): Promise<AdminOpenAIKey> => {
    try {
      // 1. Get all keys to unset their default status
      const allKeys = await databases.listDocuments(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys
      );

      // 2. Unset isDefault for all other keys
      await Promise.all(allKeys.documents.map(async (key) => {
        if (key.$id !== id && key.isDefault) {
          await databases.updateDocument(
            DATABASE_ID,
            appwriteConfig.collections.openai_keys,
            key.$id,
            { isDefault: false }
          );
        }
      }));

      // 3. Set the target key as default
      const doc = await databases.updateDocument(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        id,
        {
          isDefault: true,
          keyStatus: 'active', // Reset status when activating
          status: 'active',    // Sync legacy
          lastError: null
        }
      );

      return {
        id: doc.$id,
        label: doc.label,
        provider: doc.provider,
        isActive: true,
        isDefault: true,
        priority: doc.priority,
        status: 'active',
      } as AdminOpenAIKey;
    } catch (error: any) {
      throw new Error(error.message || "فشل في تفعيل المفتاح");
    }
  },

  updateStatus: async (id: string, status: 'active' | 'quota_exceeded' | 'error', error?: string): Promise<void> => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        id,
        {
          keyStatus: status,
          status: status, // Sync legacy
          lastError: error ? error.substring(0, 999) : null, // Truncate to fit schema
          lastTestedAt: new Date().toISOString()
        }
      );
    } catch (error) {
      console.error("Error updating key status:", error);
    }
  }
};

export const getAdminOpenAIKeys = openAIKeysApi.list;

// AI Content Generation API
export const aiContentApi = {
  improveDescription: async (productName: string, currentDescription: string): Promise<string> => {
    try {
      // 1. Get active key
      const activeKey = await openAIKeysApi.getActive();

      if (!activeKey || !activeKey.key) {
        throw new Error("لا يوجد مفتاح ذكاء اصطناعي نشط. يرجى إضافته من الإعدادات المتقدمة.");
      }

      const systemPrompt = `أنت خبير تسويق إلكتروني محترف متخصص في كتابة وصف منتجات جذاب ومقنع باللغة العربية.
مهمتك هي تحسين وصف المنتج التالي ليكون أكثر جاذبية للمشترين، مع التركيز على الفوائد والمميزات.
استخدم لغة تسويقية قوية، واجعل الوصف منظمًا وسهل القراءة.
لا تضف أي مقدمات أو خاتمات، فقط نص الوصف المحسن.`;

      const userPrompt = `اسم المنتج: ${productName}
الوصف الحالي: ${currentDescription || "لا يوجد وصف"}

قم بكتابة وصف احترافي وجذاب لهذا المنتج.`;

      // 2. Call API based on provider
      if (activeKey.provider === "gemini") {
        // Try gemini-1.5-flash-001 which is the stable version
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${activeKey.key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemPrompt}\n\n${userPrompt}`
              }]
            }]
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `Gemini Error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || currentDescription;

      } else {
        // OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeKey.key}`
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error?.message || `OpenAI Error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || currentDescription;
      }

    } catch (error: any) {
      console.error("AI Improvement Error:", error);
      throw new Error(error.message || "فشل في تحسين الوصف");
    }
  }
};
