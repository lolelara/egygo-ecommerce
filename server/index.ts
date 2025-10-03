import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getProducts,
  getProductById,
  getProductsByCategory,
} from "./routes/products";
import {
  getCategories,
  getCategoryBySlug,
  updateCategoryProductCount,
} from "./routes/categories";
import {
  getAdminStats,
  createProduct,
  updateProduct,
  deleteProduct,
  createCategory,
  updateCategory,
  deleteCategory,
  getUsers,
  updateUserRole,
  getOrders,
  updateOrderStatus,
  getCommissions,
  updateCommissionStatus,
} from "./routes/admin";
import { login, register, forgotPassword, getCurrentUser } from "./routes/auth";
import { getUserOrders, getOrderById } from "./routes/orders";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from "./routes/reviews";
// Wishlist imports commented out for static deployment
// import {
//   getUserWishlist,
//   addToWishlist,
//   removeFromWishlist,
//   isInWishlist,
// } from "./routes/wishlist";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Products API
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProductById);
  app.get("/api/categories/:slug/products", getProductsByCategory);

  // Categories API
  app.get("/api/categories", getCategories);
  app.get("/api/categories/:slug", getCategoryBySlug);
  app.post("/api/categories/update-counts", updateCategoryProductCount);

  // Auth API
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", register);
  app.post("/api/auth/forgot-password", forgotPassword);
  app.get("/api/auth/me", getCurrentUser);

  // Admin API
  app.get("/api/admin/stats", getAdminStats);

  // Admin Products
  app.post("/api/admin/products", createProduct);
  app.put("/api/admin/products/:id", updateProduct);
  app.delete("/api/admin/products/:id", deleteProduct);

  // Admin Categories
  app.post("/api/admin/categories", createCategory);
  app.put("/api/admin/categories/:id", updateCategory);
  app.delete("/api/admin/categories/:id", deleteCategory);

  // Admin Users
  app.get("/api/admin/users", getUsers);
  app.put("/api/admin/users/:id", updateUserRole);

  // Admin Orders
  app.get("/api/admin/orders", getOrders);
  app.put("/api/admin/orders/:id", updateOrderStatus);

  // Admin Commissions
  app.get("/api/admin/commissions", getCommissions);
  app.put("/api/admin/commissions/:id", updateCommissionStatus);

  // User Orders API
  app.get("/api/orders", getUserOrders);
  app.get("/api/orders/:id", getOrderById);

  // Reviews API
  app.get("/api/products/:productId/reviews", getProductReviews);
  app.post("/api/reviews", createReview);
  app.put("/api/reviews/:id", updateReview);
  app.delete("/api/reviews/:id", deleteReview);

  // Wishlist API - Commented out for static deployment
  // Use client-side Appwrite SDK instead
  // app.get("/api/wishlist", getUserWishlist);
  // app.post("/api/wishlist", addToWishlist);
  // app.delete("/api/wishlist/:id", removeFromWishlist);
  // app.get("/api/wishlist/check", isInWishlist);

  return app;
}
