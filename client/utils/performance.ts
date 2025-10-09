/**
 * 🚀 Performance Optimization Utilities
 */

import { lazy, Suspense, ComponentType } from 'react';

// ========================================
// 1. CODE SPLITTING & LAZY LOADING
// ========================================

/**
 * Lazy load component with retry logic
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      // Retry once after 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      return importFn();
    }
  });
}

/**
 * Preload component for faster navigation
 */
export function preloadComponent(
  importFn: () => Promise<any>
): void {
  importFn();
}

// ========================================
// 2. IMAGE OPTIMIZATION
// ========================================

/**
 * Generate optimized image URLs with different formats
 */
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg';
  } = {}
): string {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // If using a CDN like Cloudinary
  const baseUrl = url.replace(/\.(jpg|jpeg|png)$/i, '');
  const params = [];
  
  if (width) params.push(`w_${width}`);
  if (height) params.push(`h_${height}`);
  params.push(`q_${quality}`);
  params.push(`f_${format}`);
  
  return `${baseUrl}/${params.join(',')}.${format}`;
}

/**
 * Progressive image loading
 */
export class ProgressiveImage {
  private placeholder: string;
  private src: string;
  private observer: IntersectionObserver | null = null;

  constructor(placeholder: string, src: string) {
    this.placeholder = placeholder;
    this.src = src;
  }

  load(element: HTMLImageElement): void {
    // Start with placeholder
    element.src = this.placeholder;
    element.classList.add('loading');

    // Set up intersection observer for lazy loading
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadFullImage(element);
            this.observer?.unobserve(element);
          }
        });
      },
      { rootMargin: '50px' }
    );

    this.observer.observe(element);
  }

  private loadFullImage(element: HTMLImageElement): void {
    const img = new Image();
    img.src = this.src;
    img.onload = () => {
      element.src = this.src;
      element.classList.remove('loading');
      element.classList.add('loaded');
    };
  }

  cleanup(): void {
    this.observer?.disconnect();
  }
}

// ========================================
// 3. CACHING STRATEGIES
// ========================================

/**
 * Memory cache with TTL
 */
export class MemoryCache<T> {
  private cache = new Map<string, { data: T; expiry: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expiry });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Browser cache utilities
 */
