/**
 * Logout Page
 * تسجيل الخروج وتنظيف Session
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { Loader2, LogOut } from 'lucide-react';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Wait a moment for user to see the message
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Logout
        await logout();
        
        // Clear any cached data
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect to login
        navigate('/login', { 
          replace: true,
          state: { message: 'تم تسجيل الخروج بنجاح. يرجى تسجيل الدخول مرة أخرى.' }
        });
      } catch (error) {
        console.error('Logout error:', error);
        // Still redirect even if error
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-primary/20 rounded-full animate-ping" />
          </div>
          <div className="relative flex items-center justify-center">
            <LogOut className="w-16 h-16 text-primary animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          جاري تسجيل الخروج...
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          يرجى الانتظار لحظة
        </p>

        {/* Loading Spinner */}
        <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin" />
      </div>
    </div>
  );
}
