/**
 * Currency formatting utilities for EgyGo
 * Default currency: Egyptian Pound (EGP)
 */

export const CURRENCY_SYMBOL = 'ج.م';
export const CURRENCY_CODE = 'EGP';

/**
 * Format price with Egyptian Pound symbol
 * @param price - Price value
 * @param showDecimals - Whether to show decimal places (default: false for EGP)
 * @returns Formatted price string
 */
export function formatPrice(price: number | string, showDecimals: boolean = false): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) {
    return `0 ${CURRENCY_SYMBOL}`;
  }
  
  const formatted = showDecimals 
    ? numPrice.toFixed(2) 
    : Math.round(numPrice).toString();
  
  // Add thousand separators
  const withSeparators = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `${withSeparators} ${CURRENCY_SYMBOL}`;
}

/**
 * Format price range
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Formatted price range string
 */
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Discount percentage
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Format discount amount
 * @param originalPrice - Original price
 * @param discountedPrice - Discounted price
 * @returns Formatted discount string
 */
export function formatDiscount(originalPrice: number, discountedPrice: number): string {
  const discount = originalPrice - discountedPrice;
  return `وفر ${formatPrice(discount)}`;
}

/**
 * Parse price from string
 * @param priceString - Price string
 * @returns Numeric price value
 */
export function parsePrice(priceString: string): number {
  // Remove currency symbols and separators
  const cleaned = priceString.replace(/[^\d.]/g, '');
  return parseFloat(cleaned) || 0;
}
