import puppeteer from 'puppeteer';
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import fs from 'fs';
import https from 'https';

// Vendoor Credentials
const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';
const VENDOOR_LOGIN_URL = 'https://aff.ven-door.com/login';
const VENDOOR_PRODUCTS_URL = 'https://aff.ven-door.com/products';

// Appwrite Configuration
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68d8b9db00134c41e7c8';
const APPWRITE_API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const APPWRITE_DATABASE_ID = '68de037e003bd03c4d45';
const APPWRITE_PRODUCTS_COLLECTION_ID = 'products';
const APPWRITE_CATEGORIES_COLLECTION_ID = 'categories';

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8592879332:AAHYh6RSnKOj0eXz0p6gN1mm4xDB-z4GDvo';
const TELEGRAM_CHAT_ID = '664193835';

// Google Sheets Configuration
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzHzU-1GF4Q1H1OSe9d6BQy_MgTkNds6oEmeNk5oeP64k-mKela-Hcg78VJDFPC6Aqy/exec';

// Profit Margin
const PROFIT_MARGIN = 10; // 10 جنيه زيادة على كل منتج

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// Debug flag (enable with: DEBUG_SCRAPER=1)
const DEBUG = process.env.DEBUG_SCRAPER === '1';
function dlog(...args) {
  if (DEBUG) console.log('[DEBUG]', ...args);
}

// ========================================
// Telegram Functions
// ========================================

async function sendTelegram(message) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });
    
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.ok) {
            console.log('✅ تم إرسال الرسالة على Telegram');
          } else {
            console.error('❌ فشل إرسال الرسالة:', response.description);
          }
          resolve(response.ok);
        } catch (error) {
          console.error('❌ خطأ في تحليل الاستجابة');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ خطأ في الاتصال:', error.message);
      resolve(false);
    });
    
    req.write(data);
    req.end();
  });
}

async function sendToGoogleSheets(reportData) {
  return new Promise((resolve) => {
    const data = JSON.stringify(reportData);
    const makeRequest = (targetUrl, redirectsLeft = 3) => {
      let urlObj;
      try {
        urlObj = new URL(targetUrl);
      } catch (e) {
        console.error('❌ خطأ في عنوان Google Apps Script');
        resolve(false);
        return;
      }
      const options = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          'Accept': 'application/json'
        }
      };
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          const status = res.statusCode || 0;
          if ((status === 301 || status === 302 || status === 303 || status === 307 || status === 308) && res.headers && res.headers.location && redirectsLeft > 0) {
            let nextUrl;
            try {
              nextUrl = new URL(res.headers.location, urlObj.origin).href;
            } catch (e) {
              nextUrl = res.headers.location;
            }
            console.log('↪️ إعادة توجيه إلى:', nextUrl);
            makeRequest(nextUrl, redirectsLeft - 1);
            return;
          }
          try {
            const response = JSON.parse(body);
            if (response.success) {
              console.log('✅ تم حفظ التقرير في Google Sheets');
              console.log('   الصفوف المضافة:', response.rowsAdded || 0);
              resolve(true);
            } else {
              console.error('⚠️ فشل حفظ التقرير في Google Sheets:', response.error || 'غير معروف');
              resolve(false);
            }
          } catch (error) {
            console.error('❌ خطأ في تحليل استجابة Google Sheets');
            if (status) console.error('   HTTP', status);
            const preview = (body || '').toString().slice(0, 200).replace(/\n/g, ' ');
            if (preview) console.error('   Body:', preview);
            resolve(false);
          }
        });
      });
      req.on('error', (error) => {
        console.error('❌ خطأ في الاتصال بـ Google Sheets:', error.message);
        resolve(false);
      });
      req.write(data);
      req.end();
    };
    makeRequest(GOOGLE_APPS_SCRIPT_URL, 3);
  });
}

