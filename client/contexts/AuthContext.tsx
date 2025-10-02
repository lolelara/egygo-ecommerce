import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User, AffiliateUser } from "@shared/api";

interface AuthState {
  user: User | null;
  affiliate: AffiliateUser | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    name: string,
    password: string,
    wantAffiliate?: boolean,
  ) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Use Netlify functions for auth in development/production
const API_BASE = "/.netlify/functions";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    affiliate: null,
    token: null,
    isLoading: true,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("auth_user");
        const storedAffiliate = localStorage.getItem("auth_affiliate");

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser);
          const affiliate = storedAffiliate
            ? JSON.parse(storedAffiliate)
            : null;

          setState({
            user,
            affiliate,
            token: storedToken,
            isLoading: false,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error loading stored auth:", error);
        logout();
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/auth-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Read response text first, then parse JSON
      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("خطأ في استجابة الخادم");
      }

      if (!response.ok) {
        throw new Error(data.error || "فشل في تسجيل الدخول");
      }

      // Store in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      if (data.affiliate) {
        localStorage.setItem("auth_affiliate", JSON.stringify(data.affiliate));
      }

      setState({
        user: data.user,
        affiliate: data.affiliate,
        token: data.token,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (
    email: string,
    name: string,
    password: string,
    wantAffiliate = false,
  ): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/auth-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, password, wantAffiliate }),
      });

      // Read response text first, then parse JSON
      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("خطأ في استجابة الخادم");
      }

      if (!response.ok) {
        throw new Error(data.error || "فشل في إنشاء الحساب");
      }

      // Store in localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      if (data.affiliate) {
        localStorage.setItem("auth_affiliate", JSON.stringify(data.affiliate));
      }

      setState({
        user: data.user,
        affiliate: data.affiliate,
        token: data.token,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_affiliate");

    setState({
      user: null,
      affiliate: null,
      token: null,
      isLoading: false,
    });
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      // For demo purposes, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In real app, would call forgot password endpoint
    } catch (error) {
      throw error;
    }
  };

  const isAdmin = (): boolean => {
    return state.user?.role === "ADMIN" || state.user?.role === "SUPER_ADMIN";
  };

  const isAuthenticated = (): boolean => {
    return !!state.user && !!state.token;
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
