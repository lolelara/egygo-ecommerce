import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'merchant' | 'affiliate' | 'customer';
  requireAuth?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && user) {
    // Admin has access to everything
    if (user.role === 'admin') {
      return <>{children}</>;
    }

    // Check if user has the required role
    if (user.role !== requiredRole) {
      // Special cases for affiliate and merchant
      if (requiredRole === 'affiliate' && !user.isAffiliate) {
        return <Navigate to="/affiliate" replace />;
      }
      if (requiredRole === 'merchant' && !user.isMerchant) {
        return <Navigate to="/merchant" replace />;
      }
      
      // Redirect to appropriate dashboard based on user role
      const redirectPaths = {
        customer: '/',
        affiliate: '/affiliate/dashboard',
        merchant: '/merchant/dashboard',
        admin: '/admin'
      };
      
      return <Navigate to={redirectPaths[user.role as keyof typeof redirectPaths] || '/'} replace />;
    }

    // Check account status for merchants and affiliates
    if ((requiredRole === 'merchant' || requiredRole === 'affiliate') && 
        user.accountStatus !== 'approved') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">حسابك قيد المراجعة</h2>
            <p className="text-muted-foreground mb-4">
              {user.accountStatus === 'pending' 
                ? 'حسابك قيد المراجعة من قبل الإدارة. سيتم إشعارك عند الموافقة.'
                : `تم رفض حسابك. السبب: ${user.rejectionReason || 'غير محدد'}`}
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
