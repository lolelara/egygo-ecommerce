import "./global.css";
import "./styles/design-system.css";
import "./styles/red-theme.css";
import "./styles/font-fix.css";

import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./components/Header";
import { HelmetProvider } from "react-helmet-async";
import { ParallaxProvider } from "react-scroll-parallax";
import { initializeEnhancements } from "./components/enhanced/GlobalEnhancements";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Footer } from "./components/Footer";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { AuthProvider } from "./contexts/AppwriteAuthContext";
import { CartProvider, useCart } from "./contexts/CartContext";
import { FavoritesProvider, useFavorites } from "./contexts/FavoritesContext";
import { EnhancedErrorBoundary } from "./components/EnhancedErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { I18nProvider } from "./lib/i18n";
import { AIAssistant } from "./components/AIAssistant";
import { initPerformanceOptimizations } from './lib/performance';
import { CookieConsent } from "./components/CookieConsent";
import { NotificationPermission } from "./components/NotificationPermission";
import { loadRecaptchaScript } from "./lib/recaptcha-service";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { initializeAnalytics, trackPageView } from "./lib/analytics";
import { analytics } from "./lib/enhanced-analytics";
import { MobileBottomNavEnhanced } from "./components/MobileBottomNavEnhanced";
import { ToastProvider } from "./components/ToastNotifications";
import { QuickViewProvider } from "./contexts/QuickViewContext";

// Import lazy routes for better performance
import * as LazyRoutes from "@/lib/lazy-routes";

// Keep only critical routes as direct imports (not lazy)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import AuthCallback from "./pages/AuthCallback";
import DataDeletion from "./pages/DataDeletion";

const queryClient = new QueryClient();

// Initialize performance optimizations
initPerformanceOptimizations();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Initialize global enhancements
  useEffect(() => {
    initializeEnhancements();

    // Load reCAPTCHA script
    loadRecaptchaScript().catch(err => {
      console.error('Failed to load reCAPTCHA:', err);
    });

    // Initialize Analytics (GA4 + Facebook Pixel)
    initializeAnalytics();
  }, []);

  // Track page views on route change
  useEffect(() => {
    trackPageView(location.pathname);
    analytics.trackPageView(location.pathname);
  }, [location]);

  const { itemCount } = useCart();
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header cartItemCount={itemCount} />
      {/* Breadcrumbs removed to maximize screen space */}
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTopButton />
      <AIAssistant />

      {/* Cookie Consent & Notification Permission */}
      <CookieConsent />
      <NotificationPermission />

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />

      {/* Mobile Bottom Navigation - Shows only on mobile */}
      <div className="md:hidden">
        <MobileBottomNavEnhanced
          cartCount={itemCount}
          wishlistCount={favorites.length}
        />
      </div>
    </div>
  );
};

