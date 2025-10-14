// Performance optimization utilities
import { preloadImage, preloadImages } from './cdn';

// Resource preloading
export class ResourcePreloader {
  private static preloadedResources = new Set<string>();
  private static preloadQueue: string[] = [];
  private static isPreloading = false;

  // Preload critical CSS
  static preloadCSS(href: string): void {
    if (this.preloadedResources.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
    this.preloadedResources.add(href);
  }

  // Preload critical JavaScript
  static preloadJS(src: string): void {
    if (this.preloadedResources.has(src)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = src;
    document.head.appendChild(link);
    this.preloadedResources.add(src);
  }

  // Preload fonts
  static preloadFont(href: string, type: string = 'font/woff2'): void {
    if (this.preloadedResources.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = type;
    link.href = href;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    this.preloadedResources.add(href);
  }

  // Preload API data
  static async preloadAPI(url: string): Promise<any> {
    if (this.preloadedResources.has(url)) return null;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        this.preloadedResources.add(url);
        return data;
      }
    } catch (error) {
      console.warn('Failed to preload API data:', error);
    }
    
    return null;
  }

  // Batch preload images
  static async preloadImages(images: string[]): Promise<void> {
    const newImages = images.filter(img => !this.preloadedResources.has(img));
    if (newImages.length === 0) return;
    
    await preloadImages(newImages, 'low');
    newImages.forEach(img => this.preloadedResources.add(img));
  }

  // Queue resources for preloading
  static queuePreload(resources: string[]): void {
    this.preloadQueue.push(...resources);
    this.processQueue();
  }

  // Process preload queue
  private static async processQueue(): Promise<void> {
    if (this.isPreloading || this.preloadQueue.length === 0) return;
    
    this.isPreloading = true;
    
    while (this.preloadQueue.length > 0) {
      const resource = this.preloadQueue.shift()!;
      
      if (resource.endsWith('.css')) {
        this.preloadCSS(resource);
      } else if (resource.endsWith('.js')) {
        this.preloadJS(resource);
      } else if (resource.match(/\.(woff2?|ttf|otf)$/)) {
        this.preloadFont(resource);
      } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
        await preloadImage(resource, 'low');
        this.preloadedResources.add(resource);
      }
      
      // Small delay to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    this.isPreloading = false;
  }
}

// Code splitting utilities
export class CodeSplitter {
  private static loadedChunks = new Set<string>();
  private static loadingChunks = new Map<string, Promise<any>>();

  // Dynamic import with caching
  static async loadChunk<T = any>(
    chunkName: string,
    importFn: () => Promise<T>
  ): Promise<T> {
    if (this.loadedChunks.has(chunkName)) {
      return importFn();
    }

    if (this.loadingChunks.has(chunkName)) {
      return this.loadingChunks.get(chunkName)!;
    }

    const promise = importFn().then(module => {
      this.loadedChunks.add(chunkName);
      this.loadingChunks.delete(chunkName);
      return module;
    });

    this.loadingChunks.set(chunkName, promise);
    return promise;
  }

  // Preload chunk
  static preloadChunk(chunkName: string, importFn: () => Promise<any>): void {
    if (this.loadedChunks.has(chunkName) || this.loadingChunks.has(chunkName)) {
      return;
    }

    this.loadChunk(chunkName, importFn);
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Record<string, number> = {};
  private static observers: PerformanceObserver[] = [];

  // Start timing
  static startTiming(name: string): void {
    this.metrics[name] = performance.now();
  }

  // End timing
  static endTiming(name: string): number {
    const startTime = this.metrics[name];
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    delete this.metrics[name];
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow operation: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  // Measure function execution
  static async measureAsync<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    this.startTiming(name);
    try {
      const result = await fn();
      this.endTiming(name);
      return result;
    } catch (error) {
      this.endTiming(name);
      throw error;
    }
  }

  // Measure sync function execution
  static measure<T>(name: string, fn: () => T): T {
    this.startTiming(name);
    try {
      const result = fn();
      this.endTiming(name);
      return result;
    } catch (error) {
      this.endTiming(name);
      throw error;
    }
  }

  // Monitor Core Web Vitals
  static initWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(lcpObserver);

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    this.observers.push(fidObserver);

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(clsObserver);
  }

