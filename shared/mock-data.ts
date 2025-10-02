import { Product, Category } from "./api";

export const categories: Category[] = [
  {
    id: "electronics",
    name: "الإلكترونيات",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop",
    productCount: 45,
  },
  {
    id: "fashion",
    name: "الأزياء",
    slug: "fashion",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
    productCount: 78,
  },
  {
    id: "home-garden",
    name: "المنزل والحديقة",
    slug: "home-garden",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop",
    productCount: 32,
  },
  {
    id: "sports",
    name: "الرياضة وا��لياقة",
    slug: "sports",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
    productCount: 67,
  },
  {
    id: "beauty",
    name: "الجمال والصحة",
    slug: "beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=300&fit=crop",
    productCount: 54,
  },
  {
    id: "books",
    name: "الكتب والوسائط",
    slug: "books",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=300&fit=crop",
    productCount: 89,
  },
];

export const products: Product[] = [
  {
    id: "wireless-headphones-pro",
    name: "سماعات لاسلكية احترافية",
    description:
      "سماعات لاسلكية متميزة بتقنية إلغاء الضوضاء مع بطارية تدوم 30 ساعة وجودة صوت عالية الوضوح.",
    price: 299.99,
    originalPrice: 399.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
    ],
    category: "electronics",
    tags: ["لاسلكي", "إلغاء الضوضاء", "متميز", "صوت"],
    inStock: true,
    rating: 4.8,
    reviewCount: 127,
    affiliateCommission: 8,
  },
  {
    id: "smart-fitness-watch",
    name: "ساعة ذكية للياقة البدنية",
    description:
      "ساعة لياقة بدنية متطورة مع مراقبة معدل ضربات القلب ونظام تحديد المواقع وبطارية تدوم 7 أيام.",
    price: 249.99,
    originalPrice: 299.99,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    ],
    category: "sports",
    tags: ["لياقة", "ساعة ذكية", "صحة", "جي بي اس"],
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
    affiliateCommission: 12,
  },
  {
    id: "organic-skincare-set",
    name: "مجموعة العناية الطبيعية بالبشرة",
    description:
      "مجموعة كاملة من 5 قطع للعناية الطبيعية بالبشرة مع مكونات طبيعية لجميع أنواع البشرة.",
    price: 89.99,
    originalPrice: 129.99,
    images: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=600&fit=crop",
    ],
    category: "beauty",
    tags: ["طبيعي", "عنا��ة بالبشرة", "أعشاب", "روتين"],
    inStock: true,
    rating: 4.9,
    reviewCount: 203,
    affiliateCommission: 15,
  },
  {
    id: "ergonomic-office-chair",
    name: "كرسي مكتب مريح",
    description:
      "كرسي مكتب متميز بتصميم مريح مع دعم أسفل الظهر وارتفاع قابل للتعديل وتصميم شبكي للتهوية.",
    price: 399.99,
    originalPrice: 549.99,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    ],
    category: "home-garden",
    tags: ["مريح", "مكتب", "أثاث", "راحة"],
    inStock: true,
    rating: 4.7,
    reviewCount: 156,
    affiliateCommission: 10,
  },
  {
    id: "vintage-leather-jacket",
    name: "جاكيت جلدي كلاسيكي",
    description:
      "جاكيت جلدي أصيل بطراز كلاسيكي مصنوع من جلد البقر المتميز مع تفاصيل تصميم تقليدية.",
    price: 199.99,
    originalPrice: 279.99,
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7e22d10c4473?w=800&h=600&fit=crop",
    ],
    category: "fashion",
    tags: ["كلاسيكي", "جلد", "جاكيت", "أناقة"],
    inStock: true,
    rating: 4.5,
    reviewCount: 78,
    affiliateCommission: 18,
  },
  {
    id: "programming-mastery-book",
    name: "إتقان البرمجة: الدليل الشامل",
    description:
      "دليل شامل للبرمجة يغطي اللغات الحديثة والأطر وأفضل الممارسات في البرمجة.",
    price: 49.99,
    originalPrice: 69.99,
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    ],
    category: "books",
    tags: ["برمجة", "تعليم", "تكنولوجيا", "دليل"],
    inStock: true,
    rating: 4.8,
    reviewCount: 342,
    affiliateCommission: 25,
  },
  {
    id: "wireless-gaming-mouse",
    name: "فأرة ألعاب لاسلكية",
    description:
      "فأرة ألعاب لاسلكية عالية الدقة مع إضاءة RGB وأزرار قابلة للتخصيص.",
    price: 79.99,
    originalPrice: 99.99,
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1585863146983-1ddcd1b9ed86?w=800&h=600&fit=crop",
    ],
    category: "electronics",
    tags: ["ألعاب", "لاسلكي", "RGB", "دقة"],
    inStock: true,
    rating: 4.4,
    reviewCount: 95,
    affiliateCommission: 12,
  },
  {
    id: "yoga-mat-premium",
    name: "سجادة يوغا متميزة",
    description:
      "سجادة يوغا متميزة مقاومة للانزلاق مع توسيد ممتاز ومواد صديقة للبيئة.",
    price: 59.99,
    originalPrice: 79.99,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506629905607-676ead881b43?w=800&h=600&fit=crop",
    ],
    category: "sports",
    tags: ["يوغا", "لياقة", "صديق للبيئة", "مقاوم للانزلاق"],
    inStock: true,
    rating: 4.7,
    reviewCount: 167,
    affiliateCommission: 20,
  },
];

export const featuredProducts = products.slice(0, 4);
export const bestSellers = products.filter((p) => p.reviewCount > 100);
export const onSale = products.filter(
  (p) => p.originalPrice && p.originalPrice > p.price,
);
