import { Request, Response, NextFunction } from 'express';
import { loggers } from './logger';

// In-memory store for rate limiting (in production, use Redis)
interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  // Login attempts
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    blockDurationMs: 30 * 60 * 1000, // 30 minutes block
  },
  // General API requests
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 100,
    blockDurationMs: 60 * 60 * 1000, // 1 hour block
  },
  // Password reset requests
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3,
    blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours block
  },
  // Registration attempts
  registration: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3,
    blockDurationMs: 24 * 60 * 60 * 1000, // 24 hours block
  }
};

// Generate a key for rate limiting based on IP and optional identifier
function generateKey(ip: string, identifier?: string): string {
  return identifier ? `${ip}:${identifier}` : ip;
}

// Clean up expired entries
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now && (!entry.blockUntil || entry.blockUntil < now)) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

// Rate limiting middleware factory
export function createRateLimit(type: keyof typeof RATE_LIMIT_CONFIG) {
  return (req: Request, res: Response, next: NextFunction) => {
    const config = RATE_LIMIT_CONFIG[type];
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const identifier = req.body?.email || req.body?.username; // For login/registration
    const key = generateKey(ip, identifier);
    
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    // Check if currently blocked
    if (entry?.blocked && entry.blockUntil && entry.blockUntil > now) {
      const remainingTime = Math.ceil((entry.blockUntil - now) / 1000 / 60);
      
      loggers.security('Rate limit block active', {
        ip,
        identifier,
        type,
        remainingMinutes: remainingTime,
        userAgent: req.get('User-Agent')
      });

      return res.status(429).json({
        error: 'Too many requests',
        message: `تم حظر هذا العنوان مؤقتاً. حاول مرة أخرى بعد ${remainingTime} دقيقة.`,
        retryAfter: remainingTime * 60
      });
    }

    // Initialize or reset entry
    if (!entry || entry.resetTime < now) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
        blocked: false
      });
      
      loggers.security('Rate limit entry created', {
        ip,
        identifier,
        type,
        windowMs: config.windowMs
      });
      
      return next();
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    if (entry.count > config.maxAttempts) {
      entry.blocked = true;
      entry.blockUntil = now + config.blockDurationMs;

      loggers.security('Rate limit exceeded - blocking', {
        ip,
        identifier,
        type,
        attempts: entry.count,
        maxAttempts: config.maxAttempts,
        blockDurationMs: config.blockDurationMs,
        userAgent: req.get('User-Agent')
      });

      return res.status(429).json({
        error: 'Too many requests',
        message: `تم تجاوز الحد المسموح من المحاولات. تم حظر هذا العنوان لمدة ${Math.ceil(config.blockDurationMs / 1000 / 60)} دقيقة.`,
        retryAfter: config.blockDurationMs / 1000
      });
    }

    // Log warning when approaching limit
    if (entry.count >= config.maxAttempts * 0.8) {
      loggers.security('Rate limit warning - approaching limit', {
        ip,
        identifier,
        type,
        attempts: entry.count,
        maxAttempts: config.maxAttempts,
        userAgent: req.get('User-Agent')
      });
    }

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': config.maxAttempts.toString(),
      'X-RateLimit-Remaining': Math.max(0, config.maxAttempts - entry.count).toString(),
      'X-RateLimit-Reset': new Date(entry.resetTime).toISOString()
    });

    next();
  };
}

// Specific rate limiters
export const loginRateLimit = createRateLimit('login');
export const apiRateLimit = createRateLimit('api');
export const passwordResetRateLimit = createRateLimit('passwordReset');
export const registrationRateLimit = createRateLimit('registration');

// Advanced brute force protection with progressive delays
export function progressiveBruteForceProtection(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const identifier = req.body?.email || req.body?.username;
  const key = generateKey(ip, identifier);
  
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry) {
    return next();
  }

  // Progressive delay based on failed attempts
  const delayMs = Math.min(entry.count * 1000, 30000); // Max 30 seconds delay
  
  if (delayMs > 0) {
    loggers.security('Progressive delay applied', {
      ip,
      identifier,
      attempts: entry.count,
      delayMs,
      userAgent: req.get('User-Agent')
    });

    setTimeout(() => {
      next();
    }, delayMs);
  } else {
    next();
  }
}

// IP reputation tracking
const suspiciousIPs = new Map<string, {
  violations: number;
  lastViolation: number;
  permanentlyBlocked: boolean;
}>();

export function ipReputationCheck(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const reputation = suspiciousIPs.get(ip);

  // Check if IP is permanently blocked
  if (reputation?.permanentlyBlocked) {
    loggers.security('Blocked IP attempted access', {
      ip,
      userAgent: req.get('User-Agent'),
      violations: reputation.violations
    });

    return res.status(403).json({
      error: 'Access denied',
      message: 'تم حظر هذا العنوان نهائياً بسبب انتهاكات متعددة.'
    });
  }

  // Check if IP has too many violations
  if (reputation && reputation.violations >= 10) {
    reputation.permanentlyBlocked = true;
    
    loggers.security('IP permanently blocked', {
      ip,
      violations: reputation.violations,
      userAgent: req.get('User-Agent')
    });

    return res.status(403).json({
      error: 'Access denied',
      message: 'تم حظر هذا العنوان نهائياً بسبب انتهاكات متعددة.'
    });
  }

  next();
}

// Track violations
export function trackViolation(ip: string, violationType: string, details?: any) {
  const reputation = suspiciousIPs.get(ip) || {
    violations: 0,
    lastViolation: 0,
    permanentlyBlocked: false
  };

  reputation.violations++;
  reputation.lastViolation = Date.now();

  suspiciousIPs.set(ip, reputation);

  loggers.security('Security violation tracked', {
    ip,
    violationType,
    violations: reputation.violations,
    details
  });
}

// Clean up old reputation data
setInterval(() => {
  const now = Date.now();
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days

  for (const [ip, reputation] of suspiciousIPs.entries()) {
    if (now - reputation.lastViolation > maxAge && !reputation.permanentlyBlocked) {
      suspiciousIPs.delete(ip);
    }
  }
}, 24 * 60 * 60 * 1000); // Run daily

// Export rate limit store for monitoring
export { rateLimitStore, suspiciousIPs };
