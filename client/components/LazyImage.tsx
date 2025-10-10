import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getOptimizedImageUrl, getBestImageFormat, preloadImage } from '@/lib/cdn';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  onClick?: () => void;
  threshold?: number;
  rootMargin?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  onLoad,
  onError,
  onClick,
  threshold = 0.1,
  rootMargin = '50px',
  width,
  height,
  quality = 85,
  priority = false
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized image URL
  useEffect(() => {
    if (src) {
      const format = getBestImageFormat();
      const optimizedUrl = getOptimizedImageUrl(src, {
        width,
        height,
        quality,
        format
      });
      setOptimizedSrc(optimizedUrl);

      // Preload high priority images
      if (priority) {
        preloadImage(optimizedUrl, 'high').catch(console.warn);
      }
    }
  }, [src, width, height, quality, priority]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        className
      )}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={placeholder}
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-sm">فشل في تحميل الصورة</div>
          </div>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && optimizedSrc && (
        <img
          src={optimizedSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          onClick={onClick}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
}

// Lazy loading for product images with multiple sizes
interface LazyProductImageProps extends Omit<LazyImageProps, 'src'> {
  productId: string;
  imageIndex?: number;
  sizes?: {
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
  };
}

export function LazyProductImage({
  productId,
  imageIndex = 0,
  sizes,
  ...props
}: LazyProductImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');

  useEffect(() => {
    // In a real app, you would fetch the image URL from your API
    // For now, we'll use a placeholder
    const baseUrl = 'https://via.placeholder.com';
    const size = sizes?.medium || '400x400';
    setImageSrc(`${baseUrl}/${size}/f3f4f6/374151?text=Product+${productId}`);
  }, [productId, imageIndex, sizes]);

  return (
    <LazyImage
      src={imageSrc}
      alt={`Product ${productId} image ${imageIndex + 1}`}
      {...props}
    />
  );
}

// Lazy loading for gallery images
interface LazyGalleryProps {
  images: string[];
  className?: string;
  onImageClick?: (index: number) => void;
}

export function LazyGallery({ images, className, onImageClick }: LazyGalleryProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4', className)}>
      {images.map((src, index) => (
        <LazyImage
          key={index}
          src={src}
          alt={`Gallery image ${index + 1}`}
          className="aspect-square cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onImageClick?.(index)}
        />
      ))}
    </div>
  );
}

// Progressive image loading with blur-up effect
interface ProgressiveImageProps extends LazyImageProps {
  lowQualitySrc?: string;
  blurDataURL?: string;
}

export function ProgressiveImage({
  src,
  lowQualitySrc,
  blurDataURL,
  ...props
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || blurDataURL || '');
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    if (lowQualitySrc || blurDataURL) {
      setCurrentSrc(lowQualitySrc || blurDataURL || '');
    }
  }, [lowQualitySrc, blurDataURL]);

  const handleHighQualityLoad = () => {
    setCurrentSrc(src);
    setIsHighQualityLoaded(true);
  };

  return (
    <LazyImage
      src={currentSrc}
      onLoad={handleHighQualityLoad}
      className={cn(
        'transition-all duration-500',
        !isHighQualityLoaded && 'blur-sm scale-105',
        props.className
      )}
      {...props}
    />
  );
}
