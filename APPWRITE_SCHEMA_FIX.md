# 🔧 إصلاح Schema في Appwrite Console

**📅 التاريخ:** 25 أكتوبر 2025 - 6:45 صباحاً  
**🐛 المشكلة:** `Invalid document structure: Unknown attribute: "advancedSettings"`

---

## 🐛 **المشكلة:**

```
Error: Invalid document structure: Unknown attribute: "advancedSettings"
```

**السبب:**  
الحقل `advancedSettings` غير موجود في schema الـ collection `landing_pages` في Appwrite.

---

## ✅ **الحل:**

### **الخطوات في Appwrite Console:**

#### **1. افتح Appwrite Console:**
```
https://cloud.appwrite.io/console
```

#### **2. اذهب إلى Database:**
```
Databases → egygo-ecommerce → Collections → landing_pages
```

#### **3. اضغط على "Attributes":**

#### **4. اضغط "Create Attribute":**

#### **5. اختر "String":**

#### **6. املأ البيانات:**

```
Attribute ID: advancedSettings
Size: 10000
Required: No (Optional)
Default: (leave empty)
Array: No
```

#### **7. اضغط "Create":**

---

## 📊 **التفاصيل الكاملة:**

### **Schema المطلوب لـ `landing_pages` Collection:**

```json
{
  "attributes": [
    {
      "key": "affiliateId",
      "type": "string",
      "size": 255,
      "required": true
    },
    {
      "key": "title",
      "type": "string",
      "size": 500,
      "required": true
    },
    {
      "key": "subtitle",
      "type": "string",
      "size": 500,
      "required": false
    },
    {
      "key": "description",
      "type": "string",
      "size": 2000,
      "required": false
    },
    {
      "key": "ctaText",
      "type": "string",
      "size": 100,
      "required": true
    },
    {
      "key": "productUrl",
      "type": "string",
      "size": 500,
      "required": true
    },
    {
      "key": "affiliateLink",
      "type": "string",
      "size": 500,
      "required": true
    },
    {
      "key": "template",
      "type": "string",
      "size": 50,
      "required": true,
      "default": "modern"
    },
    {
      "key": "colorScheme",
      "type": "string",
      "size": 50,
      "required": true,
      "default": "blue"
    },
    {
      "key": "features",
      "type": "string",
      "size": 2000,
      "required": false,
      "array": true
    },
    {
      "key": "testimonials",
      "type": "boolean",
      "required": false,
      "default": false
    },
    {
      "key": "countdown",
      "type": "boolean",
      "required": false,
      "default": false
    },
    {
      "key": "slug",
      "type": "string",
      "size": 500,
      "required": true
    },
    {
      "key": "views",
      "type": "integer",
      "required": false,
      "default": 0
    },
    {
      "key": "clicks",
      "type": "integer",
      "required": false,
      "default": 0
    },
    {
      "key": "conversions",
      "type": "integer",
      "required": false,
      "default": 0
    },
    {
      "key": "isActive",
      "type": "boolean",
      "required": false,
      "default": true
    },
    {
      "key": "advancedSettings",
      "type": "string",
      "size": 10000,
      "required": false
    }
  ],
  "indexes": [
    {
      "key": "slug",
      "type": "unique",
      "attributes": ["slug"]
    },
    {
      "key": "affiliateId",
      "type": "key",
      "attributes": ["affiliateId"]
    },
    {
      "key": "isActive",
      "type": "key",
      "attributes": ["isActive"]
    }
  ]
}
```

---

## 🎨 **ما هو advancedSettings؟**

هو حقل JSON string يحتوي على:

```json
{
  "customColor": "#2563EB",
  "fontSize": "large",
  "fontFamily": "tajawal",
  "buttonStyle": "pill",
  "imageUrl": "https://example.com/image.jpg",
  "videoUrl": "https://youtube.com/watch?v=...",
  "showPrice": true,
  "price": "299",
  "originalPrice": "599",
  "badge": "🔥 الأكثر مبيعاً",
  "socialProof": "✅ انضم إلى 10,000+ عميل"
}
```

**الفائدة:**
- تخصيص كامل لصفحة الهبوط
- خطوط وألوان مخصصة
- صور وفيديو
- أسعار وخصومات
- شارات وإثبات اجتماعي

---

## 🔄 **الحل البديل (مؤقت):**

### **الكود معدّل ليعمل بدون `advancedSettings`:**

