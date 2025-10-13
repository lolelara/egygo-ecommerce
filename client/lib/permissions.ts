/**
 * Advanced Permission System for EgyGo
 * Handles role-based access control (RBAC) for different user types
 */

export enum UserRole {
  CUSTOMER = 'customer',
  AFFILIATE = 'affiliate',
  MERCHANT = 'merchant',
  INTERMEDIARY = 'intermediary',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum Permission {
  // Product Permissions
  VIEW_PRODUCTS = 'view_products',
  CREATE_PRODUCT = 'create_product',
  EDIT_OWN_PRODUCT = 'edit_own_product',
  EDIT_ANY_PRODUCT = 'edit_any_product',
  DELETE_OWN_PRODUCT = 'delete_own_product',
  DELETE_ANY_PRODUCT = 'delete_any_product',
  
  // Order Permissions
  VIEW_OWN_ORDERS = 'view_own_orders',
  VIEW_ALL_ORDERS = 'view_all_orders',
  MANAGE_OWN_ORDERS = 'manage_own_orders',
  MANAGE_ALL_ORDERS = 'manage_all_orders',
  
  // Affiliate Permissions
  VIEW_AFFILIATE_STATS = 'view_affiliate_stats',
  GENERATE_AFFILIATE_LINKS = 'generate_affiliate_links',
  WITHDRAW_EARNINGS = 'withdraw_earnings',
  VIEW_CREATIVES = 'view_creatives',
  
  // Merchant Permissions
  VIEW_MERCHANT_DASHBOARD = 'view_merchant_dashboard',
  MANAGE_INVENTORY = 'manage_inventory',
  VIEW_SALES_REPORTS = 'view_sales_reports',
  MANAGE_SHIPPING = 'manage_shipping',
  
  // Intermediary Permissions
  VIEW_INTERMEDIARY_DASHBOARD = 'view_intermediary_dashboard',
  IMPORT_PRODUCTS = 'import_products',
  SCRAPE_PRODUCTS = 'scrape_products',
  MANAGE_MARKUP = 'manage_markup',
  GENERATE_INTERMEDIARY_LINKS = 'generate_intermediary_links',
  VIEW_INTERMEDIARY_STATS = 'view_intermediary_stats',
  
  // Admin Permissions
  VIEW_ADMIN_DASHBOARD = 'view_admin_dashboard',
  MANAGE_USERS = 'manage_users',
  MANAGE_CATEGORIES = 'manage_categories',
  MANAGE_COUPONS = 'manage_coupons',
  MANAGE_COMMISSIONS = 'manage_commissions',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_SETTINGS = 'manage_settings',
  APPROVE_ACCOUNTS = 'approve_accounts',
  
  // Customer Permissions
  PLACE_ORDER = 'place_order',
  VIEW_WISHLIST = 'view_wishlist',
  WRITE_REVIEW = 'write_review'
}

// Role-based permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.CUSTOMER]: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_OWN_ORDERS,
    Permission.PLACE_ORDER,
    Permission.VIEW_WISHLIST,
    Permission.WRITE_REVIEW
  ],
  
  [UserRole.AFFILIATE]: [
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_OWN_ORDERS,
    Permission.PLACE_ORDER,
    Permission.VIEW_WISHLIST,
    Permission.VIEW_AFFILIATE_STATS,
    Permission.GENERATE_AFFILIATE_LINKS,
    Permission.WITHDRAW_EARNINGS,
    Permission.VIEW_CREATIVES
  ],
  
  [UserRole.MERCHANT]: [
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCT,
    Permission.EDIT_OWN_PRODUCT,
    Permission.DELETE_OWN_PRODUCT,
    Permission.VIEW_OWN_ORDERS,
    Permission.MANAGE_OWN_ORDERS,
    Permission.VIEW_MERCHANT_DASHBOARD,
    Permission.MANAGE_INVENTORY,
    Permission.VIEW_SALES_REPORTS,
    Permission.MANAGE_SHIPPING
  ],
  
  [UserRole.INTERMEDIARY]: [
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCT,
    Permission.EDIT_OWN_PRODUCT,
    Permission.DELETE_OWN_PRODUCT,
    Permission.VIEW_OWN_ORDERS,
    Permission.MANAGE_OWN_ORDERS,
    Permission.VIEW_INTERMEDIARY_DASHBOARD,
    Permission.IMPORT_PRODUCTS,
    Permission.SCRAPE_PRODUCTS,
    Permission.MANAGE_MARKUP,
    Permission.GENERATE_INTERMEDIARY_LINKS,
    Permission.VIEW_INTERMEDIARY_STATS,
    Permission.PLACE_ORDER,
    Permission.VIEW_WISHLIST
  ],
  
  [UserRole.ADMIN]: [
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCT,
    Permission.EDIT_ANY_PRODUCT,
    Permission.DELETE_ANY_PRODUCT,
    Permission.VIEW_ALL_ORDERS,
    Permission.MANAGE_ALL_ORDERS,
    Permission.VIEW_ADMIN_DASHBOARD,
    Permission.MANAGE_USERS,
    Permission.MANAGE_CATEGORIES,
    Permission.MANAGE_COUPONS,
    Permission.MANAGE_COMMISSIONS,
    Permission.VIEW_ANALYTICS,
    Permission.APPROVE_ACCOUNTS
  ],
  
  [UserRole.SUPER_ADMIN]: [
    ...Object.values(Permission) // Super admin has all permissions
  ]
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(userRole: UserRole | string, permission: Permission): boolean {
  const role = userRole as UserRole;
  const permissions = rolePermissions[role] || [];
  return permissions.includes(permission);
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(userRole: UserRole | string, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(userRole: UserRole | string, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(userRole: UserRole | string): Permission[] {
  const role = userRole as UserRole;
  return rolePermissions[role] || [];
}

/**
 * Check if user can access a specific product (for merchants)
 */
export function canAccessProduct(userRole: UserRole | string, userId: string, productOwnerId: string): boolean {
  const role = userRole as UserRole;
  
  // Admin can access all products
  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Merchant can only access their own products
  if (role === UserRole.MERCHANT) {
    return userId === productOwnerId;
  }
  
  return false;
}

/**
 * Check if user can access specific orders (for merchants)
 */
export function canAccessOrder(userRole: UserRole | string, userId: string, orderOwnerId: string): boolean {
  const role = userRole as UserRole;
  
  // Admin can access all orders
  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    return true;
  }
  
  // Users can access their own orders
  return userId === orderOwnerId;
}

/**
 * Get dashboard route based on user role
 */
export function getDashboardRoute(userRole: UserRole | string): string {
  const role = userRole as UserRole;
  
  switch (role) {
    case UserRole.ADMIN:
    case UserRole.SUPER_ADMIN:
      return '/admin/dashboard';
    case UserRole.MERCHANT:
      return '/merchant/dashboard';
    case UserRole.INTERMEDIARY:
      return '/intermediary/dashboard';
    case UserRole.AFFILIATE:
      return '/affiliate/dashboard';
    case UserRole.CUSTOMER:
    default:
      return '/account';
  }
}

/**
 * Get allowed routes for a user role
 */
export function getAllowedRoutes(userRole: UserRole | string): string[] {
  const role = userRole as UserRole;
  
  const commonRoutes = ['/', '/products', '/about', '/contact', '/cart', '/wishlist'];
  
  switch (role) {
    case UserRole.ADMIN:
    case UserRole.SUPER_ADMIN:
      return [
        ...commonRoutes,
        '/admin/*'
      ];
    case UserRole.MERCHANT:
      return [
        ...commonRoutes,
        '/merchant/*',
        '/account'
      ];
    case UserRole.INTERMEDIARY:
      return [
        ...commonRoutes,
        '/intermediary/*',
        '/account'
      ];
    case UserRole.AFFILIATE:
      return [
        ...commonRoutes,
        '/affiliate/*',
        '/account'
      ];
    case UserRole.CUSTOMER:
    default:
      return [
        ...commonRoutes,
        '/account',
        '/orders',
        '/checkout'
      ];
  }
}

/**
 * Sanitize user data based on role (prevent data leakage)
 */
export function sanitizeUserData(user: any, viewerRole: UserRole | string) {
  const role = viewerRole as UserRole;
  
  // Admin can see all data
  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    return user;
  }
  
  // Remove sensitive fields for non-admin users
  const { password, prefs, ...safeData } = user;
  return safeData;
}

/**
 * Filter products based on merchant ownership
 */
export function filterMerchantProducts(products: any[], merchantId: string): any[] {
  return products.filter(product => product.merchantId === merchantId);
}

/**
 * Filter orders based on merchant ownership
 */
export function filterMerchantOrders(orders: any[], merchantId: string): any[] {
  return orders.filter(order => 
    order.items?.some((item: any) => item.merchantId === merchantId)
  );
}
