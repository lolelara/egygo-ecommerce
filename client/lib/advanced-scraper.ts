/**
 * Advanced Product Scraper
 * Uses multiple strategies to extract product data
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import { proxyManager } from './proxy-manager';

export interface ScrapedProduct {
  name: string;
  price: number;
  description?: string;
  images?: string[];
  category?: string;
  specifications?: Record<string, any>;
  brand?: string;
  sku?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
}

export interface ScraperOptions {
  timeout?: number;
  userAgent?: string;
  headers?: Record<string, string>;
  followRedirects?: boolean;
  maxRedirects?: number;
}

/**
 * Advanced scraper with multiple extraction strategies
 */
export class AdvancedProductScraper {
  private options: ScraperOptions;
  private cache: Map<string, { data: ScrapedProduct; timestamp: number }>;
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes

  constructor(options: ScraperOptions = {}) {
    this.options = {
      timeout: 30000,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      followRedirects: true,
      maxRedirects: 5,
      ...options
    };
    this.cache = new Map();
  }

  /**
   * Main scraping method with fallback strategies
   */
  async scrape(url: string, useCache: boolean = true): Promise<ScrapedProduct> {
    // Check cache
    if (useCache) {
      const cached = this.cache.get(url);
      if (cached && (Date.now() - cached.timestamp) < this.cacheDuration) {
        console.log('📦 Using cached data');
        return cached.data;
      }
    }

    let result: ScrapedProduct | null = null;

    // Strategy 1: Try JSON-LD structured data
    try {
      result = await this.scrapeWithJsonLd(url);
      if (result && result.name && result.price > 0) {
        console.log('✅ Scraped with JSON-LD');
        this.cacheResult(url, result);
        return result;
      }
    } catch (error) {
      console.log('⚠️  JSON-LD extraction failed');
    }

    // Strategy 2: Try Open Graph + Schema.org
    try {
      result = await this.scrapeWithMetaTags(url);
      if (result && result.name && result.price > 0) {
        console.log('✅ Scraped with Meta Tags');
        this.cacheResult(url, result);
        return result;
      }
    } catch (error) {
      console.log('⚠️  Meta tags extraction failed');
    }

    // Strategy 3: Try common e-commerce selectors
    try {
      result = await this.scrapeWithSelectors(url);
      if (result && result.name) {
        console.log('✅ Scraped with Selectors');
        this.cacheResult(url, result);
        return result;
      }
    } catch (error) {
      console.log('⚠️  Selector extraction failed');
    }

    // Strategy 4: Try site-specific scrapers
    try {
      result = await this.scrapeWithSiteSpecific(url);
      if (result && result.name) {
        console.log('✅ Scraped with Site-Specific');
        this.cacheResult(url, result);
        return result;
      }
    } catch (error) {
      console.log('⚠️  Site-specific extraction failed');
    }

    throw new Error('فشل استخراج بيانات المنتج من جميع الطرق');
  }

  /**
   * Strategy 1: Extract from JSON-LD structured data
   */
  private async scrapeWithJsonLd(url: string): Promise<ScrapedProduct> {
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);

    // Find JSON-LD script tags
    const jsonLdScripts = $('script[type="application/ld+json"]');
    