```typescript
// في AffiliateLandingPages.tsx
let landingPage;
try {
  landingPage = await databases.createDocument(
    appwriteConfig.databaseId,
    'landing_pages',
    pageId,
    docData  // مع advancedSettings
  );
} catch (error: any) {
  // إذا فشل، حاول بدون advancedSettings
  if (error.message?.includes('advancedSettings')) {
    delete docData.advancedSettings;
    landingPage = await databases.createDocument(
      appwriteConfig.databaseId,
      'landing_pages',
      pageId,
      docData  // بدون advancedSettings
    );
    
    // تحذير للمستخدم
    toast({
      title: '⚠️ ملاحظة',
      description: 'تم إنشاء الصفحة بدون الإعدادات المتقدمة.',
    });
  }
}
```

**النتيجة:**
- ✅ الصفحة تُنشأ بنجاح
- ⚠️ لكن بدون التخصيصات المتقدمة
- 💡 يعمل بالتصميم الأساسي فقط

---

## 🎯 **التحقق من النجاح:**

### **بعد إضافة الحقل:**

```typescript
// 1. أنشئ صفحة هبوط جديدة
// 2. في تبويب "متقدم":
{
  customColor: '#2563EB',
  fontSize: 'large',
  fontFamily: 'tajawal',
  buttonStyle: 'pill',
  imageUrl: 'https://picsum.photos/800/600',
  showPrice: true,
  price: '299',
  originalPrice: '599',
  badge: '🔥 الأكثر مبيعاً',
  socialProof: '✅ 10,000+ عميل'
}

// 3. احفظ
// 4. افتح console:
✅ "Advanced settings loaded: {...}"

// 5. افتح الرابط:
https://egygo.me/#/landing/your-slug-123456

// 6. تحقق من التطبيق:
✅ الخط: Tajawal
✅ الحجم: Large
✅ الزر: Pill
✅ اللون: أزرق مخصص
✅ الصورة: تظهر
✅ السعر: 299 ~~599~~ -50%
✅ الشارة: 🔥 الأكثر مبيعاً
```

---

## 📸 **Screenshot للخطوات:**

### **1. Attributes في Appwrite:**
```
landing_pages Collection
├── affiliateId (string, 255)
├── title (string, 500)
├── subtitle (string, 500)
├── description (string, 2000)
├── ctaText (string, 100)
├── productUrl (string, 500)
├── affiliateLink (string, 500)
├── template (string, 50)
├── colorScheme (string, 50)
├── features (string[], 2000)
├── testimonials (boolean)
├── countdown (boolean)
├── slug (string, 500)
├── views (integer)
├── clicks (integer)
├── conversions (integer)
├── isActive (boolean)
└── advancedSettings (string, 10000) ← أضف هذا
```

---

## 🚨 **ملاحظات مهمة:**

### **1. حجم الحقل:**
```
Size: 10000 characters
```
لأن JSON string قد يكون كبير مع كل الإعدادات.

### **2. Optional:**
```
Required: No
```
لأن بعض الصفحات قد لا تحتاج إعدادات متقدمة.

### **3. Default:**
```
Default: (empty)
```
لا نضع default value.

### **4. Array:**
```
Array: No
```
إنه string واحد (JSON).

---

## 🔍 **التحقق من المشكلة:**

### **قبل الإصلاح:**
```
❌ Error: Unknown attribute: "advancedSettings"
❌ الصفحة لا تُنشأ
❌ 400 Bad Request
```

### **بعد الإصلاح (مؤقت بدون الحقل):**
```
✅ الصفحة تُنشأ
⚠️ بدون إعدادات متقدمة
⚠️ تصميم أساسي فقط
```

### **بعد إضافة الحقل:**
```
✅ الصفحة تُنشأ
✅ مع الإعدادات المتقدمة
✅ تصميم كامل ومخصص
```

---

## 📋 **Checklist:**

```
✅ 1. افتح Appwrite Console
✅ 2. اذهب إلى landing_pages collection
✅ 3. اضغط Attributes
✅ 4. Create Attribute → String
✅ 5. ID: advancedSettings
✅ 6. Size: 10000
✅ 7. Required: No
✅ 8. Array: No
✅ 9. اضغط Create
✅ 10. انتظر الـ indexing
✅ 11. جرّب إنشاء صفحة جديدة
✅ 12. تحقق من console
✅ 13. افتح الرابط
✅ 14. تحقق من التطبيق
```

---

## 🎉 **النتيجة النهائية:**

```
قبل: ❌ خطأ 400
بعد: ✅ صفحة هبوط مخصصة كاملة!

التخصيصات:
✅ 9 خطوط مختلفة
✅ 3 أحجام نصوص
✅ 3 أشكال أزرار
✅ ألوان غير محدودة
✅ صور وفيديو
✅ أسعار وخصومات
✅ شارات
✅ إثبات اجتماعي
```

---

**🚀 بعد إضافة الحقل، كل شيء سيعمل بشكل مثالي!**
