/**
 * 🔍 SEO Hook for React Components
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  canonical?: string;
  jsonLd?: any;
}

/**
 * Custom hook for managing SEO meta tags
 */
export function useSEO(config: SEOConfig = {}) {
  const location = useLocation();
  const baseUrl = 'https://egygo.me';
  
  useEffect(() => {
    // Update title
    if (config.title) {
      document.title = `${config.title} | إيجي جو - EgyGo`;
    }
    
    // Update meta description
    if (config.description) {
      updateMetaTag('description', config.description);
    }
    
    // Update keywords
    if (config.keywords) {
      updateMetaTag('keywords', config.keywords);
    }
    
    // Update Open Graph tags
    if (config.title) {
      updateMetaTag('og:title', config.title, 'property');
    }
    if (config.description) {
      updateMetaTag('og:description', config.description, 'property');
    }
    if (config.image) {
      updateMetaTag('og:image', config.image, 'property');
    }
    if (config.type) {
      updateMetaTag('og:type', config.type, 'property');
    }
    updateMetaTag('og:url', `${baseUrl}${location.pathname}`, 'property');
    
    // Update Twitter Card tags
    if (config.title) {
      updateMetaTag('twitter:title', config.title);
    }
    if (config.description) {
      updateMetaTag('twitter:description', config.description);
    }
    if (config.image) {
      updateMetaTag('twitter:image', config.image);
    }
    
    // Update canonical URL
    if (config.canonical) {
      updateLinkTag('canonical', config.canonical);
    } else {
      updateLinkTag('canonical', `${baseUrl}${location.pathname}`);
    }
    
    // Update robots meta
    if (config.noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }
    
    // Add JSON-LD structured data
    if (config.jsonLd) {
      addJsonLd(config.jsonLd);
    }
    
    // Track page view for analytics
    trackPageView(location.pathname);
    
    // Cleanup function
    return () => {
      // Remove JSON-LD script if added
      const script = document.querySelector('script[type="application/ld+json"]');
      if (script) {
        script.remove();
      }
    };
  }, [location, config]);
  
  // Helper function to update meta tags
  function updateMetaTag(name: string, content: string, attribute: string = 'name') {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      document.head.appendChild(meta);
    }
    
    meta.content = content;
  }
  
  // Helper function to update link tags
  function updateLinkTag(rel: string, href: string) {
    let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = rel;
      document.head.appendChild(link);
    }
    
    link.href = href;
  }
  
  // Helper function to add JSON-LD structured data
  function addJsonLd(data: any) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }
  
  // Track page views for analytics
  function trackPageView(path: string) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: path
      });
    }
    
    // Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView');
    }
  }
}

/**
 * Hook for product pages SEO
 */
export function useProductSEO(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  availability?: 'InStock' | 'OutOfStock';
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'EgyGo'
    },
    offers: {
      '@type': 'Offer',
      url: `https://egygo.me/product/${product.id}`,
      priceCurrency: 'EGP',
      price: product.price,
      availability: `https://schema.org/${product.availability || 'InStock'}`
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0
      }
    })
  };
  
  useSEO({
    title: product.name,
    description: product.description,
    image: product.image,
    type: 'product',
    jsonLd
  });
}

/**
 * Hook for category pages SEO
 */
export function useCategorySEO(category: {
  name: string;
  description: string;
  image?: string;
  productCount?: number;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    ...(category.image && { image: category.image }),
    ...(category.productCount && {
      numberOfItems: category.productCount
    })
  };
  
  useSEO({
    title: `${category.name} - تسوق أفضل المنتجات`,
    description: category.description || `اكتشف مجموعة واسعة من ${category.name} بأفضل الأسعار والعروض الحصرية`,
    image: category.image,
    type: 'website',
    jsonLd
  });
}

/**
 * Hook for blog post SEO
 */
export function useBlogSEO(post: {
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    articleBody: post.content,
    ...(post.image && { image: post.image }),
    author: {
      '@type': 'Person',
      name: post.author || 'EgyGo Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'EgyGo',
      logo: {
        '@type': 'ImageObject',
        url: 'https://egygo.me/logo.png'
      }
    },
    datePublished: post.publishedAt || new Date().toISOString(),
    ...(post.tags && {
      keywords: post.tags.join(', ')
    })
  };
  
  useSEO({
    title: post.title,
    description: post.excerpt,
    keywords: post.tags?.join(', '),
    image: post.image,
    type: 'article',
    jsonLd
  });
}
