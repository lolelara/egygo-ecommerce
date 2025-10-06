import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'https://egygo-ecommerce.appwrite.network'],
  credentials: true
}));
app.use(express.json());

const VENDOOR_EMAIL = process.env.VENDOOR_EMAIL || 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = process.env.VENDOOR_PASSWORD || 'hema2004';
const LOGIN_URL = 'https://aff.ven-door.com/login';
const PRODUCTS_BASE_URL = 'https://aff.ven-door.com/products';
const MAX_PAGES = 41;

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Vendoor API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Vendoor Scraper API',
    endpoints: {
      health: 'GET /health',
      scrapeAll: 'GET /scrape-all',
      scrapePage: 'GET /scrape-page?page=1'
    }
  });
});

// جلب جميع المنتجات
app.get('/scrape-all', async (req, res) => {
  console.log('🚀 بدء جلب جميع المنتجات...');
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser'
    });
    
    const page = await browser.newPage();
    
    // تسجيل الدخول
    await loginToVendoor(page);
    
    const allProducts = [];
    let currentPage = 1;
    
    // جلب المنتجات من كل صفحة
    while (currentPage <= MAX_PAGES) {
      console.log(`📄 معالجة الصفحة ${currentPage}/${MAX_PAGES}...`);
      
      const products = await scrapeProductsPage(page, currentPage);
      
      if (products.length === 0) {
        console.log(`✅ تم الوصول لآخر صفحة عند ${currentPage - 1}`);
        break;
      }
      
      allProducts.push(...products);
      console.log(`✅ تم جلب ${products.length} منتج من الصفحة ${currentPage}`);
      
      currentPage++;
      
      // انتظار قصير بين الصفحات
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await browser.close();
    
    console.log(`🎉 تم جلب ${allProducts.length} منتج من ${currentPage - 1} صفحة`);
    
    res.json({
      success: true,
      totalProducts: allProducts.length,
      totalPages: currentPage - 1,
      products: allProducts,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ خطأ:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// جلب صفحة واحدة
app.get('/scrape-page', async (req, res) => {
  const pageNum = parseInt(req.query.page) || 1;
  
  console.log(`🚀 جلب منتجات الصفحة ${pageNum}...`);
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser'
    });
    
    const page = await browser.newPage();
    
    // تسجيل الدخول
    await loginToVendoor(page);
    
    // جلب المنتجات
    const products = await scrapeProductsPage(page, pageNum);
    
    await browser.close();
    
    console.log(`✅ تم جلب ${products.length} منتج`);
    
    res.json({
      success: true,
      page: pageNum,
      totalProducts: products.length,
      products: products,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ خطأ:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * تسجيل الدخول إلى Ven-door
 */
async function loginToVendoor(page) {
  console.log('🔐 تسجيل الدخول...');
  
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await page.waitForSelector('input[name="name"]', { timeout: 10000 });
  await page.type('input[name="name"]', VENDOOR_EMAIL, { delay: 50 });
  await page.type('input[type="password"]', VENDOOR_PASSWORD, { delay: 50 });
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
    page.click('button[type="submit"]')
  ]).catch(() => {});
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const currentUrl = page.url();
  if (currentUrl.includes('login')) {
    throw new Error('فشل تسجيل الدخول - يرجى التحقق من البيانات');
  }
  
  console.log('✅ تم تسجيل الدخول بنجاح');
}

/**
 * جلب منتجات صفحة واحدة
 */
async function scrapeProductsPage(page, pageNum) {
  const url = `${PRODUCTS_BASE_URL}?page=${pageNum}`;
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const products = await page.evaluate(() => {
    const productsList = [];
    const rows = document.querySelectorAll('table tbody tr');
    
    rows.forEach(row => {
      try {
        const cells = row.querySelectorAll('td');
        if (cells.length < 5) return;
        
        const imageCell = cells[0];
        const nameCell = cells[1];
        const supplierCell = cells[2];
        const priceCell = cells[3];
        const commissionCell = cells[4];
        const stockCell = cells[5];
        const actionCell = cells[7];
        
        // استخراج البيانات
        const img = imageCell?.querySelector('img');
        const image = img ? (img.src || img.getAttribute('data-src')) : '';
        const title = nameCell?.textContent.trim() || '';
        const supplier = supplierCell?.textContent.trim() || '';
        const price = priceCell?.textContent.trim() || '';
        const commission = commissionCell?.textContent.trim() || '';
        const stock = stockCell?.textContent.trim() || '';
        
        // استخراج رقم المنتج
        const viewBtn = actionCell?.querySelector('a[href*="/products/"]');
        const productId = viewBtn ? viewBtn.href.split('/products/')[1] : '';
        
        if (productId && title) {
          productsList.push({
            id: productId,
            title,
            supplier,
            price,
            commission,
            stock,
            image
          });
        }
      } catch (error) {
        console.error('خطأ في معالجة صف:', error);
      }
    });
    
    return productsList;
  });
  
  return products;
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Vendoor API running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Scrape all: http://localhost:${PORT}/scrape-all`);
  console.log(`📄 Scrape page: http://localhost:${PORT}/scrape-page?page=1`);
});
