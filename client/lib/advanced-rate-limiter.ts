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
