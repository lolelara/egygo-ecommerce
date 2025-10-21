interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

class Analytics {
  private queue: AnalyticsEvent[] = [];
  private flushInterval = 5000;
  private timerId: NodeJS.Timeout | null = null;
  
  constructor() {
    // Only start timer if in browser and not already running
    if (typeof window !== 'undefined' && !this.timerId) {
      this.timerId = setInterval(() => this.flush(), this.flushInterval);
      
      // Clean up on page unload
      window.addEventListener('beforeunload', () => this.cleanup());
    }
  }
  
  private cleanup() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    // Flush any remaining events
    this.flush();
  }
  
  track(event: AnalyticsEvent) {
    this.queue.push({
      ...event,
      timestamp: Date.now(),
    } as any);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }
  }
  
  private async flush() {
    if (this.queue.length === 0) return;
    
    const events = [...this.queue];
    this.queue = [];
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log('📊 Analytics events:', events);
    }
    
    // Send to API only if available
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
      
      // Don't re-queue on 404 - the endpoint doesn't exist
      if (response.status === 404) {
        console.warn('Analytics endpoint not available');
        return;
      }
      
      if (!response.ok && response.status !== 404) {
        throw new Error(`Analytics failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // Don't re-queue events - this prevents infinite retries
      // Just log them for now
    }
  }
  
  trackPageView(page: string) {
    this.track({
      category: 'Page',
      action: 'view',
      label: page,
    });
  }
  
  trackProductView(productId: string, productName: string) {
    this.track({
      category: 'Product',
      action: 'view',
      label: `${productId}:${productName}`,
    });
  }
  
  trackAddToCart(productId: string, price: number) {
    this.track({
      category: 'Ecommerce',
      action: 'add_to_cart',
      label: productId,
      value: price,
    });
  }
  
  trackPurchase(orderId: string, total: number) {
    this.track({
      category: 'Ecommerce',
      action: 'purchase',
      label: orderId,
      value: total,
    });
  }
  
  trackSearch(query: string, resultsCount: number) {
    this.track({
      category: 'Search',
      action: 'search',
      label: query,
      value: resultsCount,
    });
  }
  
  trackClick(element: string, location: string) {
    this.track({
      category: 'Interaction',
      action: 'click',
      label: `${element}:${location}`,
    });
  }
}

// Create a singleton instance lazily
let analyticsInstance: Analytics | null = null;

// Export a wrapper that creates the instance only when needed
export const analytics = {
  trackPageView(page: string) {
    if (!analyticsInstance) {
      analyticsInstance = new Analytics();
    }
    analyticsInstance.trackPageView(page);
  },
  
  trackProductView(productId: string, productName: string) {
    if (!analyticsInstance) {
      analyticsInstance = new Analytics();
    }
    analyticsInstance.trackProductView(productId, productName);
  },
  
  trackAddToCart(productId: string, price: number) {
    if (!analyticsInstance) {
      analyticsInstance = new Analytics();
    }
    analyticsInstance.trackAddToCart(productId, price);
  },
  
  trackPurchase(orderId: string, total: number) {
    if (!analyticsInstance) {
      analyticsInstance = new Analytics();
    }
    analyticsInstance.trackPurchase(orderId, total);
  },
  
  trackSearch(query: string, resultsCount: number) {
    if (!analyticsInstance) {
      analyticsInstance = new Analytics();
    }
    analyticsInstance.trackSearch(query, resultsCount);
  },
  
  trackClick(element: string, location: string) {
    if (!analyticsInstance) {
      analyticsInstance = new Analytics();
    }
    analyticsInstance.trackClick(element, location);
  }
};
