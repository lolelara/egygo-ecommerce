import fetch from 'node-fetch';
import { CookieJar } from 'tough-cookie';
import fetchCookie from 'fetch-cookie';
import * as cheerio from 'cheerio';

// إنشاء CookieJar للاحتفاظ بالجلسة
const cookieJar = new CookieJar();
const fetchWithCookies = fetchCookie(fetch, cookieJar);

const EMAIL = 'almlmibrahym574@gmail.com';
const PASSWORD = 'hema2004';
const PRODUCT_URL = 'https://aff.ven-door.com/affiliates/29631/orders/create?product=3789';
const LOGIN_URL = 'https://aff.ven-door.com/login';

async function login() {
  console.log('🔐 جاري تسجيل الدخول...');
  
  try {
    // 1. جلب صفحة تسجيل الدخول للحصول على CSRF Token
    const loginPageResponse = await fetchWithCookies(LOGIN_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ar,en-US;q=0.7,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    const loginPageHtml = await loginPageResponse.text();
    const $loginPage = cheerio.load(loginPageHtml);
    
    // البحث عن CSRF token (قد يكون في input مخفي)
    const csrfToken = $loginPage('input[name="_token"]').val() 
                   || $loginPage('meta[name="csrf-token"]').attr('content')
                   || '';
    
    console.log('CSRF Token:', csrfToken ? 'تم العثور عليه ✓' : 'غير موجود');
    
    // استخراج كل الـ cookies
    const cookies = await cookieJar.getCookies(LOGIN_URL);
    console.log('عدد الـ Cookies:', cookies.length);
    
    // 2. إرسال بيانات تسجيل الدخول
    const loginData = {
      email: EMAIL,
      password: PASSWORD
    };
    
    if (csrfToken) {
      loginData._token = csrfToken;
    }
    
    const formBody = new URLSearchParams(loginData);
    
    console.log('البيانات المرسلة:', Object.keys(loginData));
    
    const loginResponse = await fetchWithCookies(LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ar,en-US;q=0.7,en;q=0.3',
        'Referer': LOGIN_URL,
        'Origin': 'https://aff.ven-door.com',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      body: formBody.toString(),
      redirect: 'manual'
    });
    
    console.log('رمز الاستجابة:', loginResponse.status);
    
    // عرض أول 500 حرف من الاستجابة للتشخيص
    const responseText = await loginResponse.text();
    console.log('\nأول 500 حرف من الاستجابة:');
    console.log(responseText.substring(0, 500));
    console.log('\n---');
    
    // التحقق من نجاح تسجيل الدخول
    if (loginResponse.status === 302 || loginResponse.status === 301) {
      const redirectLocation = loginResponse.headers.get('location');
      console.log('✅ تم تسجيل الدخول بنجاح! إعادة التوجيه إلى:', redirectLocation);
      return true;
    } else if (loginResponse.status === 200) {
      if (responseText.includes('Dashboard') || responseText.includes('لوحة التحكم') || responseText.includes('dashboard')) {
        console.log('✅ تم تسجيل الدخول بنجاح!');
        return true;
      } else if (responseText.includes('Invalid credentials') || responseText.includes('بيانات خاطئة')) {
        console.log('❌ بيانات الاعتماد غير صحيحة');
        return false;
      }
    }
    
    console.log('❌ فشل تسجيل الدخول - رمز الحالة:', loginResponse.status);
    return false;
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول:', error.message);
    console.error('Stack:', error.stack);
    return false;
  }
}

async function getProductData() {
  console.log('\n📦 جاري جلب بيانات المنتج...');
  
  try {
    const response = await fetchWithCookies(PRODUCT_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://aff.ven-door.com/dashboard'
      }
    });
    
    if (!response.ok) {
      console.log('❌ فشل جلب الصفحة:', response.status, response.statusText);
      return null;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // التحقق من أننا ما زلنا مسجلين الدخول
    if (html.includes('تسجيل دخول') && !html.includes('Dashboard')) {
      console.log('❌ الجلسة منتهية أو لم يتم تسجيل الدخول بشكل صحيح');
      return null;
    }
    
    console.log('✅ تم جلب الصفحة بنجاح!');
    
    // استخراج بيانات المنتج
    const productData = {
      title: '',
      price: '',
      originalPrice: '',
      description: '',
      images: [],
      specifications: {},
      variations: [],
      vendorName: '',
      sku: ''
    };
    
    // استخراج العنوان
    productData.title = $('h1.product-title').text().trim() 
                     || $('.product-name').text().trim()
                     || $('h1').first().text().trim();
    
    // استخراج السعر
    productData.price = $('.product-price').text().trim()
                     || $('.price').first().text().trim();
    
    productData.originalPrice = $('.old-price').text().trim()
                             || $('.original-price').text().trim();
    
    // استخراج الوصف
    productData.description = $('.product-description').text().trim()
                           || $('.description').text().trim()
                           || $('p').first().text().trim();
    
    // استخراج الصور
    $('.product-image img, .product-gallery img, img[src*="product"]').each((i, elem) => {
      const src = $(elem).attr('src') || $(elem).attr('data-src');
      if (src && !productData.images.includes(src)) {
        productData.images.push(src);
      }
    });
    
    // استخراج المواصفات
    $('.specifications tr, .product-specs tr').each((i, elem) => {
      const label = $(elem).find('th, td').first().text().trim();
      const value = $(elem).find('th, td').last().text().trim();
      if (label && value && label !== value) {
        productData.specifications[label] = value;
      }
    });
    
    // استخراج الاختلافات (المقاسات/الألوان)
    $('.variation-option, .product-variant').each((i, elem) => {
      productData.variations.push($(elem).text().trim());
    });
    
    console.log('\n📊 بيانات المنتج المستخرجة:');
    console.log(JSON.stringify(productData, null, 2));
    
    // حفظ HTML الكامل للتحليل
    console.log('\n💾 جاري حفظ HTML للفحص...');
    const fs = await import('fs');
    await fs.promises.writeFile('vendoor-product-page.html', html, 'utf-8');
    console.log('✅ تم حفظ HTML في: vendoor-product-page.html');
    
    // عرض جزء من HTML للتحليل
    console.log('\n📄 أول 2000 حرف من HTML:');
    console.log(html.substring(0, 2000));
    
    return productData;
  } catch (error) {
    console.error('❌ خطأ في جلب بيانات المنتج:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 بدء اختبار استخراج بيانات المنتج من Ven-door\n');
  
  // تسجيل الدخول
  const loginSuccess = await login();
  
  if (!loginSuccess) {
    console.log('\n❌ فشل تسجيل الدخول. لا يمكن المتابعة.');
    return;
  }
  
  // جلب بيانات المنتج
  const productData = await getProductData();
  
  if (productData) {
    console.log('\n✅ تم استخراج البيانات بنجاح!');
  } else {
    console.log('\n❌ فشل استخراج البيانات');
  }
}

main().catch(console.error);
