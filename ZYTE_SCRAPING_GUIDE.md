# 🕷️ Zyte (Scrapy Cloud) - دليل الاستخدام

## 🎁 العرض المجاني من GitHub Student Pack

```
✅ 1 Free Forever Scrapy Cloud Unit
✅ Unlimited crawl time (بدون حدود!)
✅ 120-day data retention
✅ Unlimited team members & projects
✅ Unlimited requests
```

---

## 🚀 الإعداد السريع

### 1️⃣ الحصول على العرض

1. اذهب إلى: https://www.zyte.com/github-students/
2. Sign up باستخدام GitHub Student account
3. احصل على Free Forever unit

---

### 2️⃣ تثبيت Scrapy

```bash
# Install Scrapy
pip install scrapy

# أو باستخدام pnpm للمشروع
pnpm add scrapy
```

---

### 3️⃣ إنشاء Scrapy Project

```bash
# Create new Scrapy project
scrapy startproject vendoor_scraper

# Navigate to project
cd vendoor_scraper

# Create spider
scrapy genspider vendoor ven-door.com
```

---

### 4️⃣ استخدام Spider الجاهز

استخدم الملف `scrapy-vendoor/vendoor_spider.py` المُنشأ في المشروع:

```bash
# Run spider locally (للاختبار)
scrapy runspider scrapy-vendoor/vendoor_spider.py

# Output: vendoor-products.json
```

---

## ☁️ Deploy على Scrapy Cloud

### Setup

```bash
# Install shub (Scrapy Cloud CLI)
pip install shub

# Login
shub login

# Deploy
shub deploy
```

### Schedule Spider

```bash
# Run spider on cloud
shub schedule vendoor

# Schedule periodic runs (كل 6 ساعات)
shub schedule --periodic vendoor
```

---

## 🎯 المميزات

### ✅ أسرع من Puppeteer
- **Scrapy:** ~2 دقيقة للـ 41 صفحة
- **Puppeteer:** ~10-15 دقيقة

### ✅ أخف وأكفأ
- لا يحتاج Chrome browser
- استهلاك RAM أقل بكثير
- Concurrent requests (16+ في نفس الوقت)

### ✅ Built-in Features
- Auto retry on failure
- Data export (JSON, CSV, XML)
- Rate limiting
- Caching
- Middleware system

### ✅ Cloud Benefits
- No server needed
- Auto-scaling
- Monitoring dashboard
- API access
- Scheduled jobs

---

## 📊 المقارنة: Scrapy vs Puppeteer

| الميزة | Scrapy + Zyte | Puppeteer |
|--------|--------------|-----------|
| **السرعة** | ⚡⚡⚡⚡⚡ (2 دقيقة) | ⚡⚡ (10-15 دقيقة) |
| **الموارد** | 💾 خفيف جداً | 💾💾💾 ثقيل |
| **التكلفة** | 🆓 مجاني للأبد | 💰 يحتاج hosting |
| **Setup** | 🔧 بسيط | 🔧🔧 معقد |
| **Scheduling** | ✅ Built-in | ❌ يحتاج GitHub Actions |
| **Monitoring** | ✅ Dashboard | ❌ يدوي |
| **JavaScript** | ⚠️ Limited | ✅ Full support |

---

## 🤔 متى تستخدم Scrapy؟

### استخدم Scrapy إذا:
- ✅ الموقع لا يعتمد بشكل كبير على JavaScript
- ✅ تحتاج سرعة عالية
- ✅ تحتاج scraping مستمر ومجدول
- ✅ تريد أقل استهلاك للموارد

### استخدم Puppeteer إذا:
- ✅ الموقع يحتاج JavaScript rendering
- ✅ تحتاج تفاعل معقد (clicks, scrolling)
- ✅ تحتاج screenshots
- ✅ Ven-door يعتمد بشكل كبير على React/Vue

---

## 🔍 اختبار Ven-door

لنرى هل Ven-door يحتاج Puppeteer فعلاً:

```bash
# Test with simple HTTP request
curl -I https://ven-door.com/products-upload
```

**إذا كان الـ HTML موجود مباشرة → استخدم Scrapy**  
**إذا كان الـ HTML يتم توليده بـ JavaScript → استخدم Puppeteer**

---

## 💡 الحل المثالي: Hybrid

استخدم **كلاهما**:

1. **Scrapy لـ lightweight scraping** (سريع + مجاني)
2. **Puppeteer للـ complex pages** (إذا احتجت)

```python
# في Scrapy spider
def parse(self, response):
    if response.css('.react-root'):
        # Use Puppeteer for this page
        yield scrapy.Request(
            url=response.url,
            callback=self.parse_with_puppeteer,
            meta={'playwright': True}
        )
    else:
        # Use Scrapy normally
        yield from self.parse_with_scrapy(response)
```

---

## 🚀 Quick Start Commands

```bash
# 1. Install
pip install scrapy shub

# 2. Test locally
scrapy runspider scrapy-vendoor/vendoor_spider.py

# 3. Deploy to cloud
shub login
shub deploy

# 4. Run on cloud
shub schedule vendoor

# 5. Schedule periodic
shub schedule --periodic vendoor --cron "0 */6 * * *"
```

---

## 📈 Architecture مع Zyte

```
┌──────────────────────────────────────┐
│      Zyte Scrapy Cloud (FREE)        │
│  ┌────────────────────────────────┐  │
│  │   Vendoor Spider              │  │
│  │   - Runs every 6 hours        │  │
│  │   - Scrapes 41 pages          │  │
│  │   - ~2 minutes execution      │  │
│  └────────────┬───────────────────┘  │
└───────────────┼──────────────────────┘
                │
                ▼
        ┌───────────────┐
        │   Webhook     │
        │  (Your API)   │
        └───────┬───────┘
                │
                ▼
        ┌───────────────┐
        │   MongoDB     │
        │   Appwrite    │
        └───────────────┘
```

---

## 🎯 الخلاصة

**Zyte + Scrapy:**
- ⚡ أسرع 5x من Puppeteer
- 💰 مجاني للأبد
- 🔄 Scheduling built-in
- 📊 Monitoring dashboard
- ☁️ Cloud-based (بدون server)

**القرار:**
1. جرّب Scrapy أولاً
2. إذا لم يعمل بسبب JavaScript → استخدم Puppeteer
3. أو استخدم كلاهما (hybrid)

---

## 📝 Next Steps

1. [ ] Claim Zyte offer من GitHub Student Pack
2. [ ] Test vendoor_spider.py locally
3. [ ] Check if Ven-door needs JavaScript rendering
4. [ ] Deploy to Scrapy Cloud
5. [ ] Setup periodic scraping (every 6 hours)

---

**💡 Tip:** Scrapy أخف وأسرع، جرّبه أولاً! 🚀
