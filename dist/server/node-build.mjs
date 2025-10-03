import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
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
      where.inStock = inStock === "true";
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
      return res.status(404).json({ error: "ا��منتج غير موجود" });
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
      where.inStock = inStock === "true";
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
function createServer() {
  const app2 = express__default();
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.get("/api/products", getProducts);
  app2.get("/api/products/:id", getProductById);
  app2.get("/api/categories/:slug/products", getProductsByCategory);
  app2.get("/api/categories", getCategories);
  app2.get("/api/categories/:slug", getCategoryBySlug);
  app2.post("/api/categories/update-counts", updateCategoryProductCount);
  app2.post("/api/auth/login", login);
  app2.post("/api/auth/register", register);
  app2.post("/api/auth/forgot-password", forgotPassword);
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
