// ============================================
// Performance Optimizations
// ============================================

import { lazy, Suspense, useMemo, useCallback, memo } from 'react';

// ===== CODE SPLITTING =====

/**
 * Lazy load advanced components
 * استخدم هذه المكونات بدلاً من import المباشر
 * 
 * NOTE: هذه أمثلة - قم بإنشاء المكونات الفعلية في client/components/advanced/
 * 
 * Example usage:
 * import { RBACSystemLazy, LoadingFallback } from '@/lib/performance';
 * 
 * <Suspense fallback={<LoadingFallback />}>
 *   <RBACSystemLazy />
 * </Suspense>
 */

// TODO: Uncomment when components are created
// export const RBACSystemLazy = lazy(() => 
//   import('../components/advanced/RBACSystem').then(m => ({ default: m.RBACSystem }))
// );

// export const SmartContractsLazy = lazy(() => 
//   import('../components/advanced/SmartContracts').then(m => ({ 
//     default: m.SmartContracts 
//   }))
// );

// export const ExperimentHubLazy = lazy(() => 
//   import('../components/advanced/ExperimentHub').then(m => ({ 
//     default: m.ExperimentHub 
//   }))
// );

// export const CustomerExperienceLazy = lazy(() => 
//   import('../components/advanced/CustomerExperience').then(m => ({ 
//     default: m.AIShoppingAssistant 
//   }))
// );

// export const SupplyChainToolsLazy = lazy(() => 
//   import('../components/advanced/SupplyChainTools').then(m => ({ 
//     default: m.SupplyOffersComparison 
//   }))
// );

// ===== LOADING COMPONENT =====

export function LoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="mr-3 text-muted-foreground">جاري التحميل...</span>
    </div>
  );
}

// ===== HOW TO USE =====

/**
 * Example usage in your pages:
 * 
 * import { RBACSystemLazy, LoadingFallback } from '@/lib/lazy-components';
 * 
 * function AdminPage() {
 *   return (
 *     <Suspense fallback={<LoadingFallback />}>
 *       <RBACSystemLazy />
 *     </Suspense>
 *   );
 * }
 */

// ===== REACT QUERY OPTIMIZATIONS =====

/**
 * Default React Query configuration للأداء الأفضل
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1
    }
  }
};

// ===== MEMOIZATION HELPERS =====

/**
 * Hook لحساب قيمة مكلفة فقط عند تغير dependencies
 */
export function useExpensiveCalculation<T>(
  calculation: () => T,
  dependencies: any[]
): T {
  return useMemo(calculation, dependencies);
}

/**
 * Hook للـ callbacks مع memoization
 */
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T {
  return useCallback(callback, dependencies) as T;
}

// ===== PERFORMANCE MONITORING =====

/**
 * قياس أداء component
 */
export function measureComponentPerformance(
  componentName: string,
  renderTime: number
) {
  if (process.env.NODE_ENV === 'development') {
    if (renderTime > 100) {
      console.warn(
        `⚠️ ${componentName} took ${renderTime}ms to render (>100ms threshold)`
      );
    }
  }
}

/**
 * HOC لقياس أداء component
 */
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return memo((props: P) => {
    const startTime = performance.now();
    
    const result = <Component {...props} />;
    
    const endTime = performance.now();
    measureComponentPerformance(componentName, endTime - startTime);
    
    return result;
  });
}

// ===== IMAGE OPTIMIZATION =====

/**
 * Lazy load images
 */
export function useLazyImage(src: string) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
  }, [src]);
  
  return { imageSrc, isLoading };
}

/**
 * Responsive image component
 */
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className,
  priority = false 
}: OptimizedImageProps) {
  const { imageSrc, isLoading } = useLazyImage(src);
  
  if (isLoading && !priority) {
    return (
      <div className={`bg-muted animate-pulse ${className}`}>
        <div className="sr-only">جاري تحميل الصورة...</div>
      </div>
    );
  }
  
  return (
    <img
      src={imageSrc || src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
}

// ===== VIRTUALIZATION HELPER =====

/**
 * للقوائم الطويلة - استخدم مع react-window
 */
export interface VirtualizedListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

/**
 * Example:
 * 
 * <VirtualizedList
 *   items={products}
 *   height={600}
 *   itemHeight={100}
 *   renderItem={(product) => <ProductCard product={product} />}
 * />
 */

// ===== DEBOUNCE & THROTTLE =====

import { useEffect, useState } from 'react';

/**
 * Debounce للبحث وinput fields
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Example:
 * 
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   // API call only happens after 500ms of no typing
 *   fetchSearchResults(debouncedSearch);
 * }, [debouncedSearch]);
 */
