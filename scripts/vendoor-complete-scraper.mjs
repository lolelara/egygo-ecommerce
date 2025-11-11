import puppeteer from 'puppeteer';
import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import fs from 'fs';

// ========================================
// Configuration
// ========================================

const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';
const VENDOOR_LOGIN_URL = 'https://aff.ven-door.com/login';
const VENDOOR_PRODUCTS_URL = 'https://aff.ven-door.com/products';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68d8b9db00134c41e7c8';
const APPWRITE_API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const APPWRITE_DATABASE_ID = '68de037e003bd03c4d45';

// Test mode - SET TO FALSE FOR FULL SCRAPING
const TEST_MODE = false;  // وضع الإنتاج الكامل
const TEST_VENDORS_LIMIT = 2;  // عدد الموردين للاختبار (ignored when TEST_MODE = false)
const TEST_PRODUCTS_PER_VENDOR = 3;  // عدد المنتجات لكل مورد (ignored when TEST_MODE = false)

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// ========================================
// Helper Functions
// ========================================

function generateSKU(index) {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `VD-${timestamp}-${random}-${index}`.toUpperCase();
}

async function getOrCreateCategory() {
  try {
    const categories = await databases.listDocuments(APPWRITE_DATABASE_ID, 'categories');
    const vendoor = categories.documents.find(c => c.name === 'Vendoor Products');
    
    if (vendoor) {
      console.log('✅ Category found:', vendoor.$id);
      return vendoor.$id;
    }
    
    const newCat = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      'categories',
      ID.unique(),
      { name: 'Vendoor Products', description: 'Products from Vendoor', image: 'https://via.placeholder.com/400' },
      [Permission.read(Role.any())]
    );
    
    console.log('✅ Category created:', newCat.$id);
    return newCat.$id;
  } catch (error) {
    console.error('❌ Category error:', error.message);
    return null;
  }
}

// ========================================
// Login
// ========================================

async function login(page) {
  try {
    console.log('🔐 Logging in...');
    await page.goto(VENDOOR_LOGIN_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    
    const email = await page.$('input[name="name"]');
    if (!email) throw new Error('Email field not found');
    await email.type(VENDOOR_EMAIL);
    
    const pass = await page.$('input[name="password"]');
    if (!pass) throw new Error('Password field not found');
    await pass.type(VENDOOR_PASSWORD);
    
    const btn = await page.$('button[type="submit"]');
    if (btn) {
      await btn.click();
      await Promise.race([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => null),
        page.waitForSelector('nav', { timeout: 60000 }).catch(() => null)
      ]);
    }
    
    console.log('✅ Logged in');
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    return false;
  }
}

// ========================================
// Step 1: Get Vendor Links
// ========================================

