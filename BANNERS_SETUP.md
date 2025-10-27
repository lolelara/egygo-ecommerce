# 🎨 نظام البانرات المتحركة - دليل التثبيت والاستخدام

## 📦 الملفات المُنشأة

### 1. المكونات (Components)
- ✅ `client/components/banners/RotatingBanner.tsx` - مكون البانر المتحرك
- ✅ `client/pages/admin/BannersManagement.tsx` - صفحة إدارة البانرات للأدمن
- ✅ `client/lib/banners-api.ts` - API للتعامل مع البانرات

### 2. السكريبتات (Scripts)
- ✅ `scripts/setup-banners.js` - سكريبت إنشاء قاعدة البيانات

---

## 🚀 خطوات التثبيت

### الخطوة 1: تثبيت المكتبات المطلوبة

```bash
npm install node-appwrite --save-dev
```

### الخطوة 2: تشغيل سكريبت الإعداد

```bash
node scripts/setup-banners.js
```

**ماذا سيفعل السكريبت؟**
1. ✅ إنشاء collection للبانرات (`banners`)
2. ✅ إنشاء collection للإعدادات (`bannerSettings`)
3. ✅ إنشاء جميع الـ attributes المطلوبة
4. ✅ إنشاء indexes للبحث السريع
5. ✅ إنشاء storage bucket لصور البانرات
6. ✅ إنشاء إعدادات افتراضية لكل موقع

**النتيجة المتوقعة:**
```
🚀 Starting Banners Setup...

📦 Creating Banners Collection...
✅ Banners collection created successfully

📝 Creating Banners Attributes...
  ✅ Attribute 'title' created
  ✅ Attribute 'imageUrl' created
  ✅ Attribute 'link' created
  ✅ Attribute 'location' created
  ✅ Attribute 'isActive' created
  ✅ Attribute 'order' created
  ✅ Attribute 'createdAt' created

🔍 Creating Banners Indexes...
  ✅ Index 'location_index' created
  ✅ Index 'active_index' created
  ✅ Index 'order_index' created
  ✅ Index 'location_active_order' created

📦 Creating Banner Settings Collection...
✅ Banner Settings collection created successfully

📝 Creating Banner Settings Attributes...
  ✅ Attribute 'location' created
  ✅ Attribute 'autoPlayInterval' created
  ✅ Attribute 'showControls' created
  ✅ Attribute 'height' created

🪣 Creating Banners Storage Bucket...
✅ Banners storage bucket created successfully

⚙️  Creating Default Settings...
  ✅ Default settings created for 'offers'
  ✅ Default settings created for 'products'
  ✅ Default settings created for 'affiliate'

✨ Banners Setup Completed Successfully!

📋 Summary:
  ✅ Banners Collection
  ✅ Banner Settings Collection
  ✅ Banners Storage Bucket
  ✅ Default Settings for all locations
```

---

## 💻 كيفية الاستخدام في الصفحات

### 1. صفحة العروض (Offers Page)

```tsx
// client/pages/Offers.tsx أو أي صفحة عروض

import { useState, useEffect } from 'react';
import RotatingBanner from '@/components/banners/RotatingBanner';
import { getBannersByLocation, getBannerSettings } from '@/lib/banners-api';

export default function OffersPage() {
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    const bannersData = await getBannersByLocation('offers');
    const settingsData = await getBannerSettings('offers');
    setBanners(bannersData);
    setSettings(settingsData);
  };

  return (
    <div className="container mx-auto p-6" dir="rtl">
      {/* البانر المتحرك */}
      <RotatingBanner
        banners={banners}
        autoPlayInterval={settings?.autoPlayInterval || 5}
        showControls={settings?.showControls ?? true}
        height={settings?.height || '300px'}
        location="offers"
      />

      {/* باقي محتوى صفحة العروض */}
      <div className="mt-8">
        <h1 className="text-3xl font-bold">العروض الحالية</h1>
        {/* ... */}
      </div>
    </div>
  );
}
```

