import puppeteer from 'puppeteer';
import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// إعدادات Vendoor
// ============================================
const VENDOOR_EMAIL = 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = 'hema2004';
const VENDOOR_LOGIN_URL = 'https://aff.ven-door.com/login';
const VENDOOR_PRODUCTS_URL = 'https://aff.ven-door.com/products';

// ============================================
// إعدادات Appwrite
// ============================================
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68d8b9db00134c41e7c8';
const APPWRITE_API_KEY = 'standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5';
const APPWRITE_DATABASE_ID = 'main';
const APPWRITE_PRODUCTS_COLLECTION_ID = 'products';
const APPWRITE_STORAGE_BUCKET_ID = 'product-images';

// ============================================
// إعداد Appwrite Client
// ============================================
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID)
  .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

// ============================================
// دالة لتحميل الصورة من URL
// ============================================
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// ============================================
// دالة لرفع الصورة على Appwrite Storage
// ============================================
async function uploadImageToAppwrite(imageUrl, productId) {
  try {
    console.log(`   📤 جاري رفع الصورة...`);
    
    // تحميل الصورة محلياً أولاً
    const tempImagePath = path.join(__dirname, `temp-${productId}.jpg`);
    await downloadImage(imageUrl, tempImagePath);
    
    // رفع الصورة على Appwrite
    const fileBuffer = fs.readFileSync(tempImagePath);
    const file = await storage.createFile(
      APPWRITE_STORAGE_BUCKET_ID,
      ID.unique(),
      fileBuffer,
      [Permission.read(Role.any())]
    );
    
    // حذف الملف المؤقت
    fs.unlinkSync(tempImagePath);
    
    // إنشاء رابط الصورة
    const imageUrlAppwrite = `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_STORAGE_BUCKET_ID}/files/${file.$id}/view?project=${APPWRITE_PROJECT_ID}`;
    
    console.log(`   ✅ تم رفع الصورة بنجاح`);
    return imageUrlAppwrite;
  } catch (error) {
    console.error(`   ❌ فشل رفع الصورة:`, error.message);
    return imageUrl; // استخدام الرابط الأصلي في حالة الفشل
  }
}

// ============================================
// دالة لإضافة منتج على Appwrite
// ============================================
async function addProductToAppwrite(product) {
  try {
    console.log(`\n📦 معالجة المنتج: ${product.title}`);
    
    // رفع الصورة على Appwrite
    let appwriteImageUrl = product.image;
    if (product.image && product.image.startsWith('http')) {
      appwriteImageUrl = await uploadImageToAppwrite(product.image, product.id);
    }
    
    // تحضير بيانات المنتج
    const productData = {
      name: product.title,
      description: product.description || `منتج من Vendoor - ${product.title}`,
      price: parseFloat(product.price.replace(/[^\d.]/g, '')) || 0,
      compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice.replace(/[^\d.]/g, '')) : null,
      images: [appwriteImageUrl],
      inStock: product.stock !== 'نفذ من المخزن',
      stockQuantity: parseInt(product.stock) || 10,
      category: product.category || 'غير مصنف',
      supplier: product.supplier || 'Vendoor',
      vendoorId: product.id,
      vendoorLink: product.link,
      featured: false,
      tags: ['vendoor', 'مستورد']
    };
    
    // إضافة المنتج إلى Appwrite
    console.log(`   💾 جاري إضافة المنتج إلى قاعدة البيانات...`);
    const document = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      APPWRITE_PRODUCTS_COLLECTION_ID,
      ID.unique(),
      productData,
      [Permission.read(Role.any())]
    );
    
    console.log(`   ✅ تم إضافة المنتج بنجاح! ID: ${document.$id}`);
    return document;
  } catch (error) {
    console.error(`   ❌ فشل إضافة المنتج:`, error.message);
    return null;
  }
}

