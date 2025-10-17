/**
 * 🔍 SEO Utilities and Helpers
 */

/**
 * Generate SEO-friendly URL slug
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove Arabic diacritics
    .replace(/[\u064B-\u065F]/g, '')
    // Replace Arabic characters with English equivalents
    .replace(/[أإآا]/g, 'a')
    .replace(/[ب]/g, 'b')
    .replace(/[ت]/g, 't')
    .replace(/[ث]/g, 'th')
    .replace(/[ج]/g, 'g')
    .replace(/[ح]/g, 'h')
    .replace(/[خ]/g, 'kh')
    .replace(/[د]/g, 'd')
    .replace(/[ذ]/g, 'z')
    .replace(/[ر]/g, 'r')
    .replace(/[ز]/g, 'z')
    .replace(/[س]/g, 's')
    .replace(/[ش]/g, 'sh')
    .replace(/[ص]/g, 's')
    .replace(/[ض]/g, 'd')
    .replace(/[ط]/g, 't')
    .replace(/[ظ]/g, 'z')
    .replace(/[ع]/g, 'a')
    .replace(/[غ]/g, 'gh')
    .replace(/[ف]/g, 'f')
    .replace(/[ق]/g, 'q')
    .replace(/[ك]/g, 'k')
    .replace(/[ل]/g, 'l')
    .replace(/[م]/g, 'm')
    .replace(/[ن]/g, 'n')
    .replace(/[ه]/g, 'h')
    .replace(/[و]/g, 'w')
    .replace(/[ي]/g, 'y')
    .replace(/[ة]/g, 'h')
    .replace(/[ى]/g, 'a')
    .replace(/[ئ]/g, 'e')
    .replace(/[ؤ]/g, 'o')
    // Replace spaces and special characters
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generate meta description from content
 */
export function generateMetaDescription(
  content: string,
  maxLength: number = 160
): string {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Trim to max length
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // Find the last complete word within the limit
  const trimmed = plainText.substring(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? trimmed.substring(0, lastSpace) + '...'
    : trimmed + '...';
}

/**
 * Generate breadcrumb data
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbs(
  path: string,
  baseUrl: string = 'https://egygo.me'
): BreadcrumbItem[] {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'الرئيسية', url: baseUrl }
  ];
  
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Convert segment to readable name
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      name: name,
      url: `${baseUrl}${currentPath}`
    });
  });
  
  return breadcrumbs;
}

/**
 * Generate Open Graph image URL
 */
export function generateOGImageUrl(
  title: string,
  description?: string,
  imageUrl?: string
): string {
  if (imageUrl) {
    return imageUrl;
  }
  
  // Use a service like Vercel OG Image Generation
  const params = new URLSearchParams({
    title: title,
    ...(description && { description })
  });
  
  return `https://egygo.me/api/og?${params.toString()}`;
}

/**
 * Extract keywords from text
 */
export function extractKeywords(
  text: string,
  minLength: number = 3,
  maxKeywords: number = 10
): string[] {
  // Remove HTML tags
  const plainText = text.replace(/<[^>]*>/g, '');
  
  // Common Arabic stop words
  const stopWords = new Set([
    'في', 'من', 'إلى', 'على', 'مع', 'عن', 'هذا', 'هذه', 'ذلك', 'تلك',
    'التي', 'الذي', 'التي', 'اللذان', 'اللتان', 'الذين', 'اللاتي', 'اللواتي',
    'كان', 'كانت', 'يكون', 'تكون', 'أن', 'إن', 'لكن', 'لكن', 'أو', 'و',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'
  ]);
  
  // Extract words
  const words = plainText
    .toLowerCase()
    .split(/\s+/)
    .filter(word => 
      word.length >= minLength && 
      !stopWords.has(word) &&
      /^[\u0600-\u06FF\w]+$/.test(word)
    );
  
  // Count word frequency
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });
  
  // Sort by frequency and return top keywords
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Check if URL is indexable
 */
export function isIndexableUrl(url: string): boolean {
  const nonIndexablePatterns = [
    /\/admin\//,
    /\/api\//,
    /\/checkout\//,
    /\/cart/,
    /\/account\//,
    /\/login/,
    /\/register/,
    /\/reset-password/,
    /\?.*page=/,
    /\?.*sort=/,
    /\?.*filter=/
  ];
  
  return !nonIndexablePatterns.some(pattern => pattern.test(url));
}

/**
 * Generate schema.org Product data
 */
