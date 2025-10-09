import { RequestHandler } from "express";
import { prisma } from "@shared/db";
import {
  ProductListResponse,
  ProductFilters,
  PaginationParams,
} from "@shared/prisma-types";

export const getProducts: RequestHandler = async (req, res) => {
  try {
    const {
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      searchQuery,
      sortBy = "featured",
      page = 1,
      limit = 12,
    } = req.query as Partial<
      ProductFilters & PaginationParams & { page: string; limit: string }
    >;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // Build where clause
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (inStock !== undefined) {
      where.inStock = String(inStock) === "true";
    }

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        {
          tags: {
            some: { name: { contains: searchQuery, mode: "insensitive" } },
          },
        },
      ];
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        // Featured: sort by rating * reviewCount
        orderBy = [{ rating: "desc" }, { reviewCount: "desc" }];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          tags: true,
          reviews: {
            include: {
              user: true,
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const response: ProductListResponse = {
      products,
      total,
      page: Number(page),
      limit: Number(limit),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "فشل في جلب المنتجات" });
  }
};

export const getProductById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        tags: true,
        reviews: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "المنتج غير موجود" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "فشل في جلب المنتج" });
  }
};

export const getProductsByCategory: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      minPrice,
      maxPrice,
      inStock,
      searchQuery,
      sortBy = "featured",
      page = 1,
      limit = 12,
    } = req.query as Partial<
      ProductFilters & PaginationParams & { page: string; limit: string }
    >;

    // Find category by slug
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      return res.status(404).json({ error: "الفئة غير موجودة" });
    }

    // Get products in this category
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = { categoryId: category.id };

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (inStock !== undefined) {
      where.inStock = String(inStock) === "true";
    }

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        {
          tags: {
            some: { name: { contains: searchQuery, mode: "insensitive" } },
          },
        },
      ];
    }

    let orderBy: any = {};
    switch (sortBy) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = [{ rating: "desc" }, { reviewCount: "desc" }];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          tags: true,
          reviews: {
            include: {
              user: true,
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const response: ProductListResponse = {
      products,
      total,
      page: Number(page),
      limit: Number(limit),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "فشل في جلب منتجات الفئة" });
  }
};
