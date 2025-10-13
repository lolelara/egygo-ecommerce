# 🔍 دليل نظام الـ Scraping المتقدم

## 📋 نظرة عامة

نظام scraping متقدم يستخدم استراتيجيات متعددة لاستخراج بيانات المنتجات من أي موقع.

---

## 🎯 الميزات الرئيسية

### **1. استراتيجيات متعددة للاستخراج**
```
✅ Strategy 1: JSON-LD Structured Data
✅ Strategy 2: Open Graph & Meta Tags
✅ Strategy 3: Common E-commerce Selectors
✅ Strategy 4: Site-Specific Scrapers
```

### **2. مواقع مدعومة بشكل خاص**
```
✅ Amazon
✅ eBay
✅ AliExpress
✅ Jumia (Egypt)
✅ Noon (Middle East)
✅ أي موقع آخر (Generic)
```

### **3. إدارة Proxies ذكية**
```
✅ 4 CORS Proxies مع Fallback تلقائي
✅ Rate Limiting
✅ Auto-retry عند الفشل
✅ Proxy Health Monitoring
```

### **4. Caching متقدم**
```
✅ Cache لمدة 5 دقائق
✅ تقليل الطلبات المكررة
✅ تسريع الاستيراد
```

---

## 📦 المكتبات المستخدمة

### **Core Libraries:**
```json
{
  "cheerio": "^1.0.0",      // HTML parsing (jQuery-like)
  "axios": "^1.6.0",        // HTTP requests
  "puppeteer-core": "^24.0.0",  // Browser automation (optional)
  "@sparticuz/chromium": "^141.0.0"  // Chromium for serverless
}
```

### **لماذا هذه المكتبات؟**

#### **Cheerio:**
- ⚡ سريع جداً (10-100x أسرع من Puppeteer)
- 💰 استهلاك موارد قليل
- 🎯 مثالي للـ Static HTML
- 📝 Syntax مثل jQuery

#### **Axios:**
- 🔄 Promise-based
- 🛡️ Automatic transforms
- ⏱️ Timeout support
- 🔁 Retry logic

#### **Puppeteer (Optional):**
- 🌐 للمواقع الديناميكية (React, Vue, Angular)
- 🎭 JavaScript rendering
- 📸 Screenshots
- 🤖 Browser automation

---

## 🚀 كيفية الاستخدام

### **1. استخدام Basic:**

```typescript
import { advancedScraper } from '@/lib/advanced-scraper';

// استخراج بيانات منتج
const product = await advancedScraper.scrape('https://example.com/product');

console.log(product);
// {
//   name: "Product Name",
//   price: 99.99,
//   description: "...",
//   images: [...],
//   brand: "Brand Name",
//   rating: 4.5,
//   reviewCount: 123
// }
```

### **2. استخدام مع Options:**

```typescript
import { AdvancedProductScraper } from '@/lib/advanced-scraper';

const scraper = new AdvancedProductScraper({
  timeout: 60000,  // 60 seconds
  userAgent: 'Custom User Agent',
  headers: {
    'Custom-Header': 'value'
  }
});

const product = await scraper.scrape(url);
```

### **3. استخدام Proxy Manager:**

```typescript
import { proxyManager } from '@/lib/proxy-manager';

// الحصول على إحصائيات
const stats = proxyManager.getStats();
console.log(stats);

// إضافة proxy مخصص
proxyManager.addProxy({
  url: 'https://my-proxy.com/?url=',
  name: 'My Proxy',
  active: true,
  rateLimit: 100
});

// Fetch من خلال proxy
const html = await proxyManager.fetchThroughProxy(url);
```

### **4. استخدام في Intermediary API:**

```typescript
import { scrapeProductFromUrl } from '@/lib/intermediary-api';

// الاستخدام العادي
const product = await scrapeProductFromUrl(url);

// بدون cache
const product = await scrapeProductFromUrl(url, false);
```

---

## 🎓 استراتيجيات الاستخراج

### **Strategy 1: JSON-LD**

**ما هو JSON-LD؟**
- Structured data في `<script type="application/ld+json">`
- معيار Schema.org
- أفضل طريقة للاستخراج

**مثال:**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Product Name",
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD"
  }
}
</script>
```

**الاستخراج:**
```typescript
// يتم تلقائياً في Strategy 1
const jsonLd = $('script[type="application/ld+json"]');
const data = JSON.parse(jsonLd.html());
```

---

### **Strategy 2: Meta Tags**

**Open Graph Tags:**
```html
<meta property="og:title" content="Product Name">
<meta property="og:description" content="...">
<meta property="og:image" content="image.jpg">
<meta property="product:price:amount" content="99.99">
```

**Twitter Cards:**
```html
<meta name="twitter:title" content="Product Name">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="image.jpg">
```

**الاستخراج:**
```typescript
const title = $('meta[property="og:title"]').attr('content');
const price = $('meta[property="product:price:amount"]').attr('content');
```

---

### **Strategy 3: Common Selectors**

**Selectors شائعة:**
```typescript
// العنوان
'h1.product-title'
'h1[itemprop="name"]'
'.product-name'

