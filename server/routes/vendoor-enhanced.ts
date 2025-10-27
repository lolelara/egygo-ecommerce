import { RequestHandler } from 'express';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

const LOGIN_URL = 'https://aff.ven-door.com/login';
const PRODUCTS_BASE_URL = 'https://aff.ven-door.com/products';
const AFFILIATE_ID = '29631';

// مجلد حفظ البيانات
const EXPORTS_DIR = path.join(process.cwd(), 'exports');

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  supplier: string;
  stock: number;
  commission: number;
  variations: {
    colors: string[];
    sizes: string[];
  };
  stockDetails: Record<string, number>;
  shippingCost: number;
  vendoorProductId: string;
  vendoorOrderLink: string;
}

interface ScrapingProgress {
  currentPage: number;
  totalPages: number;
  productsFound: number;
  status: 'idle' | 'running' | 'completed' | 'error';
}

let scrapingProgress: ScrapingProgress = {
  currentPage: 0,
  totalPages: 0,
  productsFound: 0,
  status: 'idle'
};

/**
 * إنشاء مجلد الـ exports إذا لم يكن موجوداً
 */
function ensureExportsDir() {
  if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
  }
}

/**
 * تسجيل الدخول إلى Ven-door
 */
async function loginToVendoor(page: any, email: string, password: string) {
  console.log('🔐 تسجيل الدخول...');
  
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
  
  console.log('✅ تم تسجيل الدخول بنجاح');
}

/**
 * جلب المنتجات من صفحة واحدة
 */
async function scrapeProductsPage(page: any, pageNum: number) {
  const url = `${PRODUCTS_BASE_URL}?page=${pageNum}`;
  
  console.log(`📄 جلب صفحة ${pageNum}...`);
  
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
  
  console.log(`✅ تم جلب ${products.length} منتج من الصفحة ${pageNum}`);
  
  return products;
}

/**
 * جلب تفاصيل منتج واحد
 */
async function fetchProductDetails(page: any, productId: string, basicInfo: any) {
  const url = `https://aff.ven-door.com/affiliates/${AFFILIATE_ID}/orders/create?product=${productId}`;
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const details = await page.evaluate((basicData: any) => {
    const data: any = {
      variations: {
        colors: [],
        sizes: []
      },
      stockDetails: {},
      shippingCost: 0,
      description: '',
      allImages: []
    };
    
    // جلب جميع الصور
    const images = document.querySelectorAll('img[src*="product"], img[src*="storage"]');
    images.forEach((img: any) => {
      const src = img.src || img.getAttribute('data-src');
      if (src && !data.allImages.includes(src)) {
        data.allImages.push(src);
      }
    });
    
    // إذا لم نجد صور، استخدم الصورة الأساسية
    if (data.allImages.length === 0 && basicData.image) {
      data.allImages.push(basicData.image);
    }
    
    // جلب الألوان والمقاسات
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
            
            if (color && !data.variations.colors.includes(color)) {
              data.variations.colors.push(color);
            }
            
            if (size && !data.variations.sizes.includes(size)) {
              data.variations.sizes.push(size);
            }
            
            data.stockDetails[`${color} ${size}`] = quantity;
          }
        }
      });
    }
    
    // جلب تكلفة الشحن
    const shippingText = document.body.innerText;
    const shippingMatch = shippingText.match(/تكلفة الشحن\s+(\d+)/);
    if (shippingMatch) {
      data.shippingCost = parseInt(shippingMatch[1]) || 0;
    }
    
    // جلب الوصف
    const descElements = document.querySelectorAll('p, div[class*="desc"], div[class*="detail"]');
    let descriptions: string[] = [];
    descElements.forEach((el: any) => {
      const text = el.textContent.trim();
      if (text.length > 20 && text.length < 500) {
        descriptions.push(text);
      }
    });
    data.description = descriptions.join('\n\n');
    
    return data;
  }, basicInfo);
  
  return details;
}

