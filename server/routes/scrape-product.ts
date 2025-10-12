import { RequestHandler } from "express";
import * as cheerio from 'cheerio';

/**
 * Scrape product data from URL
 * 
 * This is a basic implementation. In production, you should:
 * 1. Use Puppeteer/Playwright for dynamic content
 * 2. Add rate limiting
 * 3. Handle different website structures
 * 4. Add caching
 * 5. Respect robots.txt
 */
export const scrapeProduct: RequestHandler = async (req, res) => {
  try {
    const { url, markup = 20 } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product page');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract product data (this is generic, needs customization per site)
    const productData = {
      name: extractProductName($),
      description: extractDescription($),
      price: extractPrice($),
      images: extractImages($, url),
      category: extractCategory($),
      brand: extractBrand($),
      sku: extractSKU($),
      stockQuantity: 999, // Default
      specifications: extractSpecifications($)
    };

    // Apply markup
    if (productData.price) {
      const originalPrice = productData.price;
      productData.price = originalPrice * (1 + markup / 100);
    }

    res.json(productData);
  } catch (error: any) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Failed to scrape product',
      message: error.message 
    });
  }
};

/**
 * Helper functions to extract data
 */

function extractProductName($: cheerio.CheerioAPI): string {
  // Try common selectors
  const selectors = [
    'h1[itemprop="name"]',
    'h1.product-title',
    'h1.product-name',
    '.product-title h1',
    'h1',
    '[data-testid="product-title"]'
  ];

  for (const selector of selectors) {
    const text = $(selector).first().text().trim();
    if (text) return text;
  }

  return 'منتج مستورد';
}

function extractDescription($: cheerio.CheerioAPI): string {
  const selectors = [
    '[itemprop="description"]',
    '.product-description',
    '#product-description',
    '.description',
    '[data-testid="product-description"]'
  ];

  for (const selector of selectors) {
    const text = $(selector).first().text().trim();
    if (text) return text;
  }

  return '';
}

function extractPrice($: cheerio.CheerioAPI): number {
  const selectors = [
    '[itemprop="price"]',
    '.price',
    '.product-price',
    '[data-testid="product-price"]',
    '.sale-price'
  ];

  for (const selector of selectors) {
    const priceText = $(selector).first().text().trim();
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
    if (!isNaN(price) && price > 0) return price;
  }

  return 0;
}

function extractImages($: cheerio.CheerioAPI, baseUrl: string): string[] {
  const images: string[] = [];
  const selectors = [
    '[itemprop="image"]',
    '.product-image img',
    '.product-gallery img',
    '[data-testid="product-image"]'
  ];

  for (const selector of selectors) {
    $(selector).each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src');
      if (src) {
        // Convert relative URLs to absolute
        const absoluteUrl = src.startsWith('http') 
          ? src 
          : new URL(src, baseUrl).href;
        images.push(absoluteUrl);
      }
    });
    if (images.length > 0) break;
  }

  return images.slice(0, 5); // Limit to 5 images
}

function extractCategory($: cheerio.CheerioAPI): string {
  const selectors = [
    '[itemprop="category"]',
    '.breadcrumb a:last-child',
    '.category-name',
    '[data-testid="category"]'
  ];

  for (const selector of selectors) {
    const text = $(selector).first().text().trim();
    if (text) return text;
  }

  return 'general';
}

function extractBrand($: cheerio.CheerioAPI): string {
  const selectors = [
    '[itemprop="brand"]',
    '.brand-name',
    '[data-testid="brand"]'
  ];

  for (const selector of selectors) {
    const text = $(selector).first().text().trim();
    if (text) return text;
  }

  return '';
}

function extractSKU($: cheerio.CheerioAPI): string {
  const selectors = [
    '[itemprop="sku"]',
    '.product-sku',
    '[data-testid="sku"]'
  ];

  for (const selector of selectors) {
    const text = $(selector).first().text().trim();
    if (text) return text;
  }

  return '';
}

function extractSpecifications($: cheerio.CheerioAPI): Record<string, string> {
  const specs: Record<string, string> = {};
  
  // Try to find specification table
  $('.specifications tr, .specs tr, .product-specs tr').each((_, row) => {
    const key = $(row).find('th, td:first-child').text().trim();
    const value = $(row).find('td:last-child').text().trim();
    if (key && value) {
      specs[key] = value;
    }
  });

  return specs;
}
