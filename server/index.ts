import "dotenv/config";
import express from "express";
import cors from "cors";
import { requestLogger, loggers } from "./lib/logger";
import { loginRateLimit, registrationRateLimit, passwordResetRateLimit } from "./lib/rateLimiter";
import { handleDemo } from "./routes/demo";
import { handleChatCompletion } from "./routes/chat";
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
import { scrapeVendoorProducts } from "./routes/vendoor-scraper";
import vendoorProductsRouter from "./routes/vendoor-products";
import { login, register, forgotPassword, getCurrentUser } from "./routes/auth";
import { getUserOrders, getOrderById } from "./routes/orders";
import { approveUser } from "./routes/admin-approve-user";
import { updateUserRole as updateUserRoleServer } from "./routes/update-user-role";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from "./routes/reviews";
import {
  scrapeAllProducts as scrapeAllProductsOld,
  getScrapingProgress,
  importProduct as importProductOld,
} from "./routes/vendoor";
import {
  scrapeAllProducts,
  scrapeSingleProduct,
  importProduct,
  importMultipleProducts,
  updateVendoorProducts,
  warmupHandler,
} from "./routes/vendoor-new";
import * as vendoorEnhanced from "./routes/vendoor-enhanced";
import { startVendoorSyncCron, runManualSync } from "./cron/vendoor-sync";
import { scrapeProduct } from "./routes/scrape-product";
import { 
  advancedScrapeProduct,
  enhanceDescription,
  translateProduct,
  optimizeImages,
  reviewProduct,
  aiEnhanceProductDescription,
  aiMarketingSuggestions,
  aiGenerateProductTags,
  priceAnalysis,
  competitorAnalysis,
  generateProductImage
} from "./routes/advanced-scraper";

// ===== NEW ADVANCED APIS =====
// RBAC & Security
import {
  getRoles,
  createRole,
  updateRole,
  getAuditLogs,
  checkPermission,
} from "./routes/rbac";

// Smart Contracts
import {
  getContracts,
  createContract,
  updateContract,
  getContractPerformance,
} from "./routes/contracts";

// A/B Testing
import {
  getABTests,
  createABTest,
  setABTestWinner,
  getABTestResults,
} from "./routes/experiments";

// Customer Experience
import {
  aiChat,
  createARModel,
  getARModels,
  createFamilyAccount,
  getFamilyAccount,
  trackShipment,
} from "./routes/customer-experience";

// Supply Chain & Others
import {
  getSupplyOffers,
  compareSuppliers,
  createBundle,
  simulatePrice,
  getInventoryAlerts,
  reorderInventory,
  getInventoryPredictions,
  universalSearch,
  getSearchSuggestions,
  getLoyaltyTiers,
  calculateLoyaltyPoints,
  getCurrencyRates,
  convertCurrency,
} from "./routes/supply-chain";

