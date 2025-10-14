import { RequestHandler } from 'express';
import { chromium } from 'playwright';

// بيانات تسجيل الدخول الثابتة
const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';

const BASE = 'https://aff.ven-door.com';
const LOGIN_URL = `${BASE}/login`;
const PRODUCTS_URL = (page: number) => `${BASE}/products?page=${page}`;

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

/**
 * تسجيل الدخول إلى Vendoor
 */
async function loginToVendoor(page: any, email: string, password: string) {
  console.log('🔐 [PW] Logging in...');
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(2000);
  
  await page.waitForSelector('input[name="name"]', { timeout: 10000 });
  await page.type('input[name="name"]', email, { delay: 50 });
  await page.type('input[type="password"]', password, { delay: 50 });
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {}),
    page.click('button[type="submit"]')
  ]).catch(() => {});
  
  await sleep(5000);
  
  if (page.url().includes('login')) {
    throw new Error('فشل تسجيل الدخول');
  }
  
  console.log('✅ تم تسجيل الدخول بنجاح');
}

/**
 * جلب منتجات من صفحة واحدة
 */
async function scrapeProductsPage(page: any, pageNum: number) {
  const url = PRODUCTS_URL(pageNum);
  console.log(`📄 Fetching products page ${pageNum}`);
  
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  
  await page.waitForSelector('table tbody tr a[href*="/product/"]', { timeout: 10000 }).catch(() => {});
  
  const products = await page.evaluate(`
    (function() {
      var out = [];
      var pickText = function(el) {
        if (!el) return '';
        var text = el.innerText || el.textContent || '';
        return String(text).trim();
      };
      
      var rows = document.querySelectorAll('table tbody tr');
      for (var i = 0; i < rows.length; i++) {
        try {
          var row = rows[i];
          var tds = row.querySelectorAll('td');
          if (!tds || tds.length < 3) continue;

          var imgA = tds[1] && tds[1].querySelector('a img');
          var titleA = (tds[3] && tds[3].querySelector('a')) || (tds[2] && tds[2].querySelector('a'));
          var secondaryA = tds[2] && tds[2].querySelector('a');
          var priceA = tds[4] && tds[4].querySelector('a, span, div, b, strong');
          var commissionA = tds[5] && tds[5].querySelector('a, span, div, b, strong');
          var stockSpan = tds[6] && tds[6].querySelector('span.stock-odd, span, div');

          var image = imgA ? (imgA.getAttribute('src') || imgA.getAttribute('data-src') || '') : '';
          var title = pickText(titleA) || pickText(tds[3]) || pickText(tds[2]) || pickText(row);
          var supplier = pickText(secondaryA) || pickText(tds[2]) || pickText(tds[3]);
          var price = pickText(priceA) || pickText(tds[4]);
          var commission = pickText(commissionA) || pickText(tds[5]);
          var stock = pickText(stockSpan) || pickText(tds[6]);

          var id = '';
          var linkEl = titleA || row.querySelector('a[href*="/product/"]');
          var rawHref = linkEl ? (linkEl.getAttribute('href') || linkEl.href || '').trim() : '';
          if (rawHref) {
            try {
              var a = document.createElement('a');
              a.href = rawHref;
              var parts = a.pathname.split('/').filter(function(p) { return p; });
              var idxp = -1;
              for (var j = 0; j < parts.length; j++) {
                if (parts[j] === 'products' || parts[j] === 'product') { idxp = j; break; }
              }
              if (idxp >= 0 && parts[idxp + 1]) id = parts[idxp + 1];
              else id = parts[parts.length - 1] || '';
            } catch (e) {}
          }

          if (title) {
            out.push({ 
              id: id || ('row-' + (i + 1)), 
              title: title, 
              supplier: supplier, 
              price: price, 
              commission: commission, 
              stock: stock, 
              image: image 
            });
          }
        } catch (e) {}
      }
      return out;
    })()
  `);
  
  console.log(`📦 Extracted ${products.length} products from page ${pageNum}`);
  return products;
}

/**
 * API: جلب جميع المنتجات
 */
