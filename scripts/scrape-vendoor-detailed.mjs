import puppeteer from 'puppeteer';
import fs from 'fs';

const EMAIL = 'almlmibrahym574@gmail.com';
const PASSWORD = 'hema2004';
const LOGIN_URL = 'https://aff.ven-door.com/login';

// قائمة المنتجات للاختبار (يمكن توسيعها لاحقاً)
const PRODUCT_IDS = [
  '4235', '4234', '4233', '4232', '4231',
  '4226', '4224', '4223', '4222', '4221',
  '3789', '3790', '3791' // المنتجات التي جربناها سابقاً
];

async function loginToVendoor(page) {
  console.log('🔐 جاري تسجيل الدخول...');
  
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await page.waitForSelector('input[name="name"]', { timeout: 5000 });
  await page.type('input[name="name"]', EMAIL, { delay: 50 });
  await page.type('input[type="password"]', PASSWORD, { delay: 50 });
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
    page.click('button[type="submit"]')
  ]).catch(() => {});
  
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  const currentUrl = page.url();
  if (currentUrl.includes('login')) {
    throw new Error('فشل تسجيل الدخول');
  }
  
  console.log('✅ تم تسجيل الدخول بنجاح!\n');
}

async function extractProductDetails(page, productId) {
  const url = `https://aff.ven-door.com/affiliates/29631/orders/create?product=${productId}`;
  
  try {
    console.log(`📦 جاري جلب المنتج #${productId}...`);
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const productData = await page.evaluate(() => {
      const data = {
        id: '',
        title: '',
        price: '',
        originalPrice: '',
        commission: '',
        commissionSite: '',
        shipping: '',
        image: '',
        images: [],
        variations: {},
        stockDetails: {},
        description: '',
        supplier: '',
        category: ''
      };
      
      // استخراج رقم المنتج من input hidden
      const productIdInput = document.querySelector('input[name="product_id[]"]');
      if (productIdInput) {
        data.id = productIdInput.value;
      }
      
      // استخراج العنوان من الجدول
      const productNameCell = document.querySelector('td');
      if (productNameCell && productNameCell.textContent.includes('(')) {
        data.title = productNameCell.textContent.split('(')[0].trim();
        
        // استخراج المخزن
        const supplierMatch = productNameCell.textContent.match(/\(\s*مخزن\s+(\d+)\s*\)/);
        if (supplierMatch) {
          data.supplier = `مخزن ${supplierMatch[1]}`;
        }
      }
      
      // استخراج السعر
      const priceInputs = document.querySelectorAll('input[name="totalproprice[]"]');
      if (priceInputs.length > 0) {
        data.price = priceInputs[0].value;
      }
      
      // استخراج العمولة
      const commissionInput = document.querySelector('input[name="totalprocommission[]"]');
      if (commissionInput) {
        data.commission = commissionInput.value;
      }
      
      // استخراج عمولة الموقع
      const commissionSiteInput = document.querySelector('input[name="totalprocommissionsite[]"]');
      if (commissionSiteInput) {
        data.commissionSite = commissionSiteInput.value;
      }
      
      // استخراج الصورة الرئيسية
      const mainImage = document.querySelector('img[src*="products_image"]');
      if (mainImage) {
        data.image = mainImage.src;
        data.images.push(mainImage.src);
      }
      
      // استخراج جميع الصور
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src');
        if (src && src.includes('products_image') && !data.images.includes(src)) {
          data.images.push(src);
        }
      });
      
      // استخراج الاختلافات (المقاسات والألوان)
      const sizeSelect = document.querySelector('select[name="sizePro[]"]');
      if (sizeSelect) {
        const options = Array.from(sizeSelect.querySelectorAll('option'));
        options.forEach(option => {
          if (option.value && option.textContent) {
            const text = option.textContent.trim();
            
            // تحليل النص مثل: "الكمية=> (25) - المقاس=>(بيج مقلم 41)"
            const match = text.match(/الكمية=>\s*\(([^)]+)\)\s*-\s*المقاس=>\(([^)]+)\)/);
            if (match) {
              const quantity = match[1].trim();
              const sizeInfo = match[2].trim();
              
              // فصل اللون والمقاس
              const parts = sizeInfo.split(/\s+/);
              const size = parts[parts.length - 1]; // آخر جزء هو المقاس
              const color = parts.slice(0, -1).join(' '); // الباقي هو اللون
              
              if (!data.variations[color]) {
                data.variations[color] = [];
              }
              
              if (!data.variations[color].includes(size)) {
                data.variations[color].push(size);
              }
              
              // حفظ الكمية
              data.stockDetails[`${color} ${size}`] = parseInt(quantity) || 0;
            }
          }
        });
      }
      
      // استخراج تكلفة الشحن
      const allText = document.body.innerText;
      const shippingMatch = allText.match(/تكلفة الشحن\s+(\d+)\s+جنيه/);
      if (shippingMatch) {
        data.shipping = shippingMatch[1];
      }
      
      // استخراج الوصف
      const descElements = document.querySelectorAll('p, .description');
      descElements.forEach(el => {
        const text = el.textContent.trim();
        if (text.length > 20 && text.length < 500) {
          data.description = text;
        }
      });
      
      return data;
    });
    
    console.log(`   ✓ ${productData.title || 'منتج رقم ' + productId}`);
    console.log(`   💰 السعر: ${productData.price} جنيه | العمولة: ${productData.commissionSite} جنيه`);
    console.log(`   🎨 الألوان: ${Object.keys(productData.variations).length}`);
    console.log(`   📏 المقاسات: ${Object.values(productData.variations).flat().length}\n`);
    
    return productData;
    
  } catch (error) {
    console.log(`   ❌ فشل جلب المنتج #${productId}: ${error.message}\n`);
    return null;
  }
}

