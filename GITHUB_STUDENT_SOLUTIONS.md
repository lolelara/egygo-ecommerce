# 🎓 حلول Scraping مجانية للطلاب (GitHub Student Pack)

## 📦 الخدمات المجانية في GitHub Student Pack

### 1. **Heroku** ⭐ (الأفضل)
✅ **مجاني تماماً** مع GitHub Student Pack
✅ يدعم Puppeteer بدون مشاكل
✅ 1000 dyno hours شهرياً (مجاناً)
✅ سهل النشر جداً

**المميزات:**
- لا يحتاج Browser Rendering API
- يعمل Puppeteer مباشرة
- Performance جيد جداً
- SSL مجاني

**التكلفة:** $0 (مجاني للطلاب)

---

### 2. **DigitalOcean** ⭐⭐
✅ **$200 رصيد مجاني** لمدة سنة
✅ Droplet بـ $6/شهر = 33 شهر مجاناً!
✅ يدعم Node.js + Puppeteer بالكامل
✅ تحكم كامل في السيرفر

**المميزات:**
- سيرفر Linux كامل
- تثبيت أي شيء تريده
- Performance ممتاز
- SSH access كامل

**التكلفة:** $0 لمدة سنة كاملة (باستخدام الرصيد)

---

### 3. **Azure for Students** ⭐⭐⭐
✅ **$100 رصيد مجاني** سنوياً
✅ Azure Functions تدعم Puppeteer
✅ App Service مجاني
✅ تجديد تلقائي كل سنة (أثناء الدراسة)

**المميزات:**
- Functions: 1 مليون execution مجاناً
- App Service: B1 tier مجاناً
- Storage مجاني
- Database مجاني

**التكلفة:** $0 (مجاني طول فترة الدراسة)

---

### 4. **Railway** ⭐
✅ **$5 رصيد شهري** مجاناً
✅ يدعم Puppeteer مباشرة
✅ نشر من GitHub مباشرة
✅ Logs مباشرة

**المميزات:**
- سهل جداً في الاستخدام
- Deploy تلقائي من Git
- Environment variables
- Custom domains مجانية

**التكلفة:** $0 (الرصيد الشهري يكفي للاستخدام الخفيف)

---

### 5. **Render**
✅ **مجاني تماماً** (Free tier دائم)
✅ يدعم Puppeteer
✅ Auto-deploy من GitHub
✅ SSL مجاني

**المميزات:**
- 750 ساعة شهرياً مجاناً
- Background jobs مجانية
- Cron jobs مجانية
- PostgreSQL مجاني

**القيود:**
- ينام بعد 15 دقيقة من عدم الاستخدام
- يستيقظ تلقائياً عند أول request

---

## 🏆 التوصية الأفضل: DigitalOcean

### لماذا DigitalOcean؟

1. **$200 رصيد = سنة كاملة مجاناً**
2. **تحكم كامل** في السيرفر
3. **Performance ممتاز** (dedicated resources)
4. **يدعم Puppeteer** بدون أي قيود
5. **سهل الإعداد** (15 دقيقة فقط)

---

## 🚀 دليل الإعداد: DigitalOcean + Puppeteer

### الخطوة 1: الحصول على الرصيد المجاني

