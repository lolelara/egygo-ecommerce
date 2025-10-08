import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./components/Header";
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
import MerchantDashboard from "./pages/MerchantDashboard";
import IntermediaryDashboard from "./pages/IntermediaryDashboard";
import CustomerAccount from "./pages/CustomerAccount";
import EnhancedAffiliateDashboard from "./pages/EnhancedAffiliateDashboard";
import Wishlist from "./pages/Wishlist";
import OrderTracking from "./pages/OrderTracking";
import Merchant from "./pages/Merchant";
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
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AIAssistant } from "./components/AIAssistant";
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  // Auto-sync worker disabled - attributes removed (autoSyncEnabled, sourceUrl, etc.)
  // useEffect(() => {
  //   startAutoSyncWorker();
  //   console.log('🔄 Auto-sync worker started');
  // }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header cartItemCount={0} />
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
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <HashRouter>
              <Layout>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/category/:slug" element={<Products />} />
                <Route path="/affiliate" element={<Affiliate />} />
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
              
              {/* Affiliate Routes */}
              <Route path="/l/:linkCode" element={<ProductLanding />} />
              <Route path="/affiliate/links" element={<AffiliateLinkManager />} />
              <Route path="/affiliate/analytics" element={<AffiliateAnalytics />} />
              <Route path="/affiliate/creatives" element={<AffiliateCreatives />} />
              <Route path="/affiliate/coupons" element={<AffiliateCoupons />} />
              <Route path="/affiliate/dashboard" element={<EnhancedAffiliateDashboard />} />
              <Route path="/affiliate/withdraw" element={<AffiliateWithdrawPage />} />
              <Route path="/affiliate/resources" element={<AffiliateResourcesPage />} />
              <Route path="/affiliate/support" element={<AffiliateSupportPage />} />
              <Route path="/update-affiliate-prefs" element={<UpdateAffiliatePrefs />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<EnhancedAdminDashboard />} />
              <Route path="/admin/dashboard" element={<EnhancedAdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products-advanced" element={<AdminProductsAdvanced />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/user-management" element={<AdminUserManagement />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/affiliates" element={<AdminUsers />} />
              <Route path="/admin/commissions" element={<AdminCommissions />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
              <Route path="/intermediary/dashboard" element={<IntermediaryDashboard />} />
              <Route path="/intermediary/import" element={<VendoorImport />} />
              <Route path="/admin/vendoor-import" element={<VendoorImport />} />

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
    </HelmetProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
