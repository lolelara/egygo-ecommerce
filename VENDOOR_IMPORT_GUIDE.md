# 🚀 نظام استيراد المنتجات من Ven-door

## 📋 نظرة عامة

نظام متكامل لاستيراد المنتجات من Ven-door إلى موقع egyGo بشكل تلقائي.

## 🎯 المميزات

### 1. جلب تلقائي للمنتجات
- ✅ يجلب جميع المنتجات من صفحات Ven-door (حتى صفحة 41)
- ✅ يتحقق تلقائياً من الصفحات الفارغة
- ✅ يستخرج التفاصيل الكاملة لكل منتج:
  - الصورة الرئيسية
  - السعر والعمولة
  - المخزون
  - الألوان والمقاسات المتوفرة
  - المورد

### 2. واجهة مستخدم احترافية
- 📊 لوحة تحكم للوسطاء والمدير
- 🎨 عرض المنتجات في كروت جذابة
- ⚡ استيراد فوري بضغطة زر
- 📈 إحصائيات مباشرة

### 3. API قوية
- 🔐 تسجيل دخول آمن
- 📡 نقاط نهاية RESTful
- ⏱️ تتبع تقدم العملية

## 📁 هيكل الملفات

```
├── scripts/
│   ├── fetch-vendoor-catalog.mjs          # سكريبت جلب الكتالوج الكامل
│   ├── scrape-vendoor-detailed.mjs        # جلب التفاصيل الكاملة
│   └── test-vendoor-puppeteer.mjs         # سكريبت الاختبار
│
├── server/
│   └── routes/
│       └── vendoor.ts                      # API Endpoints
│
├── client/
│   └── pages/
│       └── VendoorImport.tsx               # واجهة الاستيراد
│
└── test-vendoor-dashboard.html            # واجهة تجريبية HTML
```

## 🔧 التثبيت والإعداد

### 1. تثبيت المكتبات المطلوبة

```bash
# في مجلد scripts
cd scripts
pnpm install
pnpm approve-builds puppeteer
```

### 2. إضافة Puppeteer للمشروع الرئيسي

```bash
# في المجلد الرئيسي
pnpm add puppeteer @types/express
```

## 🚀 الاستخدام

### استخدام السكريبت المباشر

#### 1. جلب الكتالوج الكامل (أول 10 منتجات مفصلة)

```bash
node scripts/fetch-vendoor-catalog.mjs
```

**الناتج:**
- `vendoor-products-list.json` - قائمة أساسية بجميع المنتجات
- `vendoor-catalog-complete.json` - مع الإحصائيات والتفاصيل

#### 2. جلب تفاصيل محددة

```bash
node scripts/scrape-vendoor-detailed.mjs
```

### استخدام الواجهة في الموقع

#### 1. للوسطاء (Intermediaries)

1. قم بتسجيل الدخول كوسيط
2. انتقل إلى: `/intermediary/import`
3. أدخل بيانات حساب Ven-door
4. اضغط "جلب جميع المنتجات"
5. اختر المنتجات واضغط "استيراد"

#### 2. للمدير (Admin)

1. قم بتسجيل الدخول كمدير
2. انتقل إلى: `/admin/vendoor-import`
3. نفس الخطوات السابقة

## 📡 API Endpoints

### 1. جلب جميع المنتجات

```http
POST /api/vendoor/scrape-all
Content-Type: application/json

{
  "email": "your@email.com",
  "password": "yourpassword",
  "maxPages": 41
}
```

**الاستجابة:**
```json
{
  "success": true,
  "totalProducts": 150,
  "lastPage": 30,
  "products": [...]
}
```

### 2. متابعة التقدم

```http
GET /api/vendoor/progress
```

**الاستجابة:**
```json
{
  "currentPage": 15,
  "totalPages": 41,
  "productsFound": 75
}
```

### 3. استيراد منتج واحد

```http
POST /api/vendoor/import-product
Content-Type: application/json

{
  "productId": "3789",
  "vendoorEmail": "your@email.com",
  "vendoorPassword": "yourpassword"
}
```

