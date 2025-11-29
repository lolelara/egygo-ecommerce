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
      register: 'إنشاء حساب',
      adminPanel: 'لوحة تحكم الإدارة',
      affiliatePanel: 'لوحة تحكم المسوق',
      merchantPanel: 'لوحة تحكم التاجر',
      intermediaryPanel: 'لوحة تحكم الوسيط',
      categories: 'الفئات',
      viewAllCategories: 'عرض جميع الفئات',
      partnerProgram: 'برنامج الشراكة',
      specialOffers: 'العروض الخاصة',
      offers: 'العروض',
      bePartner: 'كن شريكاً',
      dashboard: 'لوحة التحكم',
      productsManagement: 'إدارة المنتجات',
      ordersManagement: 'إدارة الطلبات',
      myProducts: 'منتجاتي',
      analytics: 'التحليلات',
      withdraw: 'سحب الأرباح',
      myLinks: 'روابطي',
      myOrders: 'طلباتي',
      wishlist: 'المفضلة',
      myAccount: 'حسابي',
      partnerDashboard: 'لوحة تحكم الشراكة'
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
    },

    // WhatsApp
    whatsapp: {
      chat: 'تواصل عبر واتساب',
      title: 'دعم العملاء',
      subtitle: 'نحن هنا للمساعدة',
      quickMessages: 'رسائل سريعة',
      customMessage: 'رسالة مخصصة',
      messagePlaceholder: 'اكتب رسالتك هنا...',
      send: 'إرسال',
      poweredBy: 'مدعوم بواسطة',
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
    },

    // Site
    site: {
      name: 'إيجي جو',
      slogan: 'التسوق الذكي يبدأ هنا',
      joinFamily: 'انضم إلى عائلة إيجي جو',
      smartShopping: 'أهلاً بك في عالم التسوق الذكي'
    },

    // Trust Signals
    trust: {
      fastDelivery: 'توصيل سريع',
      freeReturn: 'إرجاع مجاني',
      securePayment: 'دفع آمن',
      original: 'منتج أصلي',
      secureEncrypted: 'دفع آمن ومشفر 100%',
      freeReturn14Days: 'إرجاع مجاني خلال 14 يوم',
      fastSecureDelivery: 'توصيل سريع وآمن',
      deliveryTime: 'خلال 2-5 أيام عمل',
      originalQuality: 'ضمان الجودة والأصالة',
      contact24h: 'التواصل خلال 24 ساعة'
    },

    // Register Page
    register: {
      title: 'إنشاء حساب جديد',
      subtitle: 'املأ البيانات للبدء',
      fullName: 'الاسم الكامل',
      enterName: 'أدخل اسمك الكامل',
      enterEmail: 'أدخل بريدك الإلكتروني',
      enterPhone: 'مثال: 01012345678',
      phoneNote: 'سيتم استخدام هذا الرقم للتواصل معك',
      alternativePhone: 'رقم هاتف بديل (اختياري)',
      alternativePhoneNote: 'يمكنك إضافة رقم آخر للتواصل معك',
      whatsappAvailable: 'هذا الرقم متاح على WhatsApp أو للاتصال',
      whatsappNote: 'تأكد من إمكانية التواصل معك عبر هذا الرقم',
      confirmPassword: 'تأكيد كلمة المرور',
      showPassword: 'إظهار كلمة المرور',
      hidePassword: 'إخفاء كلمة المرور',
      accountType: 'نوع الحساب',
      accountTypeNote: 'اختر نوع حسابك',
      customer: 'عميل',
      customerDesc: 'للتسوق والشراء',
      affiliate: 'مسوق',
      affiliateDesc: 'اربح عمولات على المبيعات',
      merchant: 'تاجر',
      merchantDesc: 'بيع منتجاتك',
      referralCode: 'كود الإحالة (اختياري)',
      enterReferralCode: 'أدخل كود الإحالة إن وجد',
      referredBy: 'تمت الإحالة من',
      invalidReferralCode: 'كود الإحالة غير صحيح',
      acceptTerms: 'أوافق على',
      termsAndConditions: 'الشروط والأحكام',
      and: 'و',
      privacyPolicy: 'سياسة الخصوصية',
      createAccount: 'إنشاء الحساب',
      creating: 'جاري إنشاء الحساب...',
      orRegisterWith: 'أو يمكنك التسجيل عبر',
      registerGoogle: 'التسجيل بحساب Google',
      registerFacebook: 'التسجيل بحساب Facebook',
      dataProtected: 'جميع بياناتك محمية وفق',
      oneAccount: 'حساب واحد لجميع الخدمات',
      exclusiveCommissions: 'عمولات مميزة للتجار والمسوقين',
      secureData: 'بيانات آمنة ومشفرة',
      testimonial: 'تجربة رائعة! التسجيل سهل والمنصة احترافية جداً',
      testimonialAuthor: 'أحمد محمد، تاجر شريك',
      safe: 'آمن',
      trusted: 'موثوق',
      fast: 'سريع'
    },

    // Login Page  
    login: {
      title: 'تسجيل الدخول',
      subtitle: 'مرحباً بعودتك',
      welcomeBack: 'أهلاً بعودتك إلى إيجي جو',
      enterCredentials: 'أدخل بياناتك للمتابعة',
      loginButton: 'تسجيل الدخول',
      loggingIn: 'جاري تسجيل الدخول...',
      orLoginWith: 'أو سجّل الدخول عبر',
      loginGoogle: 'تسجيل الدخول بحساب Google',
      loginFacebook: 'تسجيل الدخول بحساب Facebook',
      thousandsProducts: 'آلاف المنتجات المميزة',
      easyReturn: 'استرجاع سهل خلال 14 يوم',
      testimonial: 'أفضل موقع تسوق استخدمته! المنتجات عالية الجودة',
      testimonialAuthor: 'أحمد محمد، القاهرة'
    },

    // Products Page
    productsPage: {
      allProducts: 'جميع المنتجات',
      discoverProducts: 'اكتشف مجموعتنا الكاملة من المنتجات عالية الجودة',
      productsAvailable: 'منتج متاح',
      searchProducts: 'البحث عن المنتجات...',
      sortBy: 'ترتيب حسب',
      featured: 'مميز',
      priceLowToHigh: 'السعر: من الأقل إلى الأعلى',
      priceHighToLow: 'السعر: من الأعلى إلى الأقل',
      highestRated: 'الأعلى تقييمًا',
      newest: 'الأحدث',
      filters: 'المرشحات',
      categories: 'الفئات',
      priceRange: 'نطاق السعر',
      min: 'الحد الأدنى',
      max: 'الحد الأقصى',
      specialOffers: 'العروض الخاصة',
      saleOnly: 'المنتجات المخفضة فقط',
      clearFilters: 'مسح جميع المرشحات',
      showing: 'عرض',
      of: 'من',
      product: 'منتج',
      noProducts: 'لا توجد منتجات',
      tryFilters: 'جرّب تعديل معايير البحث أو التصفية',
      viewCategories: 'عرض الفئات',
      page: 'صفحة'
    },

    // Checkout Page
    checkout: {
      title: 'إتمام الطلب',
      steps: {
        cart: 'السلة',
        information: 'البيانات',
        confirmation: 'التأكيد'
      },
      shippingAddress: 'عنوان الشحن',
      fullName: 'الاسم الكامل',
      phoneNumber: 'رقم الهاتف',
      city: 'المدينة',
      selectCity: 'اختر المدينة',
      address: 'العنوان',
      addressPlaceholder: 'الشارع، رقم المبنى، الشقة',
      postalCode: 'الرمز البريدي',
      landmark: 'علامة مميزة',
      landmarkPlaceholder: 'بجوار المسجد / المدرسة',
      paymentMethod: 'طريقة الدفع',
      cashOnDelivery: 'الدفع عند الاستلام',
      cashOnDeliveryDesc: 'ادفع نقداً عند استلام الطلب',
      vodafoneCash: 'فودافون كاش',
      vodafoneCashDesc: 'تحويل فوري عبر فودافون كاش',
      creditCard: 'بطاقة ائتمان',
      creditCardDesc: 'Visa, Mastercard, Amex',
      cardNumber: 'رقم البطاقة',
      expiryDate: 'تاريخ الانتهاء',
      additionalNotes: 'ملاحظات إضافية',
      notesPlaceholder: 'أي ملاحظات خاصة بالطلب...',
      orderSummary: 'ملخص الطلب',
      quantity: 'الكمية',
      subtotal: 'المجموع الفرعي',
      shipping: 'الشحن',
      free: 'مجاني',
      total: 'الإجمالي',
      confirmOrder: 'تأكيد الطلب',
      processing: 'جاري المعالجة...'
    },

    // Marketing Messages
    marketing: {
      partnerProgram: 'انضم لفريق الشركاء!',
      partnerDesc: 'سجّل الآن كتاجر أو مسوق واحصل على عمولات مميزة وأرباح مستمرة',
      registerEarn: 'سجّل كتاجر أو مسوق واربح عمولات مميزة!'
    },

    // Homepage
    home: {
      hero: {
        typing: {
          opportunity: "متفوتش الفرصة",
          income: "اعمل دخل بسهولة",
          save: "حافظ على فلوسك",
          earn: "اكسب أكتر"
        },
        stats: {
          products: "منتج متاح",
          customers: "عميل سعيد",
          support: "دعم فوري"
        },
        badge: "عروض حصرية تصل إلى 50%",
        title: "إيجي جو",
        subtitle: "تجربة تسوق",
        highlight: "استثنائية",
        description: "اكتشف آلاف المنتجات المميزة بأفضل الأسعار مع شحن سريع ومجاني على جميع الطلبات. الجودة التي تستحقها، بالسعر الذي تحبه.",
        shopNow: "تسوق الآن",
        exploreDeals: "استكشف العروض"
      },
      howItWorks: {
        badge: "⚙️ كيف تعمل المنصة",
        title: "ابدأ رحلتك في 3 خطوات بسيطة",
        subtitle: "سواء كنت تاجر، مسوق، أو عميل - نحن نسهل عليك البداية",
        customers: {
          title: "للعملاء",
          video: "🎬 كيف تتسوق على إيجي جو",
          step1: { title: "تصفح المنتجات", desc: "اكتشف آلاف المنتجات عالية الجودة" },
          step2: { title: "أضف للسلة", desc: "اختر ما يعجبك وأضفه لسلة المشتريات" },
          step3: { title: "اطلب واستلم", desc: "ادفع واستلم طلبك في 2-4 أيام" }
        },
        merchants: {
          title: "للتجار",
          badge: "⭐ الأكثر طلباً",
          video: "🎬 كيف تبدأ البيع كتاجر",
          step1: { title: "سجل حساب", desc: "انشئ حساب تاجر مجاناً" },
          step2: { title: "أضف منتجاتك", desc: "ارفع منتجاتك وحدد الأسعار والعمولات" },
          step3: { title: "ابدأ البيع", desc: "راقب مبيعاتك واستلم أرباحك أسبوعياً" }
        },
        affiliates: {
          title: "للمسوقين",
          video: "🎬 كيف تربح كمسوق",
          step1: { title: "انضم مجاناً", desc: "سجل كمسوق بدون أي رسوم" },
          step2: { title: "احصل على روابطك", desc: "اختر المنتجات وخذ روابط التسويق" },
          step3: { title: "سوّق واربح", desc: "اربح عمولة لحد 25% على كل بيعة" }
        }
      },
      affiliateProgram: {
        features: {
          commissions: { title: "عمولات عالية", desc: "احصل على نسبة من كل عملية بيع تتم عبر رابطك الخاص" },
          tracking: { title: "تتبع دقيق", desc: "راقب أرباحك ومبيعاتك بشكل مباشر من لوحة التحكم" },
          support: { title: "دعم مستمر", desc: "فريق دعم متواجد لمساعدتك على النجاح وزيادة أرباحك" }
        },
        cta: "اربح معنا الآن",
        stats: {
          commissionRate: "نسبة العمولة",
          activeMarketer: "مسوق نشط",
          avgIncome: "متوسط الدخل الشهري"
        }
      },
      stats: {
        badge: "📊 إحصائيات مبهرة",
        title: "منصة موثوقة يستخدمها الآلاف",
        subtitle: "انضم لمجتمع متنامي من التجار والمسوقين والعملاء الراضين",
        activeCustomer: "عميل نشط",
        successfulMerchant: "تاجر ناجح",
        activeMarketer: "مسوق نشط",
        salesVolume: "جنيه مبيعات"
      },
      partnerProgram: {
        badge: "💰 برنامج الشراكة",
        title: "ابدأ تكسب دلوقتي مع برنامج الشراكة",
        desc: "انضم لآلاف المسوقين الناجحين واكسب عمولة لحد 25% على كل عملية بيع تيجي منك. الانضمام مجاني وعندنا كل الأدوات اللي تحتاجها عشان تنجح.",
        stats: {
          commission: "عمولة",
          activeMarketer: "مسوق نشط",
          paidCommissions: "اتدفع عمولات"
        },
        cta: "انضم لبرنامج الشراكة",
        whyChoose: {
          title: "لماذا تختار برنامجنا؟",
          highRates: { title: "معدلات عمولة عالية", desc: "اكسب 8-25% عمولة على جميع المبيعات" },
          realTimeTracking: { title: "تتبع فوري", desc: "راقب أداءك وأرباحك مباشرة" },
          marketingSupport: { title: "دعم تسويقي", desc: "احصل على بانرات وروابط ومواد ترويجية" },
          fastPayments: { title: "دفعات سريعة", desc: "دفعات أسبوعية عبر PayPal أو التحويل البنكي" }
        }
      },
      bestSellers: {
        title: "الأكثر مبيعًا",
        subtitle: "منتجاتنا الأكثر شعبية المحبوبة من العملاء في جميع أنحاء مصر",
        badge: "الأكثر مبيعًا",
        commission: "عمولة"
      }
    },

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
      register: 'Register',
      adminPanel: 'Admin Panel',
      affiliatePanel: 'Affiliate Panel',
      merchantPanel: 'Merchant Panel',
      intermediaryPanel: 'Intermediary Panel',
      categories: 'Categories',
      viewAllCategories: 'View All Categories',
      partnerProgram: 'Partner Program',
      specialOffers: 'Special Offers',
      offers: 'Offers',
      bePartner: 'Be a Partner',
      dashboard: 'Dashboard',
      productsManagement: 'Products Management',
      ordersManagement: 'Orders Management',
      myProducts: 'My Products',
      analytics: 'Analytics',
      withdraw: 'Withdraw',
      myLinks: 'My Links',
      myOrders: 'My Orders',
      wishlist: 'Wishlist',
      myAccount: 'My Account',
      partnerDashboard: 'Partner Dashboard'
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

    // WhatsApp
    whatsapp: {
      chat: 'Chat on WhatsApp',
      title: 'Customer Support',
      subtitle: 'We are here to help',
      quickMessages: 'Quick Messages',
      customMessage: 'Custom Message',
      messagePlaceholder: 'Type your message here...',
      send: 'Send',
      poweredBy: 'Powered by',
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
    },

    // Site
    site: {
      name: 'EgyGo',
      slogan: 'Smart Shopping Starts Here',
      joinFamily: 'Join the EgyGo Family',
      smartShopping: 'Welcome to the World of Smart Shopping'
    },

    // Trust Signals
    trust: {
      fastDelivery: 'Fast Delivery',
      freeReturn: 'Free Return',
      securePayment: 'Secure Payment',
      original: 'Original Product',
      secureEncrypted: '100% Secure & Encrypted Payment',
      freeReturn14Days: 'Free Return within 14 Days',
      fastSecureDelivery: 'Fast & Secure Delivery',
      deliveryTime: 'Within 2-5 Business Days',
      originalQuality: 'Quality & Authenticity Guaranteed',
      contact24h: 'Contact within 24 Hours'
    },

    // Register Page
    register: {
      title: 'Create New Account',
      subtitle: 'Fill in the details to get started',
      fullName: 'Full Name',
      enterName: 'Enter your full name',
      enterEmail: 'Enter your email',
      enterPhone: 'Example: 01012345678',
      phoneNote: 'This number will be used to contact you',
      alternativePhone: 'Alternative Phone (optional)',
      alternativePhoneNote: 'You can add another number to contact you',
      whatsappAvailable: 'This number is available on WhatsApp or for calls',
      whatsappNote: 'Make sure we can reach you via this number',
      confirmPassword: 'Confirm Password',
      showPassword: 'Show Password',
      hidePassword: 'Hide Password',
      accountType: 'Account Type',
      accountTypeNote: 'Choose your account type',
      customer: 'Customer',
      customerDesc: 'For shopping and purchases',
      affiliate: 'Affiliate',
      affiliateDesc: 'Earn commissions on sales',
      merchant: 'Merchant',
      merchantDesc: 'Sell your products',
      referralCode: 'Referral Code (optional)',
      enterReferralCode: 'Enter referral code if available',
      referredBy: 'Referred by',
      invalidReferralCode: 'Invalid referral code',
      acceptTerms: 'I agree to the',
      termsAndConditions: 'Terms and Conditions',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      createAccount: 'Create Account',
      creating: 'Creating account...',
      orRegisterWith: 'Or register with',
      registerGoogle: 'Register with Google',
      registerFacebook: 'Register with Facebook',
      dataProtected: 'Your data is protected according to our',
      oneAccount: 'One account for all services',
      exclusiveCommissions: 'Exclusive commissions for merchants and affiliates',
      secureData: 'Secure & Encrypted Data',
      testimonial: 'Great experience! Registration is easy and the platform is very professional',
      testimonialAuthor: 'Ahmed Mohamed, Partner Merchant',
      safe: 'Safe',
      trusted: 'Trusted',
      fast: 'Fast'
    },

    // Login Page
    login: {
      title: 'Login',
      subtitle: 'Welcome Back',
      welcomeBack: 'Welcome Back to EgyGo',
      enterCredentials: 'Enter your credentials to continue',
      loginButton: 'Login',
      loggingIn: 'Logging in...',
      orLoginWith: 'Or login with',
      loginGoogle: 'Login with Google',
      loginFacebook: 'Login with Facebook',
      thousandsProducts: 'Thousands of Premium Products',
      easyReturn: 'Easy Return within 14 Days',
      testimonial: 'Best shopping site I\'ve used! High quality products',
      testimonialAuthor: 'Ahmed Mohamed, Cairo'
    },

    // Products Page
    productsPage: {
      allProducts: 'All Products',
      discoverProducts: 'Discover our complete range of high-quality products',
      productsAvailable: 'products available',
      searchProducts: 'Search for products...',
      sortBy: 'Sort by',
      featured: 'Featured',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
      highestRated: 'Highest Rated',
      newest: 'Newest',
      filters: 'Filters',
      categories: 'Categories',
      priceRange: 'Price Range',
      min: 'Minimum',
      max: 'Maximum',
      specialOffers: 'Special Offers',
      saleOnly: 'On Sale Only',
      clearFilters: 'Clear All Filters',
      showing: 'Showing',
      of: 'of',
      product: 'product',
      noProducts: 'No Products Found',
      tryFilters: 'Try adjusting your search or filter criteria',
      viewCategories: 'View Categories',
      page: 'Page'
    },

    // Checkout Page
    checkout: {
      title: 'Checkout',
      steps: {
        cart: 'Cart',
        information: 'Information',
        confirmation: 'Confirmation'
      },
      shippingAddress: 'Shipping Address',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      city: 'City',
      selectCity: 'Select City',
      address: 'Address',
      addressPlaceholder: 'Street, Building Number, Apartment',
      postalCode: 'Postal Code',
      landmark: 'Landmark',
      landmarkPlaceholder: 'Near Mosque / School',
      paymentMethod: 'Payment Method',
      cashOnDelivery: 'Cash on Delivery',
      cashOnDeliveryDesc: 'Pay cash upon receiving the order',
      vodafoneCash: 'Vodafone Cash',
      vodafoneCashDesc: 'Instant transfer via Vodafone Cash',
      creditCard: 'Credit Card',
      creditCardDesc: 'Visa, Mastercard, Amex',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      additionalNotes: 'Additional Notes',
      notesPlaceholder: 'Any special notes about the order...',
      orderSummary: 'Order Summary',
      quantity: 'Quantity',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'Free',
      total: 'Total',
      confirmOrder: 'Confirm Order',
      processing: 'Processing...'
    },

    // Marketing Messages
    marketing: {
      partnerProgram: 'Join Our Partners Team!',
      partnerDesc: 'Register now as a merchant or affiliate and get exclusive commissions and continuous earnings',
      registerEarn: 'Register as merchant or affiliate and earn exclusive commissions!'
    },

    // Homepage
    home: {
      hero: {
        typing: {
          opportunity: "Don't Miss the Opportunity",
          income: "Make Income Easily",
          save: "Save Your Money",
          earn: "Earn More"
        }
      },
      howItWorks: {
        badge: "⚙️ How Platform Works",
        title: "Start Your Journey in 3 Simple Steps",
        subtitle: "Whether you are a merchant, marketer, or customer - we make it easy for you to start",
        customers: {
          title: "For Customers",
          video: "🎬 How to Shop on EgyGo",
          step1: { title: "Browse Products", desc: "Discover thousands of high-quality products" },
          step2: { title: "Add to Cart", desc: "Choose what you like and add to cart" },
          step3: { title: "Order & Receive", desc: "Pay and receive your order in 2-4 days" }
        },
        merchants: {
          title: "For Merchants",
          badge: "⭐ Most Requested",
          video: "🎬 How to Start Selling",
          step1: { title: "Register Account", desc: "Create a merchant account for free" },
          step2: { title: "Add Products", desc: "Upload products, set prices and commissions" },
          step3: { title: "Start Selling", desc: "Monitor sales and receive weekly earnings" }
        },
        affiliates: {
          title: "For Marketers",
          video: "🎬 How to Earn as Marketer",
          step1: { title: "Join Free", desc: "Register as a marketer with no fees" },
          step2: { title: "Get Links", desc: "Choose products and get marketing links" },
          step3: { title: "Market & Earn", desc: "Earn up to 25% commission on every sale" }
        }
      },
      categories: {
        title: "Shop by Category",
        subtitle: "Discover our wide range of products across different categories"
      },
      featured: {
        title: "Featured Products",
        subtitle: "Hand-picked products especially for you",
        merchants: "Featured Merchants",
        viewAll: "View All"
      },
      products: {
        newArrivals: "New Arrivals",
        bestSellers: "Best Sellers",
        viewAll: "View All Products"
      },
    }
  },
  affiliateProgram: {
    badge: "💰 Affiliate Program",
    title: "Start Earning from Home",
    subtitle: "Join thousands of successful marketers and get rewarding commissions on every sale",
    features: {
      commissions: { title: "High Commissions", desc: "Get a percentage of every sale made through your link" },
      tracking: { title: "Accurate Tracking", desc: "Monitor your earnings and sales directly from the dashboard" },
      support: { title: "Continuous Support", desc: "Support team available to help you succeed and increase earnings" }
    },
    cta: "Earn With Us Now",
    stats: {
      commissionRate: "Commission Rate",
      activeMarketer: "Active Marketer",
      avgIncome: "Avg Monthly Income"
    }
  },
  stats: {
    badge: "📊 Impressive Stats",
    title: "Trusted Platform Used by Thousands",
    subtitle: "Join a growing community of satisfied merchants, marketers, and customers",
    activeCustomer: "Active Customer",
    successfulMerchant: "Successful Merchant",
    activeMarketer: "Active Marketer",
    salesVolume: "Sales Volume (EGP)"
  },
  partnerProgram: {
    badge: "💰 Partner Program",
    title: "Start Earning Now with Partner Program",
    desc: "Join thousands of successful marketers and earn up to 25% commission on every sale from you. Joining is free and we have all the tools you need to succeed.",
    stats: {
      commission: "Commission",
      activeMarketer: "Active Marketer",
      paidCommissions: "Paid Commissions"
    },
    cta: "Join Partner Program",
    whyChoose: {
      title: "Why Choose Our Program?",
      highRates: { title: "High Commission Rates", desc: "Earn 8-25% commission on all sales" },
      realTimeTracking: { title: "Real-time Tracking", desc: "Monitor your performance and earnings instantly" },
      marketingSupport: { title: "Marketing Support", desc: "Get banners, links, and promotional materials" },
      fastPayments: { title: "Fast Payments", desc: "Weekly payments via PayPal or Bank Transfer" }
    }
  },
  bestSellers: {
    title: "Best Sellers",
    subtitle: "Our most popular products loved by customers all over Egypt",
    badge: "Best Seller",
    commission: "Commission"
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
