import { databases } from "./appwrite";
import { Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || "68de037e003bd03c4d45";
const COLLECTIONS = {
  PRODUCTS: "products",
  CATEGORIES: "categories",
  ORDERS: "orders",
  USERS: "users",
  REVIEWS: "reviews",
  COMMISSIONS: "commissions",
};

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

      // Get affiliates (users with affiliate label)
      // TODO: Implement affiliate counting - Using equal query instead of search
      let totalAffiliates = 0;
      try {
        const affiliatesResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [Query.equal("labels", ["affiliate"]), Query.limit(1000)]
        );
        totalAffiliates = affiliatesResponse.total;
      } catch (error) {
        console.error("Error fetching affiliates:", error);
        // Fallback: count from all users
        const allUsers = usersResponse.documents;
        totalAffiliates = allUsers.filter((user: any) => 
          user.labels && user.labels.includes("affiliate")
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
      };
    }
  },
};

// Admin Products API
export const adminProductsApi = {
  create: async (product: any): Promise<any> => {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        "unique()",
        {
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          categoryId: product.categoryId,
          inStock: product.inStock ?? true,
          stockQuantity: product.stockQuantity || 0,
          images: product.images || [],
          colors: product.colors || [],
          sizes: product.sizes || [],
          specifications: product.specifications || {},
          rating: 0,
          reviewCount: 0,
        }
      );

      return {
        id: doc.$id,
        ...product,
        createdAt: doc.$createdAt,
      };
    } catch (error: any) {
      throw new Error(error.message || "فشل في إنشاء المنتج");
    }
  },

  update: async (product: any): Promise<any> => {
    try {
      const { id, ...updateData } = product;
      
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        id,
        updateData
      );

      return {
        id: doc.$id,
        ...updateData,
        updatedAt: doc.$updatedAt,
      };
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
export const adminCategoriesApi = {
  create: async (category: any): Promise<any> => {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        "unique()",
        {
          name: category.name,
          slug: category.slug,
          description: category.description || "",
          image: category.image || "",
          productCount: 0,
        }
      );

      return {
        id: doc.$id,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        image: doc.image,
        productCount: doc.productCount,
        createdAt: doc.$createdAt,
      };
    } catch (error: any) {
      throw new Error(error.message || "فشل في إنشاء الفئة");
    }
  },

  update: async (id: string, category: any): Promise<any> => {
    try {
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        id,
        {
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
        }
      );

      return {
        id: doc.$id,
        name: doc.name,
        slug: doc.slug,
        description: doc.description,
        image: doc.image,
        updatedAt: doc.$updatedAt,
      };
    } catch (error: any) {
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
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.orderDesc("$createdAt"), Query.limit(1000)]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        email: doc.email,
        name: doc.name || doc.email.split('@')[0],
        avatar: doc.avatar || "",
        role: doc.labels?.includes("admin") ? "ADMIN" : "USER",
        isActive: doc.isActive !== false,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  getAllAffiliates: async (): Promise<any[]> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.search("labels", "affiliate"), Query.limit(1000)]
      );

      return response.documents.map((doc: any) => ({
        id: doc.$id,
        email: doc.email,
        name: doc.name || doc.email.split('@')[0],
        affiliateCode: doc.affiliateCode || `AFF${doc.$id.substring(0, 6).toUpperCase()}`,
        commissionRate: doc.commissionRate || 10,
        totalEarnings: doc.totalEarnings || 0,
        pendingEarnings: doc.pendingEarnings || 0,
        referralCount: doc.referralCount || 0,
        joinedAt: doc.$createdAt,
        user: {
          id: doc.$id,
          email: doc.email,
          name: doc.name || doc.email.split('@')[0],
          avatar: doc.avatar || "",
          role: "USER",
          isActive: doc.isActive !== false,
          createdAt: doc.$createdAt,
          updatedAt: doc.$updatedAt,
        },
      }));
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      return [];
    }
  },

  updateRole: async (id: string, role: string): Promise<any> => {
    try {
      const labels = role === "ADMIN" ? ["admin"] : [];
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        id,
        { labels }
      );

      return {
        id: doc.$id,
        role: doc.labels?.includes("admin") ? "ADMIN" : "USER",
        updatedAt: doc.$updatedAt,
      };
    } catch (error: any) {
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