function formatProgressUpdate(current, total, successCount, failCount) {
  const progress = ((current / total) * 100).toFixed(1);
  const progressBar = generateProgressBar(current, total);
  
  let msg = '⚡ <b>تحديث مباشر</b>\n';
  msg += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
  msg += progressBar + '\n';
  msg += '📊 التقدم: <b>' + current + '/' + total + '</b> (<b>' + progress + '%</b>)\n\n';
  msg += '✅ نجح: <b>' + successCount + '</b>\n';
  msg += '❌ فشل: <b>' + failCount + '</b>\n';
  msg += '⏳ متبقي: <b>' + (total - current) + '</b>\n';
  
  return msg;
}

function generateProgressBar(current, total, length = 20) {
  const filled = Math.floor((current / total) * length);
  const empty = length - filled;
  return '▓'.repeat(filled) + '░'.repeat(empty);
}

function formatFinalReport(data) {
  const { totalFound, successCount, failCount, duration, results = [] } = data;
  const successRate = totalFound > 0 ? ((successCount / totalFound) * 100).toFixed(1) : 0;
  const date = new Date();
  const timeStr = date.toISOString().replace('T', ' ').substring(0, 19);
  
  let msg = '🎉 <b>تقرير نهائي - Vendoor Scraper</b>\n';
  msg += '━━━━━━━━━━━━━━━━━━━━━━\n\n';
  msg += '📊 <b>الإحصائيات:</b>\n';
  msg += '✅ نجح: <b>' + successCount + '</b> منتج\n';
  msg += '❌ فشل: <b>' + failCount + '</b> منتج\n';
  msg += '📦 إجمالي: <b>' + totalFound + '</b> منتج\n';
  msg += '📈 نسبة النجاح: <b>' + successRate + '%</b>\n\n';
  
  if (duration) {
    const min = Math.floor(duration / 60);
    const sec = duration % 60;
    msg += '⏱️ المدة: <b>' + min + 'د ' + sec + 'ث</b>\n';
    const avgTime = totalFound > 0 ? (duration / totalFound).toFixed(1) : 0;
    msg += '⚡ متوسط الوقت: <b>' + avgTime + 'ث/منتج</b>\n\n';
  }
  
  msg += '🕐 ' + timeStr + '\n\n';
  
  if (results.length > 0) {
    msg += '🏆 <b>أمثلة من المنتجات المضافة:</b>\n';
    results.slice(0, 3).forEach((p, i) => {
      const productName = (p.name && p.name.substring(0, 35)) || 'منتج';
      msg += (i + 1) + '. ' + productName + '...\n';
      msg += '   💰 السعر: <b>' + (p.price || 0) + ' ج.م</b>\n';
      if (p.totalStock > 0) {
        msg += '   📦 المخزون: ' + p.totalStock + '\n';
      }
      msg += '\n';
    });
  }
  
  msg += '━━━━━━━━━━━━━━━━━━━━━━\n';
  msg += '✅ <b>اكتمل بنجاح!</b>\n\n';
  msg += '🔗 <a href="https://egygo.me/#/admin/vendoor-products">فتح لوحة التحكم</a>';
  
  return msg;
}

// ========================================
// Scraping Functions
// ========================================

function generateVendoorSKU(productId) {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `VN${productId}${timestamp}${random}`;
}

async function getOrCreateVendoorCategory() {
  try {
    const allCategories = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_CATEGORIES_COLLECTION_ID
    );
    if (allCategories.documents.length > 0) {
      return allCategories.documents[0].$id;
    }
  } catch (error) {
    console.error('❌ خطأ في Category:', error.message);
  }
  return null;
}

