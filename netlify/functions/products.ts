import type { Handler } from "@netlify/functions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handler: Handler = async (event, context) => {
  // Handle CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const {
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      searchQuery,
      sortBy = "featured",
      page = "1",
      limit = "12",
    } = event.queryStringParameters || {};

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filters
    const where: any = {};

    if (categoryId && categoryId !== "all") {
      where.categoryId = categoryId;
    }

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (inStock !== undefined) {
      where.inStock = inStock === "true";
    }

    // Build sort order
    let orderBy: any = { createdAt: "desc" }; // default: newest
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

    // Get products with relations
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy,
        include: {
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          tags: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    const response = {
      products,
      total,
      page: pageNum,
      limit: limitNum,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "فشل في جلب المنتجات" }),
    };
  } finally {
    await prisma.$disconnect();
  }
};
