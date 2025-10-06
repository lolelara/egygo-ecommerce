import puppeteer from 'puppeteer';
import fs from 'fs';

const EMAIL = 'almlmibrahym574@gmail.com';
const PASSWORD = 'hema2004';
const DASHBOARD_URL = 'https://aff.ven-door.com/';
const LOGIN_URL = 'https://aff.ven-door.com/login';

async function scrapeAllProducts() {
  console.log('🚀 بدء استخراج جميع المنتجات من Ven-door\n');
  console.log('⏰ ملاحظة: العملية قد تستغرق 1-2 دقيقة، الرجاء الانتظار...\n');
  
  let browser;
  try {
    // إطلاق المتصفح
    console.log('🌐 جاري فتح المتصفح...');
    browser = await puppeteer.launch({
      headless: false, // نشغل المتصفح مع واجهة رسومية
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    const page = await browser.newPage();
    
    // تعيين User Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    
    // الانتقال إلى صفحة تسجيل الدخول
    console.log('📄 جاري فتح صفحة تسجيل الدخول...');
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // تسجيل الدخول
    console.log('⏳ انتظار تحميل النموذج...');
    await page.waitForSelector('input[name="name"]', { timeout: 5000 });
    console.log('✓ تم العثور على حقل تسجيل الدخول');
    
    await page.screenshot({ path: 'vendoor-login.png' });
    console.log('📸 تم حفظ لقطة: vendoor-login.png');
    
    console.log('✍️ جاري ملء بيانات تسجيل الدخول...');
    await page.type('input[name="name"]', EMAIL, { delay: 100 });
    await page.type('input[type="password"]', PASSWORD, { delay: 100 });
    
    console.log('🔘 جاري الضغط على زر تسجيل الدخول...');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
      page.click('button[type="submit"]')
    ]).catch(() => console.log('⚠️ Navigation timeout - المتابعة...'));
    
    console.log('⏳ انتظار 10 ثواني لتسجيل الدخول...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    await page.screenshot({ path: 'vendoor-after-login.png' });
    console.log('📸 تم حفظ لقطة: vendoor-after-login.png');
    
    const currentUrl = page.url();
    console.log('📍 الصفحة الحالية:', currentUrl);
    
    if (currentUrl.includes('login')) {
      console.log('❌ فشل تسجيل الدخول');
      await browser.close();
      return null;
    }
    
    console.log('✅ تم تسجيل الدخول بنجاح!\n');
    
    // الانتقال إلى صفحة المنتجات
    console.log('📦 جاري فتح صفحة المنتجات...');
    await page.goto('https://aff.ven-door.com/products', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('⏳ انتظار 5 ثواني لتحميل المنتجات...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    await page.screenshot({ path: 'vendoor-products-page.png', fullPage: true });
    console.log('📸 تم حفظ لقطة: vendoor-products-page.png');
    
    // حفظ HTML للفحص
    const html = await page.content();
    fs.writeFileSync('vendoor-products-page.html', html, 'utf-8');
    console.log('💾 تم حفظ HTML: vendoor-products-page.html\n');
    
    // استخراج بيانات المنتجات
    console.log('🔍 جاري استخراج بيانات المنتجات...\n');
    
    const products = await page.evaluate(() => {
      const productsList = [];
      
      // البحث عن جميع بطاقات/صفوف المنتجات
      const productElements = document.querySelectorAll('.product-card, .product-item, tr[data-product], .card, tbody tr');
      
      console.log(`Found ${productElements.length} potential product elements`);
      
      productElements.forEach((element, index) => {
        try {
          const product = {
            id: '',
            title: '',
            price: '',
            image: '',
            link: '',
            stock: '',
            category: '',
            supplier: ''
          };
          
          // استخراج رقم المنتج
          const idElement = element.querySelector('[data-product-id], .product-id, td:first-child');
          if (idElement) {
            product.id = idElement.textContent.trim() || idElement.getAttribute('data-product-id');
          }
          
          // استخراج العنوان
          const titleElement = element.querySelector('.product-title, .product-name, h3, h4, td:nth-child(2), a[href*="product"]');
          if (titleElement) {
            product.title = titleElement.textContent.trim();
            
            // استخراج الرابط
            const linkElement = titleElement.tagName === 'A' ? titleElement : titleElement.querySelector('a');
            if (linkElement && linkElement.href) {
              product.link = linkElement.href;
            }
          }
          
          // استخراج السعر
          const priceElement = element.querySelector('.price, .product-price, td:contains("جنيه")');
          if (priceElement) {
            product.price = priceElement.textContent.trim();
          }
          
          // استخراج الصورة
          const imgElement = element.querySelector('img');
          if (imgElement) {
            product.image = imgElement.src || imgElement.getAttribute('data-src');
          }
          
          // استخراج المخزون
          const stockElement = element.querySelector('.stock, .quantity, td:contains("الكمية")');
          if (stockElement) {
            product.stock = stockElement.textContent.trim();
          }
          
          // استخراج الفئة
          const categoryElement = element.querySelector('.category, .product-category');
          if (categoryElement) {
            product.category = categoryElement.textContent.trim();
          }
          
          // استخراج المورد
          const supplierElement = element.querySelector('.supplier, .vendor');
          if (supplierElement) {
            product.supplier = supplierElement.textContent.trim();
          }
          
          // إضافة المنتج إذا كان لديه عنوان أو رقم
          if (product.title || product.id) {
            productsList.push(product);
          }
        } catch (error) {
          console.error(`Error extracting product ${index}:`, error.message);
        }
      });
      
      // البحث أيضاً عن روابط المنتجات في القائمة الجانبية أو القوائم
      const productLinks = document.querySelectorAll('a[href*="product"], a[href*="orders/create"]');
      productLinks.forEach(link => {
        const href = link.href;
        const match = href.match(/product[=\/](\d+)/);
        if (match) {
          const existingProduct = productsList.find(p => p.id === match[1] || p.link === href);
          if (!existingProduct) {
            productsList.push({
              id: match[1],
              title: link.textContent.trim() || `منتج رقم ${match[1]}`,
              link: href,
              price: '',
              image: '',
              stock: '',
              category: '',
              supplier: ''
            });
          }
        }
      });
      
      // استخراج كل النصوص والروابط من الصفحة
      const allText = document.body.innerText;
      
      return {
        products: productsList,
        allText: allText.substring(0, 3000), // أول 3000 حرف للتحليل
        totalElements: productElements.length,
        totalLinks: productLinks.length
      };
    });
    
    console.log('📊 النتائج:');
    console.log(`   - عدد العناصر الممسوحة: ${products.totalElements}`);
    console.log(`   - عدد الروابط الموجودة: ${products.totalLinks}`);
    console.log(`   - عدد المنتجات المستخرجة: ${products.products.length}\n`);
    
    if (products.products.length > 0) {
      console.log('📦 المنتجات المستخرجة:');
      products.products.slice(0, 10).forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.title || 'بدون عنوان'}`);
        console.log(`   ID: ${product.id || 'غير متوفر'}`);
        console.log(`   السعر: ${product.price || 'غير متوفر'}`);
        console.log(`   الرابط: ${product.link || 'غير متوفر'}`);
      });
      
      if (products.products.length > 10) {
        console.log(`\n... و ${products.products.length - 10} منتج آخر`);
      }
    }
    
    // حفظ البيانات
    const outputData = {
      scrapedAt: new Date().toISOString(),
      totalProducts: products.products.length,
      products: products.products,
      pageText: products.allText
    };
    
    fs.writeFileSync('vendoor-all-products.json', JSON.stringify(outputData, null, 2), 'utf-8');
    console.log('\n💾 تم حفظ جميع البيانات في: vendoor-all-products.json');
    
    console.log('\n📌 الملفات المحفوظة:');
    console.log('   - vendoor-login.png');
    console.log('   - vendoor-after-login.png');
    console.log('   - vendoor-products-page.png');
    console.log('   - vendoor-products-page.html');
    console.log('   - vendoor-all-products.json');
    
    console.log('\n📄 أول 1000 حرف من محتوى الصفحة:');
    console.log(products.allText.substring(0, 1000));
    
    await browser.close();
    
    console.log('\n✅ تم استخراج البيانات بنجاح!');
    
    return outputData;
    
  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    console.error('Stack:', error.stack);
    
    if (browser) {
      await browser.close();
    }
    
    return null;
  }
}

scrapeAllProducts().catch(console.error);