// Notifications
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  broadcastNotification,
} from "./routes/notifications";
import openaiKeysRouter from "./routes/openai-keys";

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
  
  // Logging middleware
  app.use(requestLogger);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  
  // AI Chat API
  app.post("/api/chat", handleChatCompletion);

  // Analytics API - will be added later with proper import
  // TODO: Add analytics router with ES6 import

  // Products API
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProductById);
  app.get("/api/categories/:slug/products", getProductsByCategory);

  // Categories API
  app.get("/api/categories", getCategories);
  app.get("/api/categories/:slug", getCategoryBySlug);
  app.post("/api/categories/update-counts", updateCategoryProductCount);

  // Auth API with rate limiting
  app.post("/api/auth/login", loginRateLimit, login);
  app.post("/api/auth/register", registrationRateLimit, register);
  app.post("/api/auth/forgot-password", passwordResetRateLimit, forgotPassword);
  app.get("/api/auth/me", getCurrentUser);

  // Admin APIs
  app.get("/api/admin/stats", getAdminStats);
  app.post("/api/admin/products", createProduct);
  app.put("/api/admin/products/:id", updateProduct);
  app.delete("/api/admin/products/:id", deleteProduct);
  app.post("/api/admin/categories", createCategory);
  app.put("/api/admin/categories/:id", updateCategory);
  app.delete("/api/admin/categories/:id", deleteCategory);
  app.get("/api/admin/users", getUsers);
  app.put("/api/admin/users/:id/role", updateUserRole);
  app.post("/api/admin/update-user-role", updateUserRoleServer);
  app.post("/api/admin/approve-user", approveUser);
  app.get("/api/admin/orders", getOrders);

  // Vendoor APIs
  app.get("/api/vendoor/warmup", warmupHandler); // Warmup endpoint
  app.post("/api/vendoor/scrape-all", scrapeAllProducts);
  app.post("/api/vendoor/scrape-single", scrapeSingleProduct);
  app.post("/api/vendoor/import-product", importProduct);
  app.post("/api/vendoor/import-multiple", importMultipleProducts);
  app.post("/api/vendoor/update-products", updateVendoorProducts);
  app.post("/api/vendoor/sync-manual", async (_req, res) => {
    try {
      const result = await runManualSync();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vendoor Enhanced APIs (NEW - Auto-save to files)
  app.post("/api/vendoor/scrape-and-save", vendoorEnhanced.scrapeAndSaveProducts);
  app.get("/api/vendoor/enhanced-progress", vendoorEnhanced.getScrapingProgress);
  app.get("/api/vendoor/files", vendoorEnhanced.listExportFiles);
  app.get("/api/vendoor/download/:filename", vendoorEnhanced.downloadExportFile);
  app.delete("/api/vendoor/files/:filename", vendoorEnhanced.deleteExportFile);

  // Vendoor Products Management APIs
  app.use("/api", vendoorProductsRouter);

  app.put("/api/admin/orders/:id/status", updateOrderStatus);
  app.get("/api/admin/commissions", getCommissions);
  app.put("/api/admin/commissions/:id/status", updateCommissionStatus);

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

  // Vendoor Import API
  app.post("/api/vendoor/scrape-all", scrapeAllProducts);
  app.get("/api/vendoor/progress", getScrapingProgress);
  app.post("/api/vendoor/import-product", importProduct);
  
  // Vendoor Scraper API (NEW - Simple endpoint)
  app.get("/api/vendoor/scrape", scrapeVendoorProducts);
  
  // Product Scraping API for Intermediaries
  app.post("/api/scrape-product", scrapeProduct);
  app.post("/api/scrape-product-advanced", advancedScrapeProduct);
  
  // AI-Powered Tools for Intermediaries
  app.post("/api/enhance-description", enhanceDescription);
  app.post("/api/translate-product", translateProduct);
  app.post("/api/optimize-images", optimizeImages);
  app.post("/api/review-product", reviewProduct);
  app.post("/api/ai/product/enhance", aiEnhanceProductDescription);
  app.post("/api/ai/product/marketing-suggestions", aiMarketingSuggestions);
  app.post("/api/ai/product/tags", aiGenerateProductTags);
  app.post("/api/ai/price-analysis", priceAnalysis);
  app.post("/api/ai/competitor-analysis", competitorAnalysis);
  app.post("/api/ai/generate-image", generateProductImage);

  // ===== ADVANCED APIS =====
  
  // RBAC & Security
  app.get("/api/rbac/roles", getRoles);
  app.post("/api/rbac/roles", createRole);
  app.put("/api/rbac/roles/:id", updateRole);
  app.get("/api/rbac/audit-logs", getAuditLogs);
  app.post("/api/rbac/check-permission", checkPermission);

  // Smart Contracts
  app.get("/api/contracts", getContracts);
  app.post("/api/contracts", createContract);
  app.put("/api/contracts/:id", updateContract);
  app.get("/api/contracts/performance/:id", getContractPerformance);

  // A/B Testing
  app.get("/api/ab-tests", getABTests);
  app.post("/api/ab-tests", createABTest);
  app.put("/api/ab-tests/:id/winner", setABTestWinner);
  app.get("/api/ab-tests/:id/results", getABTestResults);

  // Customer Experience
  app.post("/api/ai/chat", aiChat);
  app.post("/api/ar/models", createARModel);
  app.get("/api/ar/models/:productId", getARModels);
  app.post("/api/family/accounts", createFamilyAccount);
  app.get("/api/family/accounts/:id", getFamilyAccount);
  app.get("/api/shipments/track/:orderId", trackShipment);

  // Supply Chain
  app.get("/api/supply/offers", getSupplyOffers);
  app.post("/api/supply/compare", compareSuppliers);
  app.post("/api/bundles", createBundle);
  app.get("/api/price/simulate", simulatePrice);

  // Inventory
  app.get("/api/inventory/alerts", getInventoryAlerts);
  app.post("/api/inventory/reorder", reorderInventory);
  app.get("/api/inventory/predictions", getInventoryPredictions);

  // Universal Search
  app.get("/api/search", universalSearch);
  app.get("/api/search/suggestions", getSearchSuggestions);

  // Loyalty & Currency
  app.get("/api/loyalty/tiers", getLoyaltyTiers);
  app.post("/api/loyalty/calculate", calculateLoyaltyPoints);
  app.get("/api/currency/rates", getCurrencyRates);
  app.post("/api/currency/convert", convertCurrency);

  // Notifications
  app.get("/api/notifications", getNotifications);
  app.post("/api/notifications", createNotification);
  app.post("/api/notifications/mark-read", markAsRead);
  app.post("/api/notifications/mark-all-read", markAllAsRead);
  app.delete("/api/notifications/:id", deleteNotification);
  app.post("/api/notifications/broadcast", broadcastNotification);

  // OpenAI Keys Admin API (Appwrite-based)
  app.use("/api", openaiKeysRouter);

  // Start Vendoor Sync Cron Job
  startVendoorSyncCron();
  console.log('✅ Vendoor auto-sync cron job initialized');

  return app;
}

// Start the server if this file is executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const app = createServer();
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Express server running on port ${PORT}`);
    console.log(`📡 API available at: http://localhost:${PORT}/api`);
    console.log(`🔧 Vendoor Enhanced API: http://localhost:${PORT}/api/vendoor/scrape-and-save`);
  });
}