const App = () => (
  <EnhancedErrorBoundary>
    <HelmetProvider>
      <ParallaxProvider>
        <ThemeProvider>
          <I18nProvider defaultLocale="ar">
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <CartProvider>
                  <FavoritesProvider>
                    <TooltipProvider>
                      <ToastProvider>
                        <QuickViewProvider>
                          <HashRouter>
                            <Layout>
                              <Routes>
                                <Route path="/" element={<Index />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/logout" element={<Logout />} />
                                <Route path="/auth/callback" element={<AuthCallback />} />

                                {/* <Route path="/categories" element={<LazyRoutes.Categories />} /> */}
                                {/* <Route path="/category" element={<LazyRoutes.Categories />} /> */}
                                <Route path="/products" element={<LazyRoutes.Products />} />
                                <Route path="/category/:slug" element={<LazyRoutes.Products />} />
                                <Route path="/product/:id" element={<LazyRoutes.ProductDetail />} />
                                <Route path="/search" element={<LazyRoutes.Search />} />
                                <Route path="/menu" element={<LazyRoutes.MobileMenu />} />

                                {/* Affiliate public pages */}
                                <Route path="/affiliate" element={<LazyRoutes.Affiliate />} />
                                <Route path="/merchant" element={<LazyRoutes.Merchant />} />

                                {/* Customer pages - Lazy */}
                                {/* <Route path="/deals" element={<LazyRoutes.DealsPage />} /> */}
                                <Route path="/cart" element={<LazyRoutes.Cart />} />
                                <Route path="/checkout" element={<LazyRoutes.Checkout />} />
                                <Route path="/wishlist" element={<LazyRoutes.Wishlist />} />
                                <Route path="/forgot-password" element={<LazyRoutes.ForgotPassword />} />
                                <Route path="/account" element={<LazyRoutes.CustomerAccount />} />
                                <Route path="/settings" element={<LazyRoutes.SettingsPage />} />
                                <Route path="/orders" element={<LazyRoutes.MyOrders />} />
                                <Route path="/orders/:orderId/track" element={<LazyRoutes.OrderTracking />} />

                                {/* Affiliate Routes - Protected & Lazy */}
                                {/* <Route path="/l/:linkCode" element={<LazyRoutes.ProductLanding />} /> */}
                                <Route path="/landing/:slug" element={<LazyRoutes.CustomLandingPage />} />
                                <Route path="/affiliate/dashboard" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateDashboard /></ProtectedRoute>} />
                                <Route path="/affiliate/earnings" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateEarningsHistory /></ProtectedRoute>} />
                                <Route path="/affiliate/product-links" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateProductLinks /></ProtectedRoute>} />
                                <Route path="/affiliate/landing-pages" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateLandingPages /></ProtectedRoute>} />
                                <Route path="/affiliate/tools" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateTools /></ProtectedRoute>} />
                                <Route path="/affiliate/challenges" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateChallenges /></ProtectedRoute>} />
                                <Route path="/affiliate/links" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateLinkManager /></ProtectedRoute>} />
                                <Route path="/affiliate/analytics" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateAnalytics /></ProtectedRoute>} />
                                <Route path="/affiliate/creatives" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateCreatives /></ProtectedRoute>} />
                                <Route path="/affiliate/coupons" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateCoupons /></ProtectedRoute>} />
                                <Route path="/affiliate/banners" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateBanners /></ProtectedRoute>} />
                                <Route path="/affiliate/marketing-tips" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateMarketingTips /></ProtectedRoute>} />
                                <Route path="/affiliate/courses" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateCourses /></ProtectedRoute>} />
                                <Route path="/affiliate/withdraw" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateWithdrawPage /></ProtectedRoute>} />
                                <Route path="/affiliate/withdrawals" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateWithdrawPage /></ProtectedRoute>} />
                                <Route path="/affiliate/earnings" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateAnalytics /></ProtectedRoute>} />
                                <Route path="/affiliate/leaderboard" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateLeaderboard /></ProtectedRoute>} />
                                <Route path="/affiliate/campaigns" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateCreatives /></ProtectedRoute>} />
                                <Route path="/affiliate/reports" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateAnalytics /></ProtectedRoute>} />
                                <Route path="/affiliate/settings" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.UpdateAffiliatePrefs /></ProtectedRoute>} />
                                <Route path="/affiliate/resources" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateResourcesPage /></ProtectedRoute>} />
                                <Route path="/affiliate/support" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateSupportPage /></ProtectedRoute>} />
                                <Route path="/affiliate/referrals" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.AffiliateReferralSystem /></ProtectedRoute>} />
                                <Route path="/update-affiliate-prefs" element={<ProtectedRoute requiredRole="affiliate"><LazyRoutes.UpdateAffiliatePrefs /></ProtectedRoute>} />

                                {/* Admin Routes - Protected & Lazy */}
                                <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminDashboard /></ProtectedRoute>} />
                                <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminDashboard /></ProtectedRoute>} />
                                <Route path="/admin/pending-accounts" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminPendingAccounts /></ProtectedRoute>} />
                                <Route path="/admin/analytics" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminAnalytics /></ProtectedRoute>} />
                                <Route path="/admin/products" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminProducts /></ProtectedRoute>} />
                                <Route path="/admin/products-advanced" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminProductsAdvanced /></ProtectedRoute>} />
                                <Route path="/admin/vendoor-products" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.VendoorProducts /></ProtectedRoute>} />
                                <Route path="/admin/product-approval" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminProductApproval /></ProtectedRoute>} />
                                <Route path="/admin/hero-products" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminHeroProducts /></ProtectedRoute>} />

                                {/* CMS & Notifications Admin Routes */}
                                <Route path="/admin/pages" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminPages /></ProtectedRoute>} />
                                <Route path="/admin/pages/new" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminPageEditor /></ProtectedRoute>} />
                                <Route path="/admin/pages/edit/:id" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminPageEditor /></ProtectedRoute>} />
                                <Route path="/admin/notifications" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminNotifications /></ProtectedRoute>} />

                                {/* Public CMS Pages */}
                                <Route path="/pages/:slug" element={<LazyRoutes.PageViewer />} />

                                {/* Orders System - Separate from Admin */}
                                <Route path="/orders" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.VendoorOrders /></ProtectedRoute>} />
                                <Route path="/orders/vendoor" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.VendoorOrders /></ProtectedRoute>} />
                                <Route path="/admin/categories" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminCategories /></ProtectedRoute>} />
                                <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminUsers /></ProtectedRoute>} />
                                <Route path="/admin/user-management" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminUserManagement /></ProtectedRoute>} />
                                <Route path="/admin/users-fixed" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminUserManagementFixed /></ProtectedRoute>} />
                                <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminOrders /></ProtectedRoute>} />
                                <Route path="/admin/commissions" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminCommissions /></ProtectedRoute>} />
                                <Route path="/admin/financial" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminFinancialDashboard /></ProtectedRoute>} />
                                <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminSettingsPage /></ProtectedRoute>} />
                                <Route path="/admin/coupons" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminCouponsManager /></ProtectedRoute>} />
                                <Route path="/admin/offers" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminOffersManager /></ProtectedRoute>} />
                                <Route path="/admin/shipping" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminShipping /></ProtectedRoute>} />
                                <Route path="/admin/advanced-settings" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminAdvancedSettings /></ProtectedRoute>} />
                                <Route path="/admin/ai-dashboard" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminAIDashboard /></ProtectedRoute>} />
                                <Route path="/admin/ai-tools" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.ProductAIDemo /></ProtectedRoute>} />
                                <Route path="/admin/marketer-tools" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.MarketerTools /></ProtectedRoute>} />
                                <Route path="/admin/marketing" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.MarketerTools /></ProtectedRoute>} />
                                <Route path="/admin/messages" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminWhatsAppManager /></ProtectedRoute>} />
                                <Route path="/test-ai" element={<LazyRoutes.TestAI />} />

                                {/* New Admin Routes - Deals & Advertising */}
                                <Route path="/admin/deals" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminDealsManager /></ProtectedRoute>} />
                                <Route path="/admin/advertisements" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminAdvertisementsManager /></ProtectedRoute>} />
                                <Route path="/admin/withdrawals" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminWithdrawals /></ProtectedRoute>} />
                                <Route path="/admin/banners" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.BannersManagement /></ProtectedRoute>} />
                                <Route path="/admin/whatsapp" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminWhatsAppManager /></ProtectedRoute>} />
                                <Route path="/admin/merchant-payments" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminMerchantPaymentsManager /></ProtectedRoute>} />
                                <Route path="/admin/reports" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.AdminFinancialReports /></ProtectedRoute>} />

                                {/* Ad Payment Page */}
                                <Route path="/ad-payment" element={<ProtectedRoute requiredRole="merchant"><LazyRoutes.AdPaymentPage /></ProtectedRoute>} />

                                {/* Merchant Routes - Protected & Lazy */}
                                <Route path="/merchant/dashboard" element={<ProtectedRoute requiredRole="merchant"><LazyRoutes.MerchantDashboard /></ProtectedRoute>} />
                                <Route path="/merchant/products" element={<ProtectedRoute requiredRole="merchant"><LazyRoutes.MerchantProducts /></ProtectedRoute>} />
                                <Route path="/merchant/products-status" element={<ProtectedRoute requiredRole="merchant"><LazyRoutes.MerchantProductsStatus /></ProtectedRoute>} />
                                <Route path="/merchant/orders" element={<ProtectedRoute requiredRole="merchant"><LazyRoutes.MerchantOrders /></ProtectedRoute>} />
                                <Route path="/merchant/analytics" element={<ProtectedRoute requiredRole="merchant"><LazyRoutes.MerchantAnalytics /></ProtectedRoute>} />
                                <Route path="/merchant/advertising" element={<ProtectedRoute requiredRole="merchant"><LazyRoutes.MerchantAdvertising /></ProtectedRoute>} />
                                <Route path="/merchant/financial" element={<ProtectedRoute requiredRole="merchant"><LazyRoutes.MerchantFinancialHistory /></ProtectedRoute>} />
                                <Route path="/merchant/settings" element={<ProtectedRoute requiredRole="merchant"><LazyRoutes.MerchantSettings /></ProtectedRoute>} />
                                <Route path="/merchant/:id" element={<LazyRoutes.MerchantProfile />} />

                                {/* Intermediary Routes - Protected & Lazy */}
                                <Route path="/intermediary/dashboard" element={<ProtectedRoute requiredRole="intermediary"><LazyRoutes.IntermediaryDashboard /></ProtectedRoute>} />
                                <Route path="/intermediary/import" element={<ProtectedRoute requiredRole="intermediary"><LazyRoutes.VendoorImport /></ProtectedRoute>} />
                                <Route path="/intermediary/products" element={<ProtectedRoute requiredRole="intermediary"><LazyRoutes.MerchantProducts /></ProtectedRoute>} />
                                <Route path="/intermediary/links" element={<ProtectedRoute requiredRole="intermediary"><LazyRoutes.AffiliateLinkManager /></ProtectedRoute>} />

                                {/* Admin Vendoor Import */}
                                <Route path="/admin/vendoor-import" element={<ProtectedRoute requiredRole="admin"><LazyRoutes.VendoorImport /></ProtectedRoute>} />

                                {/* Static pages - Lazy */}
                                <Route path="/about" element={<LazyRoutes.AboutPage />} />
                                <Route path="/contact" element={<LazyRoutes.ContactPage />} />
                                <Route path="/shipping" element={<LazyRoutes.ShippingPage />} />
                                <Route path="/returns" element={<LazyRoutes.ReturnPolicy />} />
                                <Route path="/faq" element={<LazyRoutes.FAQPage />} />
                                <Route path="/privacy" element={<LazyRoutes.PrivacyPolicy />} />
                                <Route path="/terms" element={<LazyRoutes.TermsOfService />} />
                                <Route path="/data-deletion" element={<DataDeletion />} />
                                <Route path="/data-deletion-status" element={<DataDeletion />} />

                                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                            </Layout>
                          </HashRouter>
                        </QuickViewProvider>
                      </ToastProvider>
                    </TooltipProvider>
                  </FavoritesProvider>
                </CartProvider>
              </AuthProvider>
            </QueryClientProvider>
          </I18nProvider>
        </ThemeProvider>
      </ParallaxProvider>
    </HelmetProvider>
  </EnhancedErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
