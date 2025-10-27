/**
 * Lazy Loading Routes Configuration
 * Improves initial load time by code splitting
 */

import { lazy, Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">جاري التحميل...</p>
    </div>
  </div>
);

// Lazy load wrapper
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ReactNode = <LoadingFallback />
) {
  const LazyComponent = lazy(importFunc);
  
  return (props: any) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

// ============================================
// PUBLIC PAGES (High Priority - Lazy for better code splitting)
// ============================================
export { default as Index } from '@/pages/Index';
export { default as Login } from '@/pages/Login';
export { default as Register } from '@/pages/Register';
export const Products = lazyLoad(() => import('@/pages/Products'));
export const ProductDetail = lazyLoad(() => import('@/pages/ProductDetail'));

// ============================================
// CUSTOMER PAGES (Medium Priority - Lazy)
// ============================================
export const Cart = lazyLoad(() => import('@/pages/Cart'));
export const Checkout = lazyLoad(() => import('@/pages/Checkout'));
export const Wishlist = lazyLoad(() => import('@/pages/Wishlist'));
export const MyOrders = lazyLoad(() => import('@/pages/MyOrders'));
export const OrderTracking = lazyLoad(() => import('@/pages/OrderTracking'));
export const OrderSuccess = lazyLoad(() => import('@/pages/OrderSuccess'));
export const CustomerAccount = lazyLoad(() => import('@/pages/CustomerAccount'));

// ============================================
// AFFILIATE PAGES (Lazy)
// ============================================
export const Affiliate = lazyLoad(() => import('@/pages/Affiliate'));
export const AffiliateDashboard = lazyLoad(() => import('@/pages/AffiliateDashboard'));
export const NewAffiliateDashboard = lazyLoad(() => import('@/pages/NewAffiliateDashboard'));
export const EnhancedAffiliateDashboard = lazyLoad(() => import('@/pages/EnhancedAffiliateDashboard'));
export const AffiliateLandingPages = lazyLoad(() => import('@/pages/AffiliateLandingPages'));
export const AffiliateChallenges = lazyLoad(() => import('@/pages/AffiliateChallenges'));
export const AffiliateAnalytics = lazyLoad(() => import('@/pages/AffiliateAnalytics'));
export const AffiliateLinkManager = lazyLoad(() => import('@/pages/AffiliateLinkManager'));
export const AffiliateCreatives = lazyLoad(() => import('@/pages/AffiliateCreatives'));
export const AffiliateCoupons = lazyLoad(() => import('@/pages/AffiliateCoupons'));
export const AffiliateBanners = lazyLoad(() => import('@/pages/AffiliateBanners'));
export const AffiliateMarketingTips = lazyLoad(() => import('@/pages/AffiliateMarketingTips'));
export const AffiliateCourses = lazyLoad(() => import('@/pages/AffiliateCourses'));
export const AffiliateWithdrawPage = lazyLoad(() => import('@/pages/AffiliateWithdrawPage'));
export const AffiliateResourcesPage = lazyLoad(() => import('@/pages/AffiliateResourcesPage'));
export const AffiliateSupportPage = lazyLoad(() => import('@/pages/AffiliateSupportPage'));
export const AffiliateReferralSystem = lazyLoad(() => import('@/pages/AffiliateReferralSystem'));
export const AffiliateEarningsHistory = lazyLoad(() => import('@/pages/AffiliateEarningsHistory'));
export const AffiliateProductLinks = lazyLoad(() => import('@/pages/AffiliateProductLinks'));
export const CustomLandingPage = lazyLoad(() => import('@/pages/CustomLandingPage'));
export const AffiliateLeaderboard = lazyLoad(() => import('@/pages/AffiliateLeaderboard'));
export const AffiliateTools = lazyLoad(() => import('@/pages/AffiliateTools'));

// ============================================
// MERCHANT PAGES (Lazy)
// ============================================
export const Merchant = lazyLoad(() => import('@/pages/Merchant'));
export const MerchantDashboard = lazyLoad(() => import('@/pages/MerchantDashboard'));
export const MerchantProducts = lazyLoad(() => import('@/pages/MerchantProducts'));
export const MerchantProductsStatus = lazyLoad(() => import('@/pages/MerchantProductsStatus'));
export const MerchantOrders = lazyLoad(() => import('@/pages/MerchantOrders'));
export const MerchantAnalytics = lazyLoad(() => import('@/pages/MerchantAnalytics'));
export const MerchantAdvertising = lazyLoad(() => import('@/pages/MerchantAdvertising'));
export const MerchantFinancialHistory = lazyLoad(() => import('@/pages/MerchantFinancialHistory'));

// ============================================
// ADMIN PAGES (Lazy)
// ============================================
export const AdminDashboard = lazyLoad(() => import('@/pages/AdminDashboard'));
export const EnhancedAdminDashboard = lazyLoad(() => import('@/pages/EnhancedAdminDashboard'));
export const AdminUsers = lazyLoad(() => import('@/pages/AdminUsers'));
export const AdminCouponsManager = lazyLoad(() => import('@/pages/AdminCouponsManager'));
export const AdminOffersManager = lazyLoad(() => import('@/pages/AdminOffersManager'));
export const AdminProductApproval = lazyLoad(() => import('@/pages/AdminProductApproval'));
export const AdminProducts = lazyLoad(() => import('@/pages/AdminProducts'));
export const AdminOrders = lazyLoad(() => import('@/pages/AdminOrders'));
export const AdminAnalytics = lazyLoad(() => import('@/pages/AdminAnalytics'));
export const AdminCategories = lazyLoad(() => import('@/pages/AdminCategories'));
export const AdminCommissions = lazyLoad(() => import('@/pages/AdminCommissions'));
export const AdminPendingAccounts = lazyLoad(() => import('@/pages/AdminPendingAccounts'));
export const AdminUserManagement = lazyLoad(() => import('@/pages/AdminUserManagement'));
export const AdminUserManagementFixed = lazyLoad(() => import('@/pages/AdminUserManagementFixed'));
export const AdminProductsAdvanced = lazyLoad(() => import('@/pages/AdminProductsAdvanced'));
export const AdminSettingsPage = lazyLoad(() => import('@/pages/AdminSettingsPage'));
export const AdminShipping = lazyLoad(() => import('@/pages/AdminShipping'));
export const AdminAdvancedSettings = lazyLoad(() => import('@/pages/AdminAdvancedSettings'));
export const AdminNotifications = lazyLoad(() => import('@/pages/AdminNotifications'));
export const AdminCoupons = lazyLoad(() => import('@/pages/AdminCoupons'));
export const AdminAIDashboard = lazyLoad(() => import('@/pages/AdminAIDashboard'));
export const AdminFinancialDashboard = lazyLoad(() => import('@/pages/AdminFinancialDashboard'));
export const ProductAIDemo = lazyLoad(() => import('@/pages/ProductAIDemo'));
export const TestAI = lazyLoad(() => import('@/pages/TestAI'));

// New Admin Pages - Deals, Advertising, Financial
export const AdminDealsManager = lazyLoad(() => import('@/pages/AdminDealsManager'));
export const AdminAdvertisementsManager = lazyLoad(() => import('@/pages/AdminAdvertisementsManager'));
export const AdminWithdrawals = lazyLoad(() => import('@/pages/AdminWithdrawalsManager'));
export const AdminMerchantPaymentsManager = lazyLoad(() => import('@/pages/AdminMerchantPaymentsManager'));
export const AdminFinancialReports = lazyLoad(() => import('@/pages/AdminFinancialReports'));
export const BannersManagement = lazyLoad(() => import('@/pages/admin/BannersManagement'));
export const AdminWhatsAppManager = lazyLoad(() => import('@/pages/AdminWhatsAppManager'));

// Advertising Pages
export const AdPaymentPage = lazyLoad(() => import('@/pages/AdPaymentPage'));

// STATIC/INFO PAGES (Low Priority - Lazy)
// ============================================
export const AboutPage = lazyLoad(() => import('@/pages/AboutPage'));
export const ContactPage = lazyLoad(() => import('@/pages/ContactPage'));
export const FAQPage = lazyLoad(() => import('@/pages/FAQPage'));
export const PrivacyPolicy = lazyLoad(() => import('@/pages/PrivacyPolicy'));
export const TermsOfService = lazyLoad(() => import('@/pages/TermsOfService'));
export const ReturnPolicy = lazyLoad(() => import('@/pages/ReturnPolicy'));
export const ShippingPage = lazyLoad(() => import('@/pages/ShippingPage'));

// ============================================
// SPECIAL PAGES (Lazy)
// ============================================
export const Categories = lazyLoad(() => import('@/pages/Categories'));
export const CategoryPage = lazyLoad(() => import('@/pages/CategoryPage'));
export const DealsPage = lazyLoad(() => import('@/pages/DealsPage'));
export const ProductLanding = lazyLoad(() => import('@/pages/ProductLanding'));

// ============================================
// UTILITY PAGES (Lazy)
// ============================================
export const ForgotPassword = lazyLoad(() => import('@/pages/ForgotPassword'));
export const SettingsPage = lazyLoad(() => import('@/pages/SettingsPage'));
export const UpdateAffiliatePrefs = lazyLoad(() => import('@/pages/UpdateAffiliatePrefs'));
export const VendoorImport = lazyLoad(() => import('@/pages/VendoorImport'));
export const IntermediaryDashboard = lazyLoad(() => import('@/pages/IntermediaryDashboard'));

// ============================================
// ERROR PAGES (Not Lazy - Need immediate load)
// ============================================
export { default as NotFound } from '@/pages/NotFound';
export { default as ErrorBoundary } from '@/pages/ErrorBoundary';

// ============================================
// PRELOAD FUNCTIONS
// ============================================

/**
 * Preload critical routes for better UX
 */
export function preloadCriticalRoutes() {
  // Preload common routes that users are likely to visit
  const criticalRoutes = [
    () => import('@/pages/Cart'),
    () => import('@/pages/Products'),
    () => import('@/pages/ProductDetail'),
  ];

  // Use requestIdleCallback to preload during idle time
  if ('requestIdleCallback' in window) {
    criticalRoutes.forEach(route => {
      requestIdleCallback(() => route());
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      criticalRoutes.forEach(route => route());
    }, 2000);
  }
}

/**
 * Preload routes based on user role
 */
export function preloadRoleBasedRoutes(role: string) {
  const roleRoutes: Record<string, Array<() => Promise<any>>> = {
    affiliate: [
      () => import('@/pages/AffiliateDashboard'),
      () => import('@/pages/AffiliateAnalytics'),
      () => import('@/pages/AffiliateLinkManager'),
    ],
    merchant: [
      () => import('@/pages/MerchantDashboard'),
      () => import('@/pages/MerchantProducts'),
      () => import('@/pages/MerchantOrders'),
    ],
    admin: [
      () => import('@/pages/AdminDashboard'),
      () => import('@/pages/AdminUsers'),
      () => import('@/pages/AdminProducts'),
    ],
  };

  const routes = roleRoutes[role] || [];
  
  if ('requestIdleCallback' in window) {
    routes.forEach(route => {
      requestIdleCallback(() => route());
    });
  } else {
    setTimeout(() => {
      routes.forEach(route => route());
    }, 1000);
  }
}

/**
 * Preload route on hover (for navigation links)
 */
export function preloadOnHover(importFunc: () => Promise<any>) {
  return () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFunc());
    } else {
      importFunc();
    }
  };
}
