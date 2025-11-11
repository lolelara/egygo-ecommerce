# 📊 دليل تكامل Google Sheets مع Vendoor Scraper

## 🎯 الهدف
تسجيل تقارير Vendoor Scraper تلقائياً في Google Sheets بعد كل تشغيل، مع إنشاء تقارير مفصلة وشاملة.

---

## 📋 الخطوات السريعة

### 1️⃣ إعداد Google Apps Script

#### أ. إنشاء Google Sheet جديد
1. اذهب إلى: https://sheets.google.com
2. أنشئ Sheet جديد باسم "Vendoor Scraper Reports"
3. انسخ **Spreadsheet ID** من الرابط:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

#### ب. فتح Apps Script
1. في Google Sheet، اذهب إلى: **Extensions** > **Apps Script**
2. أو اذهب مباشرة إلى: https://script.google.com/u/0/home/projects/1cRItoI83JQRGqQ14I2voDj9oU4zW9I17d9nuDi9U4q9L02cXsZ_61EFE/edit

#### ج. نسخ الكود
1. احذف الكود الافتراضي
2. انسخ محتوى الملف: `google-apps-script/vendoor-reports-handler.gs`
3. الصقه في المحرر

#### د. تحديث Spreadsheet ID
```javascript
// السطر 6 في الكود
const SPREADSHEET_ID = 'ضع_معرف_الشيت_هنا';
```

#### هـ. نشر Web App
1. اضغط **Deploy** > **New deployment**
2. اختر **Web app**
3. الإعدادات:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. اضغط **Deploy**
5. انسخ **Web app URL** (سيكون مثل):
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

## 2️⃣ تحديث السكريبت

### تم بالفعل! ✅

السكريبت `vendoor-scraper-with-live-updates.mjs` محدّث بالفعل:

```javascript
// السطر 25
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzHzU-1GF4Q1H1OSe9d6BQy_MgTkNds6oEmeNk5oeP64k-mKela-Hcg78VJDFPC6Aqy/exec';
```

---

## 3️⃣ ما سيتم إنشاؤه في Google Sheets

### Sheet 1: **Summary** (ملخص عام)
| التاريخ والوقت | إجمالي المنتجات | نجح | فشل | نسبة النجاح % | المدة (ثانية) | المدة (دقائق) | متوسط الوقت/منتج | هامش الربح |
|----------------|------------------|------|------|----------------|---------------|---------------|------------------|------------|
| 2025-11-11 14:30 | 50 | 45 | 5 | 90.00 | 1530 | 25.50 | 30.6 | 10 |

**الميزات:**
- ✅ صف لكل تشغيل
- 📊 إحصائيات كاملة
- 🎨 تلوين حسب النتيجة (أخضر للنجاح، أصفر للجزئي، أحمر للفشل)
- 📌 صف العناوين مثبت

---

### Sheet 2: **Products - [التاريخ]** (تفاصيل المنتجات)
| # | اسم المنتج | السعر النهائي | السعر الأصلي | هامش الربح | المخزون | عدد الصور | عدد التنويعات | الحالة | Product ID | SKU | رابط المصدر |
|---|------------|---------------|--------------|------------|---------|----------|---------------|--------|-----------|-----|-------------|
| 1 | حذاء رياضي | 899 ج.م | 889 ج.م | 10 ج.م | 150 | 5 | 12 | approved | abc123 | VN001 | رابط |

**الميزات:**
- ✅ Sheet منفصل لكل تشغيل
- 📦 تفاصيل كل منتج
- 💰 صيغة الأرقام تلقائية
- 🔗 روابط المنتجات قابلة للنقر
- 📊 صف إجمالي في الأسفل

---

### Sheet 3: **History Log** (السجل التاريخي)
| التاريخ والوقت | نوع السجل | الحالة | الرسالة | التفاصيل |
|----------------|-----------|--------|---------|----------|
| 2025-11-11 14:30 | Scraper Run | نجح | تم معالجة 45 من 50 منتج | {...} |

**الميزات:**
- ✅ سجل زمني لكل عملية
- 📝 تفاصيل JSON للرجوع
- 🔍 سهولة البحث والتتبع

---

### Sheet 4: **Dashboard** (لوحة تحكم - اختياري)
```
📊 Vendoor Scraper Dashboard

إجمالي العمليات:      15
إجمالي المنتجات:      750
المنتجات الناجحة:     680
المنتجات الفاشلة:     70
متوسط نسبة النجاح:    90.67%
إجمالي الوقت (ساعات): 6.4
```

**الميزات:**
- ✅ إحصائيات تلقائية محدثة
- 📈 معادلات ديناميكية
- 🎯 نظرة سريعة شاملة

---

## 4️⃣ طريقة العمل

### التدفق الكامل:
```
1. السكريبت يبدأ التشغيل
   ↓
2. استخراج المنتجات من Vendoor
   ↓
3. حفظ المنتجات في Appwrite
   ↓
4. إنشاء التقرير النهائي
   ↓
5. إرسال التقرير على Telegram ✅
   ↓
6. إرسال التقرير إلى Google Sheets ✅
   ↓
7. حفظ التقرير في ملف JSON محلي ✅
```

---

## 5️⃣ اختبار التكامل

