import puppeteer from 'puppeteer';
import fs from 'fs';

const EMAIL = 'almlmibrahym574@gmail.com';
const PASSWORD = 'hema2004';
const LOGIN_URL = 'https://aff.ven-door.com/login';
const PRODUCTS_BASE_URL = 'https://aff.ven-door.com/products';
const MAX_PAGES = 42; // سنفحص حتى صفحة 42
const AFFILIATE_ID = '29631'; // رقم الأفلييت

/**
 * تسجيل الدخول إلى Ven-door
 */
async function loginToVendoor(page) {
  console.log('🔐 جاري تسجيل الدخول إلى Ven-door...');
  
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await page.waitForSelector('input[name="name"]', { timeout: 5000 });
  await page.type('input[name="name"]', EMAIL, { delay: 50 });
  await page.type('input[type="password"]', PASSWORD, { delay: 50 });
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
    page.click('button[type="submit"]')
  ]).catch(() => {});
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const currentUrl = page.url();
  if (currentUrl.includes('login')) {
    throw new Error('فشل تسجيل الدخول');
  }
  
  console.log('✅ تم تسجيل الدخول بنجاح!\n');
}

/**
 * جلب قائمة المنتجات من صفحة معينة
 */
async function scrapeProductsPage(page, pageNum) {
  const url = `${PRODUCTS_BASE_URL}?page=${pageNum}`;
  
  try {
    console.log(`📄 جاري فحص الصفحة ${pageNum}...`);
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const products = await page.evaluate(() => {
      const productsList = [];
      
      // البحث في الجدول عن المنتجات
      const rows = document.querySelectorAll('table tbody tr');
      
      rows.forEach(row => {
        try {
          const cells = row.querySelectorAll('td');
          if (cells.length < 5) return; // تأكد أن هناك بيانات كافية
          
          // استخراج البيانات من الخلايا
          const imageCell = cells[0];
          const nameCell = cells[1];
          const supplierCell = cells[2];
          const priceCell = cells[3];
          const commissionCell = cells[4];
          const stockCell = cells[5];
          const actionCell = cells[7];
          
          // استخراج الصورة
          const img = imageCell ? imageCell.querySelector('img') : null;
          const image = img ? (img.src || img.getAttribute('data-src')) : '';
          
          // استخراج العنوان
          const title = nameCell ? nameCell.textContent.trim() : '';
          
          // استخراج المورد
          const supplier = supplierCell ? supplierCell.textContent.trim() : '';
          
          // استخراج السعر
          const price = priceCell ? priceCell.textContent.replace(/[^\d]/g, '') : '';
          
          // استخراج العمولة
          const commission = commissionCell ? commissionCell.textContent.replace(/[^\d]/g, '') : '';
          
          // استخراج المخزون
          const stock = stockCell ? stockCell.textContent.trim() : '';
          
          // استخراج رابط إضافة طلب
          const orderLink = actionCell ? actionCell.querySelector('a[href*="orders/create"]') : null;
          let productId = '';
          
          if (orderLink) {
            const href = orderLink.href;
            const match = href.match(/product[=\/](\d+)/);
            if (match) {
              productId = match[1];
            }
          }
          
          // إضافة المنتج إذا كان لديه بيانات
          if (title && productId) {
            productsList.push({
              id: productId,
              title: title,
              supplier: supplier,
              price: price,
              commission: commission,
              stock: stock,
              image: image,
              orderLink: orderLink ? orderLink.href : ''
            });
          }
        } catch (error) {
          console.error('Error parsing row:', error.message);
        }
      });
      
      return productsList;
    });
    
    console.log(`   ✓ تم العثور على ${products.length} منتج في الصفحة ${pageNum}`);
    
    return products;
    
  } catch (error) {
    console.log(`   ❌ خطأ في الصفحة ${pageNum}: ${error.message}`);
    return [];
  }
}

/**
 * جلب تفاصيل منتج واحد
 */