export function generateProductSchema(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  image: string;
  brand?: string;
  sku?: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating?: number;
  reviewCount?: number;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `https://egygo.me/product/${product.id}`,
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'EgyGo'
    },
    offers: {
      '@type': 'Offer',
      url: `https://egygo.me/product/${product.id}`,
      priceCurrency: product.currency || 'EGP',
      price: product.price,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: 'EgyGo'
      }
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1
      }
    }),
    ...(product.category && {
      category: product.category
    })
  };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: Array<{
  question: string;
  answer: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate LocalBusiness schema
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://egygo.me/#business',
    name: 'إيجي جو - EgyGo',
    description: 'متجرك الإلكتروني الأول في مصر للتسوق الآمن والسريع',
    url: 'https://egygo.me',
    telephone: '+20-103-432-4951',
    email: 'info@egygo.me',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 شارع التحرير',
      addressLocality: 'القاهرة',
      addressRegion: 'القاهرة',
      postalCode: '11511',
      addressCountry: 'EG'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.0444,
      longitude: 31.2357
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Sunday'
        ],
        opens: '09:00',
        closes: '22:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday', 'Saturday'],
        opens: '10:00',
        closes: '23:00'
      }
    ],
    priceRange: '$$',
    image: 'https://egygo.me/logo.png',
    sameAs: [
      'https://www.facebook.com/egygo',
      'https://twitter.com/egygo',
      'https://www.instagram.com/egygo',
      'https://www.youtube.com/egygo'
    ]
  };
}

/**
 * Optimize image alt text for SEO
 */
export function generateImageAlt(
  productName: string,
  category?: string,
  variant?: string
): string {
  let alt = productName;
  
  if (category) {
    alt = `${productName} - ${category}`;
  }
  
  if (variant) {
    alt = `${alt} - ${variant}`;
  }
  
  // Add site name for branding
  alt = `${alt} | إيجي جو`;
  
  return alt;
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(
  path: string,
  params?: URLSearchParams,
  baseUrl: string = 'https://egygo.me'
): string {
  // Remove trailing slash
  const cleanPath = path.replace(/\/$/, '');
  
  // Remove non-canonical parameters
  const canonicalParams = new URLSearchParams();
  const allowedParams = ['category', 'brand', 'color', 'size'];
  
  if (params) {
    params.forEach((value, key) => {
      if (allowedParams.includes(key)) {
        canonicalParams.append(key, value);
      }
    });
  }
  
  const queryString = canonicalParams.toString();
  return `${baseUrl}${cleanPath}${queryString ? `?${queryString}` : ''}`;
}

/**
 * Check Core Web Vitals
 */
export function measureWebVitals(callback: (metric: any) => void) {
  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry: any = entries[entries.length - 1];
      callback({
        name: 'LCP',
        value: lastEntry?.renderTime || lastEntry?.loadTime || 0,
        rating: (lastEntry?.renderTime || 0) < 2500 ? 'good' : (lastEntry?.renderTime || 0) < 4000 ? 'needs-improvement' : 'poor'
      });
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  }
  
  // First Input Delay (FID)
  if ('PerformanceObserver' in window) {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        callback({
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          rating: entry.processingStart - entry.startTime < 100 ? 'good' : entry.processingStart - entry.startTime < 300 ? 'needs-improvement' : 'poor'
        });
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  }
  
  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  let clsEntries: any[] = [];
  
  if ('PerformanceObserver' in window) {
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          clsEntries.push(entry);
        }
      }
      callback({
        name: 'CLS',
        value: clsValue,
        rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor'
      });
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  const resources = [
    { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
    { href: '/css/critical.css', as: 'style' },
    { href: '/js/main.js', as: 'script' }
  ];
  
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    if (resource.type) {
      link.type = resource.type;
    }
    if (resource.as === 'font') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
}

/**
 * Lazy load images with SEO-friendly placeholders
 */
export function lazyLoadImage(
  src: string,
  alt: string,
  width?: number,
  height?: number
): HTMLImageElement {
  const img = document.createElement('img');
  
  // Use a low-quality placeholder
  const placeholder = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width || 400} ${height || 300}'%3E%3Crect fill='%23f0f0f0'/%3E%3C/svg%3E`;
  
  img.src = placeholder;
  img.dataset.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  
  if (width) img.width = width;
  if (height) img.height = height;
  
  // Intersection Observer for lazy loading
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLImageElement;
          target.src = target.dataset.src || '';
          observer.unobserve(target);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    observer.observe(img);
  } else {
    // Fallback for older browsers
    img.src = src;
  }
  
  return img;
}
