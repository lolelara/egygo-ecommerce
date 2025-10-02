import {
  ProductListResponse,
  CategoryListResponse,
  ProductWithRelations,
  CategoryWithCount,
  ProductFilters,
  PaginationParams,
} from "@shared/prisma-types";
import { fallbackProductsApi, fallbackCategoriesApi } from "./api-fallback";

// Use Netlify functions for all API calls
const API_BASE = "/.netlify/functions";

// Check if API is available with better error handling
const isApiAvailable = async (): Promise<boolean> => {
  try {
    // Create a timeout promise to avoid hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout

    const response = await fetch(`${API_BASE}/ping`, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log("API not available, using fallback data:", error);
    return false;
  }
};

// Products API with robust fallback
export const productsApi = {
  getAll: async (
    filters?: ProductFilters & PaginationParams,
  ): Promise<ProductListResponse> => {
    try {
      if (!(await isApiAvailable())) {
        console.log("API not available, using fallback data");
        return fallbackProductsApi.getAll(filters);
      }

      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE}/products?${params}`);
      if (!response.ok) {
        throw new Error("فشل في جلب المنتجات");
      }
      return response.json();
    } catch (error) {
      console.log("Falling back to mock data due to error:", error);
      return fallbackProductsApi.getAll(filters);
    }
  },

  getById: async (id: string): Promise<ProductWithRelations> => {
    try {
      if (!(await isApiAvailable())) {
        return fallbackProductsApi.getById(id);
      }

      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) {
        throw new Error("فشل في جلب المنتج");
      }
      return response.json();
    } catch (error) {
      return fallbackProductsApi.getById(id);
    }
  },

  getByCategory: async (
    categorySlug: string,
    filters?: ProductFilters & PaginationParams,
  ): Promise<ProductListResponse> => {
    // Always use fallback data for now
    return fallbackProductsApi.getByCategory(categorySlug, filters);

    /*
    // TODO: Re-enable when API server is properly integrated
    try {
      if (!(await isApiAvailable())) {
        return fallbackProductsApi.getByCategory(categorySlug, filters);
      }

      const params = new URLSearchParams();

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${API_BASE}/categories/${categorySlug}/products?${params}`);
      if (!response.ok) {
        throw new Error('فشل في جلب منتجات الفئة');
      }
      return response.json();
    } catch (error) {
      return fallbackProductsApi.getByCategory(categorySlug, filters);
    }
    */
  },
};

// Categories API with robust fallback
export const categoriesApi = {
  getAll: async (): Promise<CategoryListResponse> => {
    try {
      if (!(await isApiAvailable())) {
        console.log("API not available, using fallback data");
        return fallbackCategoriesApi.getAll();
      }

      const response = await fetch(`${API_BASE}/categories`);
      if (!response.ok) {
        throw new Error("فشل في جلب الفئات");
      }
      return response.json();
    } catch (error) {
      console.log("Falling back to mock data due to error:", error);
      return fallbackCategoriesApi.getAll();
    }
  },

  getBySlug: async (slug: string): Promise<CategoryWithCount> => {
    // Always use fallback data for now
    return fallbackCategoriesApi.getBySlug(slug);

    /*
    // TODO: Re-enable when API server is properly integrated
    try {
      if (!(await isApiAvailable())) {
        return fallbackCategoriesApi.getBySlug(slug);
      }

      const response = await fetch(`${API_BASE}/categories/${slug}`);
      if (!response.ok) {
        throw new Error('فشل في جلب الفئة');
      }
      return response.json();
    } catch (error) {
      return fallbackCategoriesApi.getBySlug(slug);
    }
    */
  },

  updateProductCounts: async (): Promise<{ message: string }> => {
    // Mock response for now
    return { message: "تم تحديث عدد ا��منتجات (وضع التطوير)" };

    /*
    // TODO: Re-enable when API server is properly integrated
    try {
      if (!(await isApiAvailable())) {
        return { message: 'API غير متوفر' };
      }

      const response = await fetch(`${API_BASE}/categories/update-counts`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('فشل في تحديث عدد المنتجات');
      }
      return response.json();
    } catch (error) {
      return { message: 'فشل في تحديث عدد المنتجات' };
    }
    */
  },
};

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "حدث خطأ غير متوقع";
};

// React Query keys for caching
export const queryKeys = {
  products: ["products"] as const,
  product: (id: string) => ["products", id] as const,
  categories: ["categories"] as const,
  category: (slug: string) => ["categories", slug] as const,
  categoryProducts: (slug: string) => ["categories", slug, "products"] as const,
};
