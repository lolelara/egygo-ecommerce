import type {
  AdminStats,
  User,
  Product,
  Category,
  Order,
  Commission,
  AdminProductCreate,
  AdminProductUpdate,
} from "@shared/api";

const API_BASE = "/api/admin";

// Helper function for API calls
const apiCall = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Admin Dashboard API
export const adminDashboardApi = {
  getStats: async (): Promise<AdminStats> => {
    return apiCall("/stats");
  },
};

// Admin Products API
export const adminProductsApi = {
  create: async (product: AdminProductCreate): Promise<Product> => {
    return apiCall("/products", {
      method: "POST",
      body: JSON.stringify(product),
    });
  },

  update: async (product: AdminProductUpdate): Promise<Product> => {
    return apiCall(`/products/${product.id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiCall(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

// Admin Categories API
export const adminCategoriesApi = {
  create: async (
    category: Omit<Category, "id" | "productCount">,
  ): Promise<Category> => {
    return apiCall("/categories", {
      method: "POST",
      body: JSON.stringify(category),
    });
  },

  update: async (
    id: string,
    category: Omit<Category, "id" | "productCount">,
  ): Promise<Category> => {
    return apiCall(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(category),
    });
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiCall(`/categories/${id}`, {
      method: "DELETE",
    });
  },
};

// Admin Users API
export const adminUsersApi = {
  getAll: async (): Promise<User[]> => {
    return apiCall("/users");
  },

  updateRole: async (
    id: string,
    role: string,
    isActive: boolean,
  ): Promise<User> => {
    return apiCall(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify({ role, isActive }),
    });
  },
};

// Admin Orders API
export const adminOrdersApi = {
  getAll: async (): Promise<Order[]> => {
    return apiCall("/orders");
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    return apiCall(`/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

// Admin Commissions API
export const adminCommissionsApi = {
  getAll: async (): Promise<Commission[]> => {
    return apiCall("/commissions");
  },

  updateStatus: async (id: string, status: string): Promise<Commission> => {
    return apiCall(`/commissions/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

// Error handler
export const handleAdminApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "حدث خطأ غير متوقع";
};

// React Query keys for admin API
export const adminQueryKeys = {
  stats: ["admin", "stats"] as const,
  users: ["admin", "users"] as const,
  orders: ["admin", "orders"] as const,
  commissions: ["admin", "commissions"] as const,
};