async function scrapeProductDetails(page, productUrl) {
  try {
    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const details = await page.evaluate(() => {
      const data = { productImages: [], variants: [], totalStock: 0, title: '', originalPrice: 0 };

      // عنوان المنتج
      const titleEl = document.querySelector('h1, h2, h3, .prodect-text, .product-title');
      if (titleEl && titleEl.textContent) {
        data.title = titleEl.textContent.trim();
      }
      
      // استخراج الصور
      const galleryImages = document.querySelectorAll(
        '.product-gallery img, .product-images img, [class*="gallery"] img, .swiper-slide img'
      );
      
      galleryImages.forEach(img => {
        const src = img.src || img.getAttribute('data-src');
        const isInGallery = img.closest('.product-gallery, .product-images, .swiper');
        const isNotProfile = !img.closest('.vendor-profile, .seller-info, aside');
        
        if (src && src.includes('storage') && isInGallery && isNotProfile && !data.productImages.includes(src)) {
          data.productImages.push(src);
        }
      });
      
      if (data.productImages.length === 0) {
        const mainImages = document.querySelectorAll('.product-detail img, article img');
        mainImages.forEach(img => {
          const src = img.src;
          const isNotSmall = img.width > 100 && img.height > 100;
          const isNotProfile = !img.closest('.vendor-profile, aside');
          
          if (src && src.includes('storage') && isNotSmall && isNotProfile && !data.productImages.includes(src)) {
            data.productImages.push(src);
          }
        });
      }
      
      // محاولة استخراج السعر من الصفحة
      try {
        let priceText = '';
        let foundSelector = '';
        
        // محاولة 1: البحث عن "السعر :" في innerHTML لعناصر صغيرة فقط
        const smallElements = Array.from(document.querySelectorAll('div, p, span, td, h3, h4, h5, strong, b')).filter(el => {
          const txt = (el.textContent || '').trim();
          // تجنب العناصر الكبيرة (container, body, navigation)
          return txt.length < 300 && !el.classList.contains('container') && !el.classList.contains('navbar') && el.tagName !== 'BODY' && el.tagName !== 'HTML';
        });
        
        for (const el of smallElements) {
          const txt = (el.textContent || '').trim();
          // بحث دقيق عن نمط "السعر : رقم جنيه"
          if (/السعر\s*[:：]\s*\d+\s*جنيه/i.test(txt)) {
            priceText = txt;
            foundSelector = el.tagName + (el.className ? '.' + el.className.split(' ')[0] : '');
            break;
          }
        }
        
        // محاولة 2: البحث عن "رقم جنيه" فقط في عناصر صغيرة
        if (!priceText) {
          for (const el of smallElements) {
            const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
            // رقم متبوع بـ "جنيه" أو سابق له
            if (/\d+\s*(?:جنيه|ج\.م|EGP|LE)/i.test(txt)) {
              // استبعاد العمولة، البائع، المخزون
              if (!/(?:عمولة|commission|بائع|seller|stock|مخزون|quantity|في المخزن|in stock)/i.test(txt)) {
                priceText = txt;
                foundSelector = el.tagName + (el.className ? '.' + el.className.split(' ')[0] : '');
                break;
              }
            }
          }
        }
        
        // محاولة 3: البحث في class="price" بالتحديد
        if (!priceText) {
          const priceEls = Array.from(document.querySelectorAll('.price, [class*="price"], [class*="Price"]'));
          for (const el of priceEls) {
            const txt = (el.textContent || '').trim();
            if (txt.length < 200 && /\d/.test(txt)) {
              // ابحث عن "السعر :" في هذا العنصر أو أبناءه
              if (/السعر/i.test(txt)) {
                priceText = txt;
                foundSelector = el.tagName + '.' + (el.className || 'price');
                break;
              }
            }
          }
        }
        
        if (priceText) {
          // استخراج الرقم من النص
          const m = priceText.replace(/[,\s]/g, '').match(/(\d+(?:\.\d+)?)/);
          if (m) {
            data.originalPrice = parseFloat(m[1]);
            data._priceDebug = { raw: priceText.substring(0, 100), selector: foundSelector, parsed: data.originalPrice };
          }
        } else {
          data._priceDebug = { raw: 'not found', selector: 'none' };
        }
      } catch (e) {
        data._priceDebug = { error: e.toString() };
      }

      // استخراج التنويعات والمخزون من الجدول
      data.colors = [];
      data.sizes = [];
      data.colorSizeInventory = [];
      
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        // البحث عن الـ headers
        const headerRow = table.querySelector('thead tr');
        let sizeIdx = -1, colorIdx = -1, qtyIdx = -1;
        
        if (headerRow) {
          const headers = Array.from(headerRow.querySelectorAll('th'));
          headers.forEach((th, idx) => {
            const txt = th.textContent.trim().toLowerCase();
            if (txt.includes('size') || txt.includes('مقاس')) sizeIdx = idx;
            if (txt.includes('color') || txt.includes('لون')) colorIdx = idx;
            if (txt.includes('stock') || txt.includes('كمية') || txt.includes('qty') || txt.includes('quantity')) qtyIdx = idx;
          });
        }
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const isHeaderRow = row.querySelectorAll('th').length > 0;
          if (isHeaderRow) return;
          
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length === 0) return;
          
          let size = sizeIdx >= 0 && cells[sizeIdx] ? cells[sizeIdx].textContent.trim() : '';
          let color = colorIdx >= 0 && cells[colorIdx] ? cells[colorIdx].textContent.trim() : '';
          
          // معالجة "اسود 41" → لون: اسود، مقاس: 41
          if (size && color && size.includes(color)) {
            const sizeOnly = size.replace(color, '').trim();
            size = sizeOnly || size;
          }
          
          let qtyText = qtyIdx >= 0 && cells[qtyIdx] ? cells[qtyIdx].textContent : '';
          if (!qtyText) {
            const numCell = cells.find(c => /\d/.test(c.textContent || ''));
            qtyText = numCell ? numCell.textContent : '0';
          }
          
          const qty = parseInt(qtyText.replace(/\D/g, '')) || 0;
          
          if (color || size || qty > 0) {
            data.colorSizeInventory.push({
              color: color || 'Default',
              size: size || 'Default',
              quantity: qty
            });
            
            if (color && !data.colors.includes(color)) data.colors.push(color);
            if (size && !data.sizes.includes(size)) data.sizes.push(size);
            data.totalStock += qty;
          }
        });
      });
      
      // Unique arrays
      data.colors = Array.from(new Set(data.colors));
      data.sizes = Array.from(new Set(data.sizes.map(s => String(s))));
      
      return data;
    });
    
    return details;
  } catch (error) {
    console.error('   ⚠️ فشل استخراج التفاصيل للمنتج:', productUrl);
    console.error('      السبب:', error && error.message ? error.message : error);
    return null;
  }
}

