/**
 * Vendoor Function API
 * Interact with Vendoor Scraper Appwrite Function
 */

// Get Vendoor Function URL from environment
const VENDOOR_FUNCTION_URL = import.meta.env.VITE_VENDOOR_FUNCTION_URL || 'https://68e1f6240030405882c5.fra.appwrite.run';

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
  try {
    const response = await fetch(`${VENDOOR_FUNCTION_URL}/vendoor/fetch-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  try {
    const response = await fetch(`${VENDOOR_FUNCTION_URL}/vendoor/fetch-single`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
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
  try {
    const response = await fetch(`${VENDOOR_FUNCTION_URL}/vendoor/sync-manual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
  try {
    const response = await fetch(`${VENDOOR_FUNCTION_URL}/vendoor/import-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        productId,
        markupPercentage 
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
    const response = await fetch(`${VENDOOR_FUNCTION_URL}/vendoor/import-multiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        productIds,
        markupPercentage 
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
  try {
    const response = await fetch(`${VENDOOR_FUNCTION_URL}/health`, {
      method: 'GET',
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
