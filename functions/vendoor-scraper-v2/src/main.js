import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { Client, Databases, Storage, ID } from 'node-appwrite';

const LOGIN_URL = 'https://aff.ven-door.com/login';
const PRODUCTS_BASE_URL = 'https://aff.ven-door.com/products';
const AFFILIATE_ID = '29631';

/**
 * Appwrite Function Entry Point
 */
export default async ({ req, res, log, error }) => {
  try {
    // Parse request body
    const body = JSON.parse(req.bodyRaw || '{}');
    const { 
      email, 
      password, 
      maxPages = 10,
      includeDetails = false,
      operation = 'scrape' // 'scrape' | 'progress' | 'files'
    } = body;

    log(`📋 Operation: ${operation}`);
    log(`📧 Email: ${email}`);
    log(`📄 Max Pages: ${maxPages}`);

    // Initialize Appwrite
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const storage = new Storage(client);

    // Handle different operations
    if (operation === 'progress') {
      return res.json({
        success: true,
        message: 'Progress endpoint',
        note: 'Progress tracking to be implemented'
      });
    }

    if (operation === 'files') {
      // List files from storage
      try {
        const files = await storage.listFiles(
          process.env.VENDOOR_BUCKET_ID || 'vendoor-exports'
        );
        return res.json({
          success: true,
          files: files.files.map(f => ({
            id: f.$id,
            name: f.name,
            size: f.sizeOriginal,
            created: f.$createdAt,
            downloadUrl: `/api/vendoor/download/${f.$id}`
          }))
        });
      } catch (err) {
        error('Failed to list files:', err);
        return res.json({
          success: false,
          error: 'Failed to list files'
        }, 500);
      }
    }

    // Validate credentials
    if (!email || !password) {
      return res.json({
        success: false,
        error: 'Email and password are required'
      }, 400);
    }

    log('🚀 Starting Vendoor scraping...');

    // Launch browser
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    // Login
    log('🔐 Logging in to Vendoor...');
    await loginToVendoor(page, email, password, log);
    log('✅ Login successful');

    // Scrape products
    const allProducts = [];
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      log(`📄 Scraping page ${pageNum}...`);
      
      const products = await scrapeProductsPage(page, pageNum, log);
      
      if (products.length === 0) {
        log(`Page ${pageNum} is empty - stopping`);
        break;
      }
      
      allProducts.push(...products);
      log(`✅ Found ${products.length} products on page ${pageNum}`);
      
      // Small delay between pages
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    await browser.close();

    log(`📦 Total products scraped: ${allProducts.length}`);

    // Format products for bulk upload
    const formattedProducts = allProducts.map(p => ({
      id: `VENDOOR_${p.id}`,
      name: p.title,
      description: `منتج من ${p.supplier}`,
      price: p.price,
      images: [p.image].filter(Boolean),
      category: 'منتجات Vendoor',
      supplier: p.supplier,
      stock: parseInt(p.stock) || 0,
      commission: p.commission,
      variations: {
        colors: [],
        sizes: []
      },
      stockDetails: {},
      shippingCost: 0,
      vendoorProductId: p.id,
      vendoorOrderLink: p.orderLink
    }));

    // Save to Storage
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `vendoor_products_${timestamp}.json`;
    const fileContent = JSON.stringify(formattedProducts, null, 2);

    log(`💾 Saving to storage: ${filename}`);

    try {
      const file = await storage.createFile(
        process.env.VENDOOR_BUCKET_ID || 'vendoor-exports',
        ID.unique(),
        filename,
        Buffer.from(fileContent, 'utf-8')
      );

      log(`✅ File saved: ${file.$id}`);

      return res.json({
        success: true,
        message: 'Scraping completed successfully',
        totalProducts: allProducts.length,
        file: {
          id: file.$id,
          name: filename,
          size: file.sizeOriginal,
          downloadUrl: `/api/vendoor/download/${file.$id}`
        }
      });

    } catch (storageError) {
      error('Storage error:', storageError);
      
      // Fallback: return data directly
      return res.json({
        success: true,
        message: 'Scraping completed (storage failed, returning data directly)',
        totalProducts: allProducts.length,
        products: formattedProducts,
        note: 'File not saved to storage, use products array for bulk upload'
      });
    }

  } catch (err) {
    error('Function error:', err);
    return res.json({
      success: false,
      error: err.message || 'Scraping failed',
      stack: err.stack
    }, 500);
  }
};

/**
 * Login to Vendoor
 */
async function loginToVendoor(page, email, password, log) {
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await page.waitForSelector('input[name="name"]', { timeout: 5000 });
  await page.type('input[name="name"]', email, { delay: 50 });
  await page.type('input[type="password"]', password, { delay: 50 });
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
    page.click('button[type="submit"]')
  ]).catch(() => {});
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const currentUrl = page.url();
  if (currentUrl.includes('login')) {
    throw new Error('Login failed - check credentials');
  }
}

/**
 * Scrape products from a single page
 */
async function scrapeProductsPage(page, pageNum, log) {
  const url = `${PRODUCTS_BASE_URL}?page=${pageNum}`;
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const products = await page.evaluate(() => {
    const productsList = [];
    const rows = document.querySelectorAll('table tbody tr');
    
    rows.forEach((row) => {
      try {
        const cells = row.querySelectorAll('td');
        if (cells.length < 8) return;
        
        const imageCell = cells[1];
        const nameCell = cells[2];
        const supplierCell = cells[3];
        const priceCell = cells[4];
        const commissionCell = cells[5];
        const stockCell = cells[6];
        const actionCell = cells[8];
        
        const img = imageCell?.querySelector('img');
        const image = img ? (img.src || img.getAttribute('data-src')) : '';
        
        const nameLink = nameCell?.querySelector('a');
        const title = nameLink?.textContent?.trim() || '';
        
        const supplierLink = supplierCell?.querySelector('a');
        const supplier = supplierLink?.textContent?.trim() || '';
        
        const priceLink = priceCell?.querySelector('a');
        const priceText = priceLink?.textContent?.trim() || '';
        const price = priceText.replace(/[^\d]/g, '') || '0';
        
        const commissionLink = commissionCell?.querySelector('a');
        const commissionText = commissionLink?.textContent?.trim() || '';
        const commission = commissionText.replace(/[^\d]/g, '') || '0';
        
        const stockSpan = stockCell?.querySelector('span.stock-odd');
        const stock = stockSpan?.textContent?.trim() || '';
        
        const orderLink = actionCell?.querySelector('a.link-add-order');
        let productId = '';
        
        if (orderLink) {
          const href = orderLink.href;
          const match = href.match(/product=(\d+)/);
          if (match) productId = match[1];
        }
        
        if (title && productId) {
          productsList.push({
            id: productId,
            title,
            supplier,
            price: parseInt(price) || 0,
            commission: parseInt(commission) || 0,
            stock,
            image,
            orderLink: orderLink?.href || ''
          });
        }
      } catch (error) {
        console.error('Error parsing row:', error);
      }
    });
    
    return productsList;
  });
  
  return products;
}
