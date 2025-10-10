import "./global.css";

import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./components/Header";
import { HelmetProvider } from "react-helmet-async";
import { ParallaxProvider } from "react-scroll-parallax";
import { initializeEnhancements } from "./components/enhanced/GlobalEnhancements";
import EgyGoLogo3D from "./components/enhanced/EgyGoLogo3D";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { Footer } from "./components/Footer";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { AuthProvider as OriginalAuthProvider } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AppwriteAuthContext";
import { CartProvider } from "./contexts/CartContext";
// import { startAutoSyncWorker } from "./lib/auto-sync-worker"; // Disabled - attributes removed
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Affiliate from "./pages/Affiliate";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AffiliateDashboard from "./pages/AffiliateDashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminOrders from "./pages/AdminOrders";
import AdminCommissions from "./pages/AdminCommissions";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import EnhancedAdminDashboard from "./pages/EnhancedAdminDashboard";
import AdminPendingAccounts from "./pages/AdminPendingAccounts";
import MerchantDashboard from "./pages/MerchantDashboard";
import IntermediaryDashboard from "./pages/IntermediaryDashboard";
import CustomerAccount from "./pages/CustomerAccount";
import EnhancedAffiliateDashboard from "./pages/EnhancedAffiliateDashboard";
import Wishlist from "./pages/Wishlist";
import OrderTracking from "./pages/OrderTracking";
import Merchant from "./pages/Merchant";
import EnhancedHomepage from "./pages/EnhancedHomepage";
import ProductLanding from "./pages/ProductLanding";
import AffiliateLinkManager from "./pages/AffiliateLinkManager";
import AffiliateAnalytics from "./pages/AffiliateAnalytics";
import AffiliateCreatives from "./pages/AffiliateCreatives";
import VendoorImport from "./pages/VendoorImport";
import UpdateAffiliatePrefs from "./pages/UpdateAffiliatePrefs";
import AffiliateCoupons from "./pages/AffiliateCoupons";
import DealsPage from "./pages/DealsPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ShippingPage from "./pages/ShippingPage";
import FAQPage from "./pages/FAQPage";
import AffiliateWithdrawPage from "./pages/AffiliateWithdrawPage";
import AffiliateResourcesPage from "./pages/AffiliateResourcesPage";
import AffiliateSupportPage from "./pages/AffiliateSupportPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import SettingsPage from "./pages/SettingsPage";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminProductsAdvanced from "./pages/AdminProductsAdvanced";
import AdminCoupons from "./pages/AdminCoupons";
import AdminShipping from "./pages/AdminShipping";
import AdminAdvancedSettings from "./pages/AdminAdvancedSettings";
import AdminNotifications from "./pages/AdminNotifications";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AIAssistant } from "./components/AIAssistant";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { initPerformanceOptimizations } from './lib/performance';

const queryClient = new QueryClient();

// Initialize performance optimizations
initPerformanceOptimizations();

import { useLocation } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Initialize global enhancements
  useEffect(() => {
    initializeEnhancements();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header cartItemCount={0} />
      {/* Breadcrumbs: hide on home page only */}
      {location.pathname !== "/" && <Breadcrumbs />}
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTopButton />
      <AIAssistant />
    </div>
  );
};

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <ParallaxProvider>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <CartProvider>
                <TooltipProvider>
                  <Toaster position="top-center" richColors closeButton />
                  <HashRouter>
              <Layout>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/enhanced" element={<EnhancedHomepage />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category" element={<Categories />} />
                <Route path="/category/:slug" element={<Products />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
                <Route path="/merchant" element={<Merchant />} />

                <Route path="/deals" element={<DealsPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/account" element={<CustomerAccount />} />
              <Route path="/my-account" element={<CustomerAccount />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/orders/:orderId/track" element={<OrderTracking />} />
              
              {/* Affiliate Routes - Protected */}
              <Route path="/l/:linkCode" element={<ProductLanding />} />
              <Route path="/affiliate/links" element={<ProtectedRoute requiredRole="affiliate"><AffiliateLinkManager /></ProtectedRoute>} />
              <Route path="/affiliate/analytics" element={<ProtectedRoute requiredRole="affiliate"><AffiliateAnalytics /></ProtectedRoute>} />
              <Route path="/affiliate/creatives" element={<ProtectedRoute requiredRole="affiliate"><AffiliateCreatives /></ProtectedRoute>} />
              <Route path="/affiliate/coupons" element={<ProtectedRoute requiredRole="affiliate"><AffiliateCoupons /></ProtectedRoute>} />
              <Route path="/affiliate/dashboard" element={<ProtectedRoute requiredRole="affiliate"><AffiliateDashboard /></ProtectedRoute>} />
              <Route path="/affiliate/withdraw" element={<ProtectedRoute requiredRole="affiliate"><AffiliateWithdrawPage /></ProtectedRoute>} />
              <Route path="/affiliate/resources" element={<ProtectedRoute requiredRole="affiliate"><AffiliateResourcesPage /></ProtectedRoute>} />
              <Route path="/affiliate/support" element={<ProtectedRoute requiredRole="affiliate"><AffiliateSupportPage /></ProtectedRoute>} />
              <Route path="/update-affiliate-prefs" element={<ProtectedRoute requiredRole="affiliate"><UpdateAffiliatePrefs /></ProtectedRoute>} />

              {/* Admin Routes - Protected */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/pending-accounts" element={<ProtectedRoute requiredRole="admin"><AdminPendingAccounts /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute requiredRole="admin"><AdminAnalytics /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute requiredRole="admin"><AdminProducts /></ProtectedRoute>} />
              <Route path="/admin/products-advanced" element={<ProtectedRoute requiredRole="admin"><AdminProductsAdvanced /></ProtectedRoute>} />
              <Route path="/admin/categories" element={<ProtectedRoute requiredRole="admin"><AdminCategories /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/user-management" element={<ProtectedRoute requiredRole="admin"><AdminUserManagement /></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><AdminOrders /></ProtectedRoute>} />
              <Route path="/admin/affiliates" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/commissions" element={<ProtectedRoute requiredRole="admin"><AdminCommissions /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettingsPage /></ProtectedRoute>} />
              <Route path="/admin/coupons" element={<ProtectedRoute requiredRole="admin"><AdminCoupons /></ProtectedRoute>} />
              <Route path="/admin/shipping" element={<ProtectedRoute requiredRole="admin"><AdminShipping /></ProtectedRoute>} />
              <Route path="/admin/advanced-settings" element={<ProtectedRoute requiredRole="admin"><AdminAdvancedSettings /></ProtectedRoute>} />
              <Route path="/admin/notifications" element={<ProtectedRoute requiredRole="admin"><AdminNotifications /></ProtectedRoute>} />
              <Route path="/merchant/dashboard" element={<ProtectedRoute requiredRole="merchant"><MerchantDashboard /></ProtectedRoute>} />
              <Route path="/intermediary/dashboard" element={<ProtectedRoute requiredRole="merchant"><IntermediaryDashboard /></ProtectedRoute>} />
              <Route path="/intermediary/import" element={<ProtectedRoute requiredRole="merchant"><VendoorImport /></ProtectedRoute>} />
              <Route path="/admin/vendoor-import" element={<ProtectedRoute requiredRole="admin"><VendoorImport /></ProtectedRoute>} />

              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/returns" element={<ReturnPolicy />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </HashRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
        </ThemeProvider>
      </ParallaxProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