async function scrapeAllProductsDetailed() {
  console.log('🚀 بدء استخراج تفاصيل المنتجات من Ven-door\n');
  console.log(`📊 سيتم جلب ${PRODUCT_IDS.length} منتج\n`);
  console.log('⏰ الوقت التقديري: ${PRODUCT_IDS.length * 5} ثانية\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    // تسجيل الدخول
    await loginToVendoor(page);
    
    // استخراج تفاصيل كل منتج
    const allProducts = [];
    let successCount = 0;
    let failCount = 0;
    
    for (const productId of PRODUCT_IDS) {
      const productData = await extractProductDetails(page, productId);
      
      if (productData) {
        allProducts.push(productData);
        successCount++;
      } else {
        failCount++;
      }
      
      // انتظار قصير بين المنتجات
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // حفظ النتائج
    const output = {
      scrapedAt: new Date().toISOString(),
      totalProducts: allProducts.length,
      successCount,
      failCount,
      products: allProducts
    };
    
    fs.writeFileSync('vendoor-products-detailed.json', JSON.stringify(output, null, 2), 'utf-8');
    
    console.log('\n📊 ملخص النتائج:');
    console.log(`   ✅ نجح: ${successCount} منتج`);
    console.log(`   ❌ فشل: ${failCount} منتج`);
    console.log(`   📦 إجمالي المنتجات: ${allProducts.length}\n`);
    
    // إحصائيات
    const totalColors = new Set(allProducts.flatMap(p => Object.keys(p.variations))).size;
    const totalSizes = new Set(allProducts.flatMap(p => Object.values(p.variations).flat())).size;
    const avgPrice = allProducts.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / allProducts.length;
    const avgCommission = allProducts.reduce((sum, p) => sum + parseFloat(p.commissionSite || 0), 0) / allProducts.length;
    
    console.log('📈 الإحصائيات:');
    console.log(`   💰 متوسط السعر: ${Math.round(avgPrice)} جنيه`);
    console.log(`   💵 متوسط العمولة: ${Math.round(avgCommission)} جنيه`);
    console.log(`   🎨 إجمالي الألوان: ${totalColors}`);
    console.log(`   📏 إجمالي المقاسات: ${totalSizes}\n`);
    
    console.log('💾 تم حفظ البيانات في: vendoor-products-detailed.json\n');
    
    // عرض عينة من المنتجات
    console.log('📦 عينة من المنتجات:\n');
    allProducts.slice(0, 3).forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   رقم: #${product.id}`);
      console.log(`   السعر: ${product.price} جنيه (عمولة: ${product.commissionSite} جنيه)`);
      console.log(`   الألوان: ${Object.keys(product.variations).join(', ')}`);
      console.log(`   المورد: ${product.supplier}`);
      console.log(`   الصورة: ${product.image}\n`);
    });
    
    await browser.close();
    
    console.log('✅ تم استخراج جميع البيانات بنجاح!');
    
    return output;
    
  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    if (browser) {
      await browser.close();
    }
    return null;
  }
}

scrapeAllProductsDetailed().catch(console.error);
