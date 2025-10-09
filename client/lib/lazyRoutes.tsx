import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Wrapper for lazy loaded components
export const withSuspense = (Component: React.ComponentType) => {
  return (props: any) => (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
};

// Lazy load all routes for better performance
// Main Pages
export const Index = lazy(() => import('@/pages/Index'));
export const Products = lazy(() => import('@/pages/Products'));
export const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
export const ProductLanding = lazy(() => import('@/pages/ProductLanding'));
export const Categories = lazy(() => import('@/pages/Categories'));
export const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
export const Deals = lazy(() => import('@/pages/Deals'));
export const Cart = lazy(() => import('@/pages/Cart'));
export const Checkout = lazy(() => import('@/pages/Checkout'));
export const Wishlist = lazy(() => import('@/pages/Wishlist'));
export const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'));

// Auth Pages
export const Login = lazy(() => import('@/pages/Login'));
export const Register = lazy(() => import('@/pages/Register'));

// User Pages
export const UserProfile = lazy(() => import('@/pages/UserProfile'));
export const UserOrders = lazy(() => import('@/pages/UserOrders'));
export const UserSettings = lazy(() => import('@/pages/UserSettings'));

// Affiliate Pages
export const Affiliate = lazy(() => import('@/pages/Affiliate'));
export const AffiliateDashboard = lazy(() => import('@/pages/AffiliateDashboard'));
export const EnhancedAffiliateDashboard = lazy(() => import('@/pages/EnhancedAffiliateDashboard'));
export const AffiliateLinkManager = lazy(() => import('@/pages/AffiliateLinkManager'));
export const AffiliateCreatives = lazy(() => import('@/pages/AffiliateCreatives'));
export const AffiliateCoupons = lazy(() => import('@/pages/AffiliateCoupons'));
export const AffiliateWithdrawPage = lazy(() => import('@/pages/AffiliateWithdrawPage'));
export const AffiliateSupportPage = lazy(() => import('@/pages/AffiliateSupportPage'));

// Merchant Pages
export const MerchantDashboard = lazy(() => import('@/pages/MerchantDashboard'));
export const MerchantProducts = lazy(() => import('@/pages/MerchantProducts'));
export const MerchantOrders = lazy(() => import('@/pages/MerchantOrders'));
export const MerchantAnalytics = lazy(() => import('@/pages/MerchantAnalytics'));

// Intermediary Pages
export const IntermediaryDashboard = lazy(() => import('@/pages/IntermediaryDashboard'));

// Admin Pages
export const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
export const EnhancedAdminDashboard = lazy(() => import('@/pages/EnhancedAdminDashboard'));
export const AdminProducts = lazy(() => import('@/pages/AdminProducts'));
export const AdminProductsAdvanced = lazy(() => import('@/pages/AdminProductsAdvanced'));
export const AdminUsers = lazy(() => import('@/pages/AdminUsers'));
export const AdminUserManagement = lazy(() => import('@/pages/AdminUserManagement'));
export const AdminPendingAccounts = lazy(() => import('@/pages/AdminPendingAccounts'));
export const AdminOrders = lazy(() => import('@/pages/AdminOrders'));
export const AdminCategories = lazy(() => import('@/pages/AdminCategories'));
export const AdminCoupons = lazy(() => import('@/pages/AdminCoupons'));
export const AdminShipping = lazy(() => import('@/pages/AdminShipping'));
export const AdminAnalytics = lazy(() => import('@/pages/AdminAnalytics'));
export const AdminSettingsPage = lazy(() => import('@/pages/AdminSettingsPage'));
export const AdminAdvancedSettings = lazy(() => import('@/pages/AdminAdvancedSettings'));

// Vendoor Pages
export const VendoorImport = lazy(() => import('@/pages/VendoorImport'));

// Static Pages
export const AboutPage = lazy(() => import('@/pages/AboutPage'));
export const ContactPage = lazy(() => import('@/pages/ContactPage'));
export const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
export const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
export const FAQPage = lazy(() => import('@/pages/FAQPage'));

// Error Pages
export const NotFound = lazy(() => import('@/pages/NotFound'));
export const ErrorBoundary = lazy(() => import('@/pages/ErrorBoundary'));

// Preload critical routes
export const preloadCriticalRoutes = () => {
  // Preload main pages that users are likely to visit
  import('@/pages/Index');
  import('@/pages/Products');
  import('@/pages/Login');
  import('@/pages/Register');
};

// Preload route on hover
export const preloadRoute = (routeName: string) => {
  switch (routeName) {
    case 'products':
      import('@/pages/Products');
      break;
    case 'cart':
      import('@/pages/Cart');
      break;
    case 'login':
      import('@/pages/Login');
      break;
    case 'register':
      import('@/pages/Register');
      break;
    case 'affiliate':
      import('@/pages/Affiliate');
      break;
    default:
      break;
  }
};
