# 🚀 دليل تشغيل Vendoor Scraper على RDP

## 📋 المتطلبات

### 1️⃣ تثبيت Node.js على RDP
```bash
# تحميل Node.js v20 من الموقع الرسمي
https://nodejs.org/en/download/

# التحقق من التثبيت
node --version
npm --version
```

### 2️⃣ تثبيت المكتبات المطلوبة
```bash
cd c:\Users\NoteBook\Desktop\goegy-main
npm install puppeteer node-appwrite
```

## 🎯 تشغيل السكريبت

### طريقة 1: تشغيل مباشر
```bash
node scripts/vendoor-scraper-with-live-updates.mjs
```

### طريقة 2: تشغيل في الخلفية (Background)
```powershell
# فتح PowerShell كـ Administrator
Start-Process node -ArgumentList "scripts/vendoor-scraper-with-live-updates.mjs" -WindowStyle Hidden
```

### طريقة 3: جدولة تلقائية (Task Scheduler)
1. افتح Task Scheduler
2. Create Basic Task
3. Name: "Vendoor Scraper Daily"
4. Trigger: Daily at 2:00 AM
5. Action: Start a program
   - Program: `C:\Program Files\nodejs\node.exe`
   - Arguments: `scripts\vendoor-scraper-with-live-updates.mjs`
   - Start in: `c:\Users\NoteBook\Desktop\goegy-main`

## 📱 إشعارات Telegram

### ما سيتم إرساله على البوت:

#### 1️⃣ رسالة البداية
```
🚀 بدء Vendoor Scraper

⏰ الوقت: 2025-11-11 01:00:00
💰 هامش الربح: +10 ج.م

🔄 جاري الاتصال بـ Vendoor...
```

#### 2️⃣ تحديثات مستمرة (كل 5 منتجات)
```
⚡ تحديث مباشر
━━━━━━━━━━━━━━━━━━━━━━

▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░
📊 التقدم: 25/50 (50.0%)

✅ نجح: 22
❌ فشل: 3
⏳ متبقي: 25
```

#### 3️⃣ التقرير النهائي
```
🎉 تقرير نهائي - Vendoor Scraper
━━━━━━━━━━━━━━━━━━━━━━

📊 الإحصائيات:
✅ نجح: 45 منتج
❌ فشل: 5 منتج
📦 إجمالي: 50 منتج
📈 نسبة النجاح: 90.0%

⏱️ المدة: 25د 30ث
⚡ متوسط الوقت: 30.6ث/منتج

🕐 2025-11-11 01:25:30

🏆 أمثلة من المنتجات المضافة:
1. حذاء رياضي - Nike Air Max...
   💰 السعر: 899 ج.م
   📦 المخزون: 150

━━━━━━━━━━━━━━━━━━━━━━
✅ اكتمل بنجاح!

🔗 فتح لوحة التحكم
```

## 🔧 إعدادات السكريبت

### تعديل معلومات التليجرام
افتح ملف: `scripts/vendoor-scraper-with-live-updates.mjs`

```javascript
// سطر 19-20
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';
```

### تعديل هامش الربح
```javascript
// سطر 23
const PROFIT_MARGIN = 10; // غيّر القيمة حسب الحاجة
```

### تعديل تكرار التحديثات
```javascript
// سطر 453 - حالياً كل 5 منتجات
if ((i + 1) % 5 === 0 || i + 1 === products.length) {
  // غيّر الرقم 5 إلى 10 أو 20 حسب الحاجة
```

## 📊 الملفات المخرجة

### vendoor-final-report.json
يحتوي على تقرير كامل بصيغة JSON:
```json
{
  "scrapedAt": "2025-11-11T01:25:30.000Z",
  "databaseId": "68de037e003bd03c4d45",
  "categoryId": "...",
  "totalFound": 50,
  "successCount": 45,
  "failCount": 5,
  "duration": 1530,
  "profitMargin": 10,
  "results": [...]
}
```

## 🛠️ استكشاف الأخطاء

### ❌ "Cannot find module 'puppeteer'"
```bash
npm install puppeteer
```

### ❌ "Telegram message failed"
تحقق من:
- TELEGRAM_BOT_TOKEN صحيح
- TELEGRAM_CHAT_ID صحيح
- الاتصال بالإنترنت يعمل

### ❌ "Login failed"
تحقق من:
- VENDOOR_EMAIL صحيح
- VENDOOR_PASSWORD صحيح
- حساب Vendoor نشط

### ❌ "Browser launch failed"
```bash
# تثبيت dependencies مطلوبة على Windows
# قد تحتاج Visual C++ Redistributable
```

## 💡 نصائح

1. **تشغيل أول مرة**: جرّب السكريبت يدوياً أولاً للتأكد من عمله
2. **الجدولة**: استخدم Task Scheduler للتشغيل التلقائي يومياً
3. **المراقبة**: تابع إشعارات التليجرام لمعرفة حالة العملية
4. **النسخ الاحتياطي**: احتفظ بنسخة من ملفات JSON المخرجة
5. **الأمان**: لا تشارك TELEGRAM_BOT_TOKEN مع أحد

## 🔗 روابط مفيدة

- **Telegram Bot**: [@BotFather](https://t.me/BotFather)
- **Appwrite Console**: https://cloud.appwrite.io/console
- **Admin Panel**: https://egygo.me/#/admin/vendoor-products
- **Node.js Download**: https://nodejs.org/

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من Console Logs
2. راجع ملف `vendoor-final-report.json`
3. تحقق من رسائل Telegram للأخطاء
4. راجع هذا الدليل

---

✅ **جاهز للتشغيل على RDP!**
