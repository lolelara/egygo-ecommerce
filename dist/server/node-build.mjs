import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import OpenAI from "openai";
import { PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";
import { Client, Databases, ID, Query } from "node-appwrite";
const logsDir = path.join(process.cwd(), "logs");
winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    return log;
  })
);
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);
const logger = winston.createLogger({
  level: "info",
  format: fileFormat,
  defaultMeta: { service: "egygo-api" },
  transports: [
    // Error log file
    new DailyRotateFile({
      filename: path.join(logsDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "20m",
      maxFiles: "14d",
      zippedArchive: true
    }),
    // Combined log file
    new DailyRotateFile({
      filename: path.join(logsDir, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      zippedArchive: true
    }),
    // Audit log file (for security events)
    new DailyRotateFile({
      filename: path.join(logsDir, "audit-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "warn",
      maxSize: "20m",
      maxFiles: "30d",
      zippedArchive: true
    })
  ]
});
const loggers = {
  // General logging
  info: (message, meta) => logger.info(message, meta),
  warn: (message, meta) => logger.warn(message, meta),
  error: (message, error, meta) => {
    if (error instanceof Error) {
      logger.error(message, { error: error.message, stack: error.stack, ...meta });
    } else {
      logger.error(message, { error, ...meta });
    }
  },
  debug: (message, meta) => logger.debug(message, meta),
  // Security logging
  security: (event, details) => {
    logger.warn(`SECURITY: ${event}`, {
      type: "security",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...details
    });
  },
  // API logging
  api: (method, url, statusCode, responseTime, userAgent) => {
    logger.info("API Request", {
      type: "api",
      method,
      url,
      statusCode,
      responseTime: `${responseTime}ms`,
      userAgent
    });
  },
  // Database logging
  database: (operation, collection, duration, success) => {
    logger.info("Database Operation", {
      type: "database",
      operation,
      collection,
      duration: `${duration}ms`,
      success
    });
  },
  // Business logic logging
  business: (event, details) => {
    logger.info(`BUSINESS: ${event}`, {
      type: "business",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...details
    });
  }
};
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    loggers.api(
      req.method,
      req.originalUrl,
      res.statusCode,
      duration,
      req.get("User-Agent")
    );
  });
  next();
};
const rateLimitStore = /* @__PURE__ */ new Map();
const RATE_LIMIT_CONFIG = {
  // Login attempts
  login: {
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    maxAttempts: 5,
    blockDurationMs: 30 * 60 * 1e3
    // 30 minutes block
  },
  // General API requests
  api: {
    windowMs: 15 * 60 * 1e3,
    // 15 minutes
    maxAttempts: 100,
    blockDurationMs: 60 * 60 * 1e3
    // 1 hour block
  },
  // Password reset requests
  passwordReset: {
    windowMs: 60 * 60 * 1e3,
    // 1 hour
    maxAttempts: 3,
    blockDurationMs: 24 * 60 * 60 * 1e3
    // 24 hours block
  },
  // Registration attempts
  registration: {
    windowMs: 60 * 60 * 1e3,
    // 1 hour
    maxAttempts: 3,
    blockDurationMs: 24 * 60 * 60 * 1e3
    // 24 hours block
  }
};
function generateKey(ip, identifier) {
  return identifier ? `${ip}:${identifier}` : ip;
}
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now && (!entry.blockUntil || entry.blockUntil < now)) {
      rateLimitStore.delete(key);
    }
  }
}
setInterval(cleanupExpiredEntries, 5 * 60 * 1e3);
function createRateLimit(type) {
  return (req, res, next) => {
    const config = RATE_LIMIT_CONFIG[type];
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    const identifier = req.body?.email || req.body?.username;
    const key = generateKey(ip, identifier);
    const now = Date.now();
    const entry = rateLimitStore.get(key);
    if (entry?.blocked && entry.blockUntil && entry.blockUntil > now) {
      const remainingTime = Math.ceil((entry.blockUntil - now) / 1e3 / 60);
      loggers.security("Rate limit block active", {
        ip,
        identifier,
        type,
        remainingMinutes: remainingTime,
        userAgent: req.get("User-Agent")
      });
      return res.status(429).json({
        error: "Too many requests",
        message: `تم حظر هذا العنوان مؤقتاً. حاول مرة أخرى بعد ${remainingTime} دقيقة.`,
        retryAfter: remainingTime * 60
      });
    }
    if (!entry || entry.resetTime < now) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
        blocked: false
      });
      loggers.security("Rate limit entry created", {
        ip,
        identifier,
        type,
        windowMs: config.windowMs
      });
      return next();
    }
    entry.count++;
    if (entry.count > config.maxAttempts) {
      entry.blocked = true;
      entry.blockUntil = now + config.blockDurationMs;
      loggers.security("Rate limit exceeded - blocking", {
        ip,
        identifier,
        type,
        attempts: entry.count,
        maxAttempts: config.maxAttempts,
        blockDurationMs: config.blockDurationMs,
        userAgent: req.get("User-Agent")
      });
      return res.status(429).json({
        error: "Too many requests",
        message: `تم تجاوز الحد المسموح من المحاولات. تم حظر هذا العنوان لمدة ${Math.ceil(config.blockDurationMs / 1e3 / 60)} دقيقة.`,
        retryAfter: config.blockDurationMs / 1e3
      });
    }
    if (entry.count >= config.maxAttempts * 0.8) {
      loggers.security("Rate limit warning - approaching limit", {
        ip,
        identifier,
        type,
        attempts: entry.count,
        maxAttempts: config.maxAttempts,
        userAgent: req.get("User-Agent")
      });
    }
    res.set({
      "X-RateLimit-Limit": config.maxAttempts.toString(),
      "X-RateLimit-Remaining": Math.max(0, config.maxAttempts - entry.count).toString(),
      "X-RateLimit-Reset": new Date(entry.resetTime).toISOString()
    });
    next();
  };
}
const loginRateLimit = createRateLimit("login");
const passwordResetRateLimit = createRateLimit("passwordReset");
const registrationRateLimit = createRateLimit("registration");
const suspiciousIPs = /* @__PURE__ */ new Map();
setInterval(() => {
  const now = Date.now();
  const maxAge = 30 * 24 * 60 * 60 * 1e3;
  for (const [ip, reputation] of suspiciousIPs.entries()) {
    if (now - reputation.lastViolation > maxAge && !reputation.permanentlyBlocked) {
      suspiciousIPs.delete(ip);
    }
  }
}, 24 * 60 * 60 * 1e3);
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
});
const handleChatCompletion = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid request: messages array is required"
      });
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 500
    });
    const response = {
      message: completion.choices[0]?.message?.content || "عذراً، ما قدرتش أفهم. جرب تاني 🙏",
      usage: completion.usage
    };
    res.json(response);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({
      error: "حصل خطأ في الاتصال بالخدمة. جرب تاني بعد شوية 🙏",
      details: error.message
    });
  }
};
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ["query"]
});
const getProducts = async (req, res) => {
  try {
    const {
      categoryId,
      minPrice,
      maxPrice,
      inStock,
      searchQuery,
      sortBy = "featured",
      page = 1,
      limit = 12
    } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const where = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (inStock !== void 0) {
      where.inStock = String(inStock) === "true";
    }
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        {
          tags: {
            some: { name: { contains: searchQuery, mode: "insensitive" } }
          }
        }
      ];
    }
    let orderBy = {};
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
            orderBy: { order: "asc" }
          },
          tags: true,
          reviews: {
            include: {
              user: true
            },
            orderBy: { createdAt: "desc" },
            take: 5
          },
          _count: {
            select: { reviews: true }
          }
        }
      }),
      prisma.product.count({ where })
    ]);
    const response = {
      products,
      total,
      page: Number(page),
      limit: Number(limit)
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "فشل في جلب المنتجات" });
  }
};
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" }
        },
        tags: true,
        reviews: {
          include: {
            user: true
          },
          orderBy: { createdAt: "desc" }
        },
        _count: {
          select: { reviews: true }
        }
      }
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
const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      minPrice,
      maxPrice,
      inStock,
      searchQuery,
      sortBy = "featured",
      page = 1,
      limit = 12
    } = req.query;
    const category = await prisma.category.findUnique({
      where: { slug }
    });
    if (!category) {
      return res.status(404).json({ error: "الفئة غير موجودة" });
    }
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const where = { categoryId: category.id };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }
    if (inStock !== void 0) {
      where.inStock = String(inStock) === "true";
    }
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
        {
          tags: {
            some: { name: { contains: searchQuery, mode: "insensitive" } }
          }
        }
      ];
    }
    let orderBy = {};
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
            orderBy: { order: "asc" }
          },
          tags: true,
          reviews: {
            include: {
              user: true
            },
            orderBy: { createdAt: "desc" },
            take: 5
          },
          _count: {
            select: { reviews: true }
          }
        }
      }),
      prisma.product.count({ where })
    ]);
    const response = {
      products,
      total,
      page: Number(page),
      limit: Number(limit)
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "فشل في جلب منتجات الفئة" });
  }
};
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }
    });
    const response = {
      categories
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "فشل في جلب الفئات" });
  }
};
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await prisma.category.findUnique({
      where: { slug }
    });
    if (!category) {
      return res.status(404).json({ error: "الفئة غير موجودة" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "فشل في جلب الفئة" });
  }
};
const updateCategoryProductCount = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    for (const category of categories) {
      const productCount = await prisma.product.count({
        where: { categoryId: category.id }
      });
      await prisma.category.update({
        where: { id: category.id },
        data: { productCount }
      });
    }
    res.json({ message: "تم تحديث عدد المنتجات في الفئات بنجاح" });
  } catch (error) {
    console.error("Error updating category product counts:", error);
    res.status(500).json({ error: "فشل في تحديث عدد المنتجات" });
  }
};
const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalAffiliates,
      pendingOrders,
      pendingCommissions,
      orders,
      products
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.affiliateUser.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.commission.aggregate({
        where: { status: "PENDING" },
        _sum: { amount: true }
      }),
      prisma.order.findMany({
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" }
      }),
      prisma.product.findMany({
        include: {
          orderItems: true,
          category: true
        },
        orderBy: { createdAt: "desc" }
      })
    ]);
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const thisMonth = /* @__PURE__ */ new Date();
    thisMonth.setDate(1);
    const thisMonthOrders = orders.filter(
      (order) => new Date(order.createdAt) >= thisMonth
    );
    const thisMonthRevenue = thisMonthOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );
    const productSales = products.map((product) => {
      const soldQuantity = product.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const revenue = product.orderItems.reduce(
        (sum, item) => sum + item.total,
        0
      );
      return {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice || void 0,
          images: [],
          // Will be populated from images relation
          category: product.categoryId,
          tags: [],
          // Will be populated from tags relation
          inStock: product.inStock,
          rating: product.rating,
          reviewCount: product.reviewCount,
          affiliateCommission: product.affiliateCommission
        },
        soldQuantity,
        revenue
      };
    }).sort((a, b) => b.soldQuantity - a.soldQuantity).slice(0, 5);
    const recentOrders = orders.slice(0, 5).map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      userId: order.userId,
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
        productId: item.productId,
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          originalPrice: item.product.originalPrice || void 0,
          images: [],
          // Populate from images relation
          category: item.product.categoryId,
          tags: [],
          // Populate from tags relation
          inStock: item.product.inStock,
          rating: item.product.rating,
          reviewCount: item.product.reviewCount,
          affiliateCommission: item.product.affiliateCommission
        }
      }))
    }));
    const stats = {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      totalAffiliates,
      pendingCommissions: pendingCommissions._sum.amount || 0,
      thisMonthRevenue,
      thisMonthOrders: thisMonthOrders.length,
      topSellingProducts: productSales,
      recentOrders
    };
    res.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "فشل في جلب إحصائيات لوحة التحكم" });
  }
};
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      categoryId,
      images,
      tags,
      stockQuantity,
      affiliateCommission
    } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        originalPrice,
        categoryId,
        stockQuantity,
        affiliateCommission,
        inStock: stockQuantity > 0,
        images: {
          create: images.map((url, index) => ({
            url,
            order: index
          }))
        },
        tags: {
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        }
      },
      include: {
        category: true,
        images: true,
        tags: true
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "فشل في إنشاء المنتج" });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      originalPrice,
      categoryId,
      images,
      tags,
      stockQuantity,
      affiliateCommission
    } = req.body;
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.product.update({
      where: { id },
      data: { tags: { set: [] } }
    });
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        originalPrice,
        categoryId,
        stockQuantity,
        affiliateCommission,
        inStock: stockQuantity > 0,
        images: {
          create: images.map((url, index) => ({
            url,
            order: index
          }))
        },
        tags: {
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName }
          }))
        }
      },
      include: {
        category: true,
        images: true,
        tags: true
      }
    });
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "فشل في تحديث المنتج" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id }
    });
    res.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "فشل في حذف المنتج" });
  }
};
const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image
      }
    });
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "فشل في إنشاء الفئة" });
  }
};
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        image
      }
    });
    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "فشل في تحديث الفئة" });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({
      where: { id }
    });
    res.json({ message: "تم حذف الفئة بنجاح" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "فشل في حذف الفئة" });
  }
};
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        affiliate: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "فشل في جلب المستخدمين" });
  }
};
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { role, isActive }
    });
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "فشل في تحديث المستخدم" });
  }
};
const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "فشل في جلب الطلبات" });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });
    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "فشل في تحديث الطلب" });
  }
};
const getCommissions = async (req, res) => {
  try {
    const commissions = await prisma.commission.findMany({
      include: {
        affiliate: {
          include: {
            user: true
          }
        },
        order: true
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(commissions);
  } catch (error) {
    console.error("Error fetching commissions:", error);
    res.status(500).json({ error: "فشل في جلب العمولات" });
  }
};
const updateCommissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const commission = await prisma.commission.update({
      where: { id },
      data: { status },
      include: {
        affiliate: {
          include: {
            user: true
          }
        },
        order: true
      }
    });
    res.json(commission);
  } catch (error) {
    console.error("Error updating commission:", error);
    res.status(500).json({ error: "فشل في تحديث العمولة" });
  }
};
const LOGIN_URL$1 = "https://vendoor.co/user/login?returnUrl=%2Faffiliate%2Fproducts";
const PRODUCTS_BASE_URL$1 = "https://vendoor.co/affiliate/products?page=";
async function loginToVendoor$1(page, email, password) {
  await page.goto(LOGIN_URL$1, { waitUntil: "networkidle2" });
  await page.type('input[name="Email"]', email);
  await page.type('input[name="Password"]', password);
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" })
  ]);
}
async function scrapeProductsPage$1(page, pageNum) {
  const url = `${PRODUCTS_BASE_URL$1}${pageNum}`;
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForSelector("table tbody tr", { timeout: 1e4 });
  const products = await page.evaluate(() => {
    const rows = document.querySelectorAll("table tbody tr");
    const results = [];
    rows.forEach((row) => {
      try {
        const cells = row.querySelectorAll("td");
        if (cells.length < 6) return;
        const imgElement = cells[0].querySelector("img");
        const image = imgElement ? imgElement.src : "";
        const titleElement = cells[1].querySelector("a");
        const title = titleElement ? titleElement.textContent.trim() : "";
        const priceText = cells[2].textContent.trim();
        const price = priceText.replace(/[^\d.]/g, "");
        const commissionText = cells[3].textContent.trim();
        const commission = commissionText.replace(/[^\d.]/g, "");
        const stock = cells[4].textContent.trim();
        const productLink = titleElement ? titleElement.href : "";
        const productId = productLink.split("/").pop() || "";
        results.push({
          id: productId,
          title,
          price,
          commission,
          stock,
          image,
          url: productLink
        });
      } catch (error) {
        console.error("خطأ في معالجة صف:", error);
      }
    });
    return results;
  });
  return products;
}
async function scrapeVendoorProducts(req, res) {
  let browser;
  try {
    const page = parseInt(req.query.page) || 1;
    const email = process.env.VENDOOR_EMAIL || "almlmibrahym574@gmail.com";
    const password = process.env.VENDOOR_PASSWORD || "hema2004";
    console.log(`🚀 بدء scraping الصفحة ${page}...`);
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });
    const browserPage = await browser.newPage();
    console.log("🔐 تسجيل الدخول...");
    await loginToVendoor$1(browserPage, email, password);
    console.log(`📄 جلب الصفحة ${page}...`);
    const products = await scrapeProductsPage$1(browserPage, page);
    await browser.close();
    console.log(`✅ تم جلب ${products.length} منتج`);
    res.json({
      success: true,
      page,
      totalProducts: products.length,
      products
    });
  } catch (error) {
    if (browser) await browser.close();
    console.error("❌ خطأ:", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: { affiliate: true }
    });
    if (!user) {
      return res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيح" });
    }
    if (!user.isActive) {
      return res.status(401).json({ error: "الحساب معطل" });
    }
    const validPasswords = {
      "admin@example.com": "admin123",
      "superadmin@example.com": "superadmin123",
      "user@example.com": "user123"
    };
    if (password !== validPasswords[email]) {
      return res.status(401).json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيح" });
    }
    const token = `${user.id}-${Date.now()}`;
    const response = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      },
      token,
      affiliate: user.affiliate ? {
        id: user.affiliate.id,
        email: user.email,
        name: user.name || "",
        affiliateCode: user.affiliate.affiliateCode,
        commissionRate: user.affiliate.commissionRate,
        totalEarnings: user.affiliate.totalEarnings,
        pendingEarnings: user.affiliate.pendingEarnings,
        referralCount: user.affiliate.referralCount,
        joinedAt: user.affiliate.createdAt.toISOString()
      } : null
    };
    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "خطأ في تسجيل الدخول" });
  }
};
const register = async (req, res) => {
  try {
    const { email, name, password, wantAffiliate } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان" });
    }
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      return res.status(400).json({ error: "المستخدم موجود بالفعل" });
    }
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: "USER",
        isActive: true
      }
    });
    let affiliate = null;
    if (wantAffiliate) {
      affiliate = await prisma.affiliateUser.create({
        data: {
          userId: user.id,
          affiliateCode: `REF${user.id.slice(-8).toUpperCase()}`,
          commissionRate: 8,
          totalEarnings: 0,
          pendingEarnings: 0,
          referralCount: 0,
          status: "ACTIVE"
        }
      });
    }
    const token = `${user.id}-${Date.now()}`;
    const response = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      },
      token,
      affiliate: affiliate ? {
        id: affiliate.id,
        email: user.email,
        name: user.name || "",
        affiliateCode: affiliate.affiliateCode,
        commissionRate: affiliate.commissionRate,
        totalEarnings: affiliate.totalEarnings,
        pendingEarnings: affiliate.pendingEarnings,
        referralCount: affiliate.referralCount,
        joinedAt: affiliate.createdAt.toISOString()
      } : null
    };
    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "خطأ في إنشاء الحساب" });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "البريد الإلكتروني مطلوب" });
    }
    const user = await prisma.user.findUnique({
      where: { email }
    });
    if (!user) {
      return res.json({
        message: "إذا كان البريد الإلكتروني موجود، ستصلك رسالة إعادة تعيين كلمة المرور"
      });
    }
    res.json({ message: "تم إرسال رسالة إعادة تعيين كلمة المرور" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "خطأ في إرسال رسالة إعادة التعيين" });
  }
};
const getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "غير مصرح" });
    }
    const token = authHeader.replace("Bearer ", "");
    const userId = token.split("-")[0];
    if (!userId) {
      return res.status(401).json({ error: "رمز غير صالح" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { affiliate: true }
    });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "مستخدم غير صالح" });
    }
    const response = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      },
      affiliate: user.affiliate ? {
        id: user.affiliate.id,
        email: user.email,
        name: user.name || "",
        affiliateCode: user.affiliate.affiliateCode,
        commissionRate: user.affiliate.commissionRate,
        totalEarnings: user.affiliate.totalEarnings,
        pendingEarnings: user.affiliate.pendingEarnings,
        referralCount: user.affiliate.referralCount,
        joinedAt: user.affiliate.createdAt.toISOString()
      } : null
    };
    res.json(response);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "خطأ في جلب بيانات المستخدم" });
  }
};
const getUserOrders = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const orders = await prisma.order.findMany({
      where: {
        userId
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const formattedOrders = orders.map((order) => {
      const items = order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images && item.product.images.length > 0 ? item.product.images[0]?.url || "" : ""
      }));
      return {
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.createdAt.toISOString().split("T")[0],
        status: order.status,
        total: order.total,
        itemsCount: order.items.length,
        items,
        shippingAddress: order.shippingAddress
      };
    });
    res.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const order = await prisma.order.findFirst({
      where: {
        id,
        userId
        // Ensure user can only access their own orders
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            }
          }
        }
      }
    });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    const items = order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
      image: item.product.images && item.product.images.length > 0 ? item.product.images[0]?.url || "" : ""
    }));
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString().split("T")[0],
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      itemsCount: order.items.length,
      items,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString()
    };
    res.json(formattedOrder);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    const reviews = await prisma.review.findMany({
      where: {
        productId
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;
    const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
      const count = reviews.filter((r) => r.rating === stars).length;
      return {
        stars,
        count,
        percentage: totalReviews > 0 ? Math.round(count / totalReviews * 100) : 0
      };
    });
    const formattedReviews = reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      userName: review.user.name,
      userEmail: review.user.email,
      date: review.createdAt.toISOString().split("T")[0],
      createdAt: review.createdAt.toISOString()
    }));
    res.json({
      reviews: formattedReviews,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
const createReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    if (!productId || !userId || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this product" });
    }
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    res.status(201).json({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      userName: review.user.name,
      userEmail: review.user.email,
      date: review.createdAt.toISOString().split("T")[0],
      createdAt: review.createdAt.toISOString()
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
};
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, comment } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    if (existingReview.userId !== userId) {
      return res.status(403).json({ error: "You can only update your own reviews" });
    }
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    const review = await prisma.review.update({
      where: { id },
      data: {
        ...rating && { rating },
        ...comment !== void 0 && { comment }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    res.json({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      userName: review.user.name,
      userEmail: review.user.email,
      date: review.createdAt.toISOString().split("T")[0],
      updatedAt: review.updatedAt.toISOString()
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Failed to update review" });
  }
};
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const existingReview = await prisma.review.findUnique({
      where: { id }
    });
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    if (existingReview.userId !== userId) {
      return res.status(403).json({ error: "You can only delete your own reviews" });
    }
    await prisma.review.delete({
      where: { id }
    });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};
const LOGIN_URL = "https://aff.ven-door.com/login";
const PRODUCTS_BASE_URL = "https://aff.ven-door.com/products";
const AFFILIATE_ID = "29631";
let scrapingProgress = {
  currentPage: 0,
  totalPages: 0,
  productsFound: 0
};
async function loginToVendoor(page, email, password) {
  await page.goto(LOGIN_URL, { waitUntil: "networkidle2", timeout: 3e4 });
  await new Promise((resolve) => setTimeout(resolve, 2e3));
  await page.waitForSelector('input[name="name"]', { timeout: 5e3 });
  await page.type('input[name="name"]', email, { delay: 50 });
  await page.type('input[type="password"]', password, { delay: 50 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle2", timeout: 3e4 }),
    page.click('button[type="submit"]')
  ]).catch(() => {
  });
  await new Promise((resolve) => setTimeout(resolve, 5e3));
  const currentUrl = page.url();
  if (currentUrl.includes("login")) {
    throw new Error("فشل تسجيل الدخول - تحقق من البيانات");
  }
}
async function scrapeProductsPage(page, pageNum) {
  const url = `${PRODUCTS_BASE_URL}?page=${pageNum}`;
  await page.goto(url, { waitUntil: "networkidle2", timeout: 3e4 });
  await new Promise((resolve) => setTimeout(resolve, 1500));
  const products = await page.evaluate(() => {
    const productsList = [];
    const rows = document.querySelectorAll("table tbody tr");
    rows.forEach((row) => {
      try {
        const cells = row.querySelectorAll("td");
        if (cells.length < 5) return;
        const imageCell = cells[0];
        const nameCell = cells[1];
        const supplierCell = cells[2];
        const priceCell = cells[3];
        const commissionCell = cells[4];
        const stockCell = cells[5];
        const actionCell = cells[7];
        const img = imageCell?.querySelector("img");
        const image = img ? img.src || img.getAttribute("data-src") : "";
        const title = nameCell?.textContent.trim() || "";
        const supplier = supplierCell?.textContent.trim() || "";
        const price = priceCell?.textContent.replace(/[^\d]/g, "") || "";
        const commission = commissionCell?.textContent.replace(/[^\d]/g, "") || "";
        const stock = stockCell?.textContent.trim() || "";
        const orderLink = actionCell?.querySelector('a[href*="orders/create"]');
        let productId = "";
        if (orderLink) {
          const href = orderLink.href;
          const match = href.match(/product[=\/](\d+)/);
          if (match) productId = match[1];
        }
        if (title && productId) {
          productsList.push({
            id: productId,
            title,
            supplier,
            price,
            commission,
            stock,
            image,
            orderLink: orderLink?.href || ""
          });
        }
      } catch (error) {
        console.error("Error parsing row:", error);
      }
    });
    return productsList;
  });
  return products;
}
async function fetchProductDetails(page, productId) {
  const url = `https://aff.ven-door.com/affiliates/${AFFILIATE_ID}/orders/create?product=${productId}`;
  await page.goto(url, { waitUntil: "networkidle2", timeout: 3e4 });
  await new Promise((resolve) => setTimeout(resolve, 2e3));
  const details = await page.evaluate(() => {
    const data = {
      variations: {},
      stockDetails: {},
      shipping: "",
      description: ""
    };
    const sizeSelect = document.querySelector('select[name="sizePro[]"]');
    if (sizeSelect) {
      const options = Array.from(sizeSelect.querySelectorAll("option"));
      options.forEach((option) => {
        if (option.value && option.textContent) {
          const text = option.textContent.trim();
          const match = text.match(/الكمية=>\s*\(([^)]+)\)\s*-\s*المقاس=>\(([^)]+)\)/);
          if (match) {
            const quantity = parseInt(match[1].trim()) || 0;
            const sizeInfo = match[2].trim();
            const parts = sizeInfo.split(/\s+/);
            const size = parts[parts.length - 1];
            const color = parts.slice(0, -1).join(" ");
            if (!data.variations[color]) {
              data.variations[color] = [];
            }
            if (!data.variations[color].includes(size)) {
              data.variations[color].push(size);
            }
            data.stockDetails[`${color} ${size}`] = quantity;
          }
        }
      });
    }
    const shippingText = document.body.innerText;
    const shippingMatch = shippingText.match(/تكلفة الشحن\s+(\d+)/);
    if (shippingMatch) {
      data.shipping = shippingMatch[1];
    }
    return data;
  });
  return details;
}
const scrapeAllProducts = async (req, res) => {
  const { email, password, maxPages = 41 } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "البريد الإلكتروني وكلمة المرور مطلوبان"
    });
  }
  let browser;
  try {
    scrapingProgress = {
      currentPage: 0,
      totalPages: maxPages,
      productsFound: 0
    };
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
    await loginToVendoor(page, email, password);
    const allProducts = [];
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      scrapingProgress.currentPage = pageNum;
      const products = await scrapeProductsPage(page, pageNum);
      if (products.length === 0) {
        console.log(`صفحة ${pageNum} فارغة - توقف`);
        break;
      }
      allProducts.push(...products);
      scrapingProgress.productsFound = allProducts.length;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    await browser.close();
    res.json({
      success: true,
      totalProducts: allProducts.length,
      lastPage: scrapingProgress.currentPage,
      products: allProducts
    });
  } catch (error) {
    console.error("Error scraping products:", error);
    if (browser) {
      await browser.close();
    }
    res.status(500).json({
      error: error.message || "فشل جلب المنتجات"
    });
  }
};
const getScrapingProgress = (req, res) => {
  res.json(scrapingProgress);
};
const importProduct = async (req, res) => {
  const { productId, vendoorEmail, vendoorPassword } = req.body;
  if (!productId || !vendoorEmail || !vendoorPassword) {
    return res.status(400).json({
      error: "بيانات غير كاملة"
    });
  }
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
    await loginToVendoor(page, vendoorEmail, vendoorPassword);
    const details = await fetchProductDetails(page, productId);
    await browser.close();
    res.json({
      success: true,
      productId,
      details
    });
  } catch (error) {
    console.error("Error importing product:", error);
    if (browser) {
      await browser.close();
    }
    res.status(500).json({
      error: error.message || "فشل استيراد المنتج"
    });
  }
};
const getRoles = async (req, res) => {
  try {
    const { listDocuments: listDocuments2 } = require("../lib/appwrite");
    const result = await listDocuments2("roles");
    res.json(result.documents);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};
const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    if (!name || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        error: "Name and permissions array are required"
      });
    }
    const validPermissions = ["read", "write", "delete", "admin"];
    const invalidPerms = permissions.filter((p) => !validPermissions.includes(p));
    if (invalidPerms.length > 0) {
      return res.status(400).json({
        error: `Invalid permissions: ${invalidPerms.join(", ")}`
      });
    }
    let created;
    try {
      const { createDocument: createDocument2 } = require("../lib/appwrite");
      created = await createDocument2("roles", {
        name,
        permissions,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (dbError) {
      console.error("Error saving role to DB:", dbError);
      await logAudit({
        userId: req.headers["x-user-id"] || "system",
        action: "create",
        resource: "role",
        ipAddress: req.ip || "unknown",
        success: false
      });
      return res.status(500).json({ error: "Failed to save role to database" });
    }
    await logAudit({
      userId: req.headers["x-user-id"] || "system",
      action: "create",
      resource: "role",
      ipAddress: req.ip || "unknown",
      success: true
    });
    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating role:", error);
    await logAudit({
      userId: req.headers["x-user-id"] || "system",
      action: "create",
      resource: "role",
      ipAddress: req.ip || "unknown",
      success: false
    });
    res.status(500).json({ error: "Failed to create role" });
  }
};
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Role ID is required" });
    }
    let updated;
    try {
      const { updateDocument: updateDocument2 } = require("../lib/appwrite");
      updated = await updateDocument2("roles", id, {
        name,
        permissions
      });
    } catch (dbError) {
      console.error("Error updating role in DB:", dbError);
      await logAudit({
        userId: req.headers["x-user-id"] || "system",
        action: "update",
        resource: "role",
        ipAddress: req.ip || "unknown",
        success: false
      });
      return res.status(500).json({ error: "Failed to update role in database" });
    }
    await logAudit({
      userId: req.headers["x-user-id"] || "system",
      action: "update",
      resource: "role",
      ipAddress: req.ip || "unknown",
      success: true
    });
    res.json(updated);
  } catch (error) {
    console.error("Error updating role:", error);
    await logAudit({
      userId: req.headers["x-user-id"] || "system",
      action: "update",
      resource: "role",
      ipAddress: req.ip || "unknown",
      success: false
    });
    res.status(500).json({ error: "Failed to update role" });
  }
};
const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, userId, action, resource } = req.query;
    const { listDocuments: listDocuments2, Query: Query2 } = require("../lib/appwrite");
    const queries = [];
    if (userId) queries.push(Query2.equal("userId", String(userId)));
    if (action) queries.push(Query2.equal("action", String(action)));
    if (resource) queries.push(Query2.equal("resource", String(resource)));
    queries.push(Query2.orderDesc("timestamp"));
    queries.push(Query2.limit(Number(limit)));
    queries.push(Query2.offset((Number(page) - 1) * Number(limit)));
    const result = await listDocuments2("audit_logs", queries);
    res.json({
      logs: result.documents,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
};
const checkPermission = async (req, res) => {
  try {
    const { userId, resource, action } = req.body;
    if (!userId || !resource || !action) {
      return res.status(400).json({
        error: "userId, resource, and action are required"
      });
    }
    let hasPermission = false;
    try {
      const { listDocuments: listDocuments2, Query: Query2 } = require("../lib/appwrite");
      const userResult = await listDocuments2("users", [Query2.equal("userId", userId), Query2.limit(1)]);
      let userRole = "";
      if (userResult.documents.length > 0) {
        userRole = userResult.documents[0].role;
      }
      let permissions = [];
      if (userRole) {
        const roleResult = await listDocuments2("roles", [Query2.equal("name", userRole), Query2.limit(1)]);
        if (roleResult.documents.length > 0) {
          permissions = roleResult.documents[0].permissions;
        }
      }
      hasPermission = permissions.includes(action) || userRole === "admin";
    } catch (e) {
      console.error("Error checking permission from DB:", e);
    }
    await logAudit({
      userId,
      action: "check-permission",
      resource,
      ipAddress: req.ip || "unknown",
      success: hasPermission
    });
    res.json({
      hasPermission,
      userId,
      resource,
      action,
      timestamp: /* @__PURE__ */ new Date()
    });
  } catch (error) {
    console.error("Error checking permission:", error);
    res.status(500).json({ error: "Permission check failed" });
  }
};
async function logAudit(data) {
  try {
    const { createDocument: createDocument2 } = require("../lib/appwrite");
    await createDocument2("audit_logs", {
      ...data,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Failed to log audit:", error);
  }
}
const getContracts = async (req, res) => {
  try {
    const { userId, type, status } = req.query;
    const contracts = [
      {
        id: "1",
        userId: "user-123",
        type: "affiliate",
        terms: {
          commissionRate: 10,
          paymentSchedule: "monthly",
          minimumSales: 1e3,
          bonusThreshold: 5e3
        },
        performance: {
          totalSales: 15e3,
          commissionsEarned: 1500,
          ordersCompleted: 45,
          conversionRate: 3.2
        },
        status: "active",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      },
      {
        id: "2",
        userId: "user-456",
        type: "merchant",
        terms: {
          commissionRate: 5,
          paymentSchedule: "weekly"
        },
        performance: {
          totalSales: 5e4,
          commissionsEarned: 2500,
          ordersCompleted: 120,
          conversionRate: 4.5
        },
        status: "active",
        createdAt: /* @__PURE__ */ new Date(),
        updatedAt: /* @__PURE__ */ new Date()
      }
    ];
    let filtered = contracts;
    if (userId) {
      filtered = filtered.filter((c) => c.userId === userId);
    }
    if (type) {
      filtered = filtered.filter((c) => c.type === type);
    }
    if (status) {
      filtered = filtered.filter((c) => c.status === status);
    }
    res.json(filtered);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    res.status(500).json({ error: "Failed to fetch contracts" });
  }
};
const createContract = async (req, res) => {
  try {
    const { userId, type, terms } = req.body;
    if (!userId || !type || !terms) {
      return res.status(400).json({
        error: "userId, type, and terms are required"
      });
    }
    if (!["affiliate", "merchant"].includes(type)) {
      return res.status(400).json({
        error: 'type must be either "affiliate" or "merchant"'
      });
    }
    if (!terms.commissionRate || !terms.paymentSchedule) {
      return res.status(400).json({
        error: "commissionRate and paymentSchedule are required in terms"
      });
    }
    const newContract = {
      id: Date.now().toString(),
      userId,
      type,
      terms: {
        commissionRate: terms.commissionRate,
        paymentSchedule: terms.paymentSchedule,
        minimumSales: terms.minimumSales || 0,
        bonusThreshold: terms.bonusThreshold
      },
      performance: {
        totalSales: 0,
        commissionsEarned: 0,
        ordersCompleted: 0,
        conversionRate: 0
      },
      status: "pending",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    res.status(201).json(newContract);
  } catch (error) {
    console.error("Error creating contract:", error);
    res.status(500).json({ error: "Failed to create contract" });
  }
};
const updateContract = async (req, res) => {
  try {
    const { id } = req.params;
    const { terms, status } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Contract ID is required" });
    }
    const updatedContract = {
      id,
      userId: "user-123",
      type: "affiliate",
      terms: terms || {
        commissionRate: 10,
        paymentSchedule: "monthly"
      },
      performance: {
        totalSales: 15e3,
        commissionsEarned: 1500,
        ordersCompleted: 45,
        conversionRate: 3.2
      },
      status: status || "active",
      createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 30),
      // 30 days ago
      updatedAt: /* @__PURE__ */ new Date()
    };
    res.json(updatedContract);
  } catch (error) {
    console.error("Error updating contract:", error);
    res.status(500).json({ error: "Failed to update contract" });
  }
};
const getContractPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const { period = "30d" } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Contract ID is required" });
    }
    const performance = {
      contractId: id,
      period,
      metrics: {
        totalSales: 15e3,
        commissionsEarned: 1500,
        ordersCompleted: 45,
        conversionRate: 3.2,
        averageOrderValue: 333.33,
        returnRate: 2.1
      },
      trends: {
        salesGrowth: 15.5,
        // percentage
        orderGrowth: 12.3,
        conversionImprovement: 0.5
      },
      milestones: [
        {
          name: "First Sale",
          achievedAt: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 25),
          value: 100
        },
        {
          name: "$10K Sales",
          achievedAt: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 10),
          value: 1e4
        }
      ],
      projections: {
        nextMonth: {
          estimatedSales: 18e3,
          estimatedCommissions: 1800
        },
        bonusEligible: true,
        bonusAmount: 500
      }
    };
    res.json(performance);
  } catch (error) {
    console.error("Error fetching contract performance:", error);
    res.status(500).json({ error: "Failed to fetch performance" });
  }
};
const getABTests = async (req, res) => {
  try {
    const { status, includeArchived = "false" } = req.query;
    const tests = [
      {
        id: "1",
        name: "Homepage Banner Test",
        description: "Testing different banner designs",
        variants: [
          {
            id: "variant-a",
            name: "Original",
            trafficPercentage: 50,
            conversionRate: 3.2,
            visitors: 1e3,
            conversions: 32,
            revenue: 1600
          },
          {
            id: "variant-b",
            name: "New Design",
            trafficPercentage: 50,
            conversionRate: 4.5,
            visitors: 1e3,
            conversions: 45,
            revenue: 2250
          }
        ],
        status: "running",
        startDate: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 7),
        createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 10)
      },
      {
        id: "2",
        name: "Checkout Flow Test",
        description: "Testing one-page vs multi-step checkout",
        variants: [
          {
            id: "variant-a",
            name: "One Page",
            trafficPercentage: 50,
            conversionRate: 5.1,
            visitors: 500,
            conversions: 25,
            revenue: 1875
          },
          {
            id: "variant-b",
            name: "Multi Step",
            trafficPercentage: 50,
            conversionRate: 6.8,
            visitors: 500,
            conversions: 34,
            revenue: 2550
          }
        ],
        status: "completed",
        winner: "variant-b",
        startDate: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 30),
        endDate: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 15),
        createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 35)
      }
    ];
    let filtered = tests;
    if (status && status !== "all") {
      filtered = filtered.filter((t) => t.status === status);
    }
    if (includeArchived === "false") {
      filtered = filtered.filter((t) => t.status !== "completed");
    }
    res.json(filtered);
  } catch (error) {
    console.error("Error fetching A/B tests:", error);
    res.status(500).json({ error: "Failed to fetch A/B tests" });
  }
};
const createABTest = async (req, res) => {
  try {
    const { name, description, variants } = req.body;
    if (!name || !variants || !Array.isArray(variants) || variants.length < 2) {
      return res.status(400).json({
        error: "name and at least 2 variants are required"
      });
    }
    const totalTraffic = variants.reduce((sum, v) => sum + (v.trafficPercentage || 0), 0);
    if (Math.abs(totalTraffic - 100) > 0.01) {
      return res.status(400).json({
        error: "Traffic percentages must add up to 100"
      });
    }
    const newTest = {
      id: Date.now().toString(),
      name,
      description: description || "",
      variants: variants.map((v) => ({
        id: `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: v.name,
        trafficPercentage: v.trafficPercentage,
        conversionRate: 0,
        visitors: 0,
        conversions: 0,
        revenue: 0
      })),
      status: "draft",
      startDate: /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date()
    };
    res.status(201).json(newTest);
  } catch (error) {
    console.error("Error creating A/B test:", error);
    res.status(500).json({ error: "Failed to create A/B test" });
  }
};
const setABTestWinner = async (req, res) => {
  try {
    const { id } = req.params;
    const { variantId } = req.body;
    if (!id || !variantId) {
      return res.status(400).json({
        error: "Test ID and variant ID are required"
      });
    }
    const updatedTest = {
      id,
      name: "Homepage Banner Test",
      description: "Testing different banner designs",
      variants: [
        {
          id: "variant-a",
          name: "Original",
          trafficPercentage: 50,
          conversionRate: 3.2,
          visitors: 1e3,
          conversions: 32,
          revenue: 1600
        },
        {
          id: "variant-b",
          name: "New Design",
          trafficPercentage: 50,
          conversionRate: 4.5,
          visitors: 1e3,
          conversions: 45,
          revenue: 2250
        }
      ],
      status: "completed",
      winner: variantId,
      startDate: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 7),
      endDate: /* @__PURE__ */ new Date(),
      createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 10)
    };
    res.json(updatedTest);
  } catch (error) {
    console.error("Error setting winner:", error);
    res.status(500).json({ error: "Failed to set winner" });
  }
};
const getABTestResults = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Test ID is required" });
    }
    const results = {
      testId: id,
      testName: "Homepage Banner Test",
      duration: {
        days: 7,
        startDate: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 7),
        endDate: /* @__PURE__ */ new Date()
      },
      variants: [
        {
          id: "variant-a",
          name: "Original",
          metrics: {
            visitors: 1e3,
            conversions: 32,
            conversionRate: 3.2,
            revenue: 1600,
            averageOrderValue: 50,
            bounceRate: 45.2
          },
          confidence: 95.3,
          isWinner: false
        },
        {
          id: "variant-b",
          name: "New Design",
          metrics: {
            visitors: 1e3,
            conversions: 45,
            conversionRate: 4.5,
            revenue: 2250,
            averageOrderValue: 50,
            bounceRate: 38.7
          },
          confidence: 98.1,
          isWinner: true
        }
      ],
      analysis: {
        significantDifference: true,
        pValue: 0.023,
        liftPercentage: 40.6,
        // (4.5 - 3.2) / 3.2 * 100
        recommendedAction: "Deploy variant-b to 100% of traffic",
        estimatedImpact: {
          monthlyRevenue: 1e4,
          annualRevenue: 12e4
        }
      }
    };
    res.json(results);
  } catch (error) {
    console.error("Error fetching test results:", error);
    res.status(500).json({ error: "Failed to fetch results" });
  }
};
const aiChat = async (req, res) => {
  try {
    const { message, userId, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const aiResponse = {
      id: Date.now().toString(),
      message,
      response: `شكراً لرسالتك! أنا هنا لمساعدتك. ${message.includes("منتج") ? "يمكنني اقتراح منتجات مناسبة لك." : "كيف يمكنني مساعدتك اليوم؟"}`,
      suggestions: [
        "عرض المنتجات الأكثر مبيعاً",
        "مساعدة في اختيار مقاس",
        "تتبع طلبي",
        "استفسار عن الشحن"
      ],
      timestamp: /* @__PURE__ */ new Date()
    };
    res.json(aiResponse);
  } catch (error) {
    console.error("Error in AI chat:", error);
    res.status(500).json({ error: "Failed to process chat message" });
  }
};
const createARModel = async (req, res) => {
  try {
    const { productId, modelUrl, size, format } = req.body;
    if (!productId || !modelUrl || !format) {
      return res.status(400).json({
        error: "productId, modelUrl, and format are required"
      });
    }
    if (!["glb", "usdz"].includes(format)) {
      return res.status(400).json({
        error: 'format must be either "glb" or "usdz"'
      });
    }
    const arModel = {
      id: Date.now().toString(),
      productId,
      modelUrl,
      size: size || 1,
      format,
      createdAt: /* @__PURE__ */ new Date()
    };
    res.status(201).json(arModel);
  } catch (error) {
    console.error("Error creating AR model:", error);
    res.status(500).json({ error: "Failed to create AR model" });
  }
};
const getARModels = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    const models = [
      {
        id: "1",
        productId,
        modelUrl: `https://cdn.egygo.com/ar-models/${productId}.glb`,
        size: 1.2,
        format: "glb",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        id: "2",
        productId,
        modelUrl: `https://cdn.egygo.com/ar-models/${productId}.usdz`,
        size: 1.2,
        format: "usdz",
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    res.json(models);
  } catch (error) {
    console.error("Error fetching AR models:", error);
    res.status(500).json({ error: "Failed to fetch AR models" });
  }
};
const createFamilyAccount = async (req, res) => {
  try {
    const { name, createdBy } = req.body;
    if (!name || !createdBy) {
      return res.status(400).json({
        error: "name and createdBy are required"
      });
    }
    const familyAccount = {
      id: Date.now().toString(),
      name,
      createdBy,
      members: [
        {
          userId: createdBy,
          role: "admin",
          joinedAt: /* @__PURE__ */ new Date()
        }
      ],
      sharedCart: [],
      sharedWishlist: [],
      createdAt: /* @__PURE__ */ new Date()
    };
    res.status(201).json(familyAccount);
  } catch (error) {
    console.error("Error creating family account:", error);
    res.status(500).json({ error: "Failed to create family account" });
  }
};
const getFamilyAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Account ID is required" });
    }
    const familyAccount = {
      id,
      name: "عائلة أحمد",
      createdBy: "user-123",
      members: [
        {
          userId: "user-123",
          userName: "أحمد محمد",
          role: "admin",
          joinedAt: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 30)
        },
        {
          userId: "user-456",
          userName: "سارة أحمد",
          role: "member",
          joinedAt: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 20)
        },
        {
          userId: "user-789",
          userName: "محمد أحمد",
          role: "member",
          joinedAt: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 15)
        }
      ],
      sharedCart: [
        {
          productId: "prod-1",
          productName: "قميص قطن",
          quantity: 2,
          price: 50,
          addedBy: "user-456"
        }
      ],
      sharedWishlist: [
        {
          productId: "prod-2",
          productName: "حذاء رياضي",
          addedBy: "user-789"
        }
      ],
      totalOrders: 15,
      totalSpent: 7500,
      createdAt: new Date(Date.now() - 1e3 * 60 * 60 * 24 * 30)
    };
    res.json(familyAccount);
  } catch (error) {
    console.error("Error fetching family account:", error);
    res.status(500).json({ error: "Failed to fetch family account" });
  }
};
const trackShipment = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }
    const tracking = {
      orderId,
      status: "in_transit",
      statusArabic: "قيد التوصيل",
      currentLocation: {
        lat: 30.0444,
        lng: 31.2357,
        address: "القاهرة - مدينة نصر"
      },
      driverInfo: {
        name: "محمد علي",
        phone: "+20 100 123 4567",
        rating: 4.8,
        vehicleNumber: "أ ب ج 1234"
      },
      estimatedArrival: new Date(Date.now() + 1e3 * 60 * 30),
      // 30 minutes
      deliveryAddress: {
        lat: 30.0626,
        lng: 31.2497,
        address: "التجمع الخامس - الشارع الرئيسي"
      },
      timeline: [
        {
          status: "order_placed",
          statusArabic: "تم الطلب",
          timestamp: new Date(Date.now() - 1e3 * 60 * 60 * 24),
          location: "مركز التوزيع الرئيسي"
        },
        {
          status: "preparing",
          statusArabic: "قيد التجهيز",
          timestamp: new Date(Date.now() - 1e3 * 60 * 60 * 20),
          location: "مركز التوزيع الرئيسي"
        },
        {
          status: "out_for_delivery",
          statusArabic: "خرج للتوصيل",
          timestamp: new Date(Date.now() - 1e3 * 60 * 60 * 2),
          location: "القاهرة"
        },
        {
          status: "in_transit",
          statusArabic: "قيد التوصيل",
          timestamp: new Date(Date.now() - 1e3 * 60 * 30),
          location: "مدينة نصر",
          current: true
        }
      ]
    };
    res.json(tracking);
  } catch (error) {
    console.error("Error tracking shipment:", error);
    res.status(500).json({ error: "Failed to track shipment" });
  }
};
const client = new Client().setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1").setProject(process.env.APPWRITE_PROJECT_ID || "").setKey(process.env.APPWRITE_API_KEY || "");
const databases = new Databases(client);
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "egygo_database";
async function createDocument(collectionId, data, permissions) {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      collectionId,
      ID.unique(),
      data,
      permissions
    );
  } catch (error) {
    console.error(`Error creating document in ${collectionId}:`, error);
    throw error;
  }
}
async function updateDocument(collectionId, documentId, data, permissions) {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      collectionId,
      documentId,
      data,
      permissions
    );
  } catch (error) {
    console.error(`Error updating document ${documentId} in ${collectionId}:`, error);
    throw error;
  }
}
async function deleteDocument(collectionId, documentId) {
  try {
    return await databases.deleteDocument(DATABASE_ID, collectionId, documentId);
  } catch (error) {
    console.error(`Error deleting document ${documentId} from ${collectionId}:`, error);
    throw error;
  }
}
async function listDocuments(collectionId, queries = []) {
  try {
    return await databases.listDocuments(DATABASE_ID, collectionId, queries);
  } catch (error) {
    console.error(`Error listing documents from ${collectionId}:`, error);
    throw error;
  }
}
const getSupplyOffers = async (req, res) => {
  try {
    const { productId } = req.query;
    const queries = [];
    if (productId) queries.push(Query.equal("productId", String(productId)));
    const result = await listDocuments("supply_offers", queries);
    res.json(result.documents);
  } catch (error) {
    console.error("Error fetching supply offers:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
};
const compareSuppliers = async (req, res) => {
  try {
    const { supplierIds } = req.body;
    if (!supplierIds || !Array.isArray(supplierIds)) {
      return res.status(400).json({ error: "supplierIds array is required" });
    }
    const comparison = {
      suppliers: supplierIds.map((id, index) => ({
        id,
        name: `مورد ${String.fromCharCode(65 + index)}`,
        totalCost: 4500 + index * 200,
        unitCost: 45 + index * 2,
        deliveryTime: 7 + index * 3,
        reliability: 95 - index * 5,
        recommendation: index === 0
      })),
      bestPrice: supplierIds[1],
      fastestDelivery: supplierIds[0],
      bestValue: supplierIds[0]
    };
    res.json(comparison);
  } catch (error) {
    console.error("Error comparing suppliers:", error);
    res.status(500).json({ error: "Failed to compare suppliers" });
  }
};
const createBundle = async (req, res) => {
  try {
    const { name, products, discountPercentage } = req.body;
    if (!name || !products || !Array.isArray(products)) {
      return res.status(400).json({
        error: "name and products array are required"
      });
    }
    const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const bundlePrice = totalPrice * (1 - (discountPercentage || 0) / 100);
    const bundle = {
      id: Date.now().toString(),
      name,
      products,
      originalPrice: totalPrice,
      discountPercentage: discountPercentage || 0,
      bundlePrice,
      savings: totalPrice - bundlePrice,
      createdAt: /* @__PURE__ */ new Date()
    };
    try {
      const { createDocument: createDocument2 } = require("../lib/appwrite");
      const created = await createDocument2("bundles", {
        name,
        products,
        originalPrice: totalPrice,
        discountPercentage: discountPercentage || 0,
        bundlePrice,
        savings: totalPrice - bundlePrice,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      res.status(201).json(created);
    } catch (dbError) {
      console.error("Error saving bundle to DB:", dbError);
      res.status(500).json({ error: "Failed to save bundle to database" });
    }
  } catch (error) {
    console.error("Error creating bundle:", error);
    res.status(500).json({ error: "Failed to create bundle" });
  }
};
const simulatePrice = async (req, res) => {
  try {
    const { productId, basePrice } = req.query;
    const price = Number(basePrice) || 100;
    const scenarios = [
      {
        name: "سعر منخفض",
        price: price * 0.85,
        estimatedSales: 150,
        estimatedRevenue: price * 0.85 * 150,
        margin: 25,
        marketPosition: "تنافسي جداً"
      },
      {
        name: "سعر متوسط",
        price,
        estimatedSales: 100,
        estimatedRevenue: price * 100,
        margin: 35,
        marketPosition: "متوازن",
        recommended: true
      },
      {
        name: "سعر مرتفع",
        price: price * 1.2,
        estimatedSales: 60,
        estimatedRevenue: price * 1.2 * 60,
        margin: 50,
        marketPosition: "premium"
      }
    ];
    res.json({ productId, scenarios });
  } catch (error) {
    console.error("Error simulating price:", error);
    res.status(500).json({ error: "Failed to simulate price" });
  }
};
const getInventoryAlerts = async (req, res) => {
  try {
    const { severity } = req.query;
    const queries = [];
    if (severity) queries.push(Query.equal("severity", String(severity)));
    const result = await listDocuments("inventory_alerts", queries);
    res.json(result.documents);
  } catch (error) {
    console.error("Error fetching inventory alerts:", error);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
};
const reorderInventory = async (req, res) => {
  try {
    const { productId, quantity, supplierId } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({
        error: "productId and quantity are required"
      });
    }
    const reorder = {
      id: Date.now().toString(),
      productId,
      quantity,
      supplierId,
      status: "pending",
      estimatedArrival: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 7),
      createdAt: /* @__PURE__ */ new Date()
    };
    try {
      const { createDocument: createDocument2 } = require("../lib/appwrite");
      const created = await createDocument2("reorders", {
        productId,
        quantity,
        supplierId,
        status: "pending",
        estimatedArrival: reorder.estimatedArrival.toISOString(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      });
      res.status(201).json(created);
    } catch (dbError) {
      console.error("Error saving reorder to DB:", dbError);
      res.status(500).json({ error: "Failed to save reorder to database" });
    }
  } catch (error) {
    console.error("Error creating reorder:", error);
    res.status(500).json({ error: "Failed to create reorder" });
  }
};
const getInventoryPredictions = async (req, res) => {
  try {
    const { productId, days = 30 } = req.query;
    const predictions = {
      productId,
      currentStock: 100,
      predictions: [
        { day: 7, estimatedStock: 85, confidence: 0.92 },
        { day: 14, estimatedStock: 68, confidence: 0.88 },
        { day: 21, estimatedStock: 52, confidence: 0.82 },
        { day: 30, estimatedStock: 35, confidence: 0.75 }
      ],
      recommendedActions: [
        { action: "reorder", date: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 18), quantity: 100 }
      ]
    };
    res.json(predictions);
  } catch (error) {
    console.error("Error getting predictions:", error);
    res.status(500).json({ error: "Failed to get predictions" });
  }
};
const universalSearch = async (req, res) => {
  try {
    const { q, type = "all" } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Query parameter q is required" });
    }
    const query = String(q).toLowerCase();
    const { searchDocuments } = require("../lib/appwrite");
    const results = {};
    if (type === "all" || type === "products") {
      results.products = (await searchDocuments("products", "name", query)).documents;
    }
    if (type === "all" || type === "orders") {
      results.orders = (await searchDocuments("orders", "id", query)).documents;
    }
    if (type === "all" || type === "pages") {
      results.pages = (await searchDocuments("pages", "title", query)).documents;
    }
    res.json(results);
  } catch (error) {
    console.error("Error searching:", error);
    res.status(500).json({ error: "Search failed" });
  }
};
const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    const { listDocuments: listDocuments2, Query: Query2 } = require("../lib/appwrite");
    const result = await listDocuments2("products", [
      Query2.orderDesc("popularity"),
      Query2.limit(5)
    ]);
    const suggestions = result.documents.map((doc) => doc.name);
    res.json(suggestions);
  } catch (error) {
    console.error("Error getting suggestions:", error);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
};
const getLoyaltyTiers = async (req, res) => {
  try {
    const tiers = [
      {
        id: "silver",
        name: "فضي",
        minPoints: 0,
        benefits: ["شحن مجاني على طلبات +500 جنيه", "خصم 5% على الطلب الثالث"],
        color: "#C0C0C0"
      },
      {
        id: "gold",
        name: "ذهبي",
        minPoints: 1e3,
        benefits: ["شحن مجاني دائماً", "خصم 10%", "دعم أولوية"],
        color: "#FFD700"
      },
      {
        id: "platinum",
        name: "بلاتيني",
        minPoints: 5e3,
        benefits: ["كل مميزات الذهبي", "خصم 15%", "وصول مبكر للمنتجات", "هدايا حصرية"],
        color: "#E5E4E2"
      }
    ];
    res.json(tiers);
  } catch (error) {
    console.error("Error fetching tiers:", error);
    res.status(500).json({ error: "Failed to fetch tiers" });
  }
};
const calculateLoyaltyPoints = async (req, res) => {
  try {
    const { userId, orderValue } = req.body;
    if (!userId || !orderValue) {
      return res.status(400).json({
        error: "userId and orderValue are required"
      });
    }
    const pointsEarned = Math.floor(orderValue / 10);
    let currentPoints = 0;
    try {
      const { listDocuments: listDocuments2, Query: Query2 } = require("../lib/appwrite");
      const result = await listDocuments2("loyalty_points", [Query2.equal("userId", userId), Query2.limit(1)]);
      if (result.documents.length > 0) {
        currentPoints = result.documents[0].points || 0;
      }
    } catch (e) {
      console.error("Error fetching loyalty points from DB:", e);
    }
    const newTotal = currentPoints + pointsEarned;
    let tier = "silver";
    if (newTotal >= 5e3) tier = "platinum";
    else if (newTotal >= 1e3) tier = "gold";
    res.json({
      userId,
      pointsEarned,
      currentPoints: newTotal,
      tier,
      nextTier: tier === "silver" ? "gold" : tier === "gold" ? "platinum" : null,
      pointsToNextTier: tier === "silver" ? 1e3 - newTotal : tier === "gold" ? 5e3 - newTotal : 0
    });
  } catch (error) {
    console.error("Error calculating points:", error);
    res.status(500).json({ error: "Failed to calculate points" });
  }
};
const getCurrencyRates = async (req, res) => {
  try {
    const rates = {
      base: "EGP",
      date: /* @__PURE__ */ new Date(),
      rates: {
        USD: 0.032,
        EUR: 0.029,
        GBP: 0.025,
        SAR: 0.12,
        AED: 0.12,
        KWD: 0.01
      }
    };
    res.json(rates);
  } catch (error) {
    console.error("Error fetching rates:", error);
    res.status(500).json({ error: "Failed to fetch rates" });
  }
};
const convertCurrency = async (req, res) => {
  try {
    const { amount, from = "EGP", to } = req.body;
    if (!amount || !to) {
      return res.status(400).json({
        error: "amount and to currency are required"
      });
    }
    const rates = {
      "EGP_USD": 0.032,
      "EGP_EUR": 0.029,
      "EGP_SAR": 0.12
    };
    const rate = rates[`${from}_${to}`] || 1;
    const converted = amount * rate;
    res.json({
      from,
      to,
      amount,
      converted,
      rate
    });
  } catch (error) {
    console.error("Error converting currency:", error);
    res.status(500).json({ error: "Failed to convert currency" });
  }
};
const NOTIFICATIONS_COLLECTION = "notifications";
const getNotifications = async (req, res) => {
  try {
    const { userId, isRead, type, page = 1, limit = 20 } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const queries = [Query.equal("userId", String(userId))];
    if (isRead !== void 0) {
      queries.push(Query.equal("isRead", isRead === "true"));
    }
    if (type) {
      queries.push(Query.equal("type", String(type)));
    }
    queries.push(Query.orderDesc("$createdAt"));
    const offset = (Number(page) - 1) * Number(limit);
    queries.push(Query.limit(Number(limit)));
    queries.push(Query.offset(offset));
    const result = await listDocuments(NOTIFICATIONS_COLLECTION, queries);
    const unreadResult = await listDocuments(NOTIFICATIONS_COLLECTION, [
      Query.equal("userId", String(userId)),
      Query.equal("isRead", false)
    ]);
    res.json({
      notifications: result.documents,
      unreadCount: unreadResult.total,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: result.total,
        totalPages: Math.ceil(result.total / Number(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};
const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type = "info", actionUrl, metadata } = req.body;
    if (!userId || !title || !message) {
      return res.status(400).json({ error: "userId, title, and message are required" });
    }
    const data = {
      userId,
      title,
      message,
      type,
      isRead: false,
      actionUrl,
      metadata: metadata ? JSON.stringify(metadata) : void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const created = await createDocument(NOTIFICATIONS_COLLECTION, data);
    try {
      const { sendNotificationToUser } = require("../websocket");
      sendNotificationToUser(userId, created);
    } catch (wsError) {
      console.log("WebSocket not available or user not connected");
    }
    res.status(201).json(created);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};
const markAsRead = async (req, res) => {
  try {
    const { notificationId, userId } = req.body;
    if (!notificationId) {
      return res.status(400).json({ error: "notificationId is required" });
    }
    const updated = await updateDocument(
      NOTIFICATIONS_COLLECTION,
      notificationId,
      { isRead: true }
    );
    res.json({ success: true, notificationId, markedAt: /* @__PURE__ */ new Date(), updated });
  } catch (error) {
    console.error("Error marking as read:", error);
    res.status(500).json({ error: "Failed to mark as read" });
  }
};
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const unread = await listDocuments(NOTIFICATIONS_COLLECTION, [
      Query.equal("userId", userId),
      Query.equal("isRead", false),
      Query.limit(1e3)
    ]);
    const updates = unread.documents.map((n) => ({ documentId: n.$id, data: { isRead: true } }));
    let markedCount = 0;
    if (updates.length > 0) {
      const { updateMultipleDocuments } = require("../lib/appwrite");
      await updateMultipleDocuments(NOTIFICATIONS_COLLECTION, updates);
      markedCount = updates.length;
    }
    res.json({ success: true, userId, markedCount, markedAt: /* @__PURE__ */ new Date() });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ error: "Failed to mark all as read" });
  }
};
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Notification ID is required" });
    }
    await deleteDocument(NOTIFICATIONS_COLLECTION, id);
    res.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
