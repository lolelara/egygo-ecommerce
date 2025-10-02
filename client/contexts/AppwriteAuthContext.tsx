import React, { createContext, useContext, useEffect, useState } from 'react';
import AppwriteService from '../lib/appwrite';

interface User {
  $id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  isAffiliate?: boolean;
  affiliateCode?: string;
  commissionRate?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
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
        // Get additional user data from the users collection
        try {
          const userDoc = await AppwriteService.getUserDocument(currentUser.$id);
          setUser({
            $id: currentUser.$id,
            name: currentUser.name,
            email: currentUser.email,
            ...userDoc
          });
        } catch (error) {
          // If no user document exists, create one
          await AppwriteService.createUserDocument({
            userId: currentUser.$id,
            name: currentUser.name,
            email: currentUser.email,
            isAffiliate: false,
            commissionRate: 0.15
          });
          
          setUser({
            $id: currentUser.$id,
            name: currentUser.name,
            email: currentUser.email,
            isAffiliate: false,
            commissionRate: 0.15
          });
        }
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

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      if (!AppwriteService.isConfigured()) {
        throw new Error('Appwrite غير مُعد. يرجى التحقق من إعدادات المشروع.');
      }

      await AppwriteService.register(email, password, name);
      await checkAuthUser();
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
      await AppwriteService.updateUserDocument(user.$id, userData);
      
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