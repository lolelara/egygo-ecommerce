/**
 * Proxy Manager for Web Scraping
 * Manages multiple CORS proxies with fallback
 */

export interface ProxyConfig {
  url: string;
  name: string;
  active: boolean;
  rateLimit?: number; // requests per minute
  lastUsed?: number;
}

export class ProxyManager {
  private proxies: ProxyConfig[] = [
    {
      url: 'https://api.allorigins.win/get?url=',
      name: 'AllOrigins',
      active: true,
      rateLimit: 60
    },
    {
      url: 'https://corsproxy.io/?',
      name: 'CORSProxy.io',
      active: true,
      rateLimit: 100
    },
    {
      url: 'https://api.codetabs.com/v1/proxy?quest=',
      name: 'CodeTabs',
      active: true,
      rateLimit: 60
    },
    {
      url: 'https://cors-anywhere.herokuapp.com/',
      name: 'CORS Anywhere',
      active: false, // Requires request access
      rateLimit: 50
    }
  ];

  private failedProxies: Set<string> = new Set();
  private requestCounts: Map<string, number[]> = new Map();

  /**
   * Get the best available proxy
   */
  getBestProxy(): ProxyConfig | null {
    const availableProxies = this.proxies.filter(p => 
      p.active && !this.failedProxies.has(p.name) && this.canUseProxy(p)
    );

    if (availableProxies.length === 0) {
      // Reset failed proxies if all are failed
      if (this.failedProxies.size > 0) {
        console.log('⚠️  All proxies failed, resetting...');
        this.failedProxies.clear();
        return this.getBestProxy();
      }
      return null;
    }

    // Return least recently used proxy
    return availableProxies.sort((a, b) => 
      (a.lastUsed || 0) - (b.lastUsed || 0)
    )[0];
  }

  /**
   * Check if proxy can be used (rate limit)
   */
  private canUseProxy(proxy: ProxyConfig): boolean {
    if (!proxy.rateLimit) return true;

    const now = Date.now();
    const requests = this.requestCounts.get(proxy.name) || [];
    
    // Remove requests older than 1 minute
    const recentRequests = requests.filter(time => now - time < 60000);
    this.requestCounts.set(proxy.name, recentRequests);

    return recentRequests.length < proxy.rateLimit;
  }

  /**
   * Record proxy usage
   */
  recordUsage(proxyName: string) {
    const proxy = this.proxies.find(p => p.name === proxyName);
    if (proxy) {
      proxy.lastUsed = Date.now();
      
      const requests = this.requestCounts.get(proxyName) || [];
      requests.push(Date.now());
      this.requestCounts.set(proxyName, requests);
    }
  }

  /**
   * Mark proxy as failed
   */
  markFailed(proxyName: string) {
    console.log(`❌ Marking proxy as failed: ${proxyName}`);
    this.failedProxies.add(proxyName);
    
    // Auto-reset after 5 minutes
    setTimeout(() => {
      this.failedProxies.delete(proxyName);
      console.log(`✅ Proxy reset: ${proxyName}`);
    }, 5 * 60 * 1000);
  }

  /**
   * Fetch URL through proxy with automatic fallback
   */
  async fetchThroughProxy(url: string): Promise<string> {
    let lastError: Error | null = null;

    // Try each proxy
    for (let i = 0; i < this.proxies.length; i++) {
      const proxy = this.getBestProxy();
      if (!proxy) {
        throw new Error('No available proxies');
      }

      try {
        console.log(`🔄 Trying proxy: ${proxy.name}`);
        const proxyUrl = proxy.url + encodeURIComponent(url);
        
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json, text/html',
          },
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        this.recordUsage(proxy.name);

        // Handle different response formats
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          // AllOrigins format
          if (data.contents) return data.contents;
          // Other formats
          if (data.data) return data.data;
          return JSON.stringify(data);
        } else {
          return await response.text();
        }
      } catch (error) {
        console.error(`❌ Proxy ${proxy.name} failed:`, error);
        this.markFailed(proxy.name);
        lastError = error as Error;
        continue;
      }
    }

    throw new Error(`All proxies failed. Last error: ${lastError?.message}`);
  }

  /**
   * Add custom proxy
   */
  addProxy(config: ProxyConfig) {
    this.proxies.push(config);
  }

  /**
   * Remove proxy
   */
  removeProxy(name: string) {
    this.proxies = this.proxies.filter(p => p.name !== name);
  }

  /**
   * Get proxy statistics
   */
  getStats() {
    return {
      total: this.proxies.length,
      active: this.proxies.filter(p => p.active).length,
      failed: this.failedProxies.size,
      proxies: this.proxies.map(p => ({
        name: p.name,
        active: p.active,
        failed: this.failedProxies.has(p.name),
        requests: (this.requestCounts.get(p.name) || []).length,
        lastUsed: p.lastUsed
      }))
    };
  }

  /**
   * Reset all failed proxies
   */
  resetFailed() {
    this.failedProxies.clear();
    console.log('✅ All failed proxies reset');
  }
}

/**
 * Singleton instance
 */
export const proxyManager = new ProxyManager();
