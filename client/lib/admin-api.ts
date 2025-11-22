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
  provider: "openai" | "gemini" | "sambanova";
  key?: string;
  model?: string;
  isActive: boolean;
  isDefault: boolean;
  priority: number;
  status: 'active' | 'quota_exceeded' | 'error';
  lastError?: string;
  lastTestedAt?: string;
  capabilities?: ('text' | 'image')[];
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
      const ordersResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.orderDesc("$createdAt"), Query.limit(100)]
      );

      const productsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PRODUCTS,
        [Query.limit(1000)]
      );

      const usersResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.limit(1000)]
      );

      let totalAffiliates = 0;
      try {
        const affiliatesResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.USERS,
          [Query.equal("isAffiliate", true), Query.limit(1000)]
        );
        totalAffiliates = affiliatesResponse.total;
      } catch (error) {
        const allUsers = usersResponse.documents;
        totalAffiliates = allUsers.filter((user: any) => user.isAffiliate === true).length;
      }

      const commissionsResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMMISSIONS,
        [Query.limit(1000)]
      );

      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const monthlyOrders = ordersResponse.documents.filter(
        (order: any) => new Date(order.$createdAt) >= firstDayOfMonth
      );

      const thisMonthRevenue = monthlyOrders
        .filter((order: any) => order.status !== "CANCELLED")
        .reduce((sum: number, order: any) => sum + (order.total || 0), 0);

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

      const productSales: Record<string, { productId: string; quantity: number; revenue: number }> = {};
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

      const completedOrders = ordersResponse.documents.filter(
        (order: any) => order.status === "COMPLETED"
      ).length;
      const conversionRate = ordersResponse.total > 0 ? (completedOrders / ordersResponse.total) * 100 : 0;
      const averageOrderValue = ordersResponse.total > 0 ? totalRevenue / ordersResponse.total : 0;

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
        totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0, pendingOrders: 0,
        totalAffiliates: 0, pendingCommissions: 0, thisMonthRevenue: 0, thisMonthOrders: 0,
        recentOrders: [], topProducts: [], conversionRate: 0, averageOrderValue: 0, customerSatisfaction: 0,
      };
    }
  },
};

