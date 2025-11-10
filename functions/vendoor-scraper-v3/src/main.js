const puppeteer = require('puppeteer');
const { Client, Databases, Storage, ID } = require('node-appwrite');

const LOGIN_URL = 'https://aff.ven-door.com/login';
const PRODUCTS_BASE_URL = 'https://aff.ven-door.com/products';

/**
 * Appwrite Function - Vendoor Scraper V3
 * Uses full Puppeteer with bundled Chromium (more reliable)
 */
module.exports = async ({ req, res, log, error }) => {
  let browser;
  
  try {
    log('🚀 Vendoor Scraper V3 - بدء العمل');
    
    // Parse request
    let payload = {};
    if (req.body && req.body.trim() !== '') {
      try {
        payload = JSON.parse(req.body);
      } catch (e) {
        payload = req.query || {};
      }
    } else {
      payload = req.query || {};
    }
    
    const { 
      email, 
      password, 
      maxPages = 10,
      operation = 'scrape'
    } = payload;

    log(`📋 Operation: ${operation}`);
    log(`📧 Email: ${email}`);

    // Health check
    if (operation === 'health') {
      return res.json({
        success: true,
        message: 'Vendoor Scraper V3 is running',
        version: '3.0.0'
      });
    }

    // Validate credentials
    if (!email || !password) {
      return res.json({
        success: false,
        error: 'Email and password required'
      }, 400);
    }

    // Initialize Appwrite
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const storage = new Storage(client);

    log('🌐 Launching browser...');

    // Launch Puppeteer with bundled Chromium
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
      timeout: 60000
    });

    log('✅ Browser launched successfully');

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    // Login
    log('🔐 Logging in...');
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
    
    if (page.url().includes('login')) {
      throw new Error('Login failed - check credentials');
    }

    log('✅ Login successful');

    // Scrape products
    const allProducts = [];
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      log(`📄 Scraping page ${pageNum}...`);
      
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
      
      if (products.length === 0) {
        log(`Page ${pageNum} is empty - stopping`);
        break;
      }
      
      allProducts.push(...products);
      log(`✅ Found ${products.length} products on page ${pageNum}`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    await browser.close();
    browser = null;

    log(`📦 Total products: ${allProducts.length}`);

    // Format for bulk upload
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
      variations: { colors: [], sizes: [] },
      stockDetails: {},
      shippingCost: 0,
      vendoorProductId: p.id,
      vendoorOrderLink: p.orderLink
    }));

    // Save to storage
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
      
      return res.json({
        success: true,
        message: 'Scraping completed (storage failed)',
        totalProducts: allProducts.length,
        products: formattedProducts,
        note: 'Use products array for bulk upload'
      });
    }

  } catch (err) {
    error('Function error:', err);
    
    if (browser) {
      try {
        await browser.close();
      } catch (e) {}
    }
    
    return res.json({
      success: false,
      error: err.message || 'Scraping failed',
      stack: err.stack
    }, 500);
  }
};