const broadcastNotification = async (req, res) => {
  try {
    const { title, message, type = "info", targetUsers, targetRole } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: "title and message are required" });
    }
    let recipients = [];
    if (targetUsers && Array.isArray(targetUsers)) {
      recipients = targetUsers;
    } else if (targetRole) {
      recipients = [];
    } else {
      recipients = [];
    }
    let createdNotifications = [];
    if (recipients.length > 0) {
      const dataArray = recipients.map((userId) => ({
        userId,
        title,
        message,
        type,
        isRead: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }));
      const { createMultipleDocuments } = require("../lib/appwrite");
      createdNotifications = await createMultipleDocuments(NOTIFICATIONS_COLLECTION, dataArray);
    }
    try {
      const { broadcastToAll, broadcastToRole } = require("../websocket");
      if (targetRole) {
        broadcastToRole(targetRole, { title, message, type });
      } else {
        broadcastToAll({ title, message, type });
      }
    } catch (wsError) {
      console.log("WebSocket broadcast failed");
    }
    res.status(201).json({
      title,
      message,
      type,
      recipients,
      sentAt: /* @__PURE__ */ new Date(),
      recipientsCount: recipients.length,
      createdNotifications
    });
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    res.status(500).json({ error: "Failed to broadcast notification" });
  }
};
function createServer() {
  const app2 = express__default();
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.use(requestLogger);
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.post("/api/chat", handleChatCompletion);
  app2.get("/api/products", getProducts);
  app2.get("/api/products/:id", getProductById);
  app2.get("/api/categories/:slug/products", getProductsByCategory);
  app2.get("/api/categories", getCategories);
  app2.get("/api/categories/:slug", getCategoryBySlug);
  app2.post("/api/categories/update-counts", updateCategoryProductCount);
  app2.post("/api/auth/login", loginRateLimit, login);
  app2.post("/api/auth/register", registrationRateLimit, register);
  app2.post("/api/auth/forgot-password", passwordResetRateLimit, forgotPassword);
  app2.get("/api/auth/me", getCurrentUser);
  app2.get("/api/admin/stats", getAdminStats);
  app2.post("/api/admin/products", createProduct);
  app2.put("/api/admin/products/:id", updateProduct);
  app2.delete("/api/admin/products/:id", deleteProduct);
  app2.post("/api/admin/categories", createCategory);
  app2.put("/api/admin/categories/:id", updateCategory);
  app2.delete("/api/admin/categories/:id", deleteCategory);
  app2.get("/api/admin/users", getUsers);
  app2.put("/api/admin/users/:id", updateUserRole);
  app2.get("/api/admin/orders", getOrders);
  app2.put("/api/admin/orders/:id", updateOrderStatus);
  app2.get("/api/admin/commissions", getCommissions);
  app2.put("/api/admin/commissions/:id", updateCommissionStatus);
  app2.get("/api/orders", getUserOrders);
  app2.get("/api/orders/:id", getOrderById);
  app2.get("/api/products/:productId/reviews", getProductReviews);
  app2.post("/api/reviews", createReview);
  app2.put("/api/reviews/:id", updateReview);
  app2.delete("/api/reviews/:id", deleteReview);
  app2.post("/api/vendoor/scrape-all", scrapeAllProducts);
  app2.get("/api/vendoor/progress", getScrapingProgress);
  app2.post("/api/vendoor/import-product", importProduct);
  app2.get("/api/vendoor/scrape", scrapeVendoorProducts);
  app2.get("/api/rbac/roles", getRoles);
  app2.post("/api/rbac/roles", createRole);
  app2.put("/api/rbac/roles/:id", updateRole);
  app2.get("/api/rbac/audit-logs", getAuditLogs);
  app2.post("/api/rbac/check-permission", checkPermission);
  app2.get("/api/contracts", getContracts);
  app2.post("/api/contracts", createContract);
  app2.put("/api/contracts/:id", updateContract);
  app2.get("/api/contracts/performance/:id", getContractPerformance);
  app2.get("/api/ab-tests", getABTests);
  app2.post("/api/ab-tests", createABTest);
  app2.put("/api/ab-tests/:id/winner", setABTestWinner);
  app2.get("/api/ab-tests/:id/results", getABTestResults);
  app2.post("/api/ai/chat", aiChat);
  app2.post("/api/ar/models", createARModel);
  app2.get("/api/ar/models/:productId", getARModels);
  app2.post("/api/family/accounts", createFamilyAccount);
  app2.get("/api/family/accounts/:id", getFamilyAccount);
  app2.get("/api/shipments/track/:orderId", trackShipment);
  app2.get("/api/supply/offers", getSupplyOffers);
  app2.post("/api/supply/compare", compareSuppliers);
  app2.post("/api/bundles", createBundle);
  app2.get("/api/price/simulate", simulatePrice);
  app2.get("/api/inventory/alerts", getInventoryAlerts);
  app2.post("/api/inventory/reorder", reorderInventory);
  app2.get("/api/inventory/predictions", getInventoryPredictions);
  app2.get("/api/search", universalSearch);
  app2.get("/api/search/suggestions", getSearchSuggestions);
  app2.get("/api/loyalty/tiers", getLoyaltyTiers);
  app2.post("/api/loyalty/calculate", calculateLoyaltyPoints);
  app2.get("/api/currency/rates", getCurrencyRates);
  app2.post("/api/currency/convert", convertCurrency);
  app2.get("/api/notifications", getNotifications);
  app2.post("/api/notifications", createNotification);
  app2.post("/api/notifications/mark-read", markAsRead);
  app2.post("/api/notifications/mark-all-read", markAllAsRead);
  app2.delete("/api/notifications/:id", deleteNotification);
  app2.post("/api/notifications/broadcast", broadcastNotification);
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