### 2. صفحة المنتجات (Products Page)

```tsx
// client/pages/Products.tsx

import RotatingBanner from '@/components/banners/RotatingBanner';
import { getBannersByLocation, getBannerSettings } from '@/lib/banners-api';

// نفس الطريقة السابقة مع تغيير location إلى 'products'
<RotatingBanner
  banners={banners}
  autoPlayInterval={settings?.autoPlayInterval || 5}
  showControls={settings?.showControls ?? true}
  height={settings?.height || '300px'}
  location="products"
/>
```

### 3. صفحة المسوقين (Affiliate Dashboard)

```tsx
// client/pages/AffiliateDashboard.tsx

import RotatingBanner from '@/components/banners/RotatingBanner';
import { getBannersByLocation, getBannerSettings } from '@/lib/banners-api';

// نفس الطريقة مع location='affiliate'
<RotatingBanner
  banners={banners}
  autoPlayInterval={settings?.autoPlayInterval || 5}
  showControls={settings?.showControls ?? true}
  height={settings?.height || '300px'}
  location="affiliate"
/>
```

---

## 🎛️ لوحة تحكم الأدمن

### إضافة صفحة إدارة البانرات للروتر:

```tsx
// في ملف App.tsx أو router.tsx

import BannersManagement from '@/pages/admin/BannersManagement';

// أضف المسار:
{
  path: '/admin/banners',
  element: <BannersManagement />
}
```

### المميزات في لوحة التحكم:

1. ✅ **إضافة بانر جديد**
   - رفع صورة
   - كتابة عنوان
   - إضافة رابط (اختياري)
   - اختيار الموقع (offers/products/affiliate)
   - تفعيل/إيقاف

2. ✅ **تعديل البانرات**
   - تعديل جميع البيانات
   - إعادة رفع صورة جديدة

3. ✅ **ترتيب البانرات**
   - سهم للأعلى ⬆️
   - سهم للأسفل ⬇️
   - يتحكم في ترتيب الظهور

4. ✅ **الإعدادات**
   - الوقت بين كل بانر (بالثواني)
   - ارتفاع البانر
   - إظهار/إخفاء أزرار التحكم

5. ✅ **تنظيم حسب الموقع**
   - تبويبات منفصلة لكل موقع
   - إدارة مستقلة لكل قسم

---

## 🎨 مميزات البانر المتحرك

### ✨ المميزات الرئيسية:

1. **تقليب تلقائي**
   - ينتقل بين الصور تلقائياً
   - الوقت قابل للتخصيص من الأدمن

2. **أزرار تحكم**
   - سهم التالي ◀️
   - سهم السابق ▶️
   - زر تشغيل/إيقاف ⏯️

3. **مؤشرات**
   - نقاط في الأسفل للتنقل السريع
   - عداد (1/5) في الأعلى

4. **تفاعلات**
   - توقف عند hover الماوس
   - انتقالات سلسة
   - روابط قابلة للنقر

5. **تصميم احترافي**
   - دعم RTL
   - Responsive
   - Dark mode support
   - Gradient overlay للنص

---

## 📊 هيكل قاعدة البيانات

### Collection: banners

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | ✅ | عنوان البانر |
| imageUrl | string | ✅ | رابط الصورة |
| link | string | ❌ | رابط للنقر (اختياري) |
| location | enum | ✅ | offers/products/affiliate |
| isActive | boolean | ✅ | مفعّل أم لا |
| order | integer | ✅ | ترتيب الظهور |
| createdAt | datetime | ❌ | تاريخ الإنشاء |

### Collection: bannerSettings

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| location | string | ✅ | - | اسم الموقع |
| autoPlayInterval | integer | ✅ | 5 | الوقت بالثواني |
| showControls | boolean | ✅ | true | إظهار الأزرار |
| height | string | ✅ | 300px | ارتفاع البانر |