export const scrapeAllProducts: RequestHandler = async (req, res) => {
  const { email = VENDOOR_EMAIL, password = VENDOOR_PASSWORD, maxPages = 41 } = req.body;
  
  let browser;
  try {
    browser = await chromium.launch({ 
      headless: true, 
      args: ['--no-sandbox','--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    await loginToVendoor(page, email, password);
    
    const allProducts: any[] = [];
    
    for (let p = 1; p <= maxPages; p++) {
      const products = await scrapeProductsPage(page, p);
      
      if (products.length === 0) {
        console.log(`✅ No more products at page ${p}`);
        break;
      }
      
      allProducts.push(...products);
      await sleep(400);
    }
    
    await browser.close();
    
    res.json({
      success: true,
      totalProducts: allProducts.length,
      totalPages: maxPages,
      products: allProducts
    });
    
  } catch (error: any) {
    console.error('Error scraping all products:', error);
    
    if (browser) {
      await browser.close();
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message || 'فشل جلب المنتجات' 
    });
  }
};

/**
 * API: جلب منتج واحد
 */
export const scrapeSingleProduct: RequestHandler = async (req, res) => {
  const { email = VENDOOR_EMAIL, password = VENDOOR_PASSWORD, productId } = req.body;
  
  if (!productId) {
    return res.status(400).json({ 
      success: false,
      error: 'رقم المنتج مطلوب' 
    });
  }
  
  let browser;
  try {
    browser = await chromium.launch({ 
      headless: true, 
      args: ['--no-sandbox','--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    await loginToVendoor(page, email, password);
    
    // الذهاب مباشرة لصفحة المنتج
    const productUrl = `${BASE}/product/${productId}`;
    await page.goto(productUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await sleep(2000);
    
    // استخراج بيانات المنتج
    const product = await page.evaluate(`
      (function() {
        var pickText = function(el) {
          if (!el) return '';
          var text = el.innerText || el.textContent || '';
          return String(text).trim();
        };
        
        var title = pickText(document.querySelector('h1, .product-title, .product-name'));
        var image = '';
        var imgEl = document.querySelector('.product-image img, img[src*="products_image"]');
        if (imgEl) image = imgEl.getAttribute('src') || imgEl.src || '';
        
        var priceEl = document.querySelector('.price, .product-price, [class*="price"]');
        var price = pickText(priceEl);
        
        return {
          id: '${productId}',
          title: title || 'منتج من Vendoor',
          supplier: '',
          price: price,
          commission: '',
          stock: '',
          image: image
        };
      })()
    `);
    
    await browser.close();
    
    res.json({
      success: true,
      product: product
    });
    
  } catch (error: any) {
    console.error('Error scraping single product:', error);
    
    if (browser) {
      await browser.close();
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message || 'فشل جلب المنتج' 
    });
  }
};

/**
 * API: استيراد منتج إلى قاعدة البيانات
 */
export const importProduct: RequestHandler = async (req, res) => {
  const { product, userId, userName, markupPercentage = 20 } = req.body;
  
  if (!product) {
    return res.status(400).json({ 
      success: false,
      error: 'بيانات المنتج مطلوبة' 
    });
  }
  
  if (!userId || !userName) {
    return res.status(400).json({ 
      success: false,
      error: 'معلومات المستخدم مطلوبة' 
    });
  }
  
  try {
    const { importVendoorProduct } = await import('../lib/vendoor-processor');
    
    const savedProduct = await importVendoorProduct(
      product,
      userId,
      userName,
      markupPercentage
    );
    
    res.json({
      success: true,
      message: savedProduct.isNew ? 'تم استيراد المنتج بنجاح' : 'تم تحديث المنتج بنجاح',
      product: savedProduct,
      isNew: savedProduct.isNew
    });
    
  } catch (error: any) {
    console.error('Error importing product:', error);
    
    res.status(500).json({ 
      success: false,
      error: error.message || 'فشل استيراد المنتج' 
    });
  }
};

/**
 * API: استيراد عدة منتجات دفعة واحدة
 */
export const importMultipleProducts: RequestHandler = async (req, res) => {
  const { products, userId, userName, markupPercentage = 20 } = req.body;
  
  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ 
      success: false,
      error: 'قائمة المنتجات مطلوبة' 
    });
  }
  
  if (!userId || !userName) {
    return res.status(400).json({ 
      success: false,
      error: 'معلومات المستخدم مطلوبة' 
    });
  }
  
  try {
    const { importVendoorProduct } = await import('../lib/vendoor-processor');
    
    const results = {
      success: 0,
      failed: 0,
      updated: 0,
      errors: [] as string[]
    };
    
    for (const product of products) {
      try {
        const savedProduct = await importVendoorProduct(
          product,
          userId,
          userName,
          markupPercentage
        );
        
        if (savedProduct.isNew) {
          results.success++;
        } else {
          results.updated++;
        }
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${product.title}: ${error.message}`);
      }
    }
    
    res.json({
      success: true,
      results,
      message: `تم استيراد ${results.success} منتج جديد، تحديث ${results.updated} منتج، فشل ${results.failed} منتج`
    });
    
  } catch (error: any) {
    console.error('Error importing multiple products:', error);
    
    res.status(500).json({ 
      success: false,
      error: error.message || 'فشل استيراد المنتجات' 
    });
  }
};

/**
 * API: تحديث منتجات Vendoor الموجودة
 */
export const updateVendoorProducts: RequestHandler = async (req, res) => {
  const { email = VENDOOR_EMAIL, password = VENDOOR_PASSWORD } = req.body;
  
  let browser;
  try {
    browser = await chromium.launch({ 
      headless: true, 
      args: ['--no-sandbox','--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    await loginToVendoor(page, email, password);
    
    // جلب جميع المنتجات
    const allProducts: any[] = [];
    
    for (let p = 1; p <= 41; p++) {
      const products = await scrapeProductsPage(page, p);
      
      if (products.length === 0) {
        break;
      }
      
      allProducts.push(...products);
      await sleep(400);
    }
    
    await browser.close();
    
    // تحديث المنتجات في قاعدة البيانات
    const { updateVendoorProducts: updateProducts } = await import('../lib/vendoor-processor');
    const results = await updateProducts(allProducts);
    
    res.json({
      success: true,
      totalProducts: allProducts.length,
      updated: results.updated,
      failed: results.failed,
      message: `تم تحديث ${results.updated} منتج، فشل ${results.failed} منتج`
    });
    
  } catch (error: any) {
    console.error('Error updating Vendoor products:', error);
    
    if (browser) {
      await browser.close();
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message || 'فشل تحديث المنتجات' 
    });
  }
};
