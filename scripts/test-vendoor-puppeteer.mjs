import puppeteer from 'puppeteer';
import fs from 'fs';

const EMAIL = 'almlmibrahym574@gmail.com';
const PASSWORD = 'hema2004';
const PRODUCT_URL = 'https://aff.ven-door.com/affiliates/29631/orders/create?product=3789';
const LOGIN_URL = 'https://aff.ven-door.com/login';

async function scrapeVendoorProduct() {
  console.log('🚀 بدء استخراج بيانات المنتج من Ven-door باستخدام Puppeteer\n');
  console.log('⏰ ملاحظة: العملية قد تستغرق 30-60 ثانية، الرجاء الانتظار...\n');
  
  let browser;
  try {
    // إطلاق المتصفح
    console.log('🌐 جاري فتح المتصفح...');
    browser = await puppeteer.launch({
      headless: false, // نشغل المتصفح مع واجهة رسومية لنرى ما يحدث
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    const page = await browser.newPage();
    
    // تعيين User Agent ليبدو كمتصفح حقيقي
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // تعيين viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // الانتقال إلى صفحة تسجيل الدخول
    console.log('📄 جاري فتح صفحة تسجيل الدخول...');
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // انتظار قليل ليتم تحميل الصفحة بالكامل
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // أخذ لقطة شاشة قبل البحث عن النموذج
    await page.screenshot({ path: 'vendoor-login-page.png', fullPage: true });
    console.log('📸 تم حفظ لقطة الشاشة: vendoor-login-page.png');
    
    // حفظ HTML للفحص
    const loginHtml = await page.content();
    fs.writeFileSync('vendoor-login-page.html', loginHtml, 'utf-8');
    console.log('💾 تم حفظ HTML: vendoor-login-page.html');
    
    // البحث عن جميع حقول الإدخال في الصفحة
    const inputs = await page.evaluate(() => {
      const allInputs = [];
      document.querySelectorAll('input').forEach(input => {
        allInputs.push({
          type: input.type,
          name: input.name,
          id: input.id,
          placeholder: input.placeholder,
          className: input.className
        });
      });
      return allInputs;
    });
    
    console.log('\n📋 حقول الإدخال الموجودة في الصفحة:');
    console.log(JSON.stringify(inputs, null, 2));
    
    // انتظار ظهور نموذج تسجيل الدخول - محاولة selectors متعددة
    console.log('\n⏳ انتظار تحميل النموذج...');
    
    let emailSelector = null;
    let passwordSelector = null;
    
    // محاولة إيجاد الحقول بطرق مختلفة
    try {
      await page.waitForSelector('input[name="name"]', { timeout: 5000 });
      emailSelector = 'input[name="name"]';
      console.log('✓ تم العثور على حقل الاسم/البريد');
    } catch {
      try {
        await page.waitForSelector('input[type="email"]', { timeout: 5000 });
        emailSelector = 'input[type="email"]';
        console.log('✓ تم العثور على حقل البريد');
      } catch {
        try {
          await page.waitForSelector('input[name="email"]', { timeout: 5000 });
          emailSelector = 'input[name="email"]';
          console.log('✓ تم العثور على حقل البريد');
        } catch {
          try {
            await page.waitForSelector('input[type="text"]', { timeout: 5000 });
            emailSelector = 'input[type="text"]';
            console.log('✓ تم العثور على حقل نصي');
          } catch {
            console.log('❌ لم يتم العثور على حقل البريد الإلكتروني');
          }
        }
      }
    }
    
    if (!emailSelector) {
      console.log('❌ فشل العثور على نموذج تسجيل الدخول');
      console.log('📸 يرجى فحص الملفات: vendoor-login-page.png و vendoor-login-page.html');
      await browser.close();
      return null;
    }
    
    // أخذ لقطة شاشة قبل تسجيل الدخول
    await page.screenshot({ path: 'vendoor-before-login.png' });
    console.log('📸 تم حفظ لقطة الشاشة: vendoor-before-login.png');
    
    // ملء نموذج تسجيل الدخول
    console.log('✍️ جاري ملء بيانات تسجيل الدخول...');
    
    // استخدام المتغيرات المعرفة سابقاً
    await page.type(emailSelector, EMAIL, { delay: 100 });
    
    // محاولة إيجاد حقل كلمة المرور
    passwordSelector = 'input[type="password"]';
    await page.type(passwordSelector, PASSWORD, { delay: 100 });
    
    console.log('🔘 جاري الضغط على زر تسجيل الدخول...');
    
    // البحث عن زر تسجيل الدخول والضغط عليه
    try {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
        page.click('button[type="submit"]')
      ]);
      console.log('✓ تم الضغط على زر تسجيل الدخول');
    } catch (e) {
      console.log('⚠️ Navigation timeout - الموقع يأخذ وقت طويل');
    }
    
    // انتظار 10 ثواني بعد تسجيل الدخول لإعطاء الموقع وقت كافي
    console.log('⏳ انتظار 10 ثواني لتسجيل الدخول...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // أخذ لقطة شاشة بعد تسجيل الدخول
    try {
      await page.screenshot({ path: 'vendoor-after-login.png' });
      console.log('📸 تم حفظ لقطة الشاشة: vendoor-after-login.png');
    } catch (e) {
      console.log('⚠️ فشل حفظ لقطة الشاشة:', e.message);
    }
    
    // حفظ HTML بعد تسجيل الدخول
    try {
      const afterLoginHtml = await page.content();
      fs.writeFileSync('vendoor-after-login.html', afterLoginHtml, 'utf-8');
      console.log('💾 تم حفظ HTML بعد تسجيل الدخول: vendoor-after-login.html');
    } catch (e) {
      console.log('⚠️ فشل حفظ HTML:', e.message);
    }
    
    // التحقق من نجاح تسجيل الدخول
    const currentUrl = page.url();
    console.log('📍 الصفحة الحالية:', currentUrl);
    
    if (currentUrl.includes('login')) {
      console.log('❌ فشل تسجيل الدخول - ما زلنا في صفحة تسجيل الدخول');
      
      // انتظار قليل قبل قراءة رسالة الخطأ
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // محاولة قراءة رسالة الخطأ
      try {
        const errorMessage = await page.$eval('.alert-danger, .error, .invalid-feedback, .text-danger', el => el.textContent).catch(() => null);
        
        if (errorMessage) {
          console.log('💬 رسالة الخطأ:', errorMessage.trim());
        } else {
          console.log('💬 لم يتم العثور على رسالة خطأ واضحة');
        }
      } catch (e) {
        console.log('💬 لا توجد رسالة خطأ');
      }
      
      console.log('\n📸 افحص الصور المحفوظة لمعرفة المشكلة:');
      console.log('   - vendoor-before-login.png');
      console.log('   - vendoor-after-login.png');
      
      await browser.close();
      return null;
    }
    
    console.log('✅ تم تسجيل الدخول بنجاح!\n');
    
    // الانتقال إلى صفحة المنتج
    console.log('📦 جاري فتح صفحة المنتج...');
    await page.goto(PRODUCT_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('⏳ انتظار 5 ثواني لتحميل صفحة المنتج...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // أخذ لقطة شاشة للصفحة
    await page.screenshot({ path: 'vendoor-product-page.png', fullPage: true });
    console.log('📸 تم حفظ لقطة الشاشة: vendoor-product-page.png');
    
    // استخراج HTML الكامل
    const html = await page.content();
    fs.writeFileSync('vendoor-product-page.html', html, 'utf-8');
    console.log('💾 تم حفظ HTML: vendoor-product-page.html\n');
    
    // استخراج بيانات المنتج
    console.log('🔍 جاري استخراج بيانات المنتج...\n');
    
    const productData = await page.evaluate(() => {
      const data = {
        title: '',
        price: '',
        originalPrice: '',
        description: '',
        images: [],
        specifications: {},
        variations: [],
        allText: '',
        formData: {}
      };
      
      // استخراج العنوان
      const titleElement = document.querySelector('h1, .product-title, .product-name, [class*="title"]');
      data.title = titleElement ? titleElement.textContent.trim() : '';
      
      // استخراج السعر
      const priceElement = document.querySelector('.price, .product-price, [class*="price"]:not([class*="old"])');
      data.price = priceElement ? priceElement.textContent.trim() : '';
      
      // استخراج السعر القديم
      const oldPriceElement = document.querySelector('.old-price, .original-price, [class*="old-price"]');
      data.originalPrice = oldPriceElement ? oldPriceElement.textContent.trim() : '';
      
      // استخراج الوصف
      const descElement = document.querySelector('.description, .product-description, p');
      data.description = descElement ? descElement.textContent.trim() : '';
      
      // استخراج الصور
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src');
        if (src && !src.includes('icon') && !src.includes('logo')) {
          data.images.push(src);
        }
      });
      
      // استخراج كل النصوص المرئية
      data.allText = document.body.innerText;
      
      // استخراج بيانات النموذج (إن وجد)
      document.querySelectorAll('input, select, textarea').forEach(field => {
        const name = field.name || field.id;
        const value = field.value;
        const label = field.labels && field.labels[0] ? field.labels[0].textContent : '';
        
        if (name) {
          data.formData[name] = {
            value: value,
            label: label,
            type: field.type || field.tagName
          };
        }
      });
      
      return data;
    });
    
    console.log('📊 البيانات المستخرجة:');
    console.log(JSON.stringify(productData, null, 2));
    
    // حفظ البيانات في ملف JSON
    fs.writeFileSync('vendoor-product-data.json', JSON.stringify(productData, null, 2), 'utf-8');
    console.log('\n💾 تم حفظ البيانات في: vendoor-product-data.json');
    
    // عرض أول 1000 حرف من النص
    console.log('\n📄 أول 1000 حرف من محتوى الصفحة:');
    console.log(productData.allText.substring(0, 1000));
    
    console.log('\n✅ تم استخراج البيانات بنجاح!');
    console.log('\n📌 الملفات المحفوظة:');
    console.log('   - vendoor-before-login.png');
    console.log('   - vendoor-after-login.png');
    console.log('   - vendoor-product-page.png');
    console.log('   - vendoor-product-page.html');
    console.log('   - vendoor-product-data.json');
    
    await browser.close();
    return productData;
    
  } catch (error) {
    console.error('\n❌ حدث خطأ:', error.message);
    console.error('Stack:', error.stack);
    
    if (browser) {
      await browser.close();
    }
    
    return null;
  }
}

scrapeVendoorProduct().catch(console.error);
