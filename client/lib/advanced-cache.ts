/**
 * Advanced Caching Strategy
 * استراتيجية تخزين مؤقت متقدمة
 */

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

interface CacheConfig {
  key: string[];
  staleTime: number;
  cacheTime: number;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number | ((failureCount: number, error: any) => boolean);
  networkMode?: 'online' | 'always' | 'offlineFirst';
}

// تكوينات مخصصة لأنواع البيانات المختلفة
const cacheConfigs: Record<string, Partial<CacheConfig>> = {
  // بيانات ثابتة (Categories, Static Pages)
  static: {
    staleTime: 30 * 60 * 1000, // 30 دقيقة
    cacheTime: 60 * 60 * 1000, // ساعة
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    networkMode: 'offlineFirst'
  },
  
  // بيانات شبه ثابتة (Products, Offers)
  semiStatic: {
    staleTime: 5 * 60 * 1000, // 5 دقائق
    cacheTime: 30 * 60 * 1000, // 30 دقيقة
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    networkMode: 'offlineFirst'
  },
  
  // بيانات ديناميكية (Cart, User Profile)
  dynamic: {
    staleTime: 1 * 60 * 1000, // دقيقة
    cacheTime: 5 * 60 * 1000, // 5 دقائق
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    networkMode: 'online'
  },
  
  // بيانات فورية (Orders, Notifications)
  realtime: {
    staleTime: 0, // دائماً stale
    cacheTime: 2 * 60 * 1000, // دقيقتين
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    networkMode: 'always'
  }
};

/**
 * تحديد نوع الكاش حسب query key
 */
function getCacheType(queryKey: unknown[]): keyof typeof cacheConfigs {
  const key = queryKey[0] as string;
  
  // بيانات ثابتة
  if (['categories', 'settings', 'pages', 'static'].includes(key)) {
    return 'static';
  }
  
  // بيانات شبه ثابتة
  if (['products', 'offers', 'deals', 'banners', 'affiliates'].includes(key)) {
    return 'semiStatic';
  }
  
  // بيانات فورية
  if (['orders', 'notifications', 'messages', 'realtime'].includes(key)) {
    return 'realtime';
  }
  
  // بيانات ديناميكية (default)
  return 'dynamic';
}

/**
 * Query Cache مع logging متقدم
 */
const queryCache = new QueryCache({
  onError: (error, query) => {
    console.error(`Query failed [${query.queryHash}]:`, error);
    
    // تتبع الأخطاء في Sentry
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          query: {
            queryKey: query.queryKey,
            queryHash: query.queryHash
          }
        }
      });
    }
  },
  onSuccess: (data, query) => {
    const size = JSON.stringify(data).length;
    console.debug(`Query success [${query.queryHash}] - Size: ${size} bytes`);
  }
});

/**
 * Mutation Cache مع optimistic updates
 */
const mutationCache = new MutationCache({
  onError: (error, variables, context, mutation) => {
    console.error('Mutation failed:', error);
    
    // Rollback optimistic update
    if (context && typeof context === 'object' && 'rollback' in context) {
      (context as any).rollback();
    }
  },
  onSuccess: (data, variables, context, mutation) => {
    console.debug('Mutation success:', mutation.options.mutationKey);
  }
});

/**
 * Query Client مخصص
 */
export const advancedQueryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions: {
    queries: {
      // استراتيجية تخزين ذكية حسب نوع البيانات
      staleTime: (query) => {
        const cacheType = getCacheType(query.queryKey);
        return cacheConfigs[cacheType].staleTime || 0;
      },
      cacheTime: (query) => {
        const cacheType = getCacheType(query.queryKey);
        return cacheConfigs[cacheType].cacheTime || 5 * 60 * 1000;
      },
      
      // Retry strategy ذكية
      retry: (failureCount, error: any) => {
        // لا تعيد المحاولة للأخطاء 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        
        // أعد المحاولة 3 مرات كحد أقصى
        return failureCount < 3;
      },
      
      // Retry delay تصاعدي
      retryDelay: (attemptIndex) => {
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
      
      // Network mode
      networkMode: 'offlineFirst',
      
      // Refetch on mount
      refetchOnMount: (query) => {
        const cacheType = getCacheType(query.queryKey);
        return cacheConfigs[cacheType].refetchOnMount ?? false;
      },
      
      // Refetch on window focus
      refetchOnWindowFocus: (query) => {
        const cacheType = getCacheType(query.queryKey);
        return cacheConfigs[cacheType].refetchOnWindowFocus ?? false;
      },
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Структура структурирования ошибок
      useErrorBoundary: false,
    },
    
    mutations: {
      // Retry للـ mutations
      retry: 1,
      
      // Network mode
      networkMode: 'online',
      
      // Error handling
      useErrorBoundary: false,
      
      // Optimistic updates
      onMutate: async (variables) => {
        // يمكن تخصيصها لكل mutation
        return { timestamp: Date.now() };
      }
    }
  }
});

