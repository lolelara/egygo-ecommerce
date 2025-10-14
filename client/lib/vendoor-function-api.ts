/**
 * Vendoor Function API
 * Interact with Vendoor Scraper via Appwrite Function
 * خطة الطلاب: timeout 900 ثانية
 */

import { fetchWithTimeout } from './fetch-with-timeout';

// استخدام Appwrite Function مباشرة (خطة الطلاب: 900 ثانية)
const USE_APPWRITE_FUNCTION = true; // ✅ استخدم Appwrite Function دائماً
const FUNCTION_URL = 'https://68e1f6240030405882c5.fra.appwrite.run';
const FUNCTION_TIMEOUT = 890000; // 890 seconds (أقل من 900 بقليل)

console.log(`🔧 Using Appwrite Function: ${FUNCTION_URL}`);
console.log(`⏱️ Timeout: ${FUNCTION_TIMEOUT / 1000} seconds`);

export interface VendoorProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  commission?: number;
  stock: number;
  images: string[];
  description?: string;
  category?: string;
  url: string;
}

export interface VendoorSyncResult {
  success: boolean;
  updated: number;
  failed: number;
  errors?: string[];
  products?: VendoorProduct[];
}

/**
 * استدعاء Vendoor Function لجلب جميع المنتجات
 */
export async function fetchAllVendoorProducts(): Promise<VendoorSyncResult> {
  console.log('🔄 جلب جميع المنتجات من Vendoor...');
  try {
    const response = await fetchWithTimeout(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'scrape-all',
        email: 'almlmibrahym574@gmail.com',
        password: 'hema2004'
      }),
      timeout: FUNCTION_TIMEOUT
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Vendoor products:', error);
    throw new Error('فشل جلب المنتجات من Vendoor: ' + (error as Error).message);
  }
}

/**
 * استدعاء Vendoor Function لجلب منتج واحد
 */
export async function fetchSingleVendoorProduct(productId: string): Promise<VendoorProduct> {
  console.log(`🔄 جلب المنتج ${productId}...`);
  try {
    const response = await fetchWithTimeout(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'scrape-single',
        productId,
        email: 'almlmibrahym574@gmail.com',
        password: 'hema2004'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'فشل جلب المنتج');
    }

    return data.product;
  } catch (error) {
    console.error('Error fetching single Vendoor product:', error);
    throw new Error('فشل جلب المنتج من Vendoor: ' + (error as Error).message);
  }
}

/**
 * استدعاء Vendoor Function للمزامنة اليدوية
 */
export async function manualVendoorSync(): Promise<VendoorSyncResult> {
  console.log('🔄 مزامنة يدوية مع Vendoor...');
  try {
    const response = await fetchWithTimeout(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sync-manual',
        email: 'almlmibrahym574@gmail.com',
        password: 'hema2004'
      }),
      timeout: FUNCTION_TIMEOUT
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error manual Vendoor sync:', error);
    throw new Error('فشل المزامنة اليدوية: ' + (error as Error).message);
  }
}

/**
 * استدعاء Vendoor Function لاستيراد منتج واحد مع markup
 */
export async function importVendoorProduct(
  productId: string,
  markupPercentage: number = 20
): Promise<{ success: boolean; productId?: string; error?: string }> {
  console.log(`🔄 استيراد المنتج ${productId}...`);
  try {
    const response = await fetchWithTimeout(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'import-product',
        productId,
        markupPercentage,
        email: 'almlmibrahym574@gmail.com',
        password: 'hema2004'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error importing Vendoor product:', error);
    return {
      success: false,
      error: 'فشل استيراد المنتج: ' + (error as Error).message
    };
  }
}

/**
 * استدعاء Vendoor Function لاستيراد منتجات متعددة
 */
export async function importMultipleVendoorProducts(
  productIds: string[],
  markupPercentage: number = 20
): Promise<VendoorSyncResult> {
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'import-multiple',
        productIds,
        markupPercentage,
        email: 'almlmibrahym574@gmail.com',
        password: 'hema2004'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error importing multiple Vendoor products:', error);
    throw new Error('فشل استيراد المنتجات: ' + (error as Error).message);
  }
}

/**
 * التحقق من حالة Vendoor Function
 */
export async function checkVendoorFunctionStatus(): Promise<{ online: boolean; message?: string }> {
  console.log('🔄 فحص حالة Function...');
  try {
    const response = await fetchWithTimeout(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'health'
      }),
      timeout: 30000 // 30 seconds للـ health check
    });

    if (!response.ok) {
      return { online: false, message: 'Function is offline' };
    }

    return { online: true, message: 'Function is online' };
  } catch (error) {
    console.error('Error checking Vendoor function status:', error);
    return { online: false, message: (error as Error).message };
  }
}
