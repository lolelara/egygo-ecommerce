# 📋 بنية البيانات - Vendoor Reports API

## 📦 البيانات المُرسلة إلى Google Apps Script

### JSON Request Body

```json
{
  "scrapedAt": "2024-01-15T12:30:45.123Z",
  "databaseId": "68de037e003bd03c4d45",
  "categoryId": "cat_abc123xyz",
  "totalFound": 25,
  "successCount": 23,
  "failCount": 2,
  "duration": 180,
  "profitMargin": 10,
  "results": [
    {
      "$id": "67a123b456c789d",
      "name": "حذاء رياضي أديداس - أسود",
      "description": "منتج من Vendoor...",
      "price": 360,
      "originalPrice": 350,
      "images": [
        "https://cloud.appwrite.io/v1/storage/.../image1.jpg",
        "https://cloud.appwrite.io/v1/storage/.../image2.jpg"
      ],
      "categoryId": "cat_abc123xyz",
      "sku": "VN12345678901234",
      "source": "vendoor",
      "sourceUrl": "https://aff.ven-door.com/product/123",
      "status": "approved",
      "totalStock": 50,
      "stock": 50,
      "variants": [
        {
          "color": "أسود",
          "size": "42",
          "stock": 20
        },
        {
          "color": "أبيض",
          "size": "43",
          "stock": 30
        }
      ]
    }
  ]
}
```

---

## 📊 الحقول المُرسلة

### 🔹 معلومات عامة

| الحقل | النوع | الوصف | مثال |
|------|------|------|------|
| `scrapedAt` | String (ISO Date) | تاريخ ووقت العملية | `"2024-01-15T12:30:45.123Z"` |
| `databaseId` | String | معرف قاعدة بيانات Appwrite | `"68de037e003bd03c4d45"` |
| `categoryId` | String | معرف التصنيف | `"cat_abc123xyz"` |
| `totalFound` | Number | إجمالي المنتجات المكتشفة | `25` |
| `successCount` | Number | عدد المنتجات المضافة بنجاح | `23` |
| `failCount` | Number | عدد المنتجات الفاشلة | `2` |
| `duration` | Number | مدة العملية (بالثواني) | `180` |
| `profitMargin` | Number | هامش الربح (جنيه) | `10` |

### 🔹 معلومات المنتج (results[])

| الحقل | النوع | الوصف | مثال |
|------|------|------|------|
| `$id` | String | معرف المنتج في Appwrite | `"67a123b456c789d"` |
| `name` | String | اسم المنتج | `"حذاء رياضي أديداس"` |
| `description` | String | وصف المنتج | `"منتج من Vendoor..."` |
| `price` | Number | السعر النهائي (مع الهامش) | `360` |
| `originalPrice` | Number | السعر الأصلي من Vendoor | `350` |
| `images` | Array | مصفوفة روابط الصور | `["url1", "url2"]` |
| `categoryId` | String | معرف التصنيف | `"cat_abc123xyz"` |
| `sku` | String | كود SKU | `"VN12345678901234"` |
| `source` | String | المصدر | `"vendoor"` |
| `sourceUrl` | String | رابط المنتج الأصلي | `"https://aff.ven-door.com/..."` |
| `status` | String | الحالة | `"approved"` |
| `totalStock` | Number | إجمالي المخزون | `50` |
| `stock` | Number | المخزون | `50` |
| `variants` | Array | التنويعات | انظر الجدول التالي |

### 🔹 التنويعات (variants[])

| الحقل | النوع | الوصف | مثال |
|------|------|------|------|
| `color` | String | اللون | `"أسود"` |
| `size` | String | المقاس | `"42"` |
| `stock` | Number | الكمية المتوفرة | `20` |

---

## 🗂️ كيف تُحفظ البيانات

### 1. Summary Sheet
```
التاريخ والوقت: من scrapedAt
إجمالي المنتجات: من totalFound
نجح: من successCount
فشل: من failCount
نسبة النجاح: حسابية (successCount / totalFound × 100)
المدة: من duration
هامش الربح: من profitMargin
Database ID: من databaseId
Category ID: من categoryId
```

### 2. Products Sheet
```
# : ترتيب تلقائي
اسم المنتج: من name
السعر النهائي: من price
السعر الأصلي: من originalPrice
هامش الربح: حسابي (price - originalPrice)
المخزون الكلي: من totalStock
عدد الصور: عدد عناصر images[]
عدد التنويعات: عدد عناصر variants[]
الحالة: من status
Product ID: من $id
SKU: من sku
رابط المصدر: من sourceUrl (كـ HYPERLINK)
```

### 3. History Log
```
التاريخ والوقت: من scrapedAt
نوع السجل: "Scraper Run"
الحالة: "نجح" إذا failCount = 0، وإلا "جزئي"
الرسالة: "تم معالجة X من Y منتج"
التفاصيل: JSON يحتوي duration, profitMargin, categoryId
```

---

## 🎯 مثال كامل

### طلب POST

```http
POST https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
Content-Type: application/json

{
  "scrapedAt": "2024-01-15T14:30:00.000Z",
  "databaseId": "68de037e003bd03c4d45",
  "categoryId": "shoes_123",
  "totalFound": 3,
  "successCount": 3,
  "failCount": 0,
  "duration": 45,
  "profitMargin": 10,
  "results": [
    {
      "$id": "prod_001",
      "name": "حذاء رياضي",
      "price": 360,
      "originalPrice": 350,
      "totalStock": 50,
      "images": ["img1.jpg", "img2.jpg"],
      "variants": [{"color": "أسود", "size": "42", "stock": 25}],
      "status": "approved",
      "sku": "VN001123456",
      "sourceUrl": "https://vendoor.com/product/1"
    }
  ]
}
```

### استجابة Success

```json
{
  "success": true,
  "message": "تم حفظ التقرير بنجاح",
  "timestamp": "2024-01-15T14:30:05.123Z",
  "rowsAdded": 4
}
```

### استجابة Error

```json
{
  "success": false,
  "error": "Exception: Document abc123 not found"
}
```

---

## 🔍 التحقق من البيانات

### في Google Apps Script

استخدم `Logger.log()` لمراجعة البيانات:

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  Logger.log('البيانات المستلمة:');
  Logger.log(JSON.stringify(data, null, 2));
  // ...
}
```

ثم راجع: **Execution log** في Apps Script

---

## 📌 ملاحظات مهمة

1. **التواريخ**: جميع التواريخ بصيغة ISO 8601 (UTC)
2. **الأسعار**: بالجنيه المصري (رقم صحيح أو عشري)
3. **المخزون**: أرقام صحيحة موجبة
4. **الروابط**: روابط كاملة (تبدأ بـ http/https)
5. **الحقول الفارغة**: تُرسل كـ `""` أو `[]` أو `0`
6. **حد البيانات**: Google Sheets يدعم حتى 5 ملايين خلية

---

## 🧪 اختبار البيانات

استخدم دالة `testSaveReport()` في Apps Script:

```javascript
function testSaveReport() {
  const testData = {
    scrapedAt: new Date().toISOString(),
    databaseId: 'test-db-123',
    categoryId: 'test-cat-456',
    totalFound: 2,
    successCount: 2,
    failCount: 0,
    duration: 30,
    profitMargin: 10,
    results: [
      // ... بيانات تجريبية
    ]
  };
  
  const result = saveReportToSheet(testData);
  Logger.log(result);
}
```

---

✅ **البيانات جاهزة للاستخدام!**
