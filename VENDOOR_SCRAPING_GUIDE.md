# 🚀 دليل سكرابينج Vendoor المحسّن

## 📋 نظرة عامة

تم تحسين سكريبت سكرابينج Vendoor ليصبح أكثر فعالية ويحفظ البيانات في ملفات جاهزة للرفع الجماعي.

---

## ✨ المميزات الجديدة

### 1️⃣ **حفظ تلقائي للبيانات**
- ✅ حفظ في ملفات JSON أو CSV
- ✅ ملفات جاهزة للرفع الجماعي
- ✅ تسمية تلقائية بالتاريخ والوقت

### 2️⃣ **جلب بيانات كاملة**
- ✅ معلومات المنتج الأساسية
- ✅ جميع الصور
- ✅ الألوان والمقاسات
- ✅ الكميات المتاحة
- ✅ تكلفة الشحن
- ✅ الوصف التفصيلي

### 3️⃣ **إدارة الملفات**
- ✅ تحميل الملفات المُصدّرة
- ✅ عرض قائمة الملفات
- ✅ حذف الملفات القديمة

### 4️⃣ **تتبع التقدم**
- ✅ عرض الصفحة الحالية
- ✅ عدد المنتجات المُكتشفة
- ✅ حالة العملية (running/completed/error)

---

## 🔧 الإعداد

### 1. تثبيت المكتبات المطلوبة

```bash
npm install puppeteer
```

### 2. إضافة الـ Routes

في `server/index.ts`:

```typescript
import * as vendoorEnhanced from './routes/vendoor-enhanced';

// Vendoor Routes
app.post('/api/vendoor/scrape-and-save', vendoorEnhanced.scrapeAndSaveProducts);
app.get('/api/vendoor/progress', vendoorEnhanced.getScrapingProgress);
app.get('/api/vendoor/files', vendoorEnhanced.listExportFiles);
app.get('/api/vendoor/download/:filename', vendoorEnhanced.downloadExportFile);
app.delete('/api/vendoor/files/:filename', vendoorEnhanced.deleteExportFile);
```

---

## 📡 استخدام API

### 1️⃣ **بدء السكرابينج وحفظ البيانات**

```http
POST /api/vendoor/scrape-and-save
Content-Type: application/json

{
  "email": "your-vendoor-email@example.com",
  "password": "your-vendoor-password",
  "maxPages": 10,
  "format": "json",
  "includeDetails": true
}
```

**Parameters:**
- `email` (required): البريد الإلكتروني لحساب Vendoor
- `password` (required): كلمة المرور
- `maxPages` (optional): عدد الصفحات (افتراضي: 10)
- `format` (optional): صيغة الملف `json` أو `csv` (افتراضي: json)
- `includeDetails` (optional): جلب التفاصيل الكاملة (افتراضي: true)

**Response:**
```json
{
  "success": true,
  "message": "تم جلب وحفظ المنتجات بنجاح",
  "totalProducts": 250,
  "lastPage": 10,
  "file": {
    "filename": "vendoor_products_2025-01-27T18-30-45.json",
    "filepath": "/path/to/exports/vendoor_products_2025-01-27T18-30-45.json",
    "count": 250
  },
  "downloadUrl": "/api/vendoor/download/vendoor_products_2025-01-27T18-30-45.json"
}
```

---

### 2️⃣ **متابعة التقدم**

```http
GET /api/vendoor/progress
```

**Response:**
```json
{
  "currentPage": 5,
  "totalPages": 10,
  "productsFound": 125,
  "status": "running"
}
```

---

### 3️⃣ **عرض الملفات المُصدّرة**

```http
GET /api/vendoor/files
```

**Response:**
```json
{
  "files": [
    {
      "filename": "vendoor_products_2025-01-27T18-30-45.json",
      "size": 1548976,
      "created": "2025-01-27T18:30:45.000Z",
      "downloadUrl": "/api/vendoor/download/vendoor_products_2025-01-27T18-30-45.json"
    }
  ]
}
```

---

### 4️⃣ **تحميل ملف**

```http
GET /api/vendoor/download/:filename
```

**Example:**
```
GET /api/vendoor/download/vendoor_products_2025-01-27T18-30-45.json
```

---

### 5️⃣ **حذف ملف**

```http
DELETE /api/vendoor/files/:filename
```

**Response:**
```json
{
  "success": true,
  "message": "تم حذف الملف بنجاح"
}
```

---

## 📄 صيغة البيانات المُصدّرة

### JSON Format