// ============================================
// دالة لاستخراج المنتجات من Vendoor
// ============================================
async function scrapeVendoorProducts() {
  console.log('🚀 بدء استخراج المنتجات من Vendoor ورفعها على Appwrite\n');
  console.log('⏰ العملية قد تستغرق عدة دقائق حسب عدد المنتجات...\n');
  
  let browser;
  try {
    // إطلاق المتصفح
    console.log('🌐 جاري فتح المتصفح...');
    browser = await puppeteer.launch({
      headless: 'new', // استخدام وضع headless للـ server
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage', // مهم للـ Linux
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    // تسجيل الدخول
    console.log('📄 جاري تسجيل الدخول إلى Vendoor...');
    await page.goto(VENDOOR_LOGIN_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('input[name="name"]', { timeout: 10000 });
    
    await page.type('input[name="name"]', VENDOOR_EMAIL, { delay: 100 });
    await page.type('input[type="password"]', VENDOOR_PASSWORD, { delay: 100 });
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }),
      page.click('button[type="submit"]')
    ]);
    
    console.log('✅ تم تسجيل الدخول بنجاح!\n');
    
    // الانتقال إلى صفحة المنتجات
    console.log('📦 جاري فتح صفحة المنتجات...');
    await page.goto(VENDOOR_PRODUCTS_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForTimeout(5000);
    
    // استخراج المنتجات
    console.log('🔍 جاري استخراج بيانات المنتجات...\n');
    
    const products = await page.evaluate(() => {
      const productsList = [];
      
      // البحث عن جميع بطاقات المنتجات
      const productElements = document.querySelectorAll('.product-card, .product-item, tr[data-product], .card, tbody tr, [data-product-id]');
      
      productElements.forEach((element) => {
        try {
          const product = {
            id: '',
            title: '',
            description: '',
            price: '',
            compareAtPrice: '',
            image: '',
            link: '',
            stock: 'متوفر',
            category: '',
            supplier: 'Vendoor'
          };
          
          // استخراج البيانات
          const idElement = element.querySelector('[data-product-id], .product-id, td:first-child');
          if (idElement) {
            product.id = idElement.textContent.trim() || idElement.getAttribute('data-product-id') || '';
          }
          
          const titleElement = element.querySelector('.product-title, .product-name, h3, h4, td:nth-child(2), a[href*="product"]');
          if (titleElement) {
            product.title = titleElement.textContent.trim();
            const linkElement = titleElement.tagName === 'A' ? titleElement : titleElement.querySelector('a');
            if (linkElement && linkElement.href) {
              product.link = linkElement.href;
            }
          }
          
          const descElement = element.querySelector('.description, .product-description, p');
          if (descElement) {
            product.description = descElement.textContent.trim();
          }
          
          const priceElement = element.querySelector('.price, .product-price, [class*="price"]');
          if (priceElement) {
            product.price = priceElement.textContent.trim();
          }
          
          const imgElement = element.querySelector('img');
          if (imgElement) {
            product.image = imgElement.src || imgElement.getAttribute('data-src') || '';
          }
          
          const stockElement = element.querySelector('.stock, .quantity, [class*="stock"]');
          if (stockElement) {
            product.stock = stockElement.textContent.trim();
          }
          
          const categoryElement = element.querySelector('.category, .product-category');
          if (categoryElement) {
            product.category = categoryElement.textContent.trim();
          }
          
          // إضافة المنتج إذا كان لديه عنوان
          if (product.title && product.title.length > 3) {
            productsList.push(product);
          }
        } catch (error) {
          console.error('Error extracting product:', error.message);
        }
      });
      
      return productsList;
    });
    
    console.log(`📊 تم العثور على ${products.length} منتج\n`);
    
    // رفع المنتجات على Appwrite
    let successCount = 0;
    let failCount = 0;
    
    console.log('🚀 بدء رفع المنتجات على Appwrite...\n');
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`[${i + 1}/${products.length}] معالجة: ${product.title.substring(0, 50)}...`);
      
      const result = await addProductToAppwrite(product);
      
      if (result) {
        successCount++;
      } else {
        failCount++;
      }
      
      // انتظار قصير بين كل منتج لتجنب rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // حفظ النتائج في ملف JSON
    const outputData = {
      scrapedAt: new Date().toISOString(),
      totalProducts: products.length,
      successCount,
      failCount,
      products
    };
    
    const outputPath = path.join(__dirname, 'vendoor-scraping-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf-8');
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 ملخص العملية:');
    console.log('='.repeat(60));
    console.log(`✅ تم رفع ${successCount} منتج بنجاح`);
    console.log(`❌ فشل رفع ${failCount} منتج`);
    console.log(`📁 تم حفظ النتائج في: ${outputPath}`);
    console.log('='.repeat(60));
    
    await browser.close();
    
    return outputData;
    
  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    console.error('Stack:', error.stack);
    
    if (browser) {
      await browser.close();
    }
    
    throw error;
  }
}

// ============================================
// تشغيل السكريبت
// ============================================
console.log('\n' + '='.repeat(60));
console.log('🤖 Vendoor to Appwrite Scraper');
console.log('='.repeat(60) + '\n');

scrapeVendoorProducts()
  .then(() => {
    console.log('\n✅ تمت العملية بنجاح!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ فشلت العملية:', error.message);
    process.exit(1);
  });