async function addProductToAppwrite(product, categoryId, page, productIndex) {
  try {
    const ignoreList = ['لوحة التحكم', 'تسجيل الخروج', 'أضف اوردر', 'جميع المنتجات', 'المنتجات الخاصه', 'فيديو'];
    const listTitle = (product.title || '').toString();
    if (ignoreList.some(term => listTitle.includes(term))) {
      console.log('   ⚠️ تم تجاهل المنتج بسبب العنوان (قائمة التجاهل):', listTitle.substring(0, 40));
      return null;
    }
    
    // جلب التفاصيل أولاً للحصول على العنوان والسعر والصور بدقة
    const details = await scrapeProductDetails(page, product.link);
    if (!details) {
      if (DEBUG) {
        try { await page.screenshot({ path: `debug_fail_details_${productIndex}.png`, fullPage: true }); } catch (e) {}
      }
      return null;
    }

    const effectiveTitle = (details.title && details.title.length > 2) ? details.title : product.title;
    let originalPrice = parseFloat((product.price || '').replace(/[^\d.]/g, '')) || 0;
    if (!originalPrice || originalPrice < 5) originalPrice = details.originalPrice || 0;
    if (originalPrice < 5 || originalPrice > 100000) {
      console.log('   ⚠️ سعر غير صالح، سيتم تجاهل المنتج. السعر:', originalPrice, '| الرابط:', product.link);
      if (DEBUG && details._priceDebug) {
        console.log('      [DEBUG] استخراج السعر:', JSON.stringify(details._priceDebug));
      }
      if (DEBUG) {
        try { await page.screenshot({ path: `debug_invalid_price_${productIndex}.png`, fullPage: true }); } catch (e) {}
      }
      return null;
    }
    
    if (DEBUG && details._priceDebug) {
      dlog('تم استخراج السعر بنجاح:', details._priceDebug);
    }
    
    // حساب السعر النهائي (السعر الأصلي + هامش الربح)
    const finalPrice = originalPrice + PROFIT_MARGIN;
    
    console.log(`\n📦 ${effectiveTitle.substring(0, 40)}...`);
    
    const productImages = details.productImages.length > 0 
      ? details.productImages 
      : (product.image ? [product.image] : ['https://via.placeholder.com/400']);
    
    const sku = generateVendoorSKU(productIndex);
    
    const variantsCount = (details.colorSizeInventory || []).length;
    console.log(`   📸 ${productImages.length} | 📦 ${variantsCount} تنويعات | 💰 ${originalPrice}→${finalPrice} ج`);
    if (details.productImages.length === 0) dlog('لا توجد صور مستخرجة من صفحة المنتج:', product.link);
    if (!details.title) dlog('لم يتم استخراج عنوان للمنتج من الصفحة، سيتم استخدام عنوان القائمة');
    
    let description = `منتج من Vendoor - ${effectiveTitle}\n\n`;
    description += `SKU: ${sku}\nالمصدر: Vendoor\nرابط: ${product.link}\n\n`;
    
    // إضافة التنويعات للوصف
    if (details.colorSizeInventory && details.colorSizeInventory.length > 0) {
      description += 'التنويعات:\n';
      details.colorSizeInventory.forEach((v, i) => {
        description += `${i + 1}. ${v.color || '-'} / ${v.size || '-'}`;
        if (v.quantity > 0) description += ` (${v.quantity} قطعة)`;
        description += `\n`;
      });
      description += `\nإجمالي: ${details.totalStock} قطعة\n`;
    }
    
    // إضافة الألوان والمقاسات
    if (details.colors && details.colors.length > 0) {
      description += `\nالألوان: ${details.colors.join(', ')}\n`;
    }
    if (details.sizes && details.sizes.length > 0) {
      description += `المقاسات: ${details.sizes.join(', ')}\n`;
    }
    
    const productData = {
      name: effectiveTitle,
      description: description.substring(0, 1500),
      price: finalPrice, // السعر بعد إضافة الهامش
      originalPrice: originalPrice, // السعر الأصلي من Vendoor
      images: productImages,
      categoryId: categoryId,
      sku: sku,
      source: 'vendoor',
      sourceUrl: product.link,
      status: 'approved',
      totalStock: details.totalStock,
      stock: details.totalStock,
      // الحقول الجديدة - التنويعات
      colors: details.colors || [],
      sizes: details.sizes || [],
      colorSizeInventory: JSON.stringify(details.colorSizeInventory || [])
    };
    
    const document = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_PRODUCTS_COLLECTION_ID,
      ID.unique(),
      productData,
      [Permission.read(Role.any())]
    );
    
    console.log(`   ✅ ${document.$id.substring(0, 10)}`);
    if (DEBUG && details.colorSizeInventory && details.colorSizeInventory.length > 0) {
      dlog('تم حفظ التنويعات:', details.colorSizeInventory.length, 'تنويعة');
    }
    return { ...document, colorSizeInventory: details.colorSizeInventory, colors: details.colors, sizes: details.sizes };
    
  } catch (error) {
    console.error(`   ❌ خطأ أثناء إنشاء المنتج في Appwrite: ${error && error.message ? error.message : error}`);
    if (error && error.response) {
      try { console.error('      Appwrite response:', JSON.stringify(error.response)); } catch (e) { console.error('      Appwrite response (raw):', error.response); }
    }
    if (DEBUG) {
      try { await page.screenshot({ path: `debug_appwrite_error_${productIndex}.png`, fullPage: true }); } catch (e) {}
    }
    return null;
  }
}

