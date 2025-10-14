// CDN Configuration and utilities
interface CDNConfig {
  baseUrl: string;
  imageOptimization: boolean;
  webpSupport: boolean;
  avifSupport: boolean;
  compressionQuality: number;
  fallbackUrl?: string;
}

// CDN Configuration
export const cdnConfig: CDNConfig = {
  baseUrl: import.meta.env.VITE_CDN_BASE_URL || 'https://cdn.egygo.com',
  imageOptimization: true,
  webpSupport: true,
  avifSupport: true,
  compressionQuality: 85,
  fallbackUrl: import.meta.env.VITE_FALLBACK_CDN_URL || 'https://images.egygo.com'
};

// Image optimization parameters
interface ImageParams {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  blur?: number;
  grayscale?: boolean;
}

// Generate optimized image URL
export function getOptimizedImageUrl(
  imagePath: string,
  params: ImageParams = {}
): string {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Build query parameters
  const queryParams = new URLSearchParams();
  
  if (params.width) queryParams.set('w', params.width.toString());
  if (params.height) queryParams.set('h', params.height.toString());
  if (params.quality) queryParams.set('q', params.quality.toString());
  if (params.format) queryParams.set('f', params.format);
  if (params.fit) queryParams.set('fit', params.fit);
  if (params.blur) queryParams.set('blur', params.blur.toString());
  if (params.grayscale) queryParams.set('grayscale', 'true');

  // Add optimization parameters
  if (cdnConfig.imageOptimization) {
    queryParams.set('auto', 'compress');
  }

  const queryString = queryParams.toString();
  const baseUrl = cdnConfig.baseUrl.endsWith('/') 
    ? cdnConfig.baseUrl.slice(0, -1) 
    : cdnConfig.baseUrl;

  return `${baseUrl}/${cleanPath}${queryString ? `?${queryString}` : ''}`;
}

// Get responsive image URLs for different screen sizes
export function getResponsiveImageUrls(
  imagePath: string,
  baseParams: ImageParams = {}
): {
  thumbnail: string;
  small: string;
  medium: string;
  large: string;
  xlarge: string;
} {
  return {
    thumbnail: getOptimizedImageUrl(imagePath, { ...baseParams, width: 150, height: 150 }),
    small: getOptimizedImageUrl(imagePath, { ...baseParams, width: 400, height: 300 }),
    medium: getOptimizedImageUrl(imagePath, { ...baseParams, width: 800, height: 600 }),
    large: getOptimizedImageUrl(imagePath, { ...baseParams, width: 1200, height: 900 }),
    xlarge: getOptimizedImageUrl(imagePath, { ...baseParams, width: 1920, height: 1080 })
  };
}

// Get the best format based on browser support
export function getBestImageFormat(): 'avif' | 'webp' | 'jpeg' {
  // Check for AVIF support
  if (cdnConfig.avifSupport && typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const dataURL = canvas.toDataURL('image/avif');
      if (dataURL && dataURL !== 'data:,') {
        return 'avif';
      }
    }
  }

  // Check for WebP support
  if (cdnConfig.webpSupport && typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const dataURL = canvas.toDataURL('image/webp');
      if (dataURL && dataURL !== 'data:,') {
        return 'webp';
      }
    }
  }

  return 'jpeg';
}

// Preload critical images
export function preloadImage(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
    
    // Add to preload link for high priority images
    if (priority === 'high' && typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    }
  });
}

// Batch preload images
export async function preloadImages(
  imageUrls: string[],
  priority: 'high' | 'low' = 'low'
): Promise<void> {
  const promises = imageUrls.map(url => preloadImage(url, priority));
  await Promise.allSettled(promises);
}

// Get CDN URL for static assets
export function getCDNUrl(path: string): string {
  if (!path) return '';
  
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = cdnConfig.baseUrl.endsWith('/') 
    ? cdnConfig.baseUrl.slice(0, -1) 
    : cdnConfig.baseUrl;
    
  return `${baseUrl}/${cleanPath}`;
}

// Fallback mechanism for failed CDN requests
export function getImageWithFallback(
  primaryUrl: string,
  fallbackUrl?: string
): string {
  if (!primaryUrl) return fallbackUrl || '';
  
  // If primary URL is from CDN and we have a fallback, use both
  if (primaryUrl.includes(cdnConfig.baseUrl) && fallbackUrl) {
    return primaryUrl;
  }
  
  return primaryUrl;
}

// Image optimization hook for React components
export function useOptimizedImage(
  imagePath: string,
  params: ImageParams = {}
): {
  src: string;
  srcSet: string;
  sizes: string;
} {
  const format = getBestImageFormat();
  const responsiveUrls = getResponsiveImageUrls(imagePath, { ...params, format });
  
  const srcSet = [
    `${responsiveUrls.thumbnail} 150w`,
    `${responsiveUrls.small} 400w`,
    `${responsiveUrls.medium} 800w`,
    `${responsiveUrls.large} 1200w`,
    `${responsiveUrls.xlarge} 1920w`
  ].join(', ');

  const sizes = '(max-width: 640px) 400px, (max-width: 1024px) 800px, (max-width: 1280px) 1200px, 1920px';

  return {
    src: responsiveUrls.medium,
    srcSet,
    sizes
  };
}

// CDN health check
export async function checkCDNHealth(): Promise<boolean> {
  try {
    const testUrl = getCDNUrl('health-check');
    const response = await fetch(testUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn('CDN health check failed:', error);
    return false;
  }
}

// Cache busting for development
export function addCacheBuster(url: string): string {
  if (import.meta.env.DEV) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${Date.now()}`;
  }
  return url;
}

// Export CDN configuration for external use

export type { CDNConfig, ImageParams };




