/**
 * Optimized Image Component
 * 
 * Features:
 * - Lazy loading
 * - WebP support with fallback
 * - Responsive images
 * - Loading placeholder
 * - Error handling
 */

import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean; // Load immediately without lazy loading
  placeholder?: 'blur' | 'skeleton' | 'none';
  quality?: number;
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  objectFit = 'cover',
  priority = false,
  placeholder = 'skeleton',
  quality = 75,
  fallbackSrc = '/placeholder.svg',
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(priority ? src : '');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // If priority, load immediately
    if (priority) {
      setImageSrc(src);
      return;
    }

    // Lazy loading with Intersection Observer
    if (imgRef.current && !observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observerRef.current?.disconnect();
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before visible
        }
      );

      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setImageSrc(fallbackSrc);
  };

  // Convert to WebP if supported
  const getOptimizedSrc = (originalSrc: string): string => {
    if (!originalSrc) return fallbackSrc;
    
    // Check if browser supports WebP
    const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (supportsWebP && !originalSrc.endsWith('.webp')) {
      // If it's a local image, try to load WebP version
      const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      return webpSrc;
    }
    
    return originalSrc;
  };

  // Render skeleton or blur placeholder while loading
  if (isLoading && !imageSrc && placeholder !== 'none') {
    return (
      <div
        className={className}
        style={{
          width: width || '100%',
          height: height || 'auto',
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
      >
        {placeholder === 'skeleton' && (
          <Skeleton className="w-full h-full" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={imgRef as any}>
      {isLoading && imageSrc && placeholder !== 'none' && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      <img
        src={getOptimizedSrc(imageSrc)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{
          objectFit,
          width: width || '100%',
          height: height || 'auto',
        }}
        {...props}
      />
      
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          صورة غير متوفرة
        </div>
      )}
    </div>
  );
}

/**
 * Preload Critical Images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload Multiple Images
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(urls.map(url => preloadImage(url)));
}

export default OptimizedImage;
