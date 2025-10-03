import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { AuthProvider as OriginalAuthProvider } from "./contexts/AuthContext";
import { AuthProvider } from "./contexts/AppwriteAuthContext";
import { CartProvider } from "./contexts/CartContext";
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
import CustomerAccount from "./pages/CustomerAccount";
import EnhancedAffiliateDashboard from "./pages/EnhancedAffiliateDashboard";
import Wishlist from "./pages/Wishlist";
import OrderTracking from "./pages/OrderTracking";
import Merchant from "./pages/Merchant";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header cartItemCount={0} />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/category/:slug" element={<Products />} />
                <Route path="/affiliate" element={<Affiliate />} />
                <Route path="/merchant" element={<Merchant />} />

                {/* Placeholder routes */}
                <Route
                  path="/deals"
                  element={<PlaceholderPage title="Special Deals" />}
                />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/account" element={<CustomerAccount />} />
              <Route path="/my-account" element={<CustomerAccount />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/orders/:orderId/track" element={<OrderTracking />} />
              <Route
                path="/affiliate/dashboard"
                element={<EnhancedAffiliateDashboard />}
              />
              <Route
                path="/affiliate/withdraw"
                element={<PlaceholderPage title="س��ب الأرباح" />}
              />
              <Route
                path="/affiliate/resources"
                element={<PlaceholderPage title="مصادر التسويق" />}
              />
              <Route
                path="/affiliate/support"
                element={<PlaceholderPage title="الدعم الفني" />}
              />

              {/* Admin Routes */}
              <Route path="/admin" element={<EnhancedAdminDashboard />} />
              <Route path="/admin/dashboard" element={<EnhancedAdminDashboard />} />
              <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/affiliates" element={<AdminUsers />} />
              <Route path="/admin/commissions" element={<AdminCommissions />} />
              <Route
                path="/admin/settings"
                element={<PlaceholderPage title="إعدادات النظام" />}
              />
              <Route path="/account" element={<CustomerAccount />} />
              <Route path="/my-account" element={<CustomerAccount />} />

              <Route
                path="/about"
                element={<PlaceholderPage title="About Us" />}
              />
              <Route
                path="/contact"
                element={<PlaceholderPage title="Contact" />}
              />
              <Route
                path="/shipping"
                element={<PlaceholderPage title="Shipping Info" />}
              />
              <Route path="/returns" element={<ReturnPolicy />} />
              <Route path="/faq" element={<PlaceholderPage title="FAQ" />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </AuthProvider>
</QueryClientProvider>
  </ErrorBoundary>
);

createRoot(document.getElementById("root")!).render(<App />);