/**
 * تحويل البيانات لصيغة قابلة للرفع الجماعي
 */
function formatProductForBulkUpload(basicInfo: any, details: any): Product {
  return {
    id: `VENDOOR_${basicInfo.id}`,
    name: basicInfo.title,
    description: details.description || `منتج من ${basicInfo.supplier}`,
    price: basicInfo.price,
    images: details.allImages.length > 0 ? details.allImages : [basicInfo.image],
    category: 'منتجات Vendoor', // يمكن تحسينها لاحقاً
    supplier: basicInfo.supplier,
    stock: parseInt(basicInfo.stock) || 0,
    commission: basicInfo.commission,
    variations: details.variations,
    stockDetails: details.stockDetails,
    shippingCost: details.shippingCost,
    vendoorProductId: basicInfo.id,
    vendoorOrderLink: basicInfo.orderLink
  };
}

/**
 * حفظ البيانات في ملف JSON
 */
function saveToJSON(products: Product[], filename: string) {
  ensureExportsDir();
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const fullFilename = `${filename}_${timestamp}.json`;
  const filepath = path.join(EXPORTS_DIR, fullFilename);
  
  fs.writeFileSync(filepath, JSON.stringify(products, null, 2), 'utf-8');
  
  console.log(`💾 تم حفظ ${products.length} منتج في: ${fullFilename}`);
  
  return {
    filename: fullFilename,
    filepath,
    count: products.length
  };
}

/**
 * حفظ البيانات في ملف CSV
 */
