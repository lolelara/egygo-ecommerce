/**
 * Advanced Security Utilities for EgyGo
 * Handles XSS prevention, CSRF protection, input sanitization, and rate limiting
 */

// XSS Prevention
export class XSSProtection {
  /**
   * Sanitize HTML string to prevent XSS attacks
   */
  static sanitizeHTML(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * Escape HTML entities
   */
  static escapeHTML(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return text.replace(/[&<>"'/]/g, (char) => map[char]);
  }

  /**
   * Strip HTML tags from string
   */
  static stripHTML(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  /**
   * Sanitize URL to prevent javascript: and data: URIs
   */
  static sanitizeURL(url: string): string {
    const urlLower = url.toLowerCase().trim();
    
    // Block dangerous protocols
    if (
      urlLower.startsWith('javascript:') ||
      urlLower.startsWith('data:') ||
      urlLower.startsWith('vbscript:')
    ) {
      return '';
    }
    
    return url;
  }
}

// Input Validation
export class InputValidator {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number (Egyptian format)
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('يجب أن تحتوي على رقم واحد على الأقل');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('يجب أن تحتوي على رمز خاص واحد على الأقل');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    return XSSProtection.escapeHTML(input.trim());
  }

  /**
   * Validate price
   */
  static isValidPrice(price: number): boolean {
    return price > 0 && price < 1000000 && Number.isFinite(price);
  }

  /**
   * Validate quantity
   */
  static isValidQuantity(quantity: number): boolean {
    return Number.isInteger(quantity) && quantity > 0 && quantity < 10000;
  }
}

// CSRF Protection
export class CSRFProtection {
  private static token: string | null = null;

  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    this.token = token;
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  /**
   * Get current CSRF token
   */
  static getToken(): string {
    if (!this.token) {
      this.token = sessionStorage.getItem('csrf_token');
      if (!this.token) {
        this.token = this.generateToken();
      }
    }
    return this.token;
  }

  /**
   * Validate CSRF token
   */
  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return token === storedToken;
  }

  /**
   * Add CSRF token to request headers
   */
  static addTokenToHeaders(headers: HeadersInit = {}): HeadersInit {
    return {
      ...headers,
      'X-CSRF-Token': this.getToken()
    };
  }
}

// Rate Limiting (Client-side)
export class RateLimiter {
  private static requests: Map<string, number[]> = new Map();

  /**
   * Check if request is allowed
   */
  static isAllowed(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the time window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }

  /**
   * Get remaining requests
   */
  static getRemaining(key: string, maxRequests: number, windowMs: number): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < windowMs);
    return Math.max(0, maxRequests - validRequests.length);
  }

  /**
   * Reset rate limit for a key
   */
  static reset(key: string): void {
    this.requests.delete(key);
  }
}

// Secure Storage
export class SecureStorage {
  /**
   * Encrypt data before storing
   */
  private static encrypt(data: string, key: string): string {
    // Simple XOR encryption (for demonstration, use proper encryption in production)
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      encrypted += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(encrypted);
  }

  /**
   * Decrypt data after retrieving
   */
  private static decrypt(encrypted: string, key: string): string {
    const data = atob(encrypted);
    let decrypted = '';
    for (let i = 0; i < data.length; i++) {
      decrypted += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return decrypted;
  }

  /**
   * Store sensitive data securely
   */
  static setItem(key: string, value: string, encrypt: boolean = false): void {
    try {
      const data = encrypt ? this.encrypt(value, key) : value;
      localStorage.setItem(key, data);
    } catch (error) {
      console.error('Failed to store data:', error);
    }
  }

  /**
   * Retrieve sensitive data securely
   */
  static getItem(key: string, encrypted: boolean = false): string | null {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return encrypted ? this.decrypt(data, key) : data;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  }

  /**
   * Remove item
   */
  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all secure storage
   */
  static clear(): void {
    localStorage.clear();
    sessionStorage.clear();
  }
}

// Content Security Policy
export class CSPManager {
  /**
   * Set Content Security Policy meta tag
   */
  static setCSP(policy: string): void {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = policy;
    document.head.appendChild(meta);
  }

  /**
   * Get default CSP policy
   */
  static getDefaultPolicy(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.egygo.com https://cloud.appwrite.io",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
  }
}

// SQL Injection Prevention (for API calls)
export class SQLInjectionPrevention {
  /**
   * Escape SQL special characters
   */
  static escape(value: string): string {
    return value.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      switch (char) {
        case '\0':
          return '\\0';
        case '\x08':
          return '\\b';
        case '\x09':
          return '\\t';
        case '\x1a':
          return '\\z';
        case '\n':
          return '\\n';
        case '\r':
          return '\\r';
        case '"':
        case "'":
        case '\\':
        case '%':
          return '\\' + char;
        default:
          return char;
      }
    });
  }

  /**
   * Validate and sanitize search query
   */
  static sanitizeSearchQuery(query: string): string {
    // Remove SQL keywords and special characters
    return query
      .replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|WHERE)\b)/gi, '')
      .replace(/[;'"\\]/g, '')
      .trim();
  }
}

// Initialize security features
export function initSecurity(): void {
  // Generate CSRF token
  CSRFProtection.generateToken();

  // Set CSP policy
  if (import.meta.env.PROD) {
    CSPManager.setCSP(CSPManager.getDefaultPolicy());
  }

  // Disable right-click on production (optional)
  if (import.meta.env.PROD) {
    document.addEventListener('contextmenu', (e) => {
      // Allow right-click on input fields
      if ((e.target as HTMLElement).tagName === 'INPUT' || 
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }
      e.preventDefault();
    });
  }

  // Disable F12 and developer tools shortcuts (optional, not recommended for all cases)
  if (import.meta.env.PROD) {
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    });
  }
}

// Export all security utilities
export default {
  XSSProtection,
  InputValidator,
  CSRFProtection,
  RateLimiter,
  SecureStorage,
  CSPManager,
  SQLInjectionPrevention,
  initSecurity
};
