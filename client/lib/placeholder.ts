/**
 * Placeholder Image Utilities
 * بديل محلي لـ via.placeholder.com
 */

/**
 * توليد URL لصورة placeholder محلية
 */
export function getPlaceholderImage(options: {
  width?: number;
  height?: number;
  text?: string;
  bgColor?: string;
  textColor?: string;
}): string {
  const {
    width = 600,
    height = 600,
    text = 'لا توجد صورة',
    bgColor = 'f3f4f6',
    textColor = '6b7280'
  } = options;

  // استخدام SVG كـ data URL - أسرع وأكثر موثوقية
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Cairo, Arial, sans-serif" 
        font-size="${Math.min(width, height) / 10}"
        fill="#${textColor}" 
        text-anchor="middle" 
        dominant-baseline="middle"
        direction="rtl"
      >
        ${text}
      </text>
    </svg>
  `.trim();

  // تحويل SVG إلى data URL
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml,${encoded}`;
}

/**
 * توليد placeholder لمنتج
 */
export function getProductPlaceholder(productName?: string): string {
  return getPlaceholderImage({
    width: 600,
    height: 600,
    text: productName || 'منتج',
    bgColor: 'f3f4f6',
    textColor: '9ca3af'
  });
}

/**
 * توليد placeholder للفئات
 */
export function getCategoryPlaceholder(categoryName?: string): string {
  return getPlaceholderImage({
    width: 1200,
    height: 300,
    text: categoryName || 'فئة',
    bgColor: 'e5e7eb',
    textColor: '6b7280'
  });
}

/**
 * توليد placeholder للصور المربعة
 */
export function getSquarePlaceholder(text?: string, size = 300): string {
  return getPlaceholderImage({
    width: size,
    height: size,
    text: text || 'صورة',
    bgColor: 'f9fafb',
    textColor: '9ca3af'
  });
}

/**
 * توليد placeholder gradient
 */
export function getGradientPlaceholder(options: {
  width?: number;
  height?: number;
  text?: string;
  gradient?: 'purple' | 'blue' | 'pink' | 'green';
}): string {
  const {
    width = 600,
    height = 600,
    text = 'EgyGo',
    gradient = 'purple'
  } = options;

  const gradients = {
    purple: 'from-purple-600 to-pink-600',
    blue: 'from-blue-600 to-cyan-600',
    pink: 'from-pink-600 to-rose-600',
    green: 'from-green-600 to-emerald-600'
  };

  const gradientColors = {
    purple: ['#8b5cf6', '#ec4899'],
    blue: ['#2563eb', '#06b6d4'],
    pink: ['#db2777', '#f43f5e'],
    green: ['#059669', '#10b981']
  };

  const [color1, color2] = gradientColors[gradient];

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Cairo, Arial, sans-serif" 
        font-size="${Math.min(width, height) / 8}"
        font-weight="bold"
        fill="#ffffff" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `.trim();

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml,${encoded}`;
}

/**
 * توليد placeholder مع أيقونة
 */
export function getIconPlaceholder(options: {
  width?: number;
  height?: number;
  icon?: string;
  bgColor?: string;
}): string {
  const {
    width = 600,
    height = 600,
    icon = '🖼️',
    bgColor = 'f3f4f6'
  } = options;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#${bgColor}"/>
      <text 
        x="50%" 
        y="50%" 
        font-size="${Math.min(width, height) / 3}"
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${icon}
      </text>
    </svg>
  `.trim();

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');

  return `data:image/svg+xml,${encoded}`;
}

/**
 * بديل لـ via.placeholder.com
 * استخدم هذا بدلاً من الطلبات الخارجية
 */
export const placeholder = {
  product: getProductPlaceholder,
  category: getCategoryPlaceholder,
  square: getSquarePlaceholder,
  gradient: getGradientPlaceholder,
  icon: getIconPlaceholder,
  custom: getPlaceholderImage
};

export default placeholder;
