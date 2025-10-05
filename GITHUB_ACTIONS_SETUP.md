# 🤖 GitHub Actions Auto-Scraper Setup

## ✅ ما تم إنشاؤه

تم إنشاء نظام automated scraping كامل باستخدام GitHub Actions:

### 📁 الملفات المُنشأة

1. **`.github/workflows/scrape-vendoor.yml`**
   - GitHub Actions workflow
   - يشتغل تلقائيًا كل 6 ساعات
   - يمكن تشغيله يدويًا من GitHub UI

2. **`scripts/scrape-vendoor-cron.mjs`**
   - السكريبت الرئيسي للـ scraping
   - يجمع كل الـ 41 صفحة (~615 منتج)
   - يحفظ البيانات في JSON file
   - يرفعها لـ Appwrite (اختياري)

---

## 🔧 خطوات التفعيل

### 1️⃣ إضافة GitHub Secrets

اذهب إلى:
```
GitHub Repo → Settings → Secrets and variables → Actions → New repository secret
```

أضف الـ Secrets التالية:

#### **Secrets المطلوبة:**
```
VENDOOR_EMAIL = almlmibrahym574@gmail.com
VENDOOR_PASSWORD = hema2004
```

#### **Secrets اختيارية (لـ Appwrite):**
```
APPWRITE_ENDPOINT = https://fra.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID = 68d8b9db00134c41e7c8
APPWRITE_API_KEY = your_api_key_here
```

---

### 2️⃣ Push الكود إلى GitHub

```bash
git add .github/workflows/scrape-vendoor.yml
git add scripts/scrape-vendoor-cron.mjs
git commit -m "🤖 Add GitHub Actions auto-scraper"
git push origin main
```

---

### 3️⃣ تشغيل أول Workflow يدويًا

1. اذهب إلى **Actions** tab في GitHub repo
2. اختر **"Scrape Vendoor Products"**
3. اضغط **"Run workflow"**
4. اختر branch `main`
5. اضغط **"Run workflow"**

---

## 📊 كيف يعمل النظام

### الجدولة التلقائية
```yaml
schedule:
  - cron: '0 */6 * * *'  # كل 6 ساعات
```

**الأوقات (بتوقيت UTC):**
- 00:00 (12:00 AM)
- 06:00 (6:00 AM)
- 12:00 (12:00 PM)
- 18:00 (6:00 PM)

### خطوات التنفيذ

1. **Setup Environment** 🔧
   - Install Node.js 20
   - Install pnpm
   - Install dependencies

2. **Install Chrome** 🌐
   - Download Chromium for Puppeteer

3. **Run Scraper** 🚀
   - Login to Ven-door
   - Scrape all 41 pages
   - Extract ~615 products

4. **Save Results** 💾
   - Save to `vendoor-products.json`
   - Upload as GitHub Artifact (30 days retention)
   - Upload to Appwrite (if configured)

---

## 📦 تحميل البيانات

### من GitHub Artifacts

1. اذهب إلى **Actions** → اختر الـ workflow run
2. في **Artifacts** section، ستجد:
   ```
   vendoor-products-123
   ```
3. اضغط للتحميل (ملف JSON)

### البيانات تُحفظ لمدة 30 يوم تلقائيًا

---

## 🎯 مميزات النظام

### ✅ مجاني تمامًا
- 2000 دقيقة شهريًا مجانًا
- الـ workflow يستهلك ~10-15 دقيقة
- يعني ~133 تشغيل شهريًا (أكثر من كافي!)

### ✅ موثوق
- يشتغل تلقائيًا كل 6 ساعات
- لا يحتاج server شغّال 24/7
- GitHub infrastructure (99.9% uptime)

### ✅ قابل للتطوير
- يمكن تغيير الجدول الزمني
- يمكن إضافة notifications
- يمكن الإرسال لـ webhook/API

### ✅ Monitoring
- تقدر تشوف logs لكل run
- Artifacts محفوظة 30 يوم
- Email notifications في حالة الفشل

---

## 🔄 تخصيص الجدول الزمني

### كل ساعة
```yaml
schedule:
  - cron: '0 * * * *'
```

### كل 12 ساعة
```yaml
schedule:
  - cron: '0 */12 * * *'
```

### يوميًا في الساعة 2 صباحًا
```yaml
schedule:
  - cron: '0 2 * * *'
```

### كل يوم اثنين الساعة 9 صباحًا
```yaml
schedule:
  - cron: '0 9 * * 1'
```

استخدم [crontab.guru](https://crontab.guru/) لتوليد cron expressions

---

## 🚀 الخطوات التالية

### Option 1: استخدام الـ JSON مباشرة
- حمّل الـ artifact من GitHub
- استورد البيانات في الـ database
- استخدمها في الموقع

### Option 2: إرسال لـ API تلقائيًا
أضف في نهاية `scrape-vendoor-cron.mjs`:
```javascript
async function sendToAPI(products) {
  await fetch('https://your-api.com/products/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(products)
  });
}
```

### Option 3: حفظ في Appwrite مباشرة
- الكود جاهز (شغّال حاليًا)
- فقط أضف الـ Secrets في GitHub

---

## 🐛 Troubleshooting

### الـ Workflow لا يشتغل؟
1. تأكد من إضافة الـ Secrets
2. تأكد من push الكود للـ main branch
3. شغّل manually أول مرة من Actions tab

### Chrome not found؟
- الـ workflow يثبت Chrome تلقائيًا
- تأكد من step: `npx puppeteer browsers install chrome`

### Login فشل؟
- تأكد من صحة VENDOOR_EMAIL و VENDOOR_PASSWORD
- جرّب التسجيل يدويًا أولاً

### Out of minutes؟
- GitHub يعطي 2000 دقيقة مجانًا
- قلل عدد مرات التشغيل (مثلاً كل 12 ساعة)
- الطلاب يحصلون على unlimited minutes!

---

## 📈 الإحصائيات

- **Total Pages:** 41 صفحة
- **Products per page:** ~15 منتج
- **Expected total:** ~615 منتج
- **Runtime:** 10-15 دقيقة
- **Cost:** $0.00 (FREE!)

---

## 🎓 GitHub Student Pack Bonus

لو عندك GitHub Student Pack:
- **Unlimited minutes** للـ Actions
- يعني تقدر تشغّل كل ساعة بدون قلق!
- Apply: https://education.github.com/pack

---

## 💡 Tips

1. **أول مرة:** شغّل manually للاختبار
2. **راقب الـ logs:** اتأكد إن كل شيء شغّال
3. **حمّل أول artifact:** اتأكد من البيانات
4. **بعد كده:** خليه يشتغل تلقائيًا

---

## ✅ Done!

الآن عندك نظام automated scraping يشتغل كل 6 ساعات تلقائيًا! 🎉

**Next:** أضف الـ Secrets في GitHub وشغّل أول workflow