```json
[
  {
    "id": "VENDOOR_12345",
    "name": "تيشيرت قطن رجالي",
    "description": "تيشيرت قطن عالي الجودة...",
    "price": 150,
    "images": [
      "https://storage.example.com/image1.jpg",
      "https://storage.example.com/image2.jpg"
    ],
    "category": "منتجات Vendoor",
    "supplier": "مورد رقم 1",
    "stock": 100,
    "commission": 30,
    "variations": {
      "colors": ["أبيض", "أسود", "أزرق"],
      "sizes": ["S", "M", "L", "XL"]
    },
    "stockDetails": {
      "أبيض S": 10,
      "أبيض M": 15,
      "أسود L": 20
    },
    "shippingCost": 25,
    "vendoorProductId": "12345",
    "vendoorOrderLink": "https://aff.ven-door.com/..."
  }
]
```

### CSV Format

```csv
ID,Name,Description,Price,Images,Category,Supplier,Stock,Commission,Colors,Sizes,Shipping Cost,Vendoor ID,Order Link
VENDOOR_12345,"تيشيرت قطن رجالي","تيشيرت قطن عالي الجودة...",150,"image1.jpg|image2.jpg",منتجات Vendoor,مورد رقم 1,100,30,"أبيض|أسود|أزرق","S|M|L|XL",25,12345,https://...
```

---

## 🔄 الرفع الجماعي على الموقع

### طريقة 1: استخدام API

```javascript
// قراءة الملف
const products = require('./exports/vendoor_products.json');

// رفع جماعي
async function bulkUpload() {
  for (const product of products) {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
  }
}
```

### طريقة 2: استخدام صفحة الرفع الجماعي

1. افتح صفحة الرفع الجماعي: `/admin/products/bulk-upload`
2. اختر ملف JSON أو CSV
3. اضغط "رفع"
4. انتظر حتى ينتهي الرفع

---

## ⚙️ الإعدادات المتقدمة

### 1. تخصيص مجلد التصدير

في `vendoor-enhanced.ts`:

```typescript
const EXPORTS_DIR = path.join(process.cwd(), 'custom-exports');
```

### 2. تخصيص AFFILIATE_ID

```typescript
const AFFILIATE_ID = 'YOUR_AFFILIATE_ID';
```

### 3. تعديل التأخير بين الصفحات

```typescript
// في السكريبت، ابحث عن:
await new Promise(resolve => setTimeout(resolve, 500));

// غيّر 500 إلى القيمة المطلوبة (بالملي ثانية)
```

---

## 🎯 أفضل الممارسات

### 1️⃣ **البداية بصفحات قليلة**
```json
{
  "maxPages": 2,
  "includeDetails": false
}
```

### 2️⃣ **استخدام includeDetails بحذر**
- ✅ `false` للسرعة (معلومات أساسية فقط)
- ✅ `true` للبيانات الكاملة (أبطأ)

### 3️⃣ **جدولة العملية**
```bash
# في الخلفية
node scripts/scrape-vendoor-cron.mjs
```

### 4️⃣ **تنظيف الملفات القديمة**
```bash
# حذف ملفات أقدم من 7 أيام
find exports/ -name "*.json" -mtime +7 -delete
```

---

## 🔍 استكشاف الأخطاء

### خطأ: "فشل تسجيل الدخول"
✅ تحقق من البريد الإلكتروني وكلمة المرور

### خطأ: "Timeout"
✅ زد وقت الانتظار في السكريبت:
```typescript
{ timeout: 60000 } // 60 ثانية
```

### خطأ: "Cannot find module puppeteer"
✅ تثبيت المكتبة:
```bash
npm install puppeteer
```

### الملفات لا تُحفظ
✅ تحقق من صلاحيات المجلد:
```bash
chmod 755 exports/
```

---

## 📊 الأداء

### السرعة المتوقعة:
- **بدون تفاصيل**: ~5-10 منتج/ثانية
- **مع التفاصيل**: ~1-2 منتج/ثانية

### الذاكرة:
- **بدون تفاصيل**: ~200MB
- **مع التفاصيل**: ~500MB-1GB

---

## 🎉 الخلاصة

### ✅ ما تم تحسينه:
1. حفظ تلقائي في JSON/CSV
2. جلب بيانات كاملة
3. إدارة الملفات
4. تتبع التقدم
5. جاهز للرفع الجماعي

### 🚀 الخطوات التالية:
1. تشغيل السكريبت
2. تحميل الملف
3. رفع جماعي على الموقع
4. مراجعة المنتجات
5. نشر!

---

## 📞 الدعم

للمشاكل أو الاستفسارات:
- افتح Issue على GitHub
- راسلنا على support@egygo.me

**تم بنجاح! 🎊**