  // Cleanup observers
  static cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Critical resource hints
export class ResourceHints {
  // Add DNS prefetch
  static dnsPrefetch(domain: string): void {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${domain}`;
    document.head.appendChild(link);
  }

  // Add preconnect
  static preconnect(url: string): void {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
  }

  // Add prefetch
  static prefetch(url: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }

  // Add modulepreload
  static modulePreload(url: string): void {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = url;
    document.head.appendChild(link);
  }
}

// Bundle analyzer
export class BundleAnalyzer {
  private static chunks: Record<string, number> = {};

  // Track chunk size
  static trackChunk(name: string, size: number): void {
    this.chunks[name] = size;
  }

  // Get bundle stats
  static getStats(): {
    totalSize: number;
    chunkCount: number;
    largestChunk: { name: string; size: number };
    chunks: Record<string, number>;
  } {
    const totalSize = Object.values(this.chunks).reduce((sum, size) => sum + size, 0);
    const chunkCount = Object.keys(this.chunks).length;
    const largestChunk = Object.entries(this.chunks).reduce(
      (largest, [name, size]) => size > largest.size ? { name, size } : largest,
      { name: '', size: 0 }
    );

    return {
      totalSize,
      chunkCount,
      largestChunk,
      chunks: { ...this.chunks }
    };
  }

  // Log bundle analysis
  static logAnalysis(): void {
    const stats = this.getStats();
    console.group('Bundle Analysis');
    console.log(`Total Size: ${(stats.totalSize / 1024).toFixed(2)} KB`);
    console.log(`Chunk Count: ${stats.chunkCount}`);
    console.log(`Largest Chunk: ${stats.largestChunk.name} (${(stats.largestChunk.size / 1024).toFixed(2)} KB)`);
    console.table(stats.chunks);
    console.groupEnd();
  }
}

// Service Worker utilities
export class ServiceWorkerManager {
  private static swRegistration: ServiceWorkerRegistration | null = null;

  // Register service worker
  static async register(swPath: string = '/sw.js'): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return null;
    }

    try {
      this.swRegistration = await navigator.serviceWorker.register(swPath);
      console.log('Service Worker registered:', this.swRegistration);
      return this.swRegistration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  // Update service worker
  static async update(): Promise<void> {
    if (!this.swRegistration) return;

    try {
      await this.swRegistration.update();
      console.log('Service Worker updated');
    } catch (error) {
      console.error('Service Worker update failed:', error);
    }
  }

  // Unregister service worker
  static async unregister(): Promise<void> {
    if (!this.swRegistration) return;

    try {
      await this.swRegistration.unregister();
      console.log('Service Worker unregistered');
    } catch (error) {
      console.error('Service Worker unregistration failed:', error);
    }
  }
}

// Initialize performance optimizations
export function initPerformanceOptimizations(): void {
  // Initialize Web Vitals monitoring
  PerformanceMonitor.initWebVitals();

  // Add critical resource hints
  ResourceHints.dnsPrefetch('fonts.googleapis.com');
  ResourceHints.dnsPrefetch('cdn.egygo.com');
  ResourceHints.preconnect('https://api.egygo.com');

  // Preload critical resources
  ResourcePreloader.preloadCSS('/fonts/inter.css');
  ResourcePreloader.preloadFont('/fonts/inter-var.woff2');

  // Register service worker
  ServiceWorkerManager.register();

  // Log performance metrics on page unload
  window.addEventListener('beforeunload', () => {
    PerformanceMonitor.cleanup();
    BundleAnalyzer.logAnalysis();
  });
}






