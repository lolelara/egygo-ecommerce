import { RequestHandler } from "express";
import { prisma } from "@shared/db";
import type {
  AdminStats,
  User,
  Product,
  Category,
  Order,
  Commission,
} from "@shared/api";

// Get admin dashboard stats
export const getAdminStats: RequestHandler = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalAffiliates,
      pendingOrders,
      pendingCommissions,
      orders,
      products,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.affiliateUser.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.commission.aggregate({
        where: { status: "PENDING" },
        _sum: { amount: true },
      }),
      prisma.order.findMany({
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        include: {
          orderItems: true,
          category: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Calculate revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const thisMonth = new Date();
    thisMonth.setDate(1);

    const thisMonthOrders = orders.filter(
      (order) => new Date(order.createdAt) >= thisMonth,
    );
    const thisMonthRevenue = thisMonthOrders.reduce(
      (sum, order) => sum + order.total,
      0,
    );

    // Get top selling products
    const productSales = products
      .map((product) => {
        const soldQuantity = product.orderItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        const revenue = product.orderItems.reduce(
          (sum, item) => sum + item.total,
          0,
        );
        return {
          product: {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice || undefined,
            images: [], // Will be populated from images relation
            category: product.categoryId,
            tags: [], // Will be populated from tags relation
            inStock: product.inStock,
            rating: product.rating,
            reviewCount: product.reviewCount,
            affiliateCommission: product.affiliateCommission,
          },
          soldQuantity,
          revenue,
        };
      })
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .slice(0, 5);

    // Get recent orders
    const recentOrders = orders.slice(0, 5).map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status as Order["status"],
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus as Order["paymentStatus"],
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
          originalPrice: item.product.originalPrice || undefined,
          images: [], // Populate from images relation
          category: item.product.categoryId,
          tags: [], // Populate from tags relation
          inStock: item.product.inStock,
          rating: item.product.rating,
          reviewCount: item.product.reviewCount,
          affiliateCommission: item.product.affiliateCommission,
        },
      })),
    }));

    const stats: AdminStats = {
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
      recentOrders,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "فشل في جلب إحصائيات لوحة التحكم" });
  }
};

// Admin Products Management
export const createProduct: RequestHandler = async (req, res) => {
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
      affiliateCommission,
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
          create: images.map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
        tags: {
          connectOrCreate: tags.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: {
        category: true,
        images: true,
        tags: true,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "فشل في إنشاء المنتج" });
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
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
      affiliateCommission,
    } = req.body;

    // Delete existing images and tags
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.product.update({
      where: { id },
      data: { tags: { set: [] } },
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
          create: images.map((url: string, index: number) => ({
            url,
            order: index,
          })),
        },
        tags: {
          connectOrCreate: tags.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: {
        category: true,
        images: true,
        tags: true,
      },
    });

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "فشل في تحديث المنتج" });
  }
};

export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "تم حذف المنتج بنجاح" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "فشل في حذف المنتج" });
  }
};

// Admin Categories Management
export const createCategory: RequestHandler = async (req, res) => {
  try {
    const { name, slug, description, image } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "فشل في إنشاء الفئة" });
  }
};

export const updateCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, image } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        image,
      },
    });

    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "فشل في تحديث الفئة" });
  }
};

export const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: "تم حذف الفئة بنجاح" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "فشل في حذف الفئة" });
  }
};

// Admin Users Management
export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        affiliate: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "فشل في جلب المستخدمين" });
  }
};

export const updateUserRole: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { role, isActive },
    });

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "فشل في تحديث المستخدم" });
  }
};

// Admin Orders Management
export const getOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "فشل في جلب الطلبات" });
  }
};

export const updateOrderStatus: RequestHandler = async (req, res) => {
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
            product: true,
          },
        },
      },
    });

    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "فشل في تحديث الطلب" });
  }
};

// Admin Commissions Management
export const getCommissions: RequestHandler = async (req, res) => {
  try {
    const commissions = await prisma.commission.findMany({
      include: {
        affiliate: {
          include: {
            user: true,
          },
        },
        order: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(commissions);
  } catch (error) {
    console.error("Error fetching commissions:", error);
    res.status(500).json({ error: "فشل في جلب العمولات" });
  }
};

export const updateCommissionStatus: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const commission = await prisma.commission.update({
      where: { id },
      data: { status },
      include: {
        affiliate: {
          include: {
            user: true,
          },
        },
        order: true,
      },
    });

    res.json(commission);
  } catch (error) {
    console.error("Error updating commission:", error);
    res.status(500).json({ error: "فشل في تحديث العمولة" });
  }
};
