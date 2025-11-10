import puppeteer from 'puppeteer';
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import fs from 'fs';
import https from 'https';

const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';
const VENDOOR_LOGIN_URL = 'https://aff.ven-door.com/login';
const VENDOOR_PRODUCTS_URL = 'https://aff.ven-door.com/products';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68d8b9db00134c41e7c8';
const APPWRITE_API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const APPWRITE_DATABASE_ID = '68de037e003bd03c4d45';
const APPWRITE_PRODUCTS_COLLECTION_ID = 'products';
const APPWRITE_CATEGORIES_COLLECTION_ID = 'categories';

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '8592879332:AAHYh6RSnKOj0eXz0p6gN1mm4xDB-z4GDvo';
const TELEGRAM_CHAT_ID = '664193835'; // Your Telegram Chat ID

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

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
        'Content-Length': data.length
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

function formatReport(data) {
  const { totalFound, successCount, failCount, duration, results = [] } = data;
  const successRate = totalFound > 0 ? ((successCount / totalFound) * 100).toFixed(1) : 0;
  const date = new Date();
  const timeStr = date.toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });
  
  let msg = `🎉 <b>تقرير Vendoor Scraper</b>\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `📊 <b>الإحصائيات:</b>\n`;
  msg += `✅ نجح: <b>${successCount}</b> منتج\n`;
  msg += `❌ فشل: <b>${failCount}</b> منتج\n`;
  msg += `📦 إجمالي: <b>${totalFound}</b> منتج\n`;
  msg += `📈 نسبة النجاح: <b>${successRate}%</b>\n\n`;
  
  if (duration) {
    const min = Math.floor(duration / 60);
    const sec = duration % 60;
    msg += `⏱️ المدة: <b>${min}د ${sec}ث</b>\n`;
  }
  
  msg += `🕐 ${timeStr}\n\n`;
  
  if (results.length > 0) {
    msg += `🏆 <b>أمثلة من المنتجات:</b>\n`;
    results.slice(0, 3).forEach((p, i) => {
      msg += `${i + 1}. ${p.name?.substring(0, 35) || 'منتج'}...\n`;
      msg += `   SKU: <code>${p.sku}</code>\n`;
      msg += `   السعر: <b>${p.price || 0} ج</b>\n`;
      if (p.totalStock > 0) {
        msg += `   المخزون: ${p.totalStock}\n`;
      }
      msg += `\n`;
    });
  }
  
  msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `✅ <b>اكتمل بنجاح!</b>\n\n`;
  msg += `🔗 <a href="https://cloud.appwrite.io/console/project-${APPWRITE_PROJECT_ID}/databases/${APPWRITE_DATABASE_ID}/collection-${APPWRITE_PRODUCTS_COLLECTION_ID}">فتح المنتجات في Appwrite</a>`;
  
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
  } catch (error) {}
  return null;
}

async function scrapeProductDetails(page, productUrl) {
  try {
    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const details = await page.evaluate(() => {
      const data = { productImages: [], variants: [], totalStock: 0 };
      
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
      
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length >= 2) {
            const variant = { color: '', size: '', stock: 0 };
            
            cells.forEach((cell, idx) => {
              const text = cell.textContent.trim();
              if (idx === 0 && text.length < 30) variant.color = text;
              if (idx === 1 && text.length < 20) variant.size = text;
              
              const stockMatch = text.match(/\d+/);
              if (stockMatch && parseInt(stockMatch[0]) > 0) {
                variant.stock = parseInt(stockMatch[0]);
                data.totalStock += variant.stock;
              }
            });
            
            if (variant.color || variant.size || variant.stock > 0) {
              data.variants.push(variant);
            }
          }
        });
      });
      
      return data;
    });
    
    return details;
  } catch (error) {
    return null;
  }
}

async function addProductToAppwrite(product, categoryId, page, productIndex) {
  try {
    const ignoreList = ['لوحة التحكم', 'تسجيل الخروج', 'أضف اوردر', 'جميع المنتجات', 'المنتجات الخاصه', 'فيديو'];
    if (ignoreList.some(term => product.title.includes(term))) {
      return null;
    }
    
    const price = parseFloat(product.price.replace(/[^\d.]/g, '')) || 0;
    if (price < 50 || price > 100000) {
      return null;
    }
    
    console.log(`\n📦 ${product.title.substring(0, 40)}...`);
    
    const details = await scrapeProductDetails(page, product.link);
    if (!details) return null;
    
    const productImages = details.productImages.length > 0 
      ? details.productImages 
      : (product.image ? [product.image] : ['https://via.placeholder.com/400']);
    
    const sku = generateVendoorSKU(productIndex);
    
    console.log(`   📸 ${productImages.length} | 📦 ${details.variants.length} | 🏷️ ${sku}`);
    
    let description = `منتج من Vendoor - ${product.title}\n\n`;
    description += `SKU: ${sku}\nالمصدر: Vendoor\nرابط: ${product.link}\n\n`;
    
    if (details.variants.length > 0) {
      description += 'التنويعات:\n';
      details.variants.forEach((v, i) => {
        description += `${i + 1}. ${v.color || '-'} / ${v.size || '-'}`;
        if (v.stock > 0) description += ` (${v.stock} قطعة)`;
        description += `\n`;
      });
      description += `\nإجمالي: ${details.totalStock} قطعة\n`;
    }
    
    const productData = {
      name: product.title,
      description: description.substring(0, 1500),
      price: price,
      images: productImages,
      categoryId: categoryId,
      sku: sku,
      source: 'vendoor',
      status: 'draft',
      totalStock: details.totalStock
    };
    
    const document = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_PRODUCTS_COLLECTION_ID,
      ID.unique(),
      productData,
      [Permission.read(Role.any())]
    );
    
    console.log(`   ✅ ${document.$id.substring(0, 10)}`);
    return { ...document, variants: details.variants };
    
  } catch (error) {
    console.error(`   ❌ ${error.message}`);
    return null;
  }
}

// ========================================
// Main Scraping Function
// ========================================

async function scrapeVendoorProducts() {
  const startTime = Date.now();
  
  console.log('🚀 Vendoor Scraper v13.0 - TELEGRAM READY\n');
  console.log(`📱 سيتم إرسال التقارير إلى Telegram Chat ID: ${TELEGRAM_CHAT_ID}\n`);
  
  const categoryId = await getOrCreateVendoorCategory();
  if (!categoryId) {
    console.error('❌ فشل categoryId');
    await sendTelegram('❌ <b>خطأ:</b> فشل الحصول على categoryId');
    process.exit(1);
  }
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log('📄 تسجيل دخول...');
    await page.goto(VENDOOR_LOGIN_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });
    
    await page.type('input[name="name"]', VENDOOR_EMAIL, { delay: 100 });
    await page.type('input[type="password"]', VENDOOR_PASSWORD, { delay: 100 });
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
      page.click('button[type="submit"]')
    ]);
    
    console.log('✅ تم!\n');
    
    await page.goto(VENDOOR_PRODUCTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const products = await page.evaluate(() => {
      const productsList = [];
      const allLinks = Array.from(document.querySelectorAll('a'));
      const productLinks = allLinks.filter(link => 
        link.href && link.textContent.trim().length > 10 &&
        (link.href.includes('/product/') || link.href.includes('orders/create'))
      );
      
      productLinks.forEach((link, index) => {
        let container = link.closest('tr') || link.closest('.card') || link.parentElement;
        const product = {
          id: index + 1,
          title: link.textContent.trim(),
          price: '0',
          image: '',
          link: link.href
        };
        
        if (container) {
          const img = container.querySelector('img');
          if (img) product.image = img.src || '';
          const priceTexts = container.innerText.match(/\d+\s*جنيه/g);
          if (priceTexts) product.price = priceTexts[0];
        }
        
        if (product.title.length > 5) {
          productsList.push(product);
        }
      });
      
      return productsList;
    });
    
    console.log(`📊 ${products.length} منتج\n`);
    
    // إرسال إشعار البداية
    const startMsg = `🚀 <b>بدء Vendoor Scraper</b>\n\n` +
                     `📦 عدد المنتجات: <b>${products.length}</b>\n` +
                     `⏳ جاري المعالجة...\n\n` +
                     `سيتم إرسال تقرير كامل عند الانتهاء.`;
    await sendTelegram(startMsg);
    
    console.log('='.repeat(60));
    
    let successCount = 0;
    let failCount = 0;
    const results = [];
    
    for (let i = 0; i < products.length; i++) {
      console.log(`[${i + 1}/${products.length}]`);
      const result = await addProductToAppwrite(products[i], categoryId, page, i + 1);
      
      if (result) {
        successCount++;
        results.push(result);
      } else {
        failCount++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);
    
    const outputData = {
      scrapedAt: new Date().toISOString(),
      databaseId: APPWRITE_DATABASE_ID,
      categoryId,
      totalFound: products.length,
      successCount,
      failCount,
      duration,
      results: results.slice(0, 5)
    };
    
    fs.writeFileSync('vendoor-final.json', JSON.stringify(outputData, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 النتيجة:');
    console.log('='.repeat(60));
    console.log(`✅ نجح: ${successCount}`);
    console.log(`❌ فشل: ${failCount}`);
    console.log(`⏱️  المدة: ${Math.floor(duration / 60)}د ${duration % 60}ث`);
    console.log('='.repeat(60));
    
    // إرسال التقرير النهائي على Telegram
    const report = formatReport(outputData);
    await sendTelegram(report);
    console.log('\n📱 تم إرسال التقرير الكامل على Telegram!');
    
    await browser.close();
    return outputData;
    
  } catch (error) {
    console.error('\n❌', error.message);
    const errorMsg = `❌ <b>خطأ في Vendoor Scraper</b>\n\n` +
                     `<code>${error.message}</code>\n\n` +
                     `الرجاء التحقق من الـ logs.`;
    await sendTelegram(errorMsg);
    if (browser) await browser.close();
    throw error;
  }
}

scrapeVendoorProducts()
  .then(() => {
    console.log('\n✅ تم بنجاح!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ فشل:', error.message);
    process.exit(1);
  });