// Admin Products API
export const adminProductsApi = {
  create: async (product: any, userId?: string): Promise<any> => {
    try {
      const stockValue = product.stock || product.stockQuantity || 0;
      const documentData: any = {
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice || product.originalPrice || null,
        stock: stockValue,
        stockQuantity: stockValue,
        categoryId: product.categoryId || (product.categoryIds && product.categoryIds.length > 0 ? product.categoryIds[0] : null),
        categoryIds: product.categoryIds || (product.categoryId ? [product.categoryId] : []),
        images: product.images || [],
        tags: product.tags || [],
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        isFeaturedInHero: product.isFeaturedInHero ?? false,
        rating: 0,
        reviewCount: 0,
        status: userId ? 'pending' : 'approved',
      };

      if (product.merchantId) {
        documentData.merchantId = product.merchantId;
      } else if (userId) {
        documentData.merchantId = userId;
      }

      if (product.colors && Array.isArray(product.colors)) documentData.colors = product.colors;
      if (product.sizes && Array.isArray(product.sizes)) documentData.sizes = product.sizes;
      if (product.colorSizeInventory) documentData.colorSizeInventory = product.colorSizeInventory;

      try {
        const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, "unique()", documentData);
        return { ...doc, id: doc.$id };
      } catch (error: any) {
        if (error.message?.includes('Unknown attribute')) {
          delete documentData.colorSizeInventory;
          delete documentData.merchantId;
          delete documentData.colors;
          delete documentData.sizes;
          const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, "unique()", documentData);
          return { ...doc, id: doc.$id };
        }
        throw error;
      }
    } catch (error: any) {
      throw new Error(error.message || "فشل في إنشاء المنتج");
    }
  },

  update: async (product: any): Promise<any> => {
    try {
      const { id, ...updateData } = product;
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
        mappedData.stockQuantity = stockValue;
      }
      if (updateData.categoryId) {
        mappedData.categoryId = updateData.categoryId;
        mappedData.categoryIds = [updateData.categoryId];
      }
      if (updateData.categoryIds) {
        mappedData.categoryIds = updateData.categoryIds;
        if (updateData.categoryIds.length > 0) mappedData.categoryId = updateData.categoryIds[0];
      }
      if (updateData.images) mappedData.images = updateData.images;
      if (updateData.tags) mappedData.tags = updateData.tags;
      if (updateData.isActive !== undefined) mappedData.isActive = updateData.isActive;
      if (updateData.isFeatured !== undefined) mappedData.isFeatured = updateData.isFeatured;
      if (updateData.isFeaturedInHero !== undefined) mappedData.isFeaturedInHero = updateData.isFeaturedInHero;
      if (updateData.isFlashDeal !== undefined) mappedData.isFlashDeal = updateData.isFlashDeal;
      if (updateData.rating !== undefined) mappedData.rating = updateData.rating;
      if (updateData.reviewCount !== undefined) mappedData.reviewCount = updateData.reviewCount;
      if (updateData.merchantId) mappedData.merchantId = updateData.merchantId;
      if (updateData.colors) mappedData.colors = updateData.colors;
      if (updateData.sizes) mappedData.sizes = updateData.sizes;
      if (updateData.colorSizeInventory !== undefined) mappedData.colorSizeInventory = updateData.colorSizeInventory;

      try {
        const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id, mappedData);
        return { ...doc, id: doc.$id };
      } catch (error: any) {
        if (error.message?.includes('Unknown attribute')) {
          delete mappedData.colorSizeInventory;
          delete mappedData.merchantId;
          delete mappedData.colors;
          delete mappedData.sizes;
          const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id, mappedData);
          return { ...doc, id: doc.$id };
        }
        throw error;
      }
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث المنتج");
    }
  },

  delete: async (id: string): Promise<{ message: string }> => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id);
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
        ID.unique(),
        {
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          isActive: category.isActive ?? true,
          parentId: category.parentId || null,
        }
      );
      return { ...doc, id: doc.$id };
    } catch (error: any) {
      throw new Error(error.message || "فشل في إنشاء الفئة");
    }
  },

  update: async (category: any): Promise<any> => {
    try {
      const { id, ...updateData } = category;
      const doc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.CATEGORIES,
        id,
        updateData
      );
      return { ...doc, id: doc.$id };
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث الفئة");
    }
  },

  delete: async (id: string): Promise<{ message: string }> => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.CATEGORIES, id);
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
    } catch (error: any) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  getAllAffiliates: async (): Promise<any[]> => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.USERS,
        [Query.equal("isAffiliate", true), Query.limit(1000)]
      );
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
      }));
    } catch (error) {
      console.error("Error fetching affiliates:", error);
      return [];
    }
  },

  updateRole: async (id: string, role: string): Promise<any> => {
    try {
      const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, id, { role: role });
      return { id: doc.$id, role: doc.role, updatedAt: doc.$updatedAt };
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث دور المستخدم");
    }
  },

  updateStatus: async (id: string, isActive: boolean): Promise<any> => {
    try {
      const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.USERS, id, { isActive });
      return { id: doc.$id, isActive: doc.isActive, updatedAt: doc.$updatedAt };
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث حالة المستخدم");
    }
  },
};

// Admin Orders API
export const adminOrdersApi = {
  getAll: async (): Promise<any[]> => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [Query.orderDesc("$createdAt")]);
      return response.documents.map((doc: any) => ({
        id: doc.$id,
        orderNumber: doc.orderNumber,
        status: doc.status,
        total: doc.total,
        userId: doc.userId,
        createdAt: doc.$createdAt,
      }));
    } catch (error) {
      return [];
    }
  },

  updateStatus: async (id: string, status: string): Promise<any> => {
    try {
      const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.ORDERS, id, { status });
      return { id: doc.$id, status: doc.status, updatedAt: doc.$updatedAt };
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث حالة الطلب");
    }
  },
};

