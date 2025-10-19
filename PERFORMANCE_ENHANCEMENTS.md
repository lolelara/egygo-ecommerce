# 🚀 Performance Enhancements Implementation Guide

هذا الدليل يحتوي على جميع التحسينات المطلوبة مع الكود الكامل.

---

## 📦 الخطوة 1: تثبيت المكتبات

```bash
npm install @tanstack/react-query @sentry/react zustand react-window dayjs react-hot-toast zod
```

---

## 📁 الخطوة 2: إنشاء الملفات

### 1️⃣ Query Optimizer

**الملف:** `client/lib/query-optimizer.ts`

```typescript
/**
 * Query Optimizer with Caching & Batching
 * Improves database query performance
 */

import { databases } from './appwrite';
import { Query } from 'appwrite';
import { useState, useEffect } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface QueryConfig {
  cacheDuration?: number;
  staleWhileRevalidate?: boolean;
  retries?: number;
}

class QueryOptimizer {
  private cache = new Map<string, CacheEntry<any>>();
  private pendingQueries = new Map<string, Promise<any>>();
  private readonly DEFAULT_CACHE_DURATION = 5 * 60 * 1000;
  
  async cachedQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    config: QueryConfig = {}
  ): Promise<T> {
    const {
      cacheDuration = this.DEFAULT_CACHE_DURATION,
      staleWhileRevalidate = true,
      retries = 3,
    } = config;

    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached) {
      if (now < cached.expiresAt) {
        return cached.data as T;
      }

      if (staleWhileRevalidate) {
        this.refreshInBackground(key, queryFn, cacheDuration);
        return cached.data as T;
      }
    }

    const pending = this.pendingQueries.get(key);
    if (pending) return pending;

    const queryPromise = this.executeWithRetry(queryFn, retries);
    this.pendingQueries.set(key, queryPromise);

    try {
      const data = await queryPromise;
      this.cache.set(key, {
        data,
        timestamp: now,
        expiresAt: now + cacheDuration,
      });
      return data;
    } finally {
      this.pendingQueries.delete(key);
    }
  }

  async batchQueries<T>(
    queries: Array<{ key: string; fn: () => Promise<T>; config?: QueryConfig }>
  ): Promise<T[]> {
    return Promise.all(
      queries.map(({ key, fn, config }) => this.cachedQuery(key, fn, config))
    );
  }

  async paginatedQuery<T>(
    collectionId: string,
    page: number = 1,
    limit: number = 20,
    queries: string[] = [],
    config: QueryConfig = {}
  ): Promise<{ documents: T[]; total: number; hasMore: boolean }> {
    const offset = (page - 1) * limit;
    const cacheKey = `paginated:${collectionId}:${page}:${limit}:${queries.join(',')}`;

    return this.cachedQuery(
      cacheKey,
      async () => {
        const response = await databases.listDocuments(
          '68de037e003bd03c4d45',
          collectionId,
          [
            ...queries,
            Query.limit(limit),
            Query.offset(offset),
          ] as any[]
        );

        return {
          documents: response.documents as T[],
          total: response.total,
          hasMore: offset + limit < response.total,
        };
      },
      config
    );
  }

  async prefetch<T>(
    key: string,
    queryFn: () => Promise<T>,
    config: QueryConfig = {}
  ): Promise<void> {
    this.cachedQuery(key, queryFn, config).catch(err => {
      console.warn('Prefetch failed:', err);
    });
  }

  invalidate(pattern?: string | RegExp): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keys = Array.from(this.cache.keys());
    
    if (typeof pattern === 'string') {
      keys.forEach(key => {
        if (key === pattern || key.startsWith(pattern)) {
          this.cache.delete(key);
        }
      });
    } else {
      keys.forEach(key => {
        if (pattern.test(key)) {
          this.cache.delete(key);
        }
      });
    }
  }

  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt + 60000) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private async refreshInBackground<T>(
    key: string,
    queryFn: () => Promise<T>,
    cacheDuration: number
  ): Promise<void> {
    try {
      const data = await queryFn();
      const now = Date.now();
      
      this.cache.set(key, {
        data,
        timestamp: now,
        expiresAt: now + cacheDuration,
      });
    } catch (error) {
      console.warn('Background refresh failed:', error);
    }
  }

  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    retries: number
  ): Promise<T> {
    let lastError: any;

    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (i < retries) {
          const delay = Math.min(1000 * Math.pow(2, i), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}

export const queryOptimizer = new QueryOptimizer();

setInterval(() => {
  queryOptimizer.cleanup();
}, 10 * 60 * 1000);

export function useCachedQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  config?: QueryConfig
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    queryOptimizer
      .cachedQuery(key, queryFn, config)
      .then(result => {
        if (mounted) {
          setData(result);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [key]);

  return { data, loading, error };
}
```

**الاستخدام:**

```typescript
import { queryOptimizer, useCachedQuery } from '@/lib/query-optimizer';

// في Component
function ProductList() {
  const { data, loading, error } = useCachedQuery(
    'products-list',
    async () => {
      const response = await databases.listDocuments('products');
      return response.documents;
    },
    { cacheDuration: 5 * 60 * 1000 }
  );

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>خطأ: {error.message}</div>;
  
  return <div>{/* عرض المنتجات */}</div>;
}
```

---

### 2️⃣ Advanced Rate Limiter

**الملف:** `client/lib/advanced-rate-limiter.ts`

```typescript
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDuration?: number;
}

class AdvancedRateLimiter {
  private limits = new Map<string, {
    requests: number[];
    blocked: boolean;
    blockUntil?: number;
  }>();
  
  check(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const record = this.limits.get(key) || { requests: [], blocked: false };
    
    if (record.blocked && record.blockUntil) {
      if (now < record.blockUntil) {
        return false;
      }
      record.blocked = false;
      record.blockUntil = undefined;
    }
    
    record.requests = record.requests.filter(
      time => now - time < config.windowMs
    );
    
    if (record.requests.length >= config.maxRequests) {
      if (config.blockDuration) {
        record.blocked = true;
        record.blockUntil = now + config.blockDuration;
      }
      return false;
    }
    
    record.requests.push(now);
    this.limits.set(key, record);
    return true;
  }
  
  reset(key: string): void {
    this.limits.delete(key);
  }
  
  getStatus(key: string) {
    const record = this.limits.get(key);
    if (!record) return { blocked: false, remaining: Infinity };
    
    return {
      blocked: record.blocked,
      remaining: record.blockUntil ? Math.max(0, record.blockUntil - Date.now()) : 0,
      requests: record.requests.length,
    };
  }
}

export const rateLimiter = new AdvancedRateLimiter();
```

**الاستخدام:**

```typescript
import { rateLimiter } from '@/lib/advanced-rate-limiter';

async function handleLogin(email: string, password: string) {
  if (!rateLimiter.check(email, {
    maxRequests: 5,
    windowMs: 60000,
    blockDuration: 300000
  })) {
    throw new Error('محاولات كثيرة جداً. حاول بعد 5 دقائق');
  }
  
  // تسجيل الدخول
}
```

---

_يتبع في الجزء التالي..._
