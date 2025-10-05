import { RequestHandler } from 'express';
import puppeteer from 'puppeteer';

const LOGIN_URL = 'https://aff.ven-door.com/login';
const PRODUCTS_BASE_URL = 'https://aff.ven-door.com/products';
const AFFILIATE_ID = '29631';

interface ScrapingProgress {
  currentPage: number;
  totalPages: number;
  productsFound: number;
}

let scrapingProgress: ScrapingProgress = {
  currentPage: 0,
  totalPages: 0,
  productsFound: 0
};

/**
 * تسجيل الدخول إلى Ven-door
 */
async function loginToVendoor(page: any, email: string, password: string) {
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
    throw new Error('فشل تسجيل الدخول - تحقق من البيانات');
  }
}

/**
 * جلب المنتجات من صفحة واحدة
 */
async function scrapeProductsPage(page: any, pageNum: number) {
  const url = `${PRODUCTS_BASE_URL}?page=${pageNum}`;
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const products = await page.evaluate(() => {
    const productsList: any[] = [];
    const rows = document.querySelectorAll('table tbody tr');
    
    rows.forEach((row: any) => {
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
        
        const img = imageCell?.querySelector('img');
        const image = img ? (img.src || img.getAttribute('data-src')) : '';
        const title = nameCell?.textContent.trim() || '';
        const supplier = supplierCell?.textContent.trim() || '';
        const price = priceCell?.textContent.replace(/[^\d]/g, '') || '';
        const commission = commissionCell?.textContent.replace(/[^\d]/g, '') || '';
        const stock = stockCell?.textContent.trim() || '';
        
        const orderLink = actionCell?.querySelector('a[href*="orders/create"]');
        let productId = '';
        
        if (orderLink) {
          const href = orderLink.href;
          const match = href.match(/product[=\/](\d+)/);
          if (match) productId = match[1];
        }
        
        if (title && productId) {
          productsList.push({
            id: productId,
            title,
            supplier,
            price,
            commission,
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

/**
 * جلب تفاصيل منتج واحد
 */
async function fetchProductDetails(page: any, productId: string) {
  const url = `https://aff.ven-door.com/affiliates/${AFFILIATE_ID}/orders/create?product=${productId}`;
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const details = await page.evaluate(() => {
    const data: any = {
      variations: {},
      stockDetails: {},
      shipping: '',
      description: ''
    };
    
    const sizeSelect = document.querySelector('select[name="sizePro[]"]');
    if (sizeSelect) {
      const options = Array.from(sizeSelect.querySelectorAll('option'));
      options.forEach((option: any) => {
        if (option.value && option.textContent) {
          const text = option.textContent.trim();
          const match = text.match(/الكمية=>\s*\(([^)]+)\)\s*-\s*المقاس=>\(([^)]+)\)/);
          
          if (match) {
            const quantity = parseInt(match[1].trim()) || 0;
            const sizeInfo = match[2].trim();
            const parts = sizeInfo.split(/\s+/);
            const size = parts[parts.length - 1];
            const color = parts.slice(0, -1).join(' ');
            
            if (!data.variations[color]) {
              data.variations[color] = [];
            }
            
            if (!data.variations[color].includes(size)) {
              data.variations[color].push(size);
            }
            
            data.stockDetails[`${color} ${size}`] = quantity;
          }
        }
      });
    }
    
    const shippingText = document.body.innerText;
    const shippingMatch = shippingText.match(/تكلفة الشحن\s+(\d+)/);
    if (shippingMatch) {
      data.shipping = shippingMatch[1];
    }
    
    return data;
  });
  
  return details;
}

/**
 * API: جلب جميع المنتجات
 */
export const scrapeAllProducts: RequestHandler = async (req, res) => {
  const { email, password, maxPages = 41 } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'البريد الإلكتروني وكلمة المرور مطلوبان' 
    });
  }
  
  let browser;
  try {
    scrapingProgress = {
      currentPage: 0,
      totalPages: maxPages,
      productsFound: 0
    };
    
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // تسجيل الدخول
    await loginToVendoor(page, email, password);
    
    // جلب المنتجات
    const allProducts: any[] = [];
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      scrapingProgress.currentPage = pageNum;
      
      const products = await scrapeProductsPage(page, pageNum);
      
      if (products.length === 0) {
        console.log(`صفحة ${pageNum} فارغة - توقف`);
        break;
      }
      
      allProducts.push(...products);
      scrapingProgress.productsFound = allProducts.length;
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    await browser.close();
    
    res.json({
      success: true,
      totalProducts: allProducts.length,
      lastPage: scrapingProgress.currentPage,
      products: allProducts
    });
    
  } catch (error: any) {
    console.error('Error scraping products:', error);
    
    if (browser) {
      await browser.close();
    }
    
    res.status(500).json({ 
      error: error.message || 'فشل جلب المنتجات' 
    });
  }
};

/**
 * API: جلب تقدم العملية
 */
export const getScrapingProgress: RequestHandler = (req, res) => {
  res.json(scrapingProgress);
};

/**
 * API: استيراد منتج واحد
 */
export const importProduct: RequestHandler = async (req, res) => {
  const { productId, vendoorEmail, vendoorPassword } = req.body;
  
  if (!productId || !vendoorEmail || !vendoorPassword) {
    return res.status(400).json({ 
      error: 'بيانات غير كاملة' 
    });
  }
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // تسجيل الدخول
    await loginToVendoor(page, vendoorEmail, vendoorPassword);
    
    // جلب التفاصيل
    const details = await fetchProductDetails(page, productId);
    
    await browser.close();
    
    // هنا سيتم إضافة المنتج إلى قاعدة البيانات
    // يمكنك إضافة الكود لحفظ المنتج في Appwrite
    
    res.json({
      success: true,
      productId,
      details
    });
    
  } catch (error: any) {
    console.error('Error importing product:', error);
    
    if (browser) {
      await browser.close();
    }
    
    res.status(500).json({ 
      error: error.message || 'فشل استيراد المنتج' 
    });
  }
};