function saveToCSV(products: Product[], filename: string) {
  ensureExportsDir();
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const fullFilename = `${filename}_${timestamp}.csv`;
  const filepath = path.join(EXPORTS_DIR, fullFilename);
  
  // CSV Headers
  const headers = [
    'ID', 'Name', 'Description', 'Price', 'Images', 'Category', 
    'Supplier', 'Stock', 'Commission', 'Colors', 'Sizes', 
    'Shipping Cost', 'Vendoor ID', 'Order Link'
  ].join(',');
  
  // CSV Rows
  const rows = products.map(p => [
    p.id,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.description.replace(/"/g, '""')}"`,
    p.price,
    `"${p.images.join('|')}"`,
    p.category,
    p.supplier,
    p.stock,
    p.commission,
    `"${p.variations.colors.join('|')}"`,
    `"${p.variations.sizes.join('|')}"`,
    p.shippingCost,
    p.vendoorProductId,
    p.vendoorOrderLink
  ].join(','));
  
  const csv = [headers, ...rows].join('\n');
  
  fs.writeFileSync(filepath, csv, 'utf-8');
  
  console.log(`💾 تم حفظ ${products.length} منتج في: ${fullFilename}`);
  
  return {
    filename: fullFilename,
    filepath,
    count: products.length
  };
}

/**
 * API: جلب جميع المنتجات وحفظها في ملف
 */
export const scrapeAndSaveProducts: RequestHandler = async (req, res) => {
  const { 
    email, 
    password, 
    maxPages = 10, 
    format = 'json', // 'json' or 'csv'
    includeDetails = true // جلب التفاصيل أم لا
  } = req.body;
  
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
      productsFound: 0,
      status: 'running'
    };
    
    console.log('🚀 بدء عملية السكرابينج...');
    
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    // تسجيل الدخول
    await loginToVendoor(page, email, password);
    
    // جلب المنتجات الأساسية
    const basicProducts: any[] = [];
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      scrapingProgress.currentPage = pageNum;
      
      const products = await scrapeProductsPage(page, pageNum);
      
      if (products.length === 0) {
        console.log(`صفحة ${pageNum} فارغة - توقف`);
        break;
      }
      
      basicProducts.push(...products);
      scrapingProgress.productsFound = basicProducts.length;
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`📦 تم جلب ${basicProducts.length} منتج أساسي`);
    
    // جلب التفاصيل إذا طُلب ذلك
    const fullProducts: Product[] = [];
    
    if (includeDetails) {
      console.log('📝 جلب تفاصيل المنتجات...');
      
      for (let i = 0; i < basicProducts.length; i++) {
        const basicProduct = basicProducts[i];
        
        console.log(`⏳ ${i + 1}/${basicProducts.length}: ${basicProduct.title}`);
        
        try {
          const details = await fetchProductDetails(page, basicProduct.id, basicProduct);
          const fullProduct = formatProductForBulkUpload(basicProduct, details);
          fullProducts.push(fullProduct);
          
          // تأخير بسيط بين كل منتج
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`❌ فشل جلب تفاصيل المنتج ${basicProduct.id}:`, error);
          // استخدم البيانات الأساسية فقط
          const fullProduct = formatProductForBulkUpload(basicProduct, {
            variations: { colors: [], sizes: [] },
            stockDetails: {},
            shippingCost: 0,
            description: '',
            allImages: [basicProduct.image]
          });
          fullProducts.push(fullProduct);
        }
      }
    } else {
      // استخدم البيانات الأساسية فقط
      for (const basicProduct of basicProducts) {
        const fullProduct = formatProductForBulkUpload(basicProduct, {
          variations: { colors: [], sizes: [] },
          stockDetails: {},
          shippingCost: 0,
          description: '',
          allImages: [basicProduct.image]
        });
        fullProducts.push(fullProduct);
      }
    }
    
    await browser.close();
    
    // حفظ البيانات
    let saveResult;
    if (format === 'csv') {
      saveResult = saveToCSV(fullProducts, 'vendoor_products');
    } else {
      saveResult = saveToJSON(fullProducts, 'vendoor_products');
    }
    
    scrapingProgress.status = 'completed';
    
    console.log('🎉 انتهت عملية السكرابينج بنجاح!');
    
    res.json({
      success: true,
      message: 'تم جلب وحفظ المنتجات بنجاح',
      totalProducts: fullProducts.length,
      lastPage: scrapingProgress.currentPage,
      file: saveResult,
      downloadUrl: `/api/vendoor/download/${saveResult.filename}`
    });
    
  } catch (error: any) {
    console.error('❌ خطأ في السكرابينج:', error);
    
    if (browser) {
      await browser.close();
    }
    
    scrapingProgress.status = 'error';
    
    res.status(500).json({ 
      error: error.message || 'فشل جلب المنتجات' 
    });
  }
};

/**
 * API: تحميل ملف الـ export
 */
export const downloadExportFile: RequestHandler = (req, res) => {
  const { filename } = req.params;
  
  const filepath = path.join(EXPORTS_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'الملف غير موجود' });
  }
  
  res.download(filepath);
};

/**
 * API: الحصول على قائمة الملفات المُصدّرة
 */
export const listExportFiles: RequestHandler = (req, res) => {
  ensureExportsDir();
  
  const files = fs.readdirSync(EXPORTS_DIR)
    .filter(f => f.endsWith('.json') || f.endsWith('.csv'))
    .map(f => {
      const stats = fs.statSync(path.join(EXPORTS_DIR, f));
      return {
        filename: f,
        size: stats.size,
        created: stats.birthtime,
        downloadUrl: `/api/vendoor/download/${f}`
      };
    })
    .sort((a, b) => b.created.getTime() - a.created.getTime());
  
  res.json({ files });
};

/**
 * API: جلب تقدم العملية
 */
export const getScrapingProgress: RequestHandler = (req, res) => {
  res.json(scrapingProgress);
};

/**
 * API: حذف ملف
 */
export const deleteExportFile: RequestHandler = (req, res) => {
  const { filename } = req.params;
  
  const filepath = path.join(EXPORTS_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ error: 'الملف غير موجود' });
  }
  
  fs.unlinkSync(filepath);
  
  res.json({ success: true, message: 'تم حذف الملف بنجاح' });
};
