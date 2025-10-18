/**
 * Advanced Analytics Integration
 * 
 * Google Analytics 4 + Facebook Pixel + Custom Events
 */

// Analytics Configuration
const ANALYTICS_CONFIG = {
  ga4MeasurementId: import.meta.env.VITE_GA4_MEASUREMENT_ID || '',
  fbPixelId: import.meta.env.VITE_FB_PIXEL_ID || '',
  enabled: !import.meta.env.DEV, // Disabled in development
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Initialize Google Analytics 4
 */
export function initializeGA4(): void {
  if (!ANALYTICS_CONFIG.ga4MeasurementId || !ANALYTICS_CONFIG.enabled) {
    console.log('📊 GA4 disabled (dev mode or no measurement ID)');
    return;
  }

  try {
    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.ga4MeasurementId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer!.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', ANALYTICS_CONFIG.ga4MeasurementId, {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure',
    });

    console.log('✅ GA4 initialized');
  } catch (error) {
    console.error('❌ GA4 initialization failed:', error);
  }
}

/**
 * Initialize Facebook Pixel
 */
export function initializeFacebookPixel(): void {
  if (!ANALYTICS_CONFIG.fbPixelId || !ANALYTICS_CONFIG.enabled) {
    console.log('📊 Facebook Pixel disabled (dev mode or no pixel ID)');
    return;
  }

  try {
    // Facebook Pixel Code
    (function(f: any, b, e, v, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js'
    );

    window.fbq!('init', ANALYTICS_CONFIG.fbPixelId);
    window.fbq!('track', 'PageView');

    console.log('✅ Facebook Pixel initialized');
  } catch (error) {
    console.error('❌ Facebook Pixel initialization failed:', error);
  }
}

/**
 * Track Page View
 */
export function trackPageView(page: string, title?: string): void {
  // Google Analytics 4
  if (window.gtag && ANALYTICS_CONFIG.enabled) {
    window.gtag('event', 'page_view', {
      page_path: page,
      page_title: title || document.title,
    });
  }

  // Facebook Pixel
  if (window.fbq && ANALYTICS_CONFIG.enabled) {
    window.fbq('track', 'PageView');
  }

  console.log('📊 Page view tracked:', page);
}

/**
 * Track Event
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, any>
): void {
  // Google Analytics 4
  if (window.gtag && ANALYTICS_CONFIG.enabled) {
    window.gtag('event', eventName, parameters);
  }

  // Facebook Pixel - convert GA4 events to FB standard events
  if (window.fbq && ANALYTICS_CONFIG.enabled) {
    const fbEventName = convertToFBEvent(eventName);
    if (fbEventName) {
      window.fbq('track', fbEventName, parameters);
    } else {
      window.fbq('trackCustom', eventName, parameters);
    }
  }

  console.log('📊 Event tracked:', eventName, parameters);
}

/**
 * Convert GA4 event names to Facebook Pixel standard events
 */
function convertToFBEvent(gaEvent: string): string | null {
  const mapping: Record<string, string> = {
    add_to_cart: 'AddToCart',
    begin_checkout: 'InitiateCheckout',
    purchase: 'Purchase',
    view_item: 'ViewContent',
    add_to_wishlist: 'AddToWishlist',
    search: 'Search',
    sign_up: 'CompleteRegistration',
    login: 'Lead',
  };

  return mapping[gaEvent] || null;
}

/**
 * E-commerce Events
 */
export const ecommerceEvents = {
  /**
   * Track when user views a product
   */
  viewItem: (product: {
    id: string;
    name: string;
    price: number;
    category?: string;
    brand?: string;
  }) => {
    trackEvent('view_item', {
      currency: 'EGP',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          item_brand: product.brand,
          price: product.price,
        },
      ],
    });
  },

  /**
   * Track when user adds product to cart
   */
  addToCart: (product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }) => {
    trackEvent('add_to_cart', {
      currency: 'EGP',
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: product.quantity,
        },
      ],
    });
  },

  /**
   * Track when user begins checkout
   */
  beginCheckout: (cartValue: number, items: any[]) => {
    trackEvent('begin_checkout', {
      currency: 'EGP',
      value: cartValue,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },

  /**
   * Track purchase
   */
  purchase: (transaction: {
    id: string;
    value: number;
    tax?: number;
    shipping?: number;
    items: any[];
  }) => {
    trackEvent('purchase', {
      currency: 'EGP',
      transaction_id: transaction.id,
      value: transaction.value,
      tax: transaction.tax || 0,
      shipping: transaction.shipping || 0,
      items: transaction.items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },

  /**
   * Track when user adds to wishlist
   */
  addToWishlist: (product: {
    id: string;
    name: string;
    price: number;
  }) => {
    trackEvent('add_to_wishlist', {
      currency: 'EGP',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
        },
      ],
    });
  },

  /**
   * Track search
   */
  search: (searchTerm: string) => {
    trackEvent('search', {
      search_term: searchTerm,
    });
  },
};

/**
 * User Events
 */
export const userEvents = {
  /**
   * Track signup
   */
  signUp: (method: string) => {
    trackEvent('sign_up', {
      method: method, // email, google, facebook
    });
  },

  /**
   * Track login
   */
  login: (method: string) => {
    trackEvent('login', {
      method: method,
    });
  },

  /**
   * Track affiliate link click
   */
  affiliateLinkClick: (affiliateId: string, productId?: string) => {
    trackEvent('affiliate_link_click', {
      affiliate_id: affiliateId,
      product_id: productId,
    });
  },

  /**
   * Track referral
   */
  referral: (referralCode: string) => {
    trackEvent('referral', {
      referral_code: referralCode,
    });
  },
};

/**
 * Initialize All Analytics
 */
export function initializeAnalytics(): void {
  initializeGA4();
  initializeFacebookPixel();
  console.log('✅ Analytics initialized');
}

export default {
  initialize: initializeAnalytics,
  trackPageView,
  trackEvent,
  ecommerce: ecommerceEvents,
  user: userEvents,
};
