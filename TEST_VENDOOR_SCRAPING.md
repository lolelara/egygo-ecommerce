# 🧪 اختبار سكريبت Vendoor المحسّن

## 📋 المتطلبات

### 1. تثبيت Puppeteer:
```bash
npm install puppeteer
```

### 2. تشغيل السيرفر:
```bash
npm run dev
```

أو:

```bash
cd server
ts-node index.ts
```

---

## 🚀 طرق الاختبار

### **الطريقة 1: PowerShell Script (الأسهل)**

```powershell
.\scripts\test-vendoor-scraping.ps1
```

سيطلب منك:
- بريد Vendoor الإلكتروني
- كلمة المرور

ثم سيقوم بـ:
1. ✅ بدء السكرابينج (2 صفحات)
2. ✅ فحص التقدم
3. ✅ عرض الملفات
4. ✅ تحميل الملف
5. ✅ معاينة النتائج

---

### **الطريقة 2: HTTP File (VS Code REST Client)**

1. افتح `test-vendoor-scraping.http`
2. عدّل البريد وكلمة المرور
3. اضغط "Send Request" بجانب كل طلب

---

### **الطريقة 3: cURL**

#### بدء السكرابينج:
```bash
curl -X POST http://localhost:5000/api/vendoor/scrape-and-save \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "password": "password",
    "maxPages": 2,
    "format": "json",
    "includeDetails": false
  }'
```

#### فحص التقدم:
```bash
curl http://localhost:5000/api/vendoor/enhanced-progress
```

#### عرض الملفات:
```bash
curl http://localhost:5000/api/vendoor/files
```

#### تحميل ملف:
```bash
curl -O http://localhost:5000/api/vendoor/download/vendoor_products_2025-01-27.json
```

---

### **الطريقة 4: Postman**

#### 1. بدء السكرابينج
```
POST http://localhost:5000/api/vendoor/scrape-and-save
Content-Type: application/json

{
  "email": "your@email.com",
  "password": "password",
  "maxPages": 2,
  "format": "json",
  "includeDetails": false
}
```

#### 2. فحص التقدم
```
GET http://localhost:5000/api/vendoor/enhanced-progress
```

#### 3. عرض الملفات
```
GET http://localhost:5000/api/vendoor/files
```

---

## 📊 Parameters

### `email` (required)
بريد Vendoor الإلكتروني

### `password` (required)
كلمة المرور

### `maxPages` (optional, default: 10)
عدد الصفحات للسكرابينج

### `format` (optional, default: "json")
- `"json"` - ملف JSON
- `"csv"` - ملف CSV

### `includeDetails` (optional, default: true)
- `true` - جلب تفاصيل كاملة (صور، ألوان، مقاسات، وصف)
- `false` - معلومات أساسية فقط (أسرع)

---

## 📁 النتائج

### موقع الملفات:
```
egygo-main/
└── exports/
    ├── vendoor_products_2025-01-27T18-30-45.json
    └── vendoor_products_2025-01-27T19-15-22.csv
```

### صيغة JSON:
```json
[
  {
    "id": "VENDOOR_12345",
    "name": "تيشيرت قطن رجالي",
    "description": "تيشيرت قطن عالي الجودة...",
    "price": 150,
    "images": ["url1", "url2"],
    "category": "منتجات Vendoor",
    "supplier": "مورد رقم 1",
    "stock": 100,
    "commission": 30,
    "variations": {
      "colors": ["أبيض", "أسود"],
      "sizes": ["S", "M", "L"]
    },
    "shippingCost": 25
  }
]
```

---

## ✅ التحقق من النجاح

### 1. فحص السيرفر
يجب أن ترى في console:
```
🔐 تسجيل الدخول...
✅ تم تسجيل الدخول بنجاح
📄 جلب صفحة 1...
✅ تم جلب 25 منتج من الصفحة 1
📦 تم جلب 50 منتج أساسي
💾 تم حفظ 50 منتج في: vendoor_products_2025-01-27.json
🎉 انتهت عملية السكرابينج بنجاح!
```

