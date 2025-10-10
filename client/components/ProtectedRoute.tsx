import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Loader2, ShieldAlert, Lock } from 'lucide-react';
import { hasPermission, Permission, UserRole, getDashboardRoute } from '@/lib/permissions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'merchant' | 'affiliate' | 'customer';
  requiredPermission?: Permission;
  requireAuth?: boolean;
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredPermission,
  requireAuth = true,
  fallbackPath 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  // Check permission-based access (more granular than role)
  if (requiredPermission && user) {
    const userRole = user.role as UserRole;
    if (!hasPermission(userRole, requiredPermission)) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-50 to-orange-50">
          <Alert variant="destructive" className="max-w-md">
            <ShieldAlert className="h-5 w-5" />
            <AlertTitle className="text-xl font-bold">غير مصرح</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">ليس لديك صلاحية للوصول إلى هذه الصفحة.</p>
              <Button onClick={() => window.location.href = getDashboardRoute(userRole)}>
                العودة للوحة التحكم
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  // Check role-based access
  if (requiredRole && user) {
    const userRole = user.role as UserRole;
    
    // Admin and Super Admin have access to everything
    if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
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
      
      // Redirect to appropriate dashboard
      const redirectPath = fallbackPath || getDashboardRoute(userRole);
      return <Navigate to={redirectPath} replace />;
    }

    // Check account status for merchants and affiliates
    if ((requiredRole === 'merchant' || requiredRole === 'affiliate') && 
        user.accountStatus !== 'approved') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
          <Alert className="max-w-md border-yellow-500 bg-yellow-50">
            <Lock className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-xl font-bold text-yellow-900">
              حسابك قيد المراجعة
            </AlertTitle>
            <AlertDescription className="mt-2 text-yellow-800">
              <p className="mb-4">
                {user.accountStatus === 'pending' 
                  ? 'حسابك قيد المراجعة من قبل الإدارة. سيتم إشعارك عند الموافقة عبر البريد الإلكتروني.'
                  : user.accountStatus === 'rejected'
                  ? `تم رفض حسابك. السبب: ${user.rejectionReason || 'غير محدد'}. يمكنك التواصل مع الدعم الفني.`
                  : 'حالة حسابك غير معروفة. يرجى التواصل مع الدعم الفني.'}
              </p>
              <div className="flex gap-2">
                <Button onClick={() => window.location.href = '/'} variant="outline">
                  الصفحة الرئيسية
                </Button>
                <Button onClick={() => window.location.href = '/contact'}>
                  تواصل معنا
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }
  }

  return <>{children}</>;
}
