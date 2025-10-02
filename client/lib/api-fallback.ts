// Fallback API service using mock data when real API is not available
import {
  ProductListResponse,
  CategoryListResponse,
  ProductWithRelations,
  CategoryWithCount,
  ProductFilters,
  PaginationParams,
} from "@shared/prisma-types";

// Convert mock data to Prisma format
const mockCategories: CategoryWithCount[] = [
  {
    id: "electronics",
    name: "الإلكترونيات",
    slug: "electronics",
    description: "أحدث الأجهزة الإلكترونية والتكنولوجيا",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop",
    productCount: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fashion",
    name: "الأزياء",
    slug: "fashion",
    description: "أزياء عصرية وأناقة متميزة",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
    productCount: 78,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "home-garden",
    name: "المنزل والحديقة",
    slug: "home-garden",
    description: "كل ما تحتاجه للمنزل والحديقة",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop",
    productCount: 32,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sports",
    name: "الرياضة واللياقة",
    slug: "sports",
    description: "معدات رياضية ولياقة بدنية",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    productCount: 67,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "beauty",
    name: "الجمال والصحة",
    slug: "beauty",
    description: "منتجات العناية والجمال",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=300&fit=crop",
    productCount: 54,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "books",
    name: "الكتب والوسائط",
    slug: "books",
    description: "كتب ووسائط تعليمية وترفيهية",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop",
    productCount: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockProducts: ProductWithRelations[] = [
  {
    id: "wireless-headphones-pro",
    name: "سماعات لاسلكية احترافية",
    description:
      "سماعات لاسلكية متميزة بتقنية إلغاء الضوضاء مع بطارية تدوم 30 ساعة وجودة صوت عالية الوضوح.",
    price: 299.99,
    originalPrice: 399.99,
    sku: "WH-PRO-001",
    inStock: true,
    stockQuantity: 50,
    rating: 4.8,
    reviewCount: 127,
    affiliateCommission: 8,
    categoryId: "electronics",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[0],
    images: [
      {
        id: "1",
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
        alt: "سماعات لاسلكية احترافية",
        order: 0,
        productId: "wireless-headphones-pro",
        createdAt: new Date(),
      },
      {
        id: "2",
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
        alt: "سماعات لاسلكية احترافية - منظر جانبي",
        order: 1,
        productId: "wireless-headphones-pro",
        createdAt: new Date(),
      },
    ],
    tags: [
      { id: "1", name: "لاسلكي" },
      { id: "2", name: "إلغاء الضوضاء" },
      { id: "3", name: "متميز" },
      { id: "4", name: "صوت" },
    ],
    reviews: [],
  },
  {
    id: "smart-fitness-watch",
    name: "ساعة ذكية للياقة البدنية",
    description:
      "ساعة لياقة بدنية متطورة مع مراقبة معدل ضر��ات القلب ونظام تحديد المواقع وبطارية تدوم 7 أيام.",
    price: 249.99,
    originalPrice: 299.99,
    sku: "SW-FIT-001",
    inStock: true,
    stockQuantity: 30,
    rating: 4.6,
    reviewCount: 89,
    affiliateCommission: 12,
    categoryId: "sports",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[3],
    images: [
      {
        id: "3",
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
        alt: "ساعة ذكية للياقة البدنية",
        order: 0,
        productId: "smart-fitness-watch",
        createdAt: new Date(),
      },
    ],
    tags: [
      { id: "5", name: "لياقة" },
      { id: "6", name: "ساعة ذكية" },
      { id: "7", name: "صحة" },
      { id: "8", name: "جي بي اس" },
    ],
    reviews: [],
  },
  {
    id: "organic-skincare-set",
    name: "مجموعة العناية الطبيعية بالبشرة",
    description:
      "مجموعة كاملة من 5 قطع للعناية الطبيعية بالبشرة مع مكونات طبيعية لجميع أنواع البشرة.",
    price: 89.99,
    originalPrice: 129.99,
    sku: "SK-NAT-001",
    inStock: true,
    stockQuantity: 75,
    rating: 4.9,
    reviewCount: 203,
    affiliateCommission: 15,
    categoryId: "beauty",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[4],
    images: [
      {
        id: "4",
        url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=600&fit=crop",
        alt: "مجموعة العناية الطبيعية بالبشرة",
        order: 0,
        productId: "organic-skincare-set",
        createdAt: new Date(),
      },
    ],
    tags: [
      { id: "9", name: "طبيعي" },
      { id: "10", name: "عناية بالبشرة" },
      { id: "11", name: "أعشاب" },
      { id: "12", name: "روتين" },
    ],
    reviews: [],
  },
  {
    id: "ergonomic-office-chair",
    name: "كرسي مكتب مريح",
    description:
      "كرسي مكتب متميز بتصميم مريح مع دعم أسفل الظهر وارتفاع قابل للتعديل وتصميم شبكي للتهوية.",
    price: 399.99,
    originalPrice: 549.99,
    sku: "CH-ERG-001",
    inStock: true,
    stockQuantity: 20,
    rating: 4.7,
    reviewCount: 156,
    affiliateCommission: 10,
    categoryId: "home-garden",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[2],
    images: [
      {
        id: "5",
        url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        alt: "كرسي مكتب مريح",
        order: 0,
        productId: "ergonomic-office-chair",
        createdAt: new Date(),
      },
    ],
    tags: [],
    reviews: [],
  },
  {
    id: "vintage-leather-jacket",
    name: "جاكيت جلدي كلاسيكي",
    description:
      "جاكيت جلدي أصيل بطراز كلاسيكي مصنوع من جلد البقر المتميز مع تفاصيل تصميم تقليدية.",
    price: 199.99,
    originalPrice: 279.99,
    sku: "LJ-VIN-001",
    inStock: true,
    stockQuantity: 15,
    rating: 4.5,
    reviewCount: 78,
    affiliateCommission: 18,
    categoryId: "fashion",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[1],
    images: [
      {
        id: "6",
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
        alt: "جاكيت جلدي كلاسيكي",
        order: 0,
        productId: "vintage-leather-jacket",
        createdAt: new Date(),
      },
    ],
    tags: [
      { id: "13", name: "كلاسيكي" },
      { id: "14", name: "جلد" },
      { id: "15", name: "جاكيت" },
      { id: "16", name: "أناقة" },
    ],
    reviews: [],
  },
  {
    id: "programming-mastery-book",
    name: "إتقان البرمجة: الدليل الشامل",
    description:
      "دليل شامل للبرمجة يغطي اللغات الحديثة والأطر وأفضل الممارسات في البرمجة.",
    price: 49.99,
    originalPrice: 69.99,
    sku: "BK-PRG-001",
    inStock: true,
    stockQuantity: 100,
    rating: 4.8,
    reviewCount: 342,
    affiliateCommission: 25,
    categoryId: "books",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[5],
    images: [
      {
        id: "7",
        url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
        alt: "إتقان البرمجة: الدليل الشامل",
        order: 0,
        productId: "programming-mastery-book",
        createdAt: new Date(),
      },
    ],
    tags: [
      { id: "17", name: "برمجة" },
      { id: "18", name: "تعليم" },
      { id: "19", name: "تكنولوجيا" },
      { id: "20", name: "دليل" },
    ],
    reviews: [],
  },
  {
    id: "wireless-gaming-mouse",
    name: "فأرة ألعاب لاسلكية",
    description:
      "فأرة ألعاب لاسلكية عالية الدقة مع إضاءة RGB وأزرار قابلة للتخصيص.",
    price: 79.99,
    originalPrice: 99.99,
    sku: "MS-GAM-001",
    inStock: true,
    stockQuantity: 25,
    rating: 4.4,
    reviewCount: 95,
    affiliateCommission: 12,
    categoryId: "electronics",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[0],
    images: [
      {
        id: "8",
        url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
        alt: "فأرة ألعاب لاسلكية",
        order: 0,
        productId: "wireless-gaming-mouse",
        createdAt: new Date(),
      },
    ],
    tags: [
      { id: "21", name: "ألعاب" },
      { id: "22", name: "لاسلكي" },
      { id: "23", name: "RGB" },
      { id: "24", name: "دقة" },
    ],
    reviews: [],
  },
  {
    id: "yoga-mat-premium",
    name: "سجادة يوغا متميزة",
    description:
      "سجادة يوغا متميزة مقاومة للانزلاق مع توسيد ممتاز ومواد صديقة للبيئة.",
    price: 59.99,
    originalPrice: 79.99,
    sku: "YM-PRM-001",
    inStock: true,
    stockQuantity: 40,
    rating: 4.7,
    reviewCount: 167,
    affiliateCommission: 20,
    categoryId: "sports",
    createdAt: new Date(),
    updatedAt: new Date(),
    category: mockCategories[3],
    images: [
      {
        id: "9",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        alt: "سجادة يوغا متميزة",
        order: 0,
        productId: "yoga-mat-premium",
        createdAt: new Date(),
      },
    ],
    tags: [
      { id: "25", name: "يوغا" },
      { id: "26", name: "لياقة" },
      { id: "27", name: "صديق للبيئة" },
      { id: "28", name: "مقاوم للانزلاق" },
    ],
    reviews: [],
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fallback API functions
export const fallbackProductsApi = {
  getAll: async (
    filters?: ProductFilters & PaginationParams,
  ): Promise<ProductListResponse> => {
    await delay(500); // Simulate network delay

    let filtered = [...mockProducts];

    // Apply filters
    if (filters?.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      );
    }

    if (filters?.minPrice) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }

    if (filters?.maxPrice) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      default:
        // Featured - sort by rating and review count
        filtered.sort(
          (a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount,
        );
    }

    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const start = (page - 1) * limit;
    const products = filtered.slice(start, start + limit);

    return {
      products,
      total: filtered.length,
      page,
      limit,
    };
  },

  getById: async (id: string): Promise<ProductWithRelations> => {
    await delay(300);
    const product = mockProducts.find((p) => p.id === id);
    if (!product) {
      throw new Error("المنتج غير موجود");
    }
    return product;
  },

  getByCategory: async (
    categorySlug: string,
    filters?: ProductFilters & PaginationParams,
  ): Promise<ProductListResponse> => {
    const category = mockCategories.find((c) => c.slug === categorySlug);
    if (!category) {
      throw new Error("الفئة غير موجودة");
    }

    return fallbackProductsApi.getAll({
      ...filters,
      categoryId: category.id,
    });
  },
};

export const fallbackCategoriesApi = {
  getAll: async (): Promise<CategoryListResponse> => {
    await delay(300);
    return {
      categories: mockCategories,
    };
  },

  getBySlug: async (slug: string): Promise<CategoryWithCount> => {
    await delay(300);
    const category = mockCategories.find((c) => c.slug === slug);
    if (!category) {
      throw new Error("الفئة غير موجودة");
    }
    return category;
  },
};