### Storage Bucket: banners

- الحجم الأقصى: 10MB
- الأنواع المسموحة: PNG, JPG, JPEG, WebP, GIF

---

## 🎯 أمثلة عملية

### مثال 1: إضافة بانر جديد من لوحة التحكم

1. افتح `/admin/banners`
2. اختر التبويب المناسب (عروض/منتجات/مسوقين)
3. اضغط "إضافة بانر جديد"
4. املأ البيانات:
   - **العنوان**: "عرض خاص على الملابس الشتوية"
   - **الرابط**: "https://example.com/winter-sale"
   - **الصورة**: ارفع صورة البانر
5. اضغط "حفظ"

### مثال 2: تغيير مدة العرض

1. افتح `/admin/banners`
2. اختر التبويب
3. في قسم "إعدادات العرض"
4. غيّر "الوقت بين كل بانر" من 5 إلى 10 ثوانٍ
5. اضغط "حفظ الإعدادات"

### مثال 3: ترتيب البانرات

1. افتح `/admin/banners`
2. في الجدول، استخدم الأسهم ⬆️⬇️
3. البانر في الترتيب الأول سيظهر أولاً

---

## 🔧 استكشاف الأخطاء

### المشكلة: البانرات لا تظهر

**الحل:**
1. تأكد من تشغيل سكريبت الإعداد
2. تحقق من وجود بانرات مفعّلة في قاعدة البيانات
3. تأكد من صحة `location` في المكون

### المشكلة: الصور لا تُرفع

**الحل:**
1. تأكد من إنشاء storage bucket
2. تحقق من صلاحيات المستخدم
3. تأكد من حجم الصورة أقل من 10MB

### المشكلة: التقليب التلقائي لا يعمل

**الحل:**
1. تحقق من `autoPlayInterval` في الإعدادات
2. تأكد من وجود أكثر من بانر واحد مفعّل
3. تحقق من console للأخطاء

---

## 📱 دعم الأجهزة

- ✅ Desktop (1920px+)
- ✅ Laptop (1024px - 1920px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)
- ✅ Touch gestures support
- ✅ Keyboard navigation

---

## 🎨 التخصيص

### تغيير ارتفاع البانر:

من لوحة التحكم أو مباشرة:

```tsx
<RotatingBanner
  height="400px"  // أو "50vh" أو "500px"
  // ...
/>
```

### تغيير مدة العرض:

```tsx
<RotatingBanner
  autoPlayInterval={10}  // 10 ثوانٍ
  // ...
/>
```

### إخفاء أزرار التحكم:

```tsx
<RotatingBanner
  showControls={false}
  // ...
/>
```

---

## ✅ قائمة التحقق

- [ ] تشغيل `node scripts/setup-banners.js`
- [ ] التحقق من إنشاء collections في Appwrite
- [ ] التحقق من إنشاء storage bucket
- [ ] إضافة صفحة BannersManagement للروتر
- [ ] إضافة RotatingBanner لصفحة العروض
- [ ] إضافة RotatingBanner لصفحة المنتجات
- [ ] إضافة RotatingBanner لصفحة المسوقين
- [ ] رفع أول بانر تجريبي
- [ ] اختبار التقليب التلقائي
- [ ] اختبار أزرار التحكم

---

## 🎉 النتيجة النهائية

بعد إكمال جميع الخطوات، ستحصل على:

1. ✅ **بانرات احترافية متحركة** في 3 صفحات
2. ✅ **لوحة تحكم كاملة** للأدمن
3. ✅ **إعدادات قابلة للتخصيص** لكل موقع
4. ✅ **تجربة مستخدم ممتازة** مع التقليب التلقائي
5. ✅ **تصميم responsive** يعمل على جميع الأجهزة

---

**تم بنجاح! 🎊**

للدعم أو الاستفسارات، راجع الملفات أو اتصل بفريق التطوير.
