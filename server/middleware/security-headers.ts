/**
 * Security Headers Middleware
 * 
 * Adds security headers to all responses:
 * - XSS Protection
 * - Content Security Policy
 * - HSTS
 * - X-Frame-Options
 * - etc.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Security Headers Middleware
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy (formerly Feature Policy)
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self), payment=(self)'
  );

  // HSTS (HTTP Strict Transport Security) - Only in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://connect.facebook.net https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: http:",
    "connect-src 'self' https://cloud.appwrite.io https://www.google-analytics.com https://www.facebook.com",
    "frame-src 'self' https://www.google.com https://www.facebook.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests"
  ].join('; ');

  res.setHeader('Content-Security-Policy', csp);

  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');

  next();
}

/**
 * CORS Headers Middleware
 */
export function corsHeaders(req: Request, res: Response, next: NextFunction) {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://egygo.me',
    'https://www.egygo.me',
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );

  res.setHeader('Access-Control-Allow-Credentials', 'true');

  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
}

/**
 * Rate Limiting Headers
 */
export function rateLimitHeaders(
  limit: number,
  remaining: number,
  reset: number
) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-RateLimit-Limit', limit.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', reset.toString());
    next();
  };
}

/**
 * Cache Control Headers
 */
export function cacheControl(maxAge: number = 3600) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    } else {
      res.setHeader('Cache-Control', 'no-store');
    }
    next();
  };
}

/**
 * Security Headers for Static Files
 */
export function staticFileHeaders(req: Request, res: Response, next: NextFunction) {
  const ext = req.path.split('.').pop();

  // Set cache headers based on file type
  switch (ext) {
    case 'html':
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      break;
    case 'css':
    case 'js':
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      break;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webp':
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      break;
    case 'woff':
    case 'woff2':
    case 'ttf':
    case 'eot':
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Access-Control-Allow-Origin', '*');
      break;
    default:
      res.setHeader('Cache-Control', 'public, max-age=3600');
  }

  next();
}

/**
 * Sanitize User Input Middleware
 */
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key] as string);
      }
    }
  }

  // Sanitize body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  next();
}

/**
 * Sanitize String
 */
function sanitizeString(str: string): string {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Sanitize Object
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }

  return obj;
}

/**
 * Apply All Security Headers
 */
export function applySecurityHeaders(app: any) {
  // Security headers for all routes
  app.use(securityHeaders);

  // CORS headers
  app.use(corsHeaders);

  // Sanitize input
  app.use(sanitizeInput);

  // Static file headers
  app.use('/assets', staticFileHeaders);
  app.use('/images', staticFileHeaders);

  console.log('✅ Security headers applied');
}

export default {
  securityHeaders,
  corsHeaders,
  rateLimitHeaders,
  cacheControl,
  staticFileHeaders,
  sanitizeInput,
  applySecurityHeaders,
};