// Admin Commissions API
export const adminCommissionsApi = {
  getAll: async (): Promise<any[]> => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.COMMISSIONS, [Query.orderDesc("$createdAt")]);
      return response.documents.map((doc: any) => ({
        id: doc.$id,
        amount: doc.amount,
        status: doc.status,
        affiliateId: doc.affiliateId,
        orderId: doc.orderId,
        createdAt: doc.$createdAt,
      }));
    } catch (error) {
      return [];
    }
  },

  updateStatus: async (id: string, status: string): Promise<any> => {
    try {
      const doc = await databases.updateDocument(DATABASE_ID, COLLECTIONS.COMMISSIONS, id, { status });
      return { id: doc.$id, status: doc.status, updatedAt: doc.$updatedAt };
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
        model: doc.model,
        isActive: doc.status === 'active',
        isDefault: doc.isDefault || false,
        priority: doc.priority || 0,
        status: doc.keyStatus || (doc.status === 'active' ? 'active' : 'error'),
        lastError: doc.lastError,
        lastTestedAt: doc.lastTestedAt,
        capabilities: doc.capabilities || ['text'], // Default to text
        createdAt: doc.$createdAt,
      }));
    } catch (error) {
      console.error("Error fetching OpenAI keys:", error);
      return [];
    }
  },

  getActiveKey: async (capability: 'text' | 'image' = 'text'): Promise<AdminOpenAIKey> => {
    try {
      const keys = await openAIKeysApi.list();
      // Filter active keys that have the required capability
      const activeKeys = keys.filter(k =>
        k.status === 'active' &&
        (!k.capabilities || k.capabilities.includes(capability))
      );

      if (activeKeys.length === 0) {
        throw new Error(`No active API keys found for ${capability}`);
      }

      const defaultKey = activeKeys.find(k => k.isDefault);
      return defaultKey || activeKeys[0];
    } catch (error) {
      console.error('Error getting active key:', error);
      throw error;
    }
  },

  // Legacy support
  getActive: async (): Promise<AdminOpenAIKey | null> => {
    try {
      return await openAIKeysApi.getActiveKey('text');
    } catch (e) {
      return null;
    }
  },

  create: async (data: { label: string; provider: 'openai' | 'gemini' | 'sambanova'; key: string; isDefault?: boolean; model?: string; capabilities?: ('text' | 'image')[] }) => {
    try {
      const doc = await databases.createDocument(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        ID.unique(),
        {
          label: data.label,
          provider: data.provider,
          apiKey: data.key,
          key: data.key,
          isDefault: data.isDefault || false,
          status: 'active',
          keyStatus: 'active',
          model: data.model,
          capabilities: data.capabilities || ['text']
        }
      );
      return { ...doc, id: doc.$id } as unknown as AdminOpenAIKey;
    } catch (error: any) {
      throw new Error(error.message || "فشل في إضافة مفتاح API");
    }
  },

  update: async (id: string, payload: Partial<{ label: string; key: string; isActive: boolean; provider: "openai" | "gemini" | "sambanova"; model?: string; capabilities?: ('text' | 'image')[] }>): Promise<AdminOpenAIKey> => {
    try {
      const updatePayload: any = { ...payload };
      if (payload.key) updatePayload.apiKey = payload.key;
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
      return { ...doc, id: doc.$id } as unknown as AdminOpenAIKey;
    } catch (error: any) {
      throw new Error(error.message || "فشل في تحديث مفتاح API");
    }
  },

  remove: async (id: string): Promise<void> => {
    try {
      await databases.deleteDocument(DATABASE_ID, appwriteConfig.collections.openai_keys, id);
    } catch (error: any) {
      throw new Error(error.message || "فشل في حذف مفتاح API");
    }
  },

  test: async (id: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const doc = await databases.getDocument(DATABASE_ID, appwriteConfig.collections.openai_keys, id);
      const apiKey = doc.key || doc.apiKey;
      let provider = doc.provider || "openai";

      if (apiKey && apiKey.startsWith('sk-')) provider = 'openai';
      else if (apiKey && apiKey.startsWith('AIza')) provider = 'gemini';
      else if (apiKey && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(apiKey)) provider = 'sambanova';

      if (!apiKey) return { ok: false, error: "المفتاح غير موجود" };

      let isValid = false;
      let errorMessage = "";

      if (provider === "gemini") {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (response.ok) isValid = true;
        else {
          const errorData = await response.json().catch(() => ({}));
          errorMessage = errorData.error?.message || `Gemini Error: ${response.status}`;
        }
      } else if (provider === "sambanova") {
        const response = await fetch('https://api.sambanova.ai/v1/models', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (response.ok) isValid = true;
        else {
          const errorData = await response.json().catch(() => ({}));
          errorMessage = errorData.error?.message || `SambaNova Error: ${response.status}`;
        }
      } else {
        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (response.ok) isValid = true;
        else {
          const errorData = await response.json().catch(() => ({}));
          errorMessage = errorData.error?.message || `OpenAI Error: ${response.status}`;
        }
      }

      await databases.updateDocument(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        id,
        {
          lastTestedAt: new Date().toISOString(),
          lastError: isValid ? null : errorMessage,
          keyStatus: isValid ? 'active' : (errorMessage.includes('Quota') ? 'quota_exceeded' : 'error'),
          status: isValid ? 'active' : (errorMessage.includes('Quota') ? 'quota_exceeded' : 'error'),
          provider: provider
        }
      );

      return isValid ? { ok: true } : { ok: false, error: errorMessage };
    } catch (error: any) {
      return { ok: false, error: error.message || "حدث خطأ أثناء اختبار المفتاح" };
    }
  },

  getModels: async (key: string, provider: string): Promise<string[]> => {
    try {
      if (provider === "sambanova") {
        const response = await fetch('https://api.sambanova.ai/v1/models', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${key}` }
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.data
          .filter((m: any) => m.id.includes('instruct') || m.id.includes('Llama'))
          .map((m: any) => m.id);
      }
      return [];
    } catch (error) {
      return [];
    }
  },

  activate: async (id: string): Promise<AdminOpenAIKey> => {
    try {
      const allKeys = await databases.listDocuments(DATABASE_ID, appwriteConfig.collections.openai_keys);
      await Promise.all(allKeys.documents.map(async (key) => {
        if (key.$id !== id && key.isDefault) {
          await databases.updateDocument(DATABASE_ID, appwriteConfig.collections.openai_keys, key.$id, { isDefault: false });
        }
      }));
      const doc = await databases.updateDocument(
        DATABASE_ID,
        appwriteConfig.collections.openai_keys,
        id,
        { isDefault: true, keyStatus: 'active', status: 'active', lastError: null }
      );
      return { ...doc, id: doc.$id } as unknown as AdminOpenAIKey;
    } catch (error: any) {
      throw new Error(error.message || "فشل في تفعيل المفتاح");
    }
  },
};

export const getAdminOpenAIKeys = openAIKeysApi.list;

// AI Content Generation API
export const aiContentApi = {
  improveDescription: async (productName: string, currentDescription: string): Promise<string> => {
    try {
      const activeKey = await openAIKeysApi.getActiveKey('text');
      const systemPrompt = `أنت خبير تسويق إلكتروني محترف متخصص في كتابة وصف منتجات جذاب ومقنع باللغة العربية.
مهمتك هي تحسين وصف المنتج التالي ليكون أكثر جاذبية للمشترين، مع التركيز على الفوائد والمميزات.
استخدم لغة تسويقية قوية، واجعل الوصف منظمًا وسهل القراءة.
لا تضف أي مقدمات أو خاتمات، فقط نص الوصف المحسن.`;

      const userPrompt = `اسم المنتج: ${productName}
الوصف الحالي: ${currentDescription || "لا يوجد وصف"}

قم بكتابة وصف احترافي وجذاب لهذا المنتج.`;

      if (activeKey.provider === "gemini") {
        try {
          const { GoogleGenerativeAI } = await import("@google/generative-ai");
          const genAI = new GoogleGenerativeAI(activeKey.key!);
          let model;
          try { model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" }); }
          catch (e) { model = genAI.getGenerativeModel({ model: "gemini-flash-latest" }); }

          const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
          return (await result.response).text() || currentDescription;
        } catch (geminiError: any) {
          // Fallback
          throw geminiError;
        }
      } else if (activeKey.provider === "sambanova") {
        const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${activeKey.key}` },
          body: JSON.stringify({
            model: activeKey.model || "Meta-Llama-3.3-70B-Instruct",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
            temperature: 0.7
          })
        });
        if (!response.ok) throw new Error(`SambaNova Error: ${response.status}`);
        const data = await response.json();
        return data.choices?.[0]?.message?.content || currentDescription;
      } else {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${activeKey.key}` },
          body: JSON.stringify({
            model: activeKey.model || "gpt-3.5-turbo",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
            temperature: 0.7
          })
        });
        if (!response.ok) throw new Error(`OpenAI Error: ${response.status}`);
        const data = await response.json();
        return data.choices?.[0]?.message?.content || currentDescription;
      }
    } catch (error: any) {
      console.error("AI Improvement Error:", error);
      throw new Error(error.message || "فشل في تحسين الوصف");
    }
  },

  suggestCategory: async (productName: string, productDescription: string, categories: { id: string; name: string }[]): Promise<string | null> => {
    try {
      const activeKey = await openAIKeysApi.getActiveKey('text');
      const categoriesList = categories.map(c => `- ${c.name} (ID: ${c.id})`).join('\n');
      const systemPrompt = `أنت خبير تصنيف منتجات. مهمتك هي اختيار أنسب فئة للمنتج من القائمة المتاحة فقط.
يجب أن يكون الرد عبارة عن ID الفئة فقط، بدون أي نص إضافي.
إذا لم تجد فئة مناسبة، رد بـ "null".

قائمة الفئات المتاحة:
${categoriesList}`;

      const userPrompt = `اسم المنتج: ${productName}
وصف المنتج: ${productDescription || "لا يوجد وصف"}

ما هي الفئة المناسبة (ID فقط)؟`;

      if (activeKey.provider === "gemini") {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(activeKey.key!);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
        return (await result.response).text().trim();
      } else if (activeKey.provider === "sambanova") {
        const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${activeKey.key}` },
          body: JSON.stringify({
            model: activeKey.model || "Meta-Llama-3.3-70B-Instruct",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
            temperature: 0.3
          })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || null;
      } else {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${activeKey.key}` },
          body: JSON.stringify({
            model: activeKey.model || "gpt-3.5-turbo",
            messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
            temperature: 0.3
          })
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || null;
      }
    } catch (error) {
      console.error("Category Suggestion Error:", error);
      return null;
    }
  }
};
