import { RequestHandler } from "express";
import { prisma } from "@shared/db";

// Get user orders
export const getUserOrders: RequestHandler = async (req, res) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format orders to match frontend expectations
    const formattedOrders = orders.map((order) => {
      const items = order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images && item.product.images.length > 0
          ? (item.product.images as any)[0]?.url || ""
          : "",
      }));

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.createdAt.toISOString().split('T')[0],
        status: order.status,
        total: order.total,
        itemsCount: order.items.length,
        items: items,
        shippingAddress: order.shippingAddress as {
          city: string;
          address: string;
          phone: string;
        },
      };
    });

    res.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// Get single order details
export const getOrderById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: id,
        userId: userId, // Ensure user can only access their own orders
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Format order
    const items = order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
      image: item.product.images && item.product.images.length > 0
        ? (item.product.images as any)[0]?.url || ""
        : "",
    }));

    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString().split('T')[0],
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      discount: order.discount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      itemsCount: order.items.length,
      items: items,
      shippingAddress: order.shippingAddress as {
        name?: string;
        city: string;
        address: string;
        phone: string;
      },
      billingAddress: order.billingAddress,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    res.json(formattedOrder);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
};
