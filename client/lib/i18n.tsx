// ============================================
// Internationalization (i18n) Setup
// ============================================

/**
 * نظام الترجمة للمشروع
 * يدعم: العربية (الافتراضية) + الإنجليزية
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// ===== TYPES =====

export type Locale = 'ar' | 'en';

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  ar: Translation;
  en: Translation;
}

// ===== TRANSLATIONS =====

export const translations: Translations = {
  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      products: 'المنتجات',
      cart: 'السلة',
      orders: 'طلباتي',
      profile: 'الحساب',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب'
    },
    
    // Common
    common: {
      loading: 'جاري التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      add: 'إضافة',
      search: 'بحث...',
      filter: 'تصفية',
      sort: 'ترتيب',
      reset: 'إعادة تعيين',
      apply: 'تطبيق',
      close: 'إغلاق',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      submit: 'إرسال',
      confirm: 'تأكيد',
      success: 'نجحت العملية',
      error: 'حدث خطأ',
      warning: 'تحذير',
      info: 'معلومة'
    },
    
    // Products
    products: {
      title: 'المنتجات',
      addToCart: 'أضف للسلة',
      price: 'السعر',
      inStock: 'متوفر',
      outOfStock: 'غير متوفر',
      viewDetails: 'عرض التفاصيل',
      category: 'التصنيف',
      brand: 'العلامة التجارية',
      rating: 'التقييم',
      reviews: 'تقييم',
      description: 'الوصف',
      specifications: 'المواصفات'
    },
    
    // Cart
    cart: {
      title: 'سلة التسوق',
      empty: 'السلة فارغة',
      subtotal: 'المجموع الفرعي',
      shipping: 'الشحن',
      total: 'الإجمالي',
      checkout: 'إتمام الطلب',
      remove: 'إزالة',
      quantity: 'الكمية',
      continueShopping: 'متابعة التسوق'
    },
    
    // Orders
    orders: {
      title: 'طلباتي',
      orderNumber: 'رقم الطلب',
      date: 'التاريخ',
      status: 'الحالة',
      total: 'المبلغ',
      viewOrder: 'عرض الطلب',
      trackShipment: 'تتبع الشحنة',
      cancelOrder: 'إلغاء الطلب',
      reorder: 'إعادة الطلب',
      statuses: {
        pending: 'قيد الانتظار',
        processing: 'قيد المعالجة',
        shipped: 'تم الشحن',
        delivered: 'تم التوصيل',
        cancelled: 'ملغي'
      }
    },
    
    // Profile
    profile: {
      title: 'الحساب الشخصي',
      personalInfo: 'المعلومات الشخصية',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      address: 'العنوان',
      changePassword: 'تغيير كلمة المرور',
      currentPassword: 'كلمة المرور الحالية',
      newPassword: 'كلمة المرور الجديدة',
      confirmPassword: 'تأكيد كلمة المرور',
      updateProfile: 'تحديث الحساب'
    },
    
    // Auth
    auth: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب جديد',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور؟',
      noAccount: 'ليس لديك حساب؟',
      hasAccount: 'لديك حساب بالفعل؟',
      createAccount: 'إنشاء حساب',
      loginNow: 'تسجيل الدخول الآن'
    },
    
    // Notifications
    notifications: {
      title: 'الإشعارات',
      markAllRead: 'تعيين الكل كمقروء',
      noNotifications: 'لا توجد إشعارات',
      new: 'جديد'
    },
    
    // Search
    search: {
      placeholder: 'ابحث عن منتجات...',
      results: 'نتائج البحث',
      noResults: 'لا توجد نتائج',
      showingResults: 'عرض {count} نتيجة'
    },
    
    // Errors
    errors: {
      general: 'حدث خطأ غير متوقع',
      network: 'خطأ في الاتصال بالشبكة',
      notFound: 'الصفحة غير موجودة',
      unauthorized: 'غير مصرح لك بالوصول',
      validation: 'يرجى التحقق من المدخلات',
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'البريد الإلكتروني غير صحيح',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      minLength: 'يجب أن يكون الطول أكبر من {min} أحرف',
      maxLength: 'يجب أن يكون الطول أقل من {max} حرف'
    }
  },
  
  en: {
    // Navigation
    nav: {
      home: 'Home',
      products: 'Products',
      cart: 'Cart',
      orders: 'My Orders',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register'
    },
    
    // Common
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      search: 'Search...',
      filter: 'Filter',
      sort: 'Sort',
      reset: 'Reset',
      apply: 'Apply',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      confirm: 'Confirm',
      success: 'Operation successful',
      error: 'An error occurred',
      warning: 'Warning',
      info: 'Information'
    },
    
    // Products
    products: {
      title: 'Products',
      addToCart: 'Add to Cart',
      price: 'Price',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      viewDetails: 'View Details',
      category: 'Category',
      brand: 'Brand',
      rating: 'Rating',
      reviews: 'reviews',
      description: 'Description',
      specifications: 'Specifications'
    },
    
    // Cart
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      checkout: 'Checkout',
      remove: 'Remove',
      quantity: 'Quantity',
      continueShopping: 'Continue Shopping'
    },
    
    // Orders
    orders: {
      title: 'My Orders',
      orderNumber: 'Order Number',
      date: 'Date',
      status: 'Status',
      total: 'Total',
      viewOrder: 'View Order',
      trackShipment: 'Track Shipment',
      cancelOrder: 'Cancel Order',
      reorder: 'Reorder',
      statuses: {
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
      }
    },
    
    // Profile
    profile: {
      title: 'My Profile',
      personalInfo: 'Personal Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      updateProfile: 'Update Profile'
    },
    
    // Auth
    auth: {
      login: 'Login',
      register: 'Create New Account',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      createAccount: 'Create Account',
      loginNow: 'Login Now'
    },
    
    // Notifications
    notifications: {
      title: 'Notifications',
      markAllRead: 'Mark all as read',
      noNotifications: 'No notifications',
      new: 'New'
    },
    
    // Search
    search: {
      placeholder: 'Search for products...',
      results: 'Search Results',
      noResults: 'No results found',
      showingResults: 'Showing {count} results'
    },
    
    // Errors
    errors: {
      general: 'An unexpected error occurred',
      network: 'Network connection error',
      notFound: 'Page not found',
      unauthorized: 'Unauthorized access',
      validation: 'Please check your inputs',
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      passwordMismatch: 'Passwords do not match',
      minLength: 'Must be at least {min} characters',
      maxLength: 'Must be at most {max} characters'
    }
  }
};

// ===== CONTEXT =====

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// ===== PROVIDER =====

interface I18nProviderProps {
  children: React.ReactNode;
  defaultLocale?: Locale;
}

export function I18nProvider({ children, defaultLocale = 'ar' }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Get from localStorage or use default
    const saved = localStorage.getItem('locale');
    return (saved as Locale) || defaultLocale;
  });
  
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Update HTML dir and lang attributes
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };
  
  // Set initial dir
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);
  
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    let result = String(value);
    
    // Replace params like {count}, {min}, {max}
    if (params) {
      Object.entries(params).forEach(([param, val]) => {
        result = result.replace(`{${param}}`, String(val));
      });
    }
    
    return result;
  };
  
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  
  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

// ===== HOOK =====

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

// ===== LOCALE SWITCHER COMPONENT =====

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();
  
  return (
    <button
      onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
      className="px-3 py-2 rounded hover:bg-accent"
      aria-label={locale === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
    >
      {locale === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}

// ===== HOW TO USE =====

/**
 * 1. Wrap your app with I18nProvider:
 * 
 * import { I18nProvider } from '@/lib/i18n';
 * 
 * <I18nProvider defaultLocale="ar">
 *   <App />
 * </I18nProvider>
 * 
 * 
 * 2. Use translations in components:
 * 
 * import { useI18n } from '@/lib/i18n';
 * 
 * function MyComponent() {
 *   const { t, locale, dir } = useI18n();
 *   
 *   return (
 *     <div>
 *       <h1>{t('products.title')}</h1>
 *       <p>{t('search.showingResults', { count: 42 })}</p>
 *       <p>Current locale: {locale}</p>
 *       <p>Direction: {dir}</p>
 *     </div>
 *   );
 * }
 * 
 * 
 * 3. Add LocaleSwitcher:
 * 
 * import { LocaleSwitcher } from '@/lib/i18n';
 * 
 * <header>
 *   <LocaleSwitcher />
 * </header>
 */