### من السكريبت (على VM):
```bash
# تشغيل السكريبت
node vendoor-scraper-with-live-updates.mjs
```

### سترى في Console:
```
📊 جاري حفظ التقرير في Google Sheets...
✅ تم حفظ التقرير في Google Sheets
   الصفوف المضافة: 46
```

### من Google Apps Script:
```javascript
// في Apps Script Editor، اضغط "Run" > "testSaveReport"
function testSaveReport() {
  // الكود موجود في vendoor-reports-handler.gs
}
```

---

## 6️⃣ تخصيص التقارير

### إضافة أعمدة جديدة:
في `saveSummarySheet()`:
```javascript
const headers = [
  'التاريخ والوقت',
  'إجمالي المنتجات',
  // ... أعمدة موجودة
  'عمود جديد' // أضف هنا
];
```

### تغيير الألوان:
```javascript
// في saveSummarySheet()
if (data.failCount === 0) {
  dataRange.setBackground('#D9EAD3'); // أخضر - غيّر اللون
}
```

### إضافة رسوم بيانية:
```javascript
// في createDashboard()
const chart = sheet.newChart()
  .setChartType(Charts.ChartType.LINE)
  .addRange(sheet.getRange('B2:B100'))
  .setPosition(5, 5, 0, 0)
  .build();
sheet.insertChart(chart);
```

---

## 7️⃣ الأمان والصلاحيات

### الصلاحيات المطلوبة:
عند أول نشر، Google سيطلب:
- ✅ View and manage spreadsheets
- ✅ Connect to an external service

### الأمان:
- 🔒 Web App URL خاص - لا تشاركه
- 🔐 "Execute as: Me" = الكود يعمل بصلاحياتك
- 🌐 "Anyone" = أي شخص لديه الرابط يمكنه الإرسال

**للأمان الأكبر:**
```javascript
// في doPost()، أضف:
const API_KEY = 'your-secret-key';
if (e.parameter.apiKey !== API_KEY) {
  return ContentService.createTextOutput('Unauthorized');
}
```

---

## 8️⃣ استكشاف الأخطاء

### ❌ خطأ: "Permission denied"
**الحل:**
1. تأكد من أنك قمت بـ Authorize التطبيق
2. جرّب "Deploy" > "Test deployments"

### ❌ خطأ: "Spreadsheet not found"
**الحل:**
```javascript
// تأكد من SPREADSHEET_ID صحيح
const SPREADSHEET_ID = 'معرف_صحيح';
```

### ❌ خطأ: "Failed to save to Google Sheets"
**الحل:**
1. تحقق من Web App URL في السكريبت
2. تأكد من Web App منشور كـ "Anyone"
3. جرّب الاختبار من Apps Script مباشرة

### 🔍 عرض Logs:
في Apps Script Editor:
1. **View** > **Logs**
2. أو **View** > **Executions**

---

## 9️⃣ النسخ الاحتياطي التلقائي

### إضافة Trigger تلقائي:
```javascript
// في Apps Script
function createBackupTrigger() {
  ScriptApp.newTrigger('backupToGoogleDrive')
    .timeBased()
    .everyDays(7)
    .create();
}

function backupToGoogleDrive() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const blob = ss.getAs('application/pdf');
  DriveApp.createFile(blob);
}
```

---

## 🔟 الميزات المتقدمة

### إرسال إشعار بالبريد:
```javascript
// في saveReportToSheet()
MailApp.sendEmail({
  to: 'your-email@gmail.com',
  subject: 'Vendoor Scraper - تقرير جديد',
  body: 'تم إضافة ' + data.successCount + ' منتج جديد'
});
```

### تصدير إلى PDF تلقائياً:
```javascript
function exportToPDF() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const url = ss.getUrl().replace('/edit', '/export?format=pdf');
  // إرسال الرابط أو حفظ في Drive
}
```

### إنشاء Pivot Table:
```javascript
const pivotTable = sheet.getRange('A1:L100').createPivotTable(sheet.getRange('N1'));
```

---

## ✅ الخلاصة

### ما تم تنفيذه:
1. ✅ Google Apps Script جاهز للنشر
2. ✅ Web App منشور على: `https://script.google.com/.../exec`
3. ✅ السكريبت محدّث بالرابط
4. ✅ 3 Sheets تلقائية: Summary, Products, History
5. ✅ Dashboard اختياري
6. ✅ تلوين وتنسيق تلقائي
7. ✅ إرسال تلقائي بعد كل تشغيل

### التشغيل:
```bash
# على Azure VM
cd ~/vendoor-scraper
node vendoor-scraper-with-live-updates.mjs
```

### النتيجة:
- 📱 تقرير على Telegram
- 📊 تقرير في Google Sheets
- 💾 تقرير في JSON file

---

## 🔗 روابط مفيدة

- **Google Apps Script Docs**: https://developers.google.com/apps-script
- **Spreadsheet Service**: https://developers.google.com/apps-script/reference/spreadsheet
- **Web Apps Guide**: https://developers.google.com/apps-script/guides/web

---

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من Logs في Apps Script
2. جرّب `testSaveReport()` للاختبار
3. تأكد من صلاحيات Web App

**جاهز للتشغيل! 🚀**
