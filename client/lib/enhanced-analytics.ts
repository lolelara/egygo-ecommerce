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
  
  constructor() {
    setInterval(() => this.flush(), this.flushInterval);
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
    
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
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

export const analytics = new Analytics();