### 2. فحص الملفات
```powershell
ls exports/
```

يجب أن ترى:
```
vendoor_products_*.json
vendoor_products_*.csv
```

### 3. فحص المحتوى
```powershell
cat exports/vendoor_products_*.json
```

---

## 🐛 استكشاف الأخطاء

### خطأ: "Cannot find module puppeteer"
```bash
npm install puppeteer
```

### خطأ: "فشل تسجيل الدخول"
✅ تحقق من البريد وكلمة المرور  
✅ جرّب تسجيل الدخول يدوياً على vendoor.com

### خطأ: "Timeout"
✅ زد `maxPages` إلى رقم أصغر  
✅ جرّب `includeDetails: false`

### خطأ: "ECONNREFUSED"
✅ تأكد من تشغيل السيرفر:
```bash
npm run dev
```

### لا توجد ملفات في exports/
✅ تحقق من console السيرفر  
✅ تحقق من صلاحيات المجلد:
```bash
mkdir exports
```

---

## 🎯 اختبار سريع (30 ثانية)

### 1. شغّل السيرفر:
```bash
npm run dev
```

### 2. في نافذة PowerShell جديدة:
```powershell
.\scripts\test-vendoor-scraping.ps1
```

### 3. أدخل بياناتك:
```
Enter your Vendoor email: your@email.com
Enter your Vendoor password: ********
```

### 4. انتظر النتائج:
```
✅ Success!
✅ Total Products: 50
✅ File: vendoor_products_2025-01-27.json
```

### 5. افحص الملف:
```powershell
cat exports\vendoor_products_*.json | ConvertFrom-Json | Select-Object -First 2
```

---

## 📈 السرعة المتوقعة

| الإعدادات | المنتجات | الوقت | السرعة |
|----------|----------|------|---------|
| **بدون تفاصيل** | 50 | ~30 ثانية | ~1.6 منتج/ثانية |
| **بدون تفاصيل** | 500 | ~5 دقائق | ~1.6 منتج/ثانية |
| **مع تفاصيل** | 50 | ~3 دقائق | ~0.3 منتج/ثانية |
| **مع تفاصيل** | 500 | ~30 دقيقة | ~0.3 منتج/ثانية |

💡 **نصيحة**: استخدم `includeDetails: false` للاختبار السريع!

---

## 🎊 بعد النجاح

### 1. رفع جماعي:
- افتح `/admin/products/bulk-upload`
- اختر الملف من `exports/`
- اضغط "رفع"

### 2. مراجعة:
- افتح `/admin/products`
- راجع المنتجات المُضافة
- عدّل إذا لزم الأمر

### 3. نشر:
- غيّر حالة المنتجات إلى "active"
- اضغط "نشر"

---

## 📝 أمثلة عملية

### مثال 1: اختبار سريع (2 صفحة، بدون تفاصيل)
```json
{
  "maxPages": 2,
  "format": "json",
  "includeDetails": false
}
```
⏱️ **الوقت**: ~30 ثانية  
📦 **المنتجات**: ~50

---

### مثال 2: بيانات كاملة (5 صفحات، مع تفاصيل)
```json
{
  "maxPages": 5,
  "format": "json",
  "includeDetails": true
}
```
⏱️ **الوقت**: ~8 دقائق  
📦 **المنتجات**: ~125 (كاملة)

---

### مثال 3: CSV للتصدير
```json
{
  "maxPages": 10,
  "format": "csv",
  "includeDetails": false
}
```
⏱️ **الوقت**: ~1 دقيقة  
📦 **المنتجات**: ~250 (CSV)

---

## 🎉 النجاح!

إذا رأيت:
```
✅ Success!
✅ Total Products: 50
✅ File: vendoor_products_2025-01-27.json
✅ Download URL: /api/vendoor/download/vendoor_products_2025-01-27.json
```

**تهانينا! السكريبت يعمل! 🎊**

الملف جاهز للرفع الجماعي مباشرة! 🚀