export const BrowserCache = {
  // Save to localStorage with expiry
  set(key: string, data: any, expiryMinutes: number = 60): void {
    const item = {
      data,
      expiry: Date.now() + expiryMinutes * 60 * 1000
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  // Get from localStorage with expiry check
  get<T>(key: string): T | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    
    try {
      const item = JSON.parse(itemStr);
      if (Date.now() > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      return item.data;
    } catch {
      return null;
    }
  },

  // Clear specific or all cache
  clear(key?: string): void {
    if (key) {
      localStorage.removeItem(key);
    } else {
      localStorage.clear();
    }
  }
};

// ========================================
// 4. DEBOUNCE & THROTTLE
// ========================================

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ========================================
// 5. VIRTUAL SCROLLING
// ========================================

/**
 * Virtual list for rendering large lists efficiently
 */
export class VirtualList<T> {
  private items: T[];
  private itemHeight: number;
  private containerHeight: number;
  private scrollTop: number = 0;
  private visibleStart: number = 0;
  private visibleEnd: number = 0;

  constructor(items: T[], itemHeight: number, containerHeight: number) {
    this.items = items;
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
    this.calculateVisible();
  }

  private calculateVisible(): void {
    this.visibleStart = Math.floor(this.scrollTop / this.itemHeight);
    this.visibleEnd = Math.ceil(
      (this.scrollTop + this.containerHeight) / this.itemHeight
    );
  }

  onScroll(scrollTop: number): void {
    this.scrollTop = scrollTop;
    this.calculateVisible();
  }

  getVisibleItems(): { item: T; top: number }[] {
    return this.items
      .slice(this.visibleStart, this.visibleEnd)
      .map((item, index) => ({
        item,
        top: (this.visibleStart + index) * this.itemHeight
      }));
  }

  getTotalHeight(): number {
    return this.items.length * this.itemHeight;
  }
}

// ========================================
// 6. WEB WORKERS
// ========================================

/**
 * Run heavy computations in a Web Worker
 */
export function runInWorker<T, R>(
  fn: (data: T) => R,
  data: T
): Promise<R> {
  return new Promise((resolve, reject) => {
    const blob = new Blob(
      [`self.onmessage = function(e) { 
        self.postMessage((${fn.toString()})(e.data)); 
      }`],
      { type: 'application/javascript' }
    );
    
    const worker = new Worker(URL.createObjectURL(blob));
    
    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
    };
    
    worker.onerror = reject;
    worker.postMessage(data);
  });
}

// ========================================
// 7. REQUEST OPTIMIZATION
// ========================================

/**
 * Batch API requests
 */
export class RequestBatcher<T, R> {
  private queue: Array<{ data: T; resolve: (value: R) => void }> = [];
  private timeout: NodeJS.Timeout | null = null;
  private batchSize: number;
  private delay: number;
  private processBatch: (items: T[]) => Promise<R[]>;

  constructor(
    processBatch: (items: T[]) => Promise<R[]>,
    batchSize: number = 10,
    delay: number = 100
  ) {
    this.processBatch = processBatch;
    this.batchSize = batchSize;
    this.delay = delay;
  }

  add(data: T): Promise<R> {
    return new Promise((resolve) => {
      this.queue.push({ data, resolve });
      
      if (this.queue.length >= this.batchSize) {
        this.flush();
      } else {
        this.scheduleFlush();
      }
    });
  }

  private scheduleFlush(): void {
    if (this.timeout) return;
    
    this.timeout = setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  private async flush(): Promise<void> {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    
    if (this.queue.length === 0) return;
    
    const batch = this.queue.splice(0, this.batchSize);
    const results = await this.processBatch(batch.map(item => item.data));
    
    batch.forEach((item, index) => {
      item.resolve(results[index]);
    });
    
    if (this.queue.length > 0) {
      this.scheduleFlush();
    }
  }
}

// ========================================
// 8. PERFORMANCE MONITORING
// ========================================

/**
 * Performance metrics collector
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  measure(name: string, fn: () => void): void {
    const start = performance.now();
    fn();
    const end = performance.now();
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(end - start);
  }

  async measureAsync(name: string, fn: () => Promise<void>): Promise<void> {
    const start = performance.now();
    await fn();
    const end = performance.now();
    
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(end - start);
  }

  getMetrics(name: string): {
    average: number;
    min: number;
    max: number;
    count: number;
  } | null {
    const times = this.metrics.get(name);
    if (!times || times.length === 0) return null;
    
    return {
      average: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      count: times.length
    };
  }

  logMetrics(): void {
    console.group('⚡ Performance Metrics');
    this.metrics.forEach((times, name) => {
      const metrics = this.getMetrics(name);
      if (metrics) {
        console.log(`${name}:`, {
          avg: `${metrics.average.toFixed(2)}ms`,
          min: `${metrics.min.toFixed(2)}ms`,
          max: `${metrics.max.toFixed(2)}ms`,
          count: metrics.count
        });
      }
    });
    console.groupEnd();
  }

  clear(): void {
    this.metrics.clear();
  }
}

// ========================================
// 9. RESOURCE HINTS
// ========================================

/**
 * Add resource hints for faster loading
 */
export const ResourceHints = {
  // Preconnect to external domains
  preconnect(url: string): void {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
  },

  // DNS prefetch for external domains
  dnsPrefetch(url: string): void {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    document.head.appendChild(link);
  },

  // Preload critical resources
  preload(url: string, as: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  },

  // Prefetch resources for future navigation
  prefetch(url: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }
};

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
export const memoryCache = new MemoryCache();
