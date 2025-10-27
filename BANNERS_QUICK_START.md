# 🚀 دليل البدء السريع - نظام البانرات

## ⚡ ابدأ في 3 خطوات فقط!

### الخطوة 1️⃣: تثبيت المكتبة المطلوبة

```bash
npm install node-appwrite --save-dev
```

### الخطوة 2️⃣: تشغيل السكريبت

```bash
npm run setup-banners
```

أو:

```bash
node scripts/setup-banners.js
```

### الخطوة 3️⃣: إضافة صفحة الإدارة للروتر

في ملف `client/App.tsx` أو `router.tsx`:

```tsx
import BannersManagement from '@/pages/admin/BannersManagement';

// أضف:
{
  path: '/admin/banners',
  element: <BannersManagement />
}
```

---

## 🎨 استخدام البانرات في صفحاتك

### مثال كامل:

```tsx
import { useState, useEffect } from 'react';
import RotatingBanner from '@/components/banners/RotatingBanner';
import { getBannersByLocation, getBannerSettings } from '@/lib/banners-api';

export default function MyPage() {
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    const bannersData = await getBannersByLocation('offers'); // أو 'products' أو 'affiliate'
    const settingsData = await getBannerSettings('offers');
    setBanners(bannersData);
    setSettings(settingsData);
  };

  return (
    <div>
      <RotatingBanner
        banners={banners}
        autoPlayInterval={settings?.autoPlayInterval || 5}
        showControls={settings?.showControls ?? true}
        height={settings?.height || '300px'}
        location="offers"
      />
      
      {/* باقي محتوى الصفحة */}
    </div>
  );
}
```

---

## 📍 الصفحات المقترحة للبانرات

### 1. صفحة العروض
```tsx
location="offers"
```

### 2. صفحة المنتجات
```tsx
location="products"
```

### 3. صفحة المسوقين
```tsx
location="affiliate"
```

---

## 🎛️ لوحة تحكم الأدمن

بعد إضافة المسار، افتح:

```
http://localhost:3000/admin/banners
```

**ماذا يمكنك فعله؟**

1. ✅ إضافة بانر جديد
2. ✅ رفع صورة
3. ✅ تعديل البانرات
4. ✅ ترتيب البانرات
5. ✅ تفعيل/إيقاف البانرات
6. ✅ تغيير الإعدادات (الوقت، الارتفاع، إلخ)

---

## ✨ مثال صفحة كاملة

راجع الملف: `client/pages/OffersWithBanner.tsx`

هذا مثال كامل لصفحة عروض مع البانر المتحرك!

---

## 🔍 استكشاف الأخطاء

### ❌ البانرات لا تظهر؟

**جرّب:**
```bash
# تأكد من تشغيل السكريبت
npm run setup-banners

# تأكد من وجود بانرات في قاعدة البيانات
# افتح Appwrite Console وتحقق من collection: banners
```

### ❌ خطأ في رفع الصور؟

**تحقق:**
- حجم الصورة أقل من 10MB ✅
- نوع الصورة: PNG, JPG, JPEG, WebP, GIF ✅
- Appwrite API Key صحيح ✅

---

## 📋 قائمة التحقق السريعة

- [ ] تثبيت `node-appwrite`
- [ ] تشغيل `npm run setup-banners`
- [ ] إضافة صفحة `/admin/banners` للروتر
- [ ] فتح لوحة التحكم
- [ ] إضافة أول بانر تجريبي
- [ ] استخدام `RotatingBanner` في صفحتك
- [ ] اختبار التقليب التلقائي

---

## 🎉 انتهيت!

الآن لديك نظام بانرات احترافي كامل! 

**للمزيد من التفاصيل:** راجع ملف `BANNERS_SETUP.md`

---

**نصيحة أخيرة:** 
استخدم صور عالية الجودة وعناوين جذابة لزيادة التفاعل! 📸✨