## 🎨 واجهة المستخدم

### المكونات الرئيسية

#### 1. صفحة الاستيراد (`VendoorImport.tsx`)

**التبويبات:**
- **استيراد المنتجات**: الواجهة الرئيسية
- **الإعدادات**: تخصيص الاستيراد

**المميزات:**
- 📊 بطاقة جلب الكتالوج
- 🎴 كروت المنتجات بالصور
- ⚡ زر استيراد فوري
- 👁️ عرض التفاصيل في نافذة منبثقة

#### 2. نافذة تفاصيل المنتج

تعرض:
- الصورة الكبيرة
- السعر والعمولة
- المخزون
- الألوان والمقاسات
- زر الاستيراد

## 📊 البيانات المستخرجة

### معلومات أساسية:
```typescript
{
  id: string;           // رقم المنتج
  title: string;        // العنوان
  supplier: string;     // المورد (مثل: مخزن 127)
  price: string;        // السعر
  commission: string;   // العمولة
  stock: string;        // حالة المخزون
  image: string;        // رابط الصورة
}
```

### تفاصيل إضافية:
```typescript
{
  variations: {
    [color: string]: string[]  // {"أسود": ["41", "42", "43"]}
  },
  stockDetails: {
    [key: string]: number      // {"أسود 41": 25}
  },
  shipping: string             // تكلفة الشحن
}
```

## 🔒 الأمان

- ✅ تسجيل الدخول مشفر
- ✅ كلمات المرور لا تُحفظ
- ✅ جلسات آمنة عبر Puppeteer
- ✅ فقط الوسطاء والمدير يمكنهم الوصول

## ⚡ الأداء

### أوقات متوقعة:
- **جلب صفحة واحدة**: 2-3 ثواني
- **جلب 41 صفحة**: 2-3 دقائق
- **جلب تفاصيل منتج**: 3-4 ثواني
- **استيراد منتج**: 5-6 ثواني

### تحسينات الأداء:
- ✅ انتظار ذكي بين الطلبات
- ✅ معالجة متوازية للصفحات
- ✅ تخزين مؤقت للبيانات

## 🐛 معالجة الأخطاء

### الأخطاء الشائعة:

#### 1. فشل تسجيل الدخول
```
خطأ: فشل تسجيل الدخول - تحقق من البيانات
```
**الحل**: تأكد من صحة البريد والباسورد

#### 2. timeout
```
خطأ: Navigation timeout
```
**الحل**: زيادة وقت الانتظار في السكريبت

#### 3. صفحة فارغة
```
الصفحة X فارغة - توقف البحث
```
**طبيعي**: السكريبت يتوقف تلقائياً عند الصفحات الفارغة

## 📝 مثال كامل

```javascript
// استخدام API من React
const handleImport = async () => {
  // 1. جلب المنتجات
  const response = await fetch('/api/vendoor/scrape-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'password123',
      maxPages: 41
    })
  });
  
  const data = await response.json();
  console.log(`تم جلب ${data.totalProducts} منتج`);
  
  // 2. استيراد منتج محدد
  for (const product of data.products.slice(0, 5)) {
    await fetch('/api/vendoor/import-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        vendoorEmail: 'user@example.com',
        vendoorPassword: 'password123'
      })
    });
    
    console.log(`تم استيراد: ${product.title}`);
  }
};
```

## 🔮 التطويرات المستقبلية

- [ ] دعم موردين إضافيين
- [ ] جدولة تلقائية للاستيراد
- [ ] مزامنة المخزون التلقائية
- [ ] تحديث الأسعار تلقائياً
- [ ] إشعارات عند إضافة منتجات جديدة
- [ ] فلترة المنتجات حسب الفئة
- [ ] استيراد جماعي محسّن

## 📞 الدعم

في حالة وجود مشاكل:
1. تحقق من ملف `console` في المتصفح
2. افحص ملفات JSON المحفوظة
3. راجع لقطات الشاشة في المجلد الرئيسي

## 📜 الترخيص

هذا النظام جزء من مشروع egyGo - جميع الحقوق محفوظة © 2025