// جمع روابط كل المنتجات عبر الصفحات
async function collectAllProductLinks(page) {
  const collected = new Map();
  let currentPage = 1;
  let lastPage = 1;
  while (true) {
    const url = currentPage === 1 ? VENDOOR_PRODUCTS_URL : `${VENDOOR_PRODUCTS_URL}?page=${currentPage}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 500));
    const result = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a'));
      const productAnchors = anchors.filter(a => {
        const href = a.href || '';
        return href.includes('/product/') && !href.includes('/logout') && !href.includes('/login');
      });
      const links = productAnchors.map(a => ({ link: a.href.trim(), title: (a.textContent || '').trim() }));
      let lastPage = 1;
      const pageLinks = Array.from(document.querySelectorAll('a[href*="page="]'));
      const nums = pageLinks.map(a => {
        const m = a.href.match(/[?&]page=(\d+)/);
        return m ? parseInt(m[1], 10) : NaN;
      }).filter(n => !isNaN(n));
      if (nums.length) lastPage = Math.max(...nums);
      return { links, lastPage };
    });
    result.links.forEach(it => collected.set(it.link, it));
    lastPage = Math.max(lastPage, result.lastPage);
    console.log(`📄 صفحة ${currentPage}/${lastPage} - روابط المنتجات المكتشفة: ${result.links.length}`);
    if (currentPage >= lastPage) break;
    currentPage++;
    if (currentPage > 200) break; // أمان
  }
  return Array.from(collected.values());
}

// ========================================
// Main Scraping Function
// ========================================

async function scrapeVendoorProducts() {
  const startTime = Date.now();
  
  console.log('🚀 Vendoor Scraper v14.0 - LIVE UPDATES\n');
  console.log(`📱 Telegram Chat ID: ${TELEGRAM_CHAT_ID}\n`);
  console.log(`💰 Profit Margin: +${PROFIT_MARGIN} ج.م على كل منتج\n`);
  
  // إرسال رسالة البداية
  const now = new Date();
  const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
  const startMsg = '🚀 <b>بدء Vendoor Scraper</b>\n\n' +
                   '⏰ الوقت: ' + timeStr + '\n' +
                   '💰 هامش الربح: <b>+' + PROFIT_MARGIN + ' ج.م</b>\n\n' +
                   '🔄 جاري الاتصال بـ Vendoor...';
  await sendTelegram(startMsg);
  
  const categoryId = await getOrCreateVendoorCategory();
  if (!categoryId) {
    console.error('❌ فشل الحصول على categoryId');
    await sendTelegram('❌ <b>خطأ:</b> فشل الحصول على categoryId');
    process.exit(1);
  }
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--window-size=1920,1080'
      ],
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    if (DEBUG) {
      page.on('console', msg => console.log('[PAGE]', msg.type(), msg.text()));
      page.on('requestfailed', req => console.log('[REQ-FAILED]', req.url(), req.failure() && req.failure().errorText));
    }
    
    console.log('📄 تسجيل دخول...');
    await page.goto(VENDOOR_LOGIN_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });
    
    await page.type('input[name="name"]', VENDOOR_EMAIL, { delay: 100 });
    await page.type('input[type="password"]', VENDOOR_PASSWORD, { delay: 100 });
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
      page.click('button[type="submit"]')
    ]);
    
    console.log('✅ تم تسجيل الدخول!\n');
    await sendTelegram('✅ تم تسجيل الدخول بنجاح!' + '\n' + '🔍 جاري استخراج المنتجات...');
    
    console.log('🔎 جمع روابط المنتجات من كل الصفحات...');
    const products = await collectAllProductLinks(page);
    
    console.log(`📊 تم العثور على ${products.length} منتج\n`);
    
    // إرسال إشعار بعدد المنتجات
    const productsFoundMsg = '📦 <b>تم العثور على ' + products.length + ' منتج</b>\n\n' +
                              '🔄 جاري معالجة المنتجات...\n' +
                              'سيتم إرسال تحديثات كل 5 منتجات';
    await sendTelegram(productsFoundMsg);
    
    console.log('='.repeat(60));
    
    let successCount = 0;
    let failCount = 0;
    const results = [];
    
    // معالجة المنتجات مع تحديثات دورية
    for (let i = 0; i < products.length; i++) {
      console.log(`[${i + 1}/${products.length}]`);
      const result = await addProductToAppwrite(products[i], categoryId, page, i + 1);
      
      if (result) {
        successCount++;
        results.push(result);
      } else {
        failCount++;
      }
      
      // إرسال تحديث كل 5 منتجات
      if ((i + 1) % 5 === 0 || i + 1 === products.length) {
        const progressMsg = formatProgressUpdate(i + 1, products.length, successCount, failCount);
        await sendTelegram(progressMsg);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);
    
    // بيانات التقرير الكاملة
    const fullOutputData = {
      scrapedAt: new Date().toISOString(),
      databaseId: APPWRITE_DATABASE_ID,
      categoryId,
      totalFound: products.length,
      successCount,
      failCount,
      duration,
      profitMargin: PROFIT_MARGIN,
      results: results // كل المنتجات للشيت
    };
    
    // بيانات ملخصة لـ Telegram فقط
    const outputData = {
      ...fullOutputData,
      results: results.slice(0, 5) // أول 5 منتجات فقط للتليجرام
    };
    
    // حفظ النتائج في ملف JSON
    fs.writeFileSync('vendoor-final-report.json', JSON.stringify(outputData, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 النتيجة النهائية:');
    console.log('='.repeat(60));
    console.log(`✅ نجح: ${successCount}`);
    console.log(`❌ فشل: ${failCount}`);
    console.log(`⏱️  المدة: ${Math.floor(duration / 60)}د ${duration % 60}ث`);
    console.log('='.repeat(60));
    
    // إرسال التقرير النهائي على Telegram
    const finalReport = formatFinalReport(outputData);
    await sendTelegram(finalReport);
    console.log('\n📱 تم إرسال التقرير النهائي على Telegram!');
    
    // إرسال التقرير إلى Google Sheets (البيانات الكاملة)
    console.log('\n📊 جاري حفظ التقرير في Google Sheets...');
    const sheetsSaved = await sendToGoogleSheets(fullOutputData);
    
    if (sheetsSaved) {
      console.log('✅ تم حفظ التقرير في Google Sheets بنجاح!');
      await sendTelegram('✅ <b>تم حفظ التقرير في Google Sheets</b>\n\n🔗 <a href="https://docs.google.com/spreadsheets/">فتح Google Sheets</a>');
    } else {
      console.log('⚠️ فشل حفظ التقرير في Google Sheets');
    }
    
    await browser.close();
    return outputData;
    
  } catch (error) {
    console.error('\n❌ خطأ:', error.message);
    const errorMsg = '❌ <b>خطأ في Vendoor Scraper</b>\n\n' +
                     '<code>' + error.message + '</code>\n\n' +
                     'الرجاء التحقق من الـ logs.';
    await sendTelegram(errorMsg);
    if (browser) await browser.close();
    throw error;
  }
}

// ========================================
// Start Scraping
// ========================================

scrapeVendoorProducts()
  .then((data) => {
    console.log('\n✅ اكتمل بنجاح!');
    console.log(`📄 التقرير محفوظ في: vendoor-final-report.json`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ فشل:', error.message);
    process.exit(1);
  });