async function getVendorLinks(page) {
  try {
    console.log('\n📋 Step 1: Getting vendor links...');
    await page.goto(VENDOOR_PRODUCTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    
    const vendors = await page.evaluate(() => {
      const results = [];
      const links = Array.from(document.querySelectorAll('a[href*="vendor_id"]'));
      
      links.forEach(a => {
        const href = a.href;
        const match = href.match(/vendor_id=(\d+)/);
        if (match && !results.find(v => v.url === href)) {
          const nameEl = a.querySelector('h5, .card-title');
          results.push({
            vendorId: match[1],
            name: nameEl ? nameEl.textContent.trim() : `Vendor ${match[1]}`,
            url: href
          });
        }
      });
      
      return results;
    });
    
    console.log(`✅ Found ${vendors.length} vendors`);
    return vendors;
  } catch (error) {
    console.error('❌ Error getting vendors:', error.message);
    return [];
  }
}

// ========================================
// Step 2: Get Products from Vendor Page
// ========================================

async function getProductsFromVendor(page, vendor, vendorIndex) {
  try {
    console.log(`\n🏪 Vendor ${vendorIndex + 1}: ${vendor.name}`);
    await page.goto(vendor.url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    
    await page.screenshot({ path: `vendor-${vendor.vendorId}.png` });
    
    const products = await page.evaluate(() => {
      const results = [];
      
      // البحث عن بطاقات المنتجات
      const cards = Array.from(document.querySelectorAll('.card, .product-card, [class*="product"]'));
      
      cards.forEach(card => {
        // البحث عن رابط المنتج داخل البطاقة
        const link = card.querySelector('a[href*="/product/"], a[href*="/p/"]');
        if (!link) return;
        
        const href = link.href;
        // تأكد أنه رابط منتج فردي وليس فلتر
        if (!href.includes('vendor_id') && !results.includes(href)) {
          results.push(href);
        }
      });
      
      // إذا لم نجد شيء، ابحث عن أي رابط يحتوي على product
      if (results.length === 0) {
        const allLinks = Array.from(document.querySelectorAll('a'));
        allLinks.forEach(a => {
          const href = a.href;
          if (href && (href.includes('/product/') || href.includes('/p/')) && !href.includes('vendor_id') && !results.includes(href)) {
            results.push(href);
          }
        });
      }
      
      return results;
    });
    
    console.log(`   📦 Found ${products.length} products`);
    return products;
  } catch (error) {
    console.error(`   ❌ Error getting products from ${vendor.name}:`, error.message);
    return [];
  }
}

// ========================================
// Step 3: Scrape Individual Product
// ========================================

async function scrapeProduct(page, productUrl, index) {
  try {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📦 Product #${index + 1}`);
    console.log(`🔗 ${productUrl}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(r => setTimeout(r, 2000));
    
    // استخراج البيانات
    const data = await page.evaluate(() => {
      const result = {
        title: '',
        price: 0,
        description: '',
        images: [],
        colors: [],
        sizes: [],
        colorSizeInventory: [],
        totalStock: 0,
        seller: '',
        mediaLinks: []
      };
      
      // Helpers: Arabic normalization and size normalization
      const normalizeArabic = (s) => (s || '')
        .replace(/[أإآ]/g, 'ا')
        .replace(/ى/g, 'ي')
        .replace(/[ًٌٍَُِّْ]/g, '')
        .trim();
      const normalizeSize = (s) => {
        const str = (s || '').trim();
        const m = str.match(/\d+(?:\.\d+)?/);
        return m ? m[0] : str; // keep non-numeric sizes like S/M/L
      };
      
      // ✅ العنوان من h6.prodect-text
      const titleEl = document.querySelector('h6.prodect-text');
      if (titleEl) {
        result.title = titleEl.textContent.trim();
      }
      
      // ✅ البائع من .card-body-2.price
      const sellerDiv = Array.from(document.querySelectorAll('.card-body-2.price')).find(
        div => div.textContent.includes('البائع')
      );
      if (sellerDiv) {
        const sellerSpan = sellerDiv.querySelector('span');
        if (sellerSpan) result.seller = sellerSpan.textContent.trim();
      }
      
      // ✅ السعر من .card-body-2.price
      const priceDiv = Array.from(document.querySelectorAll('.card-body-2.price')).find(
        div => div.textContent.includes('السعر')
      );
      if (priceDiv) {
        const priceMatch = priceDiv.textContent.match(/(\d+)\s*جنيه/);
        if (priceMatch) {
          result.price = parseInt(priceMatch[1]);
        }
      }
      
      // إذا لم نجد سعر، ابحث بطريقة أخرى
      const priceSelectors = ['.price', '.product-price', '[class*="price"]'];
      for (const selector of priceSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          if (el && el.textContent) {
            const text = el.textContent.trim();
            // بحث عن أرقام مع "ج" أو "EGP" أو "جنيه"
            if (/\d/.test(text) && (text.includes('ج') || text.includes('EGP') || text.includes('جنيه'))) {
              const priceMatch = text.match(/[\d,]+\.?\d*/);
              if (priceMatch) {
                result.price = parseFloat(priceMatch[0].replace(/,/g, '')) || 0;
                if (result.price > 0) break;
              }
            }
          }
        }
        if (result.price > 0) break;
      }
      
      // إذا لم نجد سعر، ابحث في أي عنصر يحتوي على أرقام
      if (result.price === 0) {
        const allText = Array.from(document.querySelectorAll('*'))
          .map(el => el.textContent || '')
          .join(' ');
        const matches = allText.match(/(\d{2,})\s*(ج|EGP|جنيه)/gi);
        if (matches && matches.length > 0) {
          const firstMatch = matches[0].match(/\d+/);
          if (firstMatch) {
            result.price = parseFloat(firstMatch[0]) || 0;
          }
        }
      }
      
      // ✅ الوصف من p.prodcut-titles
      const descEl = document.querySelector('p.prodcut-titles');
      if (descEl) {
        // إزالة لينكات وأخذ النص فقط
        const clonedDesc = descEl.cloneNode(true);
        // إزالة جميع الـ links
        const links = clonedDesc.querySelectorAll('a');
        links.forEach(link => link.remove());
        result.description = clonedDesc.textContent.trim();
        
        // استخراج لينكات الميديا
        const mediaLinks = descEl.querySelectorAll('a[href*="drive.google.com"]');
        mediaLinks.forEach(link => {
          const href = link.href;
          if (href && !result.mediaLinks.includes(href)) {
            result.mediaLinks.push(href);
          }
        });
      }
      
      // ✅ الصور - الصورة الرئيسية من .abut-img img
      const mainImg = document.querySelector('.abut-img img');
      if (mainImg && mainImg.src) {
        result.images.push(mainImg.src);
      }
      
      // الصور الإضافية - مع استبعاد اللوجوهات
      const addImage = (url) => {
        if (!url) return;
        const lower = String(url).toLowerCase();
        // استبعاد لوجو وفافيكون
        if (lower.includes('/file/logo') || lower.includes('logo.png') || lower.includes('logo2.png') || lower.includes('favicon')) return;
        if (url.startsWith('http') && !result.images.includes(url)) {
          result.images.push(url);
        }
      };
      
      // صورة og:image
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        const content = ogImage.getAttribute('content');
        if (content) addImage(content);
      }
      
      // الصور الأخرى
      const imgs = Array.from(document.querySelectorAll('.product-images img, .gallery img'));
      imgs.forEach(img => {
        const src = img.src || img.getAttribute('data-src') || '';
        if (src) addImage(src);
      });
      
      // ✅ Variants from table.table-product
      const tables = Array.from(document.querySelectorAll('table.table-product, table'));
      
      tables.forEach(table => {
        const headers = Array.from(table.querySelectorAll('th, thead td'))
          .map(h => h.textContent.trim().toLowerCase());
        
        if (headers.length === 0) return;
        
        // البحث عن أعمدة Size, Color, stock
        const findCol = (patterns) => headers.findIndex(h => patterns.some(p => p.test(h)));
        
        const sizeIdx = findCol([/size/i, /مقاس/]);
        const colorIdx = findCol([/color/i, /لون/]);
        const qtyIdx = findCol([/stock/i, /كمية/, /qty/i, /quantity/i, /عدد/]);
        
        if (colorIdx === -1 && sizeIdx === -1 && qtyIdx === -1) return;
        
        const rows = Array.from(table.querySelectorAll('tbody tr, tr'));
        
        rows.forEach((row, idx) => {
          if (idx === 0 && headers.length > 0) return; // skip header
          
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length === 0) return;
          
          // ✅ استخراج البيانات من الأعمدة
          let size = sizeIdx >= 0 && cells[sizeIdx] ? cells[sizeIdx].textContent.trim() : '';
          let color = colorIdx >= 0 && cells[colorIdx] ? cells[colorIdx].textContent.trim() : '';
          
          // إذا كان Size يحتوي على اللون + المقاس (مثل "اسود 41")
          // وColor يحتوي على اللون فقط (مثل "اسود")
          // نستخدم Color للون و نستخرج المقاس من Size
          if (size && color && size.includes(color)) {
            // نزيل اللون من Size لنحصل على المقاس فقط
            const sizeOnly = size.replace(color, '').trim();
            size = sizeOnly || size; // إذا لم نجد مقاس، نبقي size كما هو
          }
          // طبّق التطبيع
          color = normalizeArabic(color);
          size = normalizeSize(size);
          
          let qtyText = qtyIdx >= 0 && cells[qtyIdx] ? cells[qtyIdx].textContent : '';
          if (!qtyText) {
            const numCell = cells.find(c => /\d/.test(c.textContent || ''));
            qtyText = numCell ? numCell.textContent : '0';
          }
          
          const qty = parseInt(qtyText.replace(/\D/g, '')) || 0;
          
          if (color || size || qty > 0) {
            result.colorSizeInventory.push({
              color: color || 'Default',
              size: size || 'Default',
              quantity: qty
            });
            
            if (color && !result.colors.includes(color)) result.colors.push(color);
            // حفظ المقاس (بدون اللون)
            if (size && !result.sizes.includes(size)) result.sizes.push(size);
            result.totalStock += qty;
          }
        });
      });

      // Unique arrays
      result.colors = Array.from(new Set(result.colors));
      result.sizes = Array.from(new Set(result.sizes.map(s => String(s))));
      
      return result;
    });
    
    console.log('\n📊 Scraped:');
    console.log('   Title:', data.title || '(No title)');
    console.log('   Seller:', data.seller || '(No seller)');
    console.log('   Price:', data.price, 'EGP');
    console.log('   Images:', data.images.length);
    if (data.mediaLinks.length > 0) {
      console.log('   Media Links:', data.mediaLinks.length);
    }
    console.log('   Colors:', data.colors);
    console.log('   Sizes:', data.sizes.slice(0, 10), data.sizes.length > 10 ? `...and ${data.sizes.length - 10} more` : '');
    console.log('   Variants:', data.colorSizeInventory.length);
    console.log('   Total Stock:', data.totalStock);
    
    return data;
  } catch (error) {
    console.error('   ❌ Scraping error:', error.message);
    return null;
  }
}

// ========================================
// Step 4: Save to Appwrite
// ========================================

async function saveToAppwrite(data, categoryId, index, productUrl) {
  try {
    if (data.price < 50) {
      console.log('   ⏭️ Price too low, skipping');
      return null;
    }
    
    // ✅ Use clean page description only (no inventory lines here)
    let description = (data.description || '').trim();
    // Optionally append media links if present
    if (data.mediaLinks && data.mediaLinks.length > 0) {
      const linksText = data.mediaLinks.map((l) => `- ${l}`).join('\n');
      description = `${description}\n\n📎 روابط الميديا:\n${linksText}`.trim();
    }
    
    // ✅ استخدام الحقول الموجودة فعلياً في products collection
    // Filter images again to ensure no logos are saved
    const filteredImages = (data.images || []).filter((u) => u && !/logo2?\.png|favicon/i.test(String(u)));

    const productData = {
      // Required fields
      name: data.title || `Vendoor Product ${index + 1}`,
      description: description.substring(0, 1500),
      price: data.price,
      categoryId: categoryId,
      
      // Optional fields - Basic info
      images: filteredImages.length > 0 ? filteredImages : ['https://via.placeholder.com/400'],
      source: 'vendoor',
      status: 'approved', // ✅ منشور مباشرة
      originalPrice: data.price,
      sourceUrl: productUrl, // ✅ لتتبع المنتج
      
      // Optional fields - Stock
      stock: data.totalStock,
      totalStock: data.totalStock,
      stockQuantity: data.totalStock,
      
      // ✅ الحقول الصحيحة - تخزين المقاسات والألوان في مكانها الصحيح
      colors: data.colors,
      sizes: data.sizes,
      colorSizeInventory: JSON.stringify(data.colorSizeInventory),
      
      // Optional fields - Defaults
      isActive: true,
      inStock: data.totalStock > 0,
      rating: 0,
      reviewCount: 0,
      viewCount: 0,
      purchaseCount: 0,
      lastSyncedAt: new Date().toISOString()
    };
    
    console.log('\n💾 Checking if product exists...');
    
    // 🔍 البحث عن المنتج الموجود باستخدام sourceUrl
    try {
      const existingProducts = await databases.listDocuments(
        APPWRITE_DATABASE_ID,
        'products',
        [
          Query.equal('sourceUrl', productUrl),
          Query.limit(1)
        ]
      );
      
      if (existingProducts.documents.length > 0) {
        // ✅ المنتج موجود - تحديثه
        const existingProduct = existingProducts.documents[0];
        console.log('🔄 Product exists, updating...');
        console.log('   Old Stock:', existingProduct.stock);
        console.log('   New Stock:', data.totalStock);
        console.log('   Old Images:', existingProduct.images?.length || 0);
        console.log('   New Images:', data.images.length);
        
        // Keep SKU from existing product
        productData.sku = existingProduct.sku;
        
        const doc = await databases.updateDocument(
          APPWRITE_DATABASE_ID,
          'products',
          existingProduct.$id,
          productData
        );
        
        console.log('✅ Updated! ID:', doc.$id);
        console.log('   Stock: ', existingProduct.stock, '→', doc.stock);
        console.log('   Colors:', doc.colors);
        console.log('   Sizes:', doc.sizes);
        console.log('   Inventory: YES');
        
        return { doc, updated: true };
      }
    } catch (searchError) {
      console.log('   ℹ️  No existing product found, creating new...');
    }
    
    // ✅ المنتج غير موجود - إنشاء جديد
    productData.sku = generateSKU(index);
    
    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      'products',
      ID.unique(),
      productData,
      [Permission.read(Role.any())]
    );
    
    console.log('✅ Created! ID:', doc.$id);
    console.log('   SKU:', doc.sku);
    console.log('   Colors:', doc.colors);
    console.log('   Sizes:', doc.sizes);
    console.log('   Inventory: YES');
    
    return { doc, updated: false };
  } catch (error) {
    console.error('   ❌ Save error:', error.message);
    return null;
  }
}

// ========================================
// Main Function
// ========================================

async function main() {
  const start = Date.now();
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                                                           ║');
  console.log('║   🚀 VENDOOR COMPLETE SCRAPER                            ║');
  console.log('║      يفتح كل صفحة منتج - يحفظ في الحقول الصحيحة        ║');
  console.log('║                                                           ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  
  const categoryId = await getOrCreateCategory();
  if (!categoryId) {
    console.error('❌ No category');
    return;
  }
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const stats = { vendors: 0, products: 0, saved: 0, failed: 0 };
  
  try {
    if (!await login(page)) throw new Error('Login failed');
    
    const vendors = await getVendorLinks(page);
    if (vendors.length === 0) throw new Error('No vendors found');
    
    const vendorsToProcess = TEST_MODE ? vendors.slice(0, TEST_VENDORS_LIMIT) : vendors;
    stats.vendors = vendorsToProcess.length;
    
    let globalProductIndex = 0;
    
    for (let i = 0; i < vendorsToProcess.length; i++) {
      const vendor = vendorsToProcess[i];
      const productLinks = await getProductsFromVendor(page, vendor, i);
      
      if (productLinks.length === 0) continue;
      
      const linksToProcess = TEST_MODE 
        ? productLinks.slice(0, TEST_PRODUCTS_PER_VENDOR) 
        : productLinks;
      
      for (const link of linksToProcess) {
        const productData = await scrapeProduct(page, link, globalProductIndex);
        
        if (productData) {
          const result = await saveToAppwrite(productData, categoryId, globalProductIndex, link);
          if (result) {
            stats.saved++;
            if (result.updated) {
              stats.updated = (stats.updated || 0) + 1;
            } else {
              stats.created = (stats.created || 0) + 1;
            }
          } else {
            stats.failed++;
          }
        } else {
          stats.failed++;
        }
        
        globalProductIndex++;
        stats.products++;
        
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    
  } catch (error) {
    console.error('\n❌ Fatal:', error.message);
  } finally {
    await browser.close();
  }
  
  const duration = ((Date.now() - start) / 1000).toFixed(2);
  
  console.log('\n');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║                   📊 FINAL REPORT                         ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`⏱️  Duration: ${duration}s`);
  console.log(`🏪 Vendors: ${stats.vendors}`);
  console.log(`📦 Products Processed: ${stats.products}`);
  console.log(`✅ Saved: ${stats.saved}`);
  console.log(`   🆕 Created: ${stats.created || 0}`);
  console.log(`   🔄 Updated: ${stats.updated || 0}`);
  console.log(`❌ Failed: ${stats.failed}`);
  console.log('');
  
  if (stats.saved > 0) {
    console.log('✅ SUCCESS! Data saved in correct fields:');
    console.log('   - colors: Array');
    console.log('   - sizes: Array');
    console.log('   - colorSizeInventory: JSON');
    console.log('   - stock: Total (updated automatically)');
    console.log('   - images: Updated');
    console.log('   - description: Updated with latest info');
    console.log('   - lastSyncedAt: Current timestamp');
  }
  
  if (stats.updated > 0) {
    console.log('');
    console.log('🔄 Product Updates:');
    console.log(`   ${stats.updated} existing products were updated with latest data`);
    console.log('   Stock quantities refreshed');
    console.log('   Images updated');
    console.log('   Prices synced');
  }
  
  console.log('');
}

main().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});
