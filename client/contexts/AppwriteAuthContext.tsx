import React, { createContext, useContext, useEffect, useState } from 'react';
import AppwriteService from '../lib/appwrite';

interface User {
  $id: string;
  name: string;
  email: string;
  phone?: string;
  alternativePhone?: string;
  address?: string;
  role?: 'admin' | 'merchant' | 'affiliate' | 'customer';
  isAffiliate?: boolean;
  isMerchant?: boolean;
  affiliateCode?: string;
  commissionRate?: number;
  accountStatus?: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  register: (email: string, password: string, name: string, accountType?: 'customer' | 'affiliate' | 'merchant' | 'intermediary', phone?: string, alternativePhone?: string) => Promise<{ $id: string; email: string; name: string } | undefined>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // في وضع التطوير، نعرض تحذير بدلاً من رمي خطأ
    if (import.meta.env.DEV) {
      console.warn('useAuth is being called before AuthProvider is ready');
    }
    // نرجع قيم افتراضية بدلاً من رمي خطأ
    return {
      user: null,
      loading: true,
      login: async () => {},
      loginWithGoogle: async () => {},
      loginWithFacebook: async () => {},
      register: async () => {},
      logout: async () => {},
      updateUser: async () => {}
    };
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthUser();
  }, []);

  const checkAuthUser = async () => {
    try {
      setLoading(true);
      
      // Check if Appwrite is configured
      if (!AppwriteService.isConfigured()) {
        console.log('Appwrite not configured, using fallback auth');
        setUser(null);
        return;
      }

      const currentUser = await AppwriteService.getCurrentUser();
      
      if (currentUser) {
        // Use user preferences instead of separate collection
        const prefs = currentUser.prefs as any || {};
        
        // قائمة الإيميلات للمديرين (Super Admins)
        const ADMIN_EMAILS = [
          'lolelarap@gmail.com',
          'admin@egygo.me'
        ];
        
        // Determine user role
        let userRole: 'admin' | 'merchant' | 'affiliate' | 'customer' = prefs.role || 'customer';
        
        // If role not set in prefs, determine from email or affiliate status
        if (!prefs.role) {
          // التحقق من البريد الإلكتروني أولاً للمديرين
          if (ADMIN_EMAILS.includes(currentUser.email.toLowerCase())) {
            userRole = 'admin';
            console.log(`✅ تم تحديد المستخدم كـ Admin: ${currentUser.email}`);
          } else if (currentUser.email.includes('admin')) {
            userRole = 'admin';
          } else if (currentUser.email.includes('merchant') || currentUser.email.includes('vendor')) {
            userRole = 'merchant';
          } else if (prefs.isAffiliate) {
            userRole = 'affiliate';
          } else {
            userRole = 'customer';
          }
          
          // Save the detected role
          try {
            await AppwriteService.updateUserPreferences({ 
              role: userRole,
              isAdmin: userRole === 'admin',
              isSuperAdmin: ADMIN_EMAILS.includes(currentUser.email.toLowerCase())
            });
          } catch (error) {
            console.log('Could not save user role:', error);
          }
        } else if (ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) && prefs.role !== 'admin') {
          // إذا كان البريد في قائمة المديرين لكن الدور ليس admin، قم بالتحديث
          userRole = 'admin';
          try {
            await AppwriteService.updateUserPreferences({ 
              role: 'admin',
              isAdmin: true,
              isSuperAdmin: true
            });
            console.log(`✅ تم تحديث دور المستخدم إلى Admin: ${currentUser.email}`);
          } catch (error) {
            console.log('Could not update user role:', error);
          }
        }
        
        setUser({
          $id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
          role: userRole,
          phone: prefs.phone || '',
          address: prefs.address || '',
          isAffiliate: prefs.isAffiliate || userRole === 'affiliate',
          isMerchant: prefs.isMerchant || userRole === 'merchant',
          affiliateCode: prefs.affiliateCode || '',
          commissionRate: prefs.commissionRate || 0.15,
          accountStatus: prefs.accountStatus || 'approved',
          approvedAt: prefs.approvedAt,
          approvedBy: prefs.approvedBy,
          rejectionReason: prefs.rejectionReason
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (!AppwriteService.isConfigured()) {
        throw new Error('Appwrite غير مُعد. يرجى التحقق من إعدادات المشروع.');
      }

      await AppwriteService.login(email, password);
      await checkAuthUser();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      if (!AppwriteService.isConfigured()) {
        throw new Error('Appwrite غير مُعد. يرجى التحقق من إعدادات المشروع.');
      }

      // This will redirect the user to Google OAuth
      await AppwriteService.loginWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const loginWithFacebook = async () => {
    try {
      if (!AppwriteService.isConfigured()) {
        throw new Error('Appwrite غير مُعد. يرجى التحقق من إعدادات المشروع.');
      }

      // This will redirect the user to Facebook OAuth
      await AppwriteService.loginWithFacebook();
    } catch (error) {
      console.error('Facebook login error:', error);
      throw error;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    accountType: 'customer' | 'affiliate' | 'merchant' | 'intermediary' = 'customer', 
    phone?: string,
    alternativePhone?: string
  ) => {
    try {
      setLoading(true);
      
      if (!AppwriteService.isConfigured()) {
        throw new Error('Appwrite غير مُعد. يرجى التحقق من إعدادات المشروع.');
      }

      // Register user in Appwrite Auth
      await AppwriteService.register(email, password, name);
      
      // Get the current user to get their ID
      const currentUser = await AppwriteService.getCurrentUser();
      
      // Determine if account needs approval (merchants and affiliates)
      const needsApproval = accountType === 'affiliate' || accountType === 'merchant';
      const accountStatus = needsApproval ? 'pending' : 'approved';
      
      // Set user role and preferences after registration
      const preferences: any = {
        role: accountType,
        isAffiliate: accountType === 'affiliate',
        isMerchant: accountType === 'merchant',
        isIntermediary: accountType === 'intermediary',
        phone: phone || '',
        alternativePhone: alternativePhone || '',
        accountStatus: accountStatus,
        approvedAt: needsApproval ? null : new Date().toISOString(),
      };
      
      // Generate affiliate code if needed
      if (accountType === 'affiliate') {
        preferences.affiliateCode = `AFF${Date.now().toString(36).toUpperCase()}`;
        preferences.commissionRate = 0.15; // 15% default commission
      }
      
      // Generate intermediary code if needed
      if (accountType === 'intermediary') {
        preferences.intermediaryCode = `INT${Date.now().toString(36).toUpperCase()}`;
        preferences.defaultMarkupPercentage = 0.20; // 20% default markup
      }
      
      await AppwriteService.updateUserPreferences(preferences);
      
      // Create user document in users collection for admin dashboard
      try {
        const { databases, appwriteConfig } = await import('@/lib/appwrite');
        
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.users,
          currentUser.$id,
          {
            email: email,
            name: name,
            phone: phone || '',
            alternativePhone: alternativePhone || '',
            isAffiliate: accountType === 'affiliate',
            isMerchant: accountType === 'merchant',
            isIntermediary: accountType === 'intermediary',
            affiliateCode: preferences.affiliateCode || null,
            commissionRate: preferences.commissionRate || null,
            accountStatus: accountStatus,
            approvedAt: preferences.approvedAt,
            isActive: !needsApproval, // Only active if doesn't need approval
          }
        );
      } catch (docError) {
        console.error('Failed to create user document:', docError);
        // Don't fail registration if document creation fails
      }
      
      await checkAuthUser();
      
      // Return user info for notification creation
      return {
        $id: currentUser.$id,
        email: currentUser.email,
        name: currentUser.name
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      if (!AppwriteService.isConfigured()) {
        setUser(null);
        return;
      }

      await AppwriteService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;
      
      setLoading(true);
      
      // Update user preferences instead of separate document
      await AppwriteService.updateUserPreferences(userData);
      
      setUser(prev => prev ? { ...prev, ...userData } : null);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithGoogle,
    loginWithFacebook,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};