// السعر
'.price'
'[itemprop="price"]'
'.product-price'

// الوصف
'[itemprop="description"]'
'.product-description'

// الصور
'[itemprop="image"]'
'.product-image img'
```

---

### **Strategy 4: Site-Specific**

**Amazon:**
```typescript
name: $('#productTitle').text()
price: $('.a-price .a-offscreen').text()
images: $('.imgTagWrapper img')
rating: $('.a-icon-star .a-icon-alt').text()
```

**eBay:**
```typescript
name: $('.x-item-title__mainTitle').text()
price: $('.x-price-primary').text()
```

**Jumia:**
```typescript
name: $('.-fs20').text()
price: $('.-b.-ltr.-tal.-fs24').text()
rating: $('.stars').attr('data-rating')
```

---

## 🔧 إضافة موقع جديد

### **خطوات إضافة Site-Specific Scraper:**

```typescript
// في advanced-scraper.ts

private async scrapeWithSiteSpecific(url: string): Promise<ScrapedProduct> {
  const hostname = new URL(url).hostname.toLowerCase();

  // إضافة موقع جديد
  if (hostname.includes('mynewsite')) {
    return this.scrapeMyNewSite(url);
  }

  // ... باقي المواقع
}

/**
 * MyNewSite-specific scraper
 */
private async scrapeMyNewSite(url: string): Promise<ScrapedProduct> {
  const html = await this.fetchHtml(url);
  const $ = cheerio.load(html);

  return {
    name: $('.product-name').text().trim(),
    price: this.parsePrice($('.product-price').text()),
    description: $('.product-desc').text().trim(),
    images: this.extractMyNewSiteImages($),
    brand: $('.brand-name').text().trim(),
    category: ''
  };
}
```

---

## 🛡️ معالجة الأخطاء

### **Retry Logic:**
```typescript
// تلقائي في Proxy Manager
// يحاول 4 proxies مختلفة
// Auto-reset بعد 5 دقائق
```

### **Timeout:**
```typescript
// Default: 30 seconds
// يمكن تغييره في Options
timeout: 60000  // 60 seconds
```

### **Error Messages:**
```typescript
try {
  const product = await scrapeProductFromUrl(url);
} catch (error) {
  // "فشل استخراج بيانات المنتج: [سبب محدد]"
  console.error(error.message);
}
```

---

## 📊 Monitoring & Analytics

### **Proxy Statistics:**
```typescript
const stats = proxyManager.getStats();
// {
//   total: 4,
//   active: 4,
//   failed: 0,
//   proxies: [...]
// }
```

### **Cache Statistics:**
```typescript
// في AdvancedProductScraper
scraper.clearCache();  // مسح الـ cache
scraper.setCacheDuration(10);  // 10 دقائق
```

---

## ⚡ تحسينات الأداء

### **1. استخدام Cache:**
```typescript
// Cache تلقائي لمدة 5 دقائق
const product = await scraper.scrape(url, true);

// بدون cache
const product = await scraper.scrape(url, false);
```

### **2. Parallel Scraping:**
```typescript
const urls = ['url1', 'url2', 'url3'];
const products = await Promise.all(
  urls.map(url => scraper.scrape(url))
);
```

### **3. Rate Limiting:**
```typescript
// تلقائي في Proxy Manager
// كل proxy له rate limit خاص
```

---

## 🔮 ميزات مستقبلية (Optional)

### **1. Puppeteer Integration:**
```typescript
// للمواقع الديناميكية
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const browser = await puppeteer.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath()
});
```

### **2. AI-Powered Extraction:**
```typescript
// استخدام GPT لاستخراج البيانات
// من HTML غير منظم
```

### **3. Image Recognition:**
```typescript
// استخراج معلومات من الصور
// باستخدام OCR أو Computer Vision
```

---

## 📝 Best Practices

### **1. احترام robots.txt:**
```typescript
// تحقق من robots.txt قبل الـ scraping
// استخدم rate limiting
```

### **2. User Agent:**
```typescript
// استخدم User Agent واقعي
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...'
```

### **3. Error Handling:**
```typescript
// دائماً استخدم try/catch
// اعرض رسائل خطأ واضحة
```

### **4. Caching:**
```typescript
// استخدم cache للبيانات المتكررة
// قلل الطلبات للمواقع الخارجية
```

---

## 🎯 الخلاصة

### **النظام يوفر:**
```
✅ 4 استراتيجيات مختلفة
✅ دعم 5+ مواقع شهيرة
✅ 4 CORS proxies مع fallback
✅ Caching ذكي
✅ Error handling قوي
✅ سهل التوسع
✅ Performance عالي
```

### **الاستخدام:**
```typescript
// بسيط جداً
const product = await advancedScraper.scrape(url);
```

**🎊 جاهز للاستخدام في الإنتاج!**
