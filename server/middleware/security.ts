/**
 * 🛡️ Security Middleware for EgyGo
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { createHash } from 'crypto';

// Extend Express Request type to include session and rateLimit
declare module 'express' {
  interface Request {
    session?: {
      csrfToken?: string;
      [key: string]: any;
    };
    rateLimit?: {
      limit: number;
      current: number;
      remaining: number;
      resetTime: Date;
    };
  }
}

// ========================================
// 1. SECURITY HEADERS
// ========================================

/**
 * Configure Helmet for security headers
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://cdn.jsdelivr.net",
        "https://apis.google.com",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:",
        "http://localhost:*"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net"
      ],
      connectSrc: [
        "'self'",
        "https://fra.cloud.appwrite.io",
        "https://api.openai.com",
        "wss://",
        "ws://localhost:*"
      ],
      mediaSrc: ["'self'", "https:", "blob:"],
      objectSrc: ["'none'"],
      childSrc: ["'self'", "blob:"],
      workerSrc: ["'self'", "blob:"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: true },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
});

/**
 * Additional security headers
 */
export const additionalHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Permissions Policy (formerly Feature Policy)
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );
  
  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Cache-Control for security
  if (req.url.includes('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  
  next();
};

// ========================================
// 2. RATE LIMITING
// ========================================

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: req.rateLimit?.resetTime
    });
  }
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Rate limiter for password reset
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: 'Too many password reset requests, please try again later.'
});

/**
 * Rate limiter for file uploads
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  message: 'Upload limit exceeded, please try again later.'
});

// ========================================
// 3. CORS CONFIGURATION
// ========================================

/**
 * CORS configuration
 */
export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://egygo.me',
      'https://www.egygo.me',
      'https://egygo-ecommerce.appwrite.network'
    ];
    
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-API-Key'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24 hours
};

// ========================================
// 4. CSRF PROTECTION
// ========================================

/**
 * Generate CSRF token
 */
export const generateCSRFToken = (): string => {
  return createHash('sha256')
    .update(Math.random().toString())
    .digest('hex');
};

/**
 * CSRF middleware
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return next();
  }
  
  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = (req.session as any)?.csrfToken;
  
  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({
      error: 'CSRF token validation failed'
    });
  }
  
  next();
};

// ========================================
// 5. INPUT VALIDATION & SANITIZATION
// ========================================

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate and sanitize request body
 */
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  // Recursively sanitize all string values in the request body
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeInput(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };
  
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  next();
};

// ========================================
// 6. SQL INJECTION PREVENTION
// ========================================

/**
 * Check for SQL injection patterns
 */
export const checkSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/gi,
    /(--|\||;|\/\*|\*\/)/g,
    /(\bOR\b\s*\d+\s*=\s*\d+)/gi,
    /(\bAND\b\s*\d+\s*=\s*\d+)/gi,
    /(\'|\"|`)/g
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * SQL injection prevention middleware
 */
export const preventSQLInjection = (req: Request, res: Response, next: NextFunction) => {
  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return checkSQLInjection(value);
    }
    if (Array.isArray(value)) {
      return value.some(checkValue);
    }
    if (value && typeof value === 'object') {
      return Object.values(value).some(checkValue);
    }
    return false;
  };
  
  // Check query parameters
  if (req.query && checkValue(req.query)) {
    return res.status(400).json({
      error: 'Invalid input detected'
    });
  }
  
  // Check body
  if (req.body && checkValue(req.body)) {
    return res.status(400).json({
      error: 'Invalid input detected'
    });
  }
  
  // Check params
  if (req.params && checkValue(req.params)) {
    return res.status(400).json({
      error: 'Invalid input detected'
    });
  }
  
  next();
};

// ========================================
// 7. API KEY VALIDATION
// ========================================

/**
 * API key validation middleware
 */
export const validateAPIKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key is required'
    });
  }
  
  // In production, validate against database or environment variable
  const validAPIKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (!validAPIKeys.includes(apiKey)) {
    return res.status(401).json({
      error: 'Invalid API key'
    });
  }
  
  next();
};

// ========================================
// 8. REQUEST SIZE LIMITING
// ========================================

/**
 * Limit request body size
 */
export const bodySizeLimit = {
  json: '10mb',
  urlencoded: { extended: true, limit: '10mb' },
  raw: '10mb'
};

// ========================================
// 9. IP BLOCKING
// ========================================

/**
 * IP blocking middleware
 */
const blockedIPs = new Set<string>();

export const blockIP = (ip: string): void => {
  blockedIPs.add(ip);
};

export const unblockIP = (ip: string): void => {
  blockedIPs.delete(ip);
};

export const ipBlocker = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || req.socket.remoteAddress || '';
  
  if (blockedIPs.has(clientIP)) {
    return res.status(403).json({
      error: 'Access denied'
    });
  }
  
  next();
};

// ========================================
// 10. SECURITY MONITORING
// ========================================

/**
 * Log security events
 */
export const logSecurityEvent = (
  event: string,
  details: any,
  req: Request
): void => {
  const log = {
    timestamp: new Date().toISOString(),
    event,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
    method: req.method,
    path: req.path,
    details
  };
  
  // In production, send to logging service
  console.log('[SECURITY]', JSON.stringify(log));
};

/**
 * Security monitoring middleware
 */
export const securityMonitor = (req: Request, res: Response, next: NextFunction) => {
  // Monitor suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//g, // Directory traversal
    /<script/gi, // XSS attempts
    /eval\(/gi, // Code injection
    /exec\(/gi // Command injection
  ];
  
  const url = req.url + JSON.stringify(req.body || {});
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) {
      logSecurityEvent('Suspicious Request', {
        pattern: pattern.toString(),
        url: req.url,
        body: req.body
      }, req);
      
      return res.status(400).json({
        error: 'Invalid request'
      });
    }
  }
  
  next();
};

// ========================================
// EXPORT ALL MIDDLEWARE
// ========================================

export const setupSecurity = (app: any): void => {
  // Apply security middleware in order
  app.use(ipBlocker);
  app.use(securityHeaders);
  app.use(additionalHeaders);
  app.use(cors(corsOptions));
  app.use(securityMonitor);
  app.use(validateInput);
  app.use(preventSQLInjection);
  
  // Apply rate limiting to specific routes
  app.use('/api/', apiLimiter);
  app.use('/api/auth/', authLimiter);
  app.use('/api/password-reset/', passwordResetLimiter);
  app.use('/api/upload/', uploadLimiter);
  
  console.log('✅ Security middleware configured');
};