1. اذهب إلى [GitHub Student Developer Pack](https://education.github.com/pack)
2. سجل بحساب GitHub الخاص بك
3. أثبت أنك طالب (رفع صورة البطاقة الجامعية)
4. بعد الموافقة، افعّل عرض DigitalOcean
5. ستحصل على **$200 رصيد** لمدة سنة

### الخطوة 2: إنشاء Droplet (السيرفر)

1. اذهب إلى [DigitalOcean](https://cloud.digitalocean.com)
2. اضغط "Create" → "Droplets"
3. اختر:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($6/month)
   - **CPU**: Regular Intel ($6/month)
   - **Datacenter**: Frankfurt (الأقرب للمنطقة العربية)
   - **Authentication**: SSH Key (أو Password)
   - **Hostname**: vendoor-scraper

4. اضغط "Create Droplet"

### الخطوة 3: الاتصال بالسيرفر

```bash
# استبدل YOUR_SERVER_IP بـ IP السيرفر
ssh root@YOUR_SERVER_IP
```

### الخطوة 4: تثبيت المتطلبات

```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# تثبيت المكتبات المطلوبة لـ Puppeteer
apt install -y \
  chromium-browser \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils

# تثبيت pnpm
npm install -g pnpm

# تثبيت PM2 (لإدارة التطبيق)
npm install -g pm2

# إنشاء مجلد المشروع
mkdir -p /var/www/vendoor-scraper
cd /var/www/vendoor-scraper
```

### الخطوة 5: رفع الكود

```bash
# على جهازك المحلي
# أنشئ مجلد جديد للـ API
mkdir vendoor-api
cd vendoor-api

# انسخ الكود من المشروع
# سأنشئ لك الملفات الآن...
```

### الخطوة 6: تشغيل التطبيق

```bash
# على السيرفر
cd /var/www/vendoor-scraper

# تثبيت المكتبات
pnpm install

# تشغيل التطبيق مع PM2
pm2 start index.js --name vendoor-api

# حفظ التشغيل التلقائي عند إعادة تشغيل السيرفر
pm2 save
pm2 startup
```

### الخطوة 7: إعداد Nginx (Reverse Proxy)

```bash
# تثبيت Nginx
apt install -y nginx

# إنشاء ملف التكوين
cat > /etc/nginx/sites-available/vendoor-api << 'EOF'
server {
    listen 80;
    server_name YOUR_SERVER_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        # زيادة Timeout للـ scraping
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
EOF

# تفعيل الموقع
ln -s /etc/nginx/sites-available/vendoor-api /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# إعادة تشغيل Nginx
systemctl restart nginx
```

### الخطوة 8: إعداد SSL (اختياري ولكن مهم)

```bash
# تثبيت Certbot
apt install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL (استبدل بالدومين الخاص بك)
certbot --nginx -d api.yoursite.com
```

---

## 📁 ملفات الكود للسيرفر

### ملف index.js (على السيرفر)

```javascript
import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const VENDOOR_EMAIL = process.env.VENDOOR_EMAIL || 'almlmibrahym574@gmail.com';
const VENDOOR_PASSWORD = process.env.VENDOOR_PASSWORD || 'hema2004';
const LOGIN_URL = 'https://aff.ven-door.com/login';
const PRODUCTS_BASE_URL = 'https://aff.ven-door.com/products';
const MAX_PAGES = 41;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vendoor API is running' });
});

// جلب جميع المنتجات
app.get('/scrape-all', async (req, res) => {
  console.log('🚀 بدء جلب جميع المنتجات...');
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ],
      executablePath: '/usr/bin/chromium-browser'
    });
    
    const page = await browser.newPage();
    
    // تسجيل الدخول
    await loginToVendoor(page);
    
    const allProducts = [];
    let currentPage = 1;
    
    // جلب المنتجات من كل صفحة
    while (currentPage <= MAX_PAGES) {
      console.log(`📄 معالجة الصفحة ${currentPage}/${MAX_PAGES}...`);
      
      const products = await scrapeProductsPage(page, currentPage);
      
      if (products.length === 0) {
        console.log(`✅ تم الوصول لآخر صفحة عند ${currentPage - 1}`);
        break;
      }
      
      allProducts.push(...products);
      currentPage++;
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await browser.close();
    
    console.log(`🎉 تم جلب ${allProducts.length} منتج`);
    
    res.json({
      success: true,
      totalProducts: allProducts.length,
      totalPages: currentPage - 1,
      products: allProducts
    });
    
  } catch (error) {
    console.error('❌ خطأ:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// جلب صفحة واحدة
app.get('/scrape-page', async (req, res) => {
  const pageNum = parseInt(req.query.page) || 1;
  
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/usr/bin/chromium-browser'
    });
    
    const page = await browser.newPage();
    await loginToVendoor(page);
    const products = await scrapeProductsPage(page, pageNum);
    await browser.close();
    
    res.json({
      success: true,
      page: pageNum,
      totalProducts: products.length,
      products: products
    });
    
  } catch (error) {
    console.error('❌ خطأ:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

async function loginToVendoor(page) {
  console.log('🔐 تسجيل الدخول...');
  
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  await page.waitForSelector('input[name="name"]');
  await page.type('input[name="name"]', VENDOOR_EMAIL, { delay: 50 });
  await page.type('input[type="password"]', VENDOOR_PASSWORD, { delay: 50 });
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }),
    page.click('button[type="submit"]')
  ]).catch(() => {});
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  if (page.url().includes('login')) {
    throw new Error('فشل تسجيل الدخول');
  }
  
  console.log('✅ تم تسجيل الدخول');
}

async function scrapeProductsPage(page, pageNum) {
  const url = `${PRODUCTS_BASE_URL}?page=${pageNum}`;
  
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const products = await page.evaluate(() => {
    const productsList = [];
    const rows = document.querySelectorAll('table tbody tr');
    
    rows.forEach(row => {
      try {
        const cells = row.querySelectorAll('td');
        if (cells.length < 5) return;
        
        const imageCell = cells[0];
        const nameCell = cells[1];
        const supplierCell = cells[2];
        const priceCell = cells[3];
        const commissionCell = cells[4];
        const stockCell = cells[5];
        const actionCell = cells[7];
        
        const img = imageCell?.querySelector('img');
        const image = img ? (img.src || img.getAttribute('data-src')) : '';
        const title = nameCell?.textContent.trim() || '';
        const supplier = supplierCell?.textContent.trim() || '';
        const price = priceCell?.textContent.trim() || '';
        const commission = commissionCell?.textContent.trim() || '';
        const stock = stockCell?.textContent.trim() || '';
        
        const viewBtn = actionCell?.querySelector('a[href*="/products/"]');
        const productId = viewBtn ? viewBtn.href.split('/products/')[1] : '';
        
        if (productId && title) {
          productsList.push({
            id: productId,
            title,
            supplier,
            price,
            commission,
            stock,
            image
          });
        }
      } catch (error) {
        console.error('خطأ في معالجة صف:', error);
      }
    });
    
    return productsList;
  });
  
  return products;
}

app.listen(PORT, () => {
  console.log(`✅ Vendoor API running on port ${PORT}`);
});
```

### ملف package.json (على السيرفر)

```json
{
  "name": "vendoor-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "puppeteer": "^21.0.0",
    "cors": "^2.8.5"
  }
}
```

---

## 🔄 تحديث VendoorImport.tsx

استبدل URL الـ API في `client/pages/VendoorImport.tsx`:

```typescript
// استبدل YOUR_SERVER_IP بـ IP سيرفر DigitalOcean
const API_URL = 'http://YOUR_SERVER_IP';

const handleScrapeAll = async () => {
  setIsScrapingAll(true);
  
  try {
    const response = await fetch(`${API_URL}/scrape-all`);
    const data = await response.json();
    
    if (data.success) {
      setProducts(data.products);
      toast({
        title: "نجح!",
        description: `تم جلب ${data.totalProducts} منتج من ${data.totalPages} صفحة`
      });
    }
  } catch (error) {
    toast({
      variant: "destructive",
      title: "خطأ",
      description: error.message
    });
  } finally {
    setIsScrapingAll(false);
  }
};
```

---

## 💰 مقارنة التكاليف

| الخدمة | التكلفة الشهرية | الرصيد المجاني | المدة |
|--------|-----------------|----------------|-------|
| **DigitalOcean** | $6 | $200 | 33 شهر |
| **Azure** | $0 | $100/سنة | طول الدراسة |
| **Heroku** | $0 | ∞ | طول الدراسة |
| **Railway** | $0 | $5/شهر | ∞ |
| **Render** | $0 | ∞ | ∞ |
| **Cloudflare** | $5 | $0 | - |

---

## ✅ التوصية النهائية

### للاستخدام الفوري:
1. **Heroku** - أسهل وأسرع حل
2. **Railway** - بديل ممتاز

### للاستخدام طويل المدى:
1. **DigitalOcean** - أفضل قيمة (33 شهر مجاناً)
2. **Azure** - تجديد تلقائي كل سنة

---

## 📞 الدعم

- **DigitalOcean Docs**: [docs.digitalocean.com](https://docs.digitalocean.com)
- **GitHub Student Pack**: [education.github.com/pack](https://education.github.com/pack)
- **Community**: [digitalocean.com/community](https://www.digitalocean.com/community)

---

**ابدأ الآن واحصل على $200 مجاناً!** 🎉
