#!/usr/bin/env node

/**
 * 🤖 Vendoor Auto-Scraper for GitHub Actions
 * 
 * يشتغل تلقائيًا كل 6 ساعات عبر GitHub Actions
 * يجمع كل المنتجات من Ven-door ويحفظها أو يرسلها للـ API
 */

import { webkit } from 'playwright'; // استخدام playwright webkit (أخف)
import fs from 'fs/promises';
import { Client, Databases, ID } from 'appwrite';

// ================== CONFIG ==================
const VENDOOR_EMAIL = process.env.VENDOOR_EMAIL || 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = process.env.VENDOOR_PASSWORD || 'hema2004';
const TOTAL_PAGES = 41; // إجمالي عدد الصفحات
const MAX_CONCURRENT_PAGES = 3; // عدد الصفحات المتزامنة

// Appwrite Config (اختياري - لحفظ البيانات مباشرة)
const USE_APPWRITE = process.env.APPWRITE_PROJECT_ID ? true : false;
const APPWRITE_CONFIG = {
  endpoint: process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1',
  projectId: process.env.APPWRITE_PROJECT_ID,
  apiKey: process.env.APPWRITE_API_KEY,
  databaseId: '68d8c1b50010a03f79ab',
  collectionId: 'vendoor-products'
};

// ================== HELPERS ==================

function log(emoji, message) {
  console.log(`${emoji} [${new Date().toISOString()}] ${message}`);
}

async function loginToVendoor(page) {
  log('🔐', 'Logging in to Ven-door...');
  
  await page.goto('https://ven-door.com/auth/login', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });
  
  await page.waitForSelector('input[type="email"], input[name="email"]');
  await page.type('input[type="email"], input[name="email"]', VENDOOR_EMAIL);
  await page.type('input[type="password"], input[name="password"]', VENDOOR_PASSWORD);
  
  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 })
  ]);
  
  log('✅', 'Logged in successfully');
}

async function scrapeProductsPage(page, pageNum) {
  const url = `https://ven-door.com/products-upload?page=${pageNum}`;
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('.product-card, .product-item, [class*="product"]', {
      timeout: 10000
    });
    
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.product-card, .product-item, [class*="product"]');
      
      return Array.from(productElements).map(el => {
        const getPrice = (selector) => {
          const priceEl = el.querySelector(selector);
          if (!priceEl) return null;
          const priceText = priceEl.textContent.trim();
          const match = priceText.match(/[\d,]+(?:\.\d{2})?/);
          return match ? parseFloat(match[0].replace(/,/g, '')) : null;
        };
        
        return {
          title: el.querySelector('.product-title, h3, h2, [class*="title"]')?.textContent?.trim() || 'No Title',
          price: getPrice('.product-price, .price, [class*="price"]'),
          originalPrice: getPrice('.original-price, .old-price, [class*="original"]'),
          image: el.querySelector('img')?.src || el.querySelector('img')?.getAttribute('data-src') || '',
          link: el.querySelector('a')?.href || window.location.href,
          sku: el.querySelector('.sku, [class*="sku"]')?.textContent?.trim() || null,
          category: el.querySelector('.category, [class*="category"]')?.textContent?.trim() || null,
          inStock: !el.querySelector('.out-of-stock, [class*="out-of-stock"]'),
          scrapedAt: new Date().toISOString()
        };
      });
    });
    
    log('📦', `Page ${pageNum}: Found ${products.length} products`);
    return products;
    
  } catch (error) {
    log('❌', `Error on page ${pageNum}: ${error.message}`);
    return [];
  }
}

async function scrapeInBatches(browser, startPage, endPage) {
  const allProducts = [];
  
  for (let i = startPage; i <= endPage; i += MAX_CONCURRENT_PAGES) {
    const batch = [];
    const endBatch = Math.min(i + MAX_CONCURRENT_PAGES - 1, endPage);
    
    log('🔄', `Scraping pages ${i}-${endBatch}...`);
    
    for (let pageNum = i; pageNum <= endBatch; pageNum++) {
      const page = await browser.newPage();
      batch.push(
        scrapeProductsPage(page, pageNum)
          .then(products => {
            page.close();
            return products;
          })
          .catch(err => {
            log('⚠️', `Failed page ${pageNum}: ${err.message}`);
            page.close();
            return [];
          })
      );
    }
    
    const results = await Promise.all(batch);
    results.forEach(products => allProducts.push(...products));
    
    // استراحة صغيرة بين الـ batches
    if (endBatch < endPage) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return allProducts;
}

async function saveToAppwrite(products) {
  if (!USE_APPWRITE) {
    log('⏭️', 'Skipping Appwrite upload (not configured)');
    return;
  }
  
  try {
    log('☁️', 'Uploading to Appwrite...');
    
    const client = new Client()
      .setEndpoint(APPWRITE_CONFIG.endpoint)
      .setProject(APPWRITE_CONFIG.projectId)
      .setKey(APPWRITE_CONFIG.apiKey);
    
    const databases = new Databases(client);
    
    let uploaded = 0;
    let failed = 0;
    
    for (const product of products) {
      try {
        await databases.createDocument(
          APPWRITE_CONFIG.databaseId,
          APPWRITE_CONFIG.collectionId,
          ID.unique(),
          product
        );
        uploaded++;
      } catch (error) {
        failed++;
        if (failed <= 5) {
          log('⚠️', `Failed to upload: ${product.title}`);
        }
      }
    }
    
    log('✅', `Appwrite: ${uploaded} uploaded, ${failed} failed`);
    
  } catch (error) {
    log('❌', `Appwrite error: ${error.message}`);
  }
}

async function saveToFile(products, filename = 'vendoor-products.json') {
  await fs.writeFile(filename, JSON.stringify(products, null, 2));
  log('💾', `Saved ${products.length} products to ${filename}`);
}

// ================== MAIN ==================

async function main() {
  log('🚀', '=== Vendoor Auto-Scraper Started ===');
  log('📅', `Date: ${new Date().toLocaleString()}`);
  log('📄', `Target: ${TOTAL_PAGES} pages (~${TOTAL_PAGES * 15} products)`);
  
  const browser = await webkit.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });
  
  try {
    // Login
    const loginPage = await browser.newPage();
    await loginToVendoor(loginPage);
    await loginPage.close();
    
    // Scrape all pages
    const allProducts = await scrapeInBatches(browser, 1, TOTAL_PAGES);
    
    // Remove duplicates
    const uniqueProducts = Array.from(
      new Map(allProducts.map(p => [p.link, p])).values()
    );
    
    log('🎯', `Total unique products: ${uniqueProducts.length}`);
    
    // Save locally (GitHub Artifact)
    await saveToFile(uniqueProducts);
    
    // Upload to Appwrite (optional)
    await saveToAppwrite(uniqueProducts);
    
    log('✅', '=== Scraping Completed Successfully ===');
    
  } catch (error) {
    log('❌', `Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run
main().catch(error => {
  log('💥', `Unhandled error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