async function fetchProductDetails(page, productId) {
  const url = `https://aff.ven-door.com/affiliates/${AFFILIATE_ID}/orders/create?product=${productId}`;
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const details = await page.evaluate(() => {
      const data = {
        variations: {},
        stockDetails: {},
        shipping: '',
        totalCommission: '',
        grandTotal: ''
      };
      
      // استخراج الاختلافات من select
      const sizeSelect = document.querySelector('select[name="sizePro[]"]');
      if (sizeSelect) {
        const options = Array.from(sizeSelect.querySelectorAll('option'));
        options.forEach(option => {
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
      
      // استخراج تكلفة الشحن
      const shippingText = document.body.innerText;
      const shippingMatch = shippingText.match(/تكلفة الشحن\s+(\d+)/);
      if (shippingMatch) {
        data.shipping = shippingMatch[1];
      }
      
      return data;
    });
    
    return details;
    
  } catch (error) {
    console.error(`Error fetching details for product ${productId}:`, error.message);
    return null;
  }
}

/**
 * السكريبت الرئيسي
 */
async function fetchVendoorCatalog() {
  console.log('🚀 بدء جلب كتالوج المنتجات من Ven-door\n');
  console.log(`📊 سيتم فحص ${MAX_PAGES} صفحة\n`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    // تسجيل الدخول
    await loginToVendoor(page);
    
    // جلب المنتجات من جميع الصفحات
    let allProducts = [];
    let emptyPageFound = false;
    
    for (let pageNum = 1; pageNum <= MAX_PAGES; pageNum++) {
      const products = await scrapeProductsPage(page, pageNum);
      
      if (products.length === 0) {
        console.log(`\n⚠️ الصفحة ${pageNum} فارغة - توقف البحث`);
        emptyPageFound = true;
        break;
      }
      
      allProducts = allProducts.concat(products);
      
      // انتظار قصير بين الصفحات
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n📊 إجمالي المنتجات المجلوبة: ${allProducts.length}\n`);
    
    // حفظ القائمة الأولية
    const initialData = {
      scrapedAt: new Date().toISOString(),
      totalProducts: allProducts.length,
      lastPage: emptyPageFound ? allProducts.length : MAX_PAGES,
      products: allProducts
    };
    
    fs.writeFileSync('vendoor-products-list.json', JSON.stringify(initialData, null, 2), 'utf-8');
    console.log('💾 تم حفظ قائمة المنتجات في: vendoor-products-list.json\n');
    
    // جلب التفاصيل لعينة من المنتجات (أول 10 للاختبار)
    console.log('🔍 جاري جلب التفاصيل الكاملة لعينة من المنتجات...\n');
    
    const sampleProducts = allProducts.slice(0, 10);
    
    for (const product of sampleProducts) {
      console.log(`📦 جلب تفاصيل: ${product.title}`);
      const details = await fetchProductDetails(page, product.id);
      
      if (details) {
        Object.assign(product, details);
        console.log(`   ✓ الألوان: ${Object.keys(details.variations).length}, المقاسات: ${Object.values(details.variations).flat().length}\n`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // حفظ البيانات النهائية
    const finalData = {
      scrapedAt: new Date().toISOString(),
      totalProducts: allProducts.length,
      detailedProducts: sampleProducts.length,
      products: allProducts,
      statistics: {
        totalProducts: allProducts.length,
        avgPrice: Math.round(allProducts.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / allProducts.length),
        avgCommission: Math.round(allProducts.reduce((sum, p) => sum + parseFloat(p.commission || 0), 0) / allProducts.length),
        suppliers: [...new Set(allProducts.map(p => p.supplier))],
        totalSuppliers: [...new Set(allProducts.map(p => p.supplier))].length
      }
    };
    
    fs.writeFileSync('vendoor-catalog-complete.json', JSON.stringify(finalData, null, 2), 'utf-8');
    
    console.log('\n✅ تم جلب وحفظ الكتالوج الكامل!');
    console.log('\n📊 الإحصائيات النهائية:');
    console.log(`   📦 إجمالي المنتجات: ${finalData.totalProducts}`);
    console.log(`   💰 متوسط السعر: ${finalData.statistics.avgPrice} جنيه`);
    console.log(`   💵 متوسط العمولة: ${finalData.statistics.avgCommission} جنيه`);
    console.log(`   🏪 عدد الموردين: ${finalData.statistics.totalSuppliers}`);
    console.log(`\n💾 الملفات المحفوظة:`);
    console.log(`   - vendoor-products-list.json (قائمة أساسية)`);
    console.log(`   - vendoor-catalog-complete.json (مع الإحصائيات)`);
    
    await browser.close();
    
    return finalData;
    
  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    console.error(error.stack);
    
    if (browser) {
      await browser.close();
    }
    
    return null;
  }
}

// تشغيل السكريبت
fetchVendoorCatalog().catch(console.error);
