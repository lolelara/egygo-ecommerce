import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import AppwriteService, { databases, appwriteConfig } from '../lib/appwrite';
import { Query } from 'appwrite';
import { startSessionSync } from '../lib/session-sync';

interface User {
  $id: string;
  name: string;
  email: string;
  phone?: string;
  alternativePhone?: string;
  address?: string;
  role?: 'admin' | 'merchant' | 'affiliate' | 'customer' | 'intermediary';
  isAffiliate?: boolean;
  isMerchant?: boolean;
  isIntermediary?: boolean;
  affiliateCode?: string;
  intermediaryCode?: string;
  commissionRate?: number;
  defaultMarkupPercentage?: number;
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
  refreshUser: () => Promise<void>;
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
      updateUser: async () => {},
      refreshUser: async () => {}
    };
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const syncCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    checkAuthUser();
    
    // Cleanup session sync on unmount
    return () => {
      if (syncCleanupRef.current) {
        syncCleanupRef.current();
      }
    };
  }, []);

  const checkAuthUser = async () => {
    try {
      setLoading(true);
      
      // Check if Appwrite is configured
      if (!AppwriteService.isConfigured()) {
        console.debug('Appwrite not configured, using fallback auth');
        setUser(null);
        return;
      }

      const currentUser = await AppwriteService.getCurrentUser();
      
      if (currentUser) {
        // Try to get user data from userPreferences collection
        let userData: any = {};
        try {
          const userPrefsResponse = await databases.listDocuments(
            appwriteConfig.databaseId,
            'userPreferences',
            [Query.equal('userId', currentUser.$id)]
          );
          
          if (userPrefsResponse.documents.length > 0) {
            userData = userPrefsResponse.documents[0];
            console.log('✅ Loaded user data from userPreferences:', userData);
          } else {
            // User has no preferences yet - this is normal for new users
            console.debug('No userPreferences found for user (normal for new users)');
          }
        } catch (error) {
          console.log('Error loading userPreferences:', error);
        }

        // Use user preferences as fallback
        const prefs = currentUser.prefs as any || {};
        
        // قائمة الإيميلات للمديرين (Super Admins)
        const ADMIN_EMAILS = [
          'lolelarap@gmail.com',
          'admin@egygo.me'
        ];
        
        // Determine user role - prioritize userData from userPreferences collection
        let userRole: 'admin' | 'merchant' | 'affiliate' | 'customer' | 'intermediary' = userData.role || prefs.role || 'customer';
        
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
        
        const newUser = {
          $id: currentUser.$id,
          name: userData.name || currentUser.name,
          email: userData.email || currentUser.email,
          role: userRole,
          phone: userData.phone || prefs.phone || '',
          address: userData.address || prefs.address || '',
          isAffiliate: userData.isAffiliate || prefs.isAffiliate || userRole === 'affiliate',
          isMerchant: userData.isMerchant || prefs.isMerchant || userRole === 'merchant',
          isIntermediary: userData.isIntermediary || prefs.isIntermediary || userRole === 'intermediary',
          affiliateCode: userData.affiliateCode || prefs.affiliateCode || '',
          intermediaryCode: userData.intermediaryCode || prefs.intermediaryCode || '',
          commissionRate: userData.commissionRate || prefs.commissionRate || 0.15,
          defaultMarkupPercentage: userData.defaultMarkupPercentage || prefs.defaultMarkupPercentage || 20,
          // Use userData from collection if available, otherwise use prefs
          accountStatus: userData.accountStatus || prefs.accountStatus || 'approved',
          approvedAt: userData.approvedAt || prefs.approvedAt,
          approvedBy: userData.approvedBy || prefs.approvedBy,
          rejectionReason: userData.rejectionReason || prefs.rejectionReason
        };
        
        setUser(newUser);
        
        // Start session sync for auto-refresh
        if (syncCleanupRef.current) {
          syncCleanupRef.current(); // Cleanup previous sync
        }
        
        syncCleanupRef.current = startSessionSync({
          userId: currentUser.$id,
          onUpdate: (updatedData) => {
            console.log('🔄 Session auto-updated:', updatedData);
            setUser(prev => prev ? {
              ...prev,
              accountStatus: updatedData.accountStatus,
              approvedAt: updatedData.approvedAt,
              approvedBy: updatedData.approvedBy,
              rejectionReason: updatedData.rejectionReason
            } : null);
          },
          interval: 10000 // Check every 10 seconds
        });
      } else {
        setUser(null);
      }
    } catch (error: any) {
      // Silently handle 401 Unauthorized (user not logged in)
      if (error?.code === 401 || error?.type === 'general_unauthorized_scope') {
        console.debug('User not authenticated');
      } else {
        console.error('Error checking auth user:', error);
      }
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
      
      // Generate affiliate code if needed (max 10 chars)
      if (accountType === 'affiliate') {
        const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
        preferences.affiliateCode = `AF${randomPart}`.substring(0, 10);
        preferences.commissionRate = 0.15; // 15% default commission
      }
      
      // Generate intermediary code if needed (max 10 chars)
      if (accountType === 'intermediary') {
        const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
        preferences.intermediaryCode = `IN${randomPart}`.substring(0, 10);
        preferences.defaultMarkupPercentage = 0.20; // 20% default markup
      }
      
      await AppwriteService.updateUserPreferences(preferences);
      
      // Create user document in users collection for admin dashboard
      try {
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.collections.users,
          currentUser.$id,
          {
            email: email,
            name: name,
            phone: phone || '',
            alternativePhone: alternativePhone || '',
            address: '',
            isAffiliate: accountType === 'affiliate',
            isMerchant: accountType === 'merchant',
            isIntermediary: accountType === 'intermediary',
            affiliateCode: preferences.affiliateCode || null,
            commissionRate: preferences.commissionRate || 0.15,
            totalEarnings: 0,
            pendingEarnings: 0,
            referralCount: 0,
            accountStatus: accountStatus,
            approvedAt: preferences.approvedAt,
            approvedBy: null,
            rejectionReason: null,
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
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error?.code === 409 || error?.message?.includes('already exists')) {
        throw new Error('هذا البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.');
      }
      
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

  const refreshUser = async () => {
    try {
      await checkAuthUser();
    } catch (error) {
      console.error('Refresh user error:', error);
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
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};