    for (let i = 0; i < jsonLdScripts.length; i++) {
      try {
        const jsonText = $(jsonLdScripts[i]).html();
        if (!jsonText) continue;

        const data = JSON.parse(jsonText);
        
        // Handle array of objects
        const items = Array.isArray(data) ? data : [data];
        
        for (const item of items) {
          if (item['@type'] === 'Product' || item['@type']?.includes('Product')) {
            return this.extractFromJsonLd(item);
          }
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error('No JSON-LD product data found');
  }

  /**
   * Extract product data from JSON-LD object
   */
  private extractFromJsonLd(data: any): ScrapedProduct {
    const offers = data.offers || data.Offers || {};
    const aggregateRating = data.aggregateRating || data.AggregateRating || {};

    return {
      name: data.name || data.Name || '',
      price: this.parsePrice(offers.price || offers.Price || offers.lowPrice || 0),
      description: data.description || data.Description || '',
      images: this.extractImages(data.image || data.Image),
      brand: data.brand?.name || data.brand || data.Brand || '',
      sku: data.sku || data.SKU || data.mpn || '',
      availability: offers.availability || offers.Availability || '',
      rating: parseFloat(aggregateRating.ratingValue || 0),
      reviewCount: parseInt(aggregateRating.reviewCount || 0),
      category: data.category || ''
    };
  }

  /**
   * Strategy 2: Extract from meta tags (Open Graph, Twitter Cards, etc.)
   */
  private async scrapeWithMetaTags(url: string): Promise<ScrapedProduct> {
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);

    const getMetaContent = (names: string[]): string => {
      for (const name of names) {
        const content = 
          $(`meta[property="${name}"]`).attr('content') ||
          $(`meta[name="${name}"]`).attr('content') ||
          $(`meta[itemprop="${name}"]`).attr('content');
        if (content) return content;
      }
      return '';
    };

    const name = getMetaContent([
      'og:title',
      'twitter:title',
      'product:title',
      'title'
    ]) || $('title').text();

    const description = getMetaContent([
      'og:description',
      'twitter:description',
      'description',
      'product:description'
    ]);

    const image = getMetaContent([
      'og:image',
      'twitter:image',
      'product:image'
    ]);

    const priceText = getMetaContent([
      'product:price:amount',
      'og:price:amount',
      'price',
      'product:price'
    ]);

    const brand = getMetaContent([
      'product:brand',
      'og:brand',
      'brand'
    ]);

    return {
      name: name.trim(),
      price: this.parsePrice(priceText),
      description: description.trim(),
      images: image ? [image] : [],
      brand: brand.trim(),
      category: ''
    };
  }

  /**
   * Strategy 3: Extract using common e-commerce selectors
   */
  private async scrapeWithSelectors(url: string): Promise<ScrapedProduct> {
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);

    // Common title selectors
    const titleSelectors = [
      'h1.product-title',
      'h1[itemprop="name"]',
      '.product-name',
      '#product-name',
      '.product-title',
      'h1.title',
      '.product h1',
      'h1'
    ];

    // Common price selectors
    const priceSelectors = [
      '.price',
      '[itemprop="price"]',
      '.product-price',
      '#price',
      '.sale-price',
      '.current-price',
      '.price-current',
      'span.price',
      '.product-price-value'
    ];

    // Common description selectors
    const descriptionSelectors = [
      '[itemprop="description"]',
      '.product-description',
      '#description',
      '.description',
      '.product-details'
    ];

    // Common image selectors
    const imageSelectors = [
      '[itemprop="image"]',
      '.product-image img',
      '#product-image',
      '.main-image',
      '.product-gallery img',
      'img[data-zoom]'
    ];

    const name = this.findBySelectors($, titleSelectors);
    const priceText = this.findBySelectors($, priceSelectors);
    const description = this.findBySelectors($, descriptionSelectors);
    
    const images: string[] = [];
    for (const selector of imageSelectors) {
      $(selector).each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy');
        if (src && !images.includes(src)) {
          images.push(this.resolveUrl(src, url));
        }
      });
      if (images.length >= 5) break;
    }

    return {
      name: name.trim(),
      price: this.parsePrice(priceText),
      description: description.trim(),
      images: images.slice(0, 5),
      category: ''
    };
  }

  /**
   * Strategy 4: Site-specific scrapers
   */
  private async scrapeWithSiteSpecific(url: string): Promise<ScrapedProduct> {
    const hostname = new URL(url).hostname.toLowerCase();

    // Amazon
    if (hostname.includes('amazon')) {
      return this.scrapeAmazon(url);
    }

    // eBay
    if (hostname.includes('ebay')) {
      return this.scrapeEbay(url);
    }

    // AliExpress
    if (hostname.includes('aliexpress')) {
      return this.scrapeAliExpress(url);
    }

    // Jumia (Egypt)
    if (hostname.includes('jumia')) {
      return this.scrapeJumia(url);
    }

    // Noon (Middle East)
    if (hostname.includes('noon')) {
      return this.scrapeNoon(url);
    }

    throw new Error('No site-specific scraper available');
  }

  /**
   * Amazon-specific scraper
   */
  private async scrapeAmazon(url: string): Promise<ScrapedProduct> {
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);

    return {
      name: $('#productTitle').text().trim(),
      price: this.parsePrice($('.a-price .a-offscreen').first().text()),
      description: $('#feature-bullets').text().trim() || $('#productDescription').text().trim(),
      images: this.extractAmazonImages($),
      brand: $('#bylineInfo').text().replace('Visit the', '').replace('Store', '').trim(),
      rating: parseFloat($('.a-icon-star .a-icon-alt').first().text().split(' ')[0] || '0'),
      reviewCount: parseInt($('#acrCustomerReviewText').text().replace(/[^\d]/g, '') || '0'),
      category: ''
    };
  }

  /**
   * eBay-specific scraper
   */
  private async scrapeEbay(url: string): Promise<ScrapedProduct> {
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);

    return {
      name: $('.x-item-title__mainTitle').text().trim() || $('h1.it-ttl').text().trim(),
      price: this.parsePrice($('.x-price-primary').text() || $('.notranslate').first().text()),
      description: $('#viTabs_0_panel').text().trim(),
      images: this.extractEbayImages($),
      category: ''
    };
  }

  /**
   * AliExpress-specific scraper
   */
  private async scrapeAliExpress(url: string): Promise<ScrapedProduct> {
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);

    return {
      name: $('.product-title-text').text().trim() || $('h1').first().text().trim(),
      price: this.parsePrice($('.product-price-value').text()),
      description: $('.product-description').text().trim(),
      images: [],
      category: ''
    };
  }

  /**
   * Jumia-specific scraper (Egypt)
   */
  private async scrapeJumia(url: string): Promise<ScrapedProduct> {
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);

    return {
      name: $('.-fs20').text().trim() || $('h1').first().text().trim(),
      price: this.parsePrice($('.-b.-ltr.-tal.-fs24').text()),
      description: $('.markup').text().trim(),
      images: [],
      rating: parseFloat($('.stars').attr('data-rating') || '0'),
      category: ''
    };
  }

  /**
   * Noon-specific scraper (Middle East)
   */
  private async scrapeNoon(url: string): Promise<ScrapedProduct> {
    const html = await this.fetchHtml(url);
    const $ = cheerio.load(html);

    return {
      name: $('h1').first().text().trim(),
      price: this.parsePrice($('.priceNow').text()),
      description: $('.detailsSection').text().trim(),
      images: [],
      category: ''
    };
  }

  /**
   * Helper: Fetch HTML with proper headers and proxy fallback
   */
  private async fetchHtml(url: string): Promise<string> {
    try {
      // Try direct fetch first
      const response = await axios.get(url, {
        timeout: this.options.timeout,
        headers: {
          'User-Agent': this.options.userAgent!,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          ...this.options.headers
        },
        maxRedirects: this.options.maxRedirects,
        validateStatus: (status) => status < 400
      });

      return response.data;
    } catch (error) {
      // Fallback to proxy manager with automatic fallback
      console.log('⚠️  Direct fetch failed, trying proxy manager...');
      try {
        return await proxyManager.fetchThroughProxy(url);
      } catch (proxyError) {
        console.error('❌ All proxies failed:', proxyError);
        throw new Error('فشل تحميل الصفحة من جميع المصادر');
      }
    }
  }

  /**
   * Helper: Find element by multiple selectors
   */
  private findBySelectors($: cheerio.CheerioAPI, selectors: string[]): string {
    for (const selector of selectors) {
      const text = $(selector).first().text().trim();
      if (text) return text;
    }
    return '';
  }

  /**
   * Helper: Parse price from text
   */
  private parsePrice(text: string): number {
    if (!text) return 0;
    // Remove currency symbols and extract number
    const cleaned = text.replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  }

  /**
   * Helper: Extract images from various formats
   */
  private extractImages(imageData: any): string[] {
    if (!imageData) return [];
    if (typeof imageData === 'string') return [imageData];
    if (Array.isArray(imageData)) return imageData.filter(img => typeof img === 'string');
    if (imageData.url) return [imageData.url];
    return [];
  }

  /**
   * Helper: Extract Amazon images
   */
  private extractAmazonImages($: cheerio.CheerioAPI): string[] {
    const images: string[] = [];
    $('.imgTagWrapper img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !images.includes(src)) {
        // Convert thumbnail to full size
        const fullSize = src.replace(/\._.*_\./, '.');
        images.push(fullSize);
      }
    });
    return images.slice(0, 5);
  }

  /**
   * Helper: Extract eBay images
   */
  private extractEbayImages($: cheerio.CheerioAPI): string[] {
    const images: string[] = [];
    $('.ux-image-carousel-item img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !images.includes(src)) {
        images.push(src);
      }
    });
    return images.slice(0, 5);
  }

  /**
   * Helper: Resolve relative URLs
   */
  private resolveUrl(relativeUrl: string, baseUrl: string): string {
    if (relativeUrl.startsWith('http')) return relativeUrl;
    try {
      return new URL(relativeUrl, baseUrl).href;
    } catch {
      return relativeUrl;
    }
  }

  /**
   * Helper: Cache result
   */
  private cacheResult(url: string, data: ScrapedProduct) {
    this.cache.set(url, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Set cache duration
   */
  setCacheDuration(minutes: number) {
    this.cacheDuration = minutes * 60 * 1000;
  }
}

/**
 * Create a singleton instance
 */
export const advancedScraper = new AdvancedProductScraper();