/**
 * Prefetch helper مع Priority
 */
export async function prefetchWithPriority(
  priority: 'high' | 'medium' | 'low',
  queries: Array<{
    queryKey: any[];
    queryFn: () => Promise<any>;
  }>
) {
  const delays: Record<typeof priority, number> = {
    high: 0,
    medium: 100,
    low: 500
  };
  
  await new Promise(resolve => setTimeout(resolve, delays[priority]));
  
  const promises = queries.map(({ queryKey, queryFn }) =>
    advancedQueryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: getCacheType(queryKey).includes('static') ? Infinity : 5 * 60 * 1000
    })
  );
  
  return Promise.all(promises);
}

/**
 * Batch prefetch للمنتجات
 */
export async function prefetchProducts(productIds: string[]) {
  const chunks = [];
  const chunkSize = 5;
  
  for (let i = 0; i < productIds.length; i += chunkSize) {
    chunks.push(productIds.slice(i, i + chunkSize));
  }
  
  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(id =>
        advancedQueryClient.prefetchQuery({
          queryKey: ['product', id],
          queryFn: () => fetchProduct(id),
          staleTime: 5 * 60 * 1000
        })
      )
    );
    
    // تأخير صغير بين chunks
    await new Promise(resolve => setTimeout(resolve, 50));
  }
}

/**
 * Invalidate cache ذكي
 */
export function invalidateRelatedQueries(mutationType: string, resourceId?: string) {
  switch (mutationType) {
    case 'product':
      advancedQueryClient.invalidateQueries({ queryKey: ['products'] });
      if (resourceId) {
        advancedQueryClient.invalidateQueries({ queryKey: ['product', resourceId] });
      }
      // تحديث recommendations أيضاً
      advancedQueryClient.invalidateQueries({ queryKey: ['recommendations'] });
      break;
      
    case 'order':
      advancedQueryClient.invalidateQueries({ queryKey: ['orders'] });
      advancedQueryClient.invalidateQueries({ queryKey: ['user', 'stats'] });
      break;
      
    case 'cart':
      advancedQueryClient.invalidateQueries({ queryKey: ['cart'] });
      break;
      
    case 'user':
      advancedQueryClient.invalidateQueries({ queryKey: ['user'] });
      break;
  }
}

/**
 * مسح الكاش القديم
 */
export function clearOldCache(olderThan: number = 24 * 60 * 60 * 1000) {
  const cache = advancedQueryClient.getQueryCache();
  const queries = cache.getAll();
  const now = Date.now();
  
  let cleared = 0;
  
  queries.forEach(query => {
    const state = query.state;
    if (state.dataUpdatedAt && now - state.dataUpdatedAt > olderThan) {
      cache.remove(query);
      cleared++;
    }
  });
  
  console.log(`Cleared ${cleared} old cache entries`);
}

/**
 * Cache statistics
 */
export function getCacheStats() {
  const cache = advancedQueryClient.getQueryCache();
  const queries = cache.getAll();
  
  const stats = {
    total: queries.length,
    active: queries.filter(q => q.getObserversCount() > 0).length,
    inactive: queries.filter(q => q.getObserversCount() === 0).length,
    stale: queries.filter(q => q.isStale()).length,
    fresh: queries.filter(q => !q.isStale()).length,
    byType: {} as Record<string, number>
  };
  
  queries.forEach(query => {
    const type = getCacheType(query.queryKey);
    stats.byType[type] = (stats.byType[type] || 0) + 1;
  });
  
  return stats;
}

/**
 * Background cache refresh
 */
export function startBackgroundRefresh(intervalMs: number = 5 * 60 * 1000) {
  return setInterval(() => {
    const cache = advancedQueryClient.getQueryCache();
    const staleQueries = cache.getAll().filter(q => 
      q.isStale() && q.getObserversCount() > 0
    );
    
    console.log(`Background refresh: ${staleQueries.length} stale queries`);
    
    staleQueries.forEach(query => {
      query.fetch();
    });
  }, intervalMs);
}

// Helper function (يجب أن تكون مُعرّفة في مكان آخر)
declare function fetchProduct(id: string): Promise<any>;

// Type augmentation لـ Window
declare global {
  interface Window {
    Sentry?: any;
  }
}
