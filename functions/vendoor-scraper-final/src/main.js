const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const { Client, Storage, ID } = require('node-appwrite');

const LOGIN_URL = 'https://aff.ven-door.com/login';
const PRODUCTS_BASE_URL = 'https://aff.ven-door.com/products';

module.exports = async ({ req, res, log, error }) => {
  let browser;
  
  try {
    log('🚀 Vendoor Scraper - بدء العمل');
    
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
    
    const { email, password, maxPages = 10 } = payload;

    log(`📧 Email: ${email}, Pages: ${maxPages}`);

    if (!email || !password) {
      return res.json({ success: false, error: 'Credentials required' }, 400);
    }

    // Initialize Appwrite
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const storage = new Storage(client);

    log('🌐 Launching browser with chrome-aws-lambda...');

    // Launch browser using chrome-aws-lambda
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    log('✅ Browser launched');

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    // Login
    log('🔐 Logging in...');
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    
    await page.waitForSelector('input[name="name"]', { timeout: 5000 });
    await page.type('input[name="name"]', email, { delay: 50 });
    await page.type('input[type="password"]', password, { delay: 50 });
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
      page.click('button[type="submit"]')
    ]).catch(() => {});
    
    await new Promise(r => setTimeout(r, 5000));
    
    if (page.url().includes('login')) {
      throw new Error('Login failed');
    }

    log('✅ Login successful');

    // Scrape products
    const allProducts = [];
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      log(`📄 Page ${pageNum}...`);
      
      const url = `${PRODUCTS_BASE_URL}?page=${pageNum}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));
      
      const products = await page.evaluate(() => {
        const list = [];
        const rows = document.querySelectorAll('table tbody tr');
        
        rows.forEach((row) => {
          try {
            const cells = row.querySelectorAll('td');
            if (cells.length < 8) return;
            
            const img = cells[1]?.querySelector('img');
            const nameLink = cells[2]?.querySelector('a');
            const supplierLink = cells[3]?.querySelector('a');
            const priceLink = cells[4]?.querySelector('a');
            const commissionLink = cells[5]?.querySelector('a');
            const stockSpan = cells[6]?.querySelector('span');
            const orderLink = cells[8]?.querySelector('a');
            
            const title = nameLink?.textContent?.trim() || '';
            const price = (priceLink?.textContent?.replace(/[^\d]/g, '') || '0');
            const commission = (commissionLink?.textContent?.replace(/[^\d]/g, '') || '0');
            
            let productId = '';
            if (orderLink) {
              const match = orderLink.href.match(/product=(\d+)/);
              if (match) productId = match[1];
            }
            
            if (title && productId) {
              list.push({
                id: productId,
                title,
                supplier: supplierLink?.textContent?.trim() || '',
                price: parseInt(price) || 0,
                commission: parseInt(commission) || 0,
                stock: stockSpan?.textContent?.trim() || '',
                image: img ? (img.src || img.getAttribute('data-src')) : '',
                orderLink: orderLink?.href || ''
              });
            }
          } catch (e) {}
        });
        
        return list;
      });
      
      if (products.length === 0) {
        log(`Page ${pageNum} empty - stop`);
        break;
      }
      
      allProducts.push(...products);
      log(`✅ ${products.length} products`);
      
      await new Promise(r => setTimeout(r, 500));
    }

    await browser.close();
    browser = null;

    log(`📦 Total: ${allProducts.length}`);

    // Format
    const formatted = allProducts.map(p => ({
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

    // Save
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `vendoor_${timestamp}.json`;
    const content = JSON.stringify(formatted, null, 2);

    log(`💾 Saving ${filename}...`);

    try {
      const file = await storage.createFile(
        process.env.VENDOOR_BUCKET_ID || 'vendoor-exports',
        ID.unique(),
        filename,
        Buffer.from(content, 'utf-8')
      );

      return res.json({
        success: true,
        totalProducts: allProducts.length,
        file: {
          id: file.$id,
          name: filename,
          downloadUrl: `/api/vendoor/download/${file.$id}`
        }
      });
    } catch (storageError) {
      return res.json({
        success: true,
        totalProducts: allProducts.length,
        products: formatted
      });
    }

  } catch (err) {
    error('Error:', err);
    
    if (browser) {
      try { await browser.close(); } catch (e) {}
    }
    
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
