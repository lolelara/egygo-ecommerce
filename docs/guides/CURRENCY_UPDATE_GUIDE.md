# تحديث العملة من $ إلى ج.م

## ✅ تم إنشاء

### 1. ملف Currency Utility
**الملف:** `client/lib/currency.ts`

```typescript
import { formatPrice } from '@/lib/currency';

// استخدام
formatPrice(100); // "100 ج.م"
formatPrice(1500); // "1,500 ج.م"
formatPrice(99.99, true); // "99.99 ج.م"
```

### 2. الدوال المتاحة

```typescript
// تنسيق السعر
formatPrice(price: number, showDecimals?: boolean): string

// تنسيق نطاق الأسعار
formatPriceRange(minPrice: number, maxPrice: number): string

// حساب نسبة الخصم
calculateDiscount(originalPrice: number, discountedPrice: number): number

// تنسيق مبلغ الخصم
formatDiscount(originalPrice: number, discountedPrice: number): string

// تحويل النص إلى رقم
parsePrice(priceString: string): number
```

## 📝 الملفات التي تم تحديثها

### ✅ تم التحديث:
1. **client/pages/Index.tsx** - الصفحة الرئيسية
   - استبدال `${product.price}` بـ `{formatPrice(product.price)}`
   - استبدال `وفر $${...}` بـ `formatDiscount(...)`

### 🔄 يحتاج تحديث:
استخدم `formatPrice()` في هذه الملفات:

1. **client/pages/Products.tsx** (14 مرة)
2. **client/pages/ProductDetail.tsx** (7 مرات)
3. **client/pages/Cart.tsx** (3 مرات)
4. **client/pages/Checkout.tsx** (2 مرة)
5. **client/pages/MerchantDashboard.tsx** (1 مرة)
6. **client/components/EnhancedProductCard.tsx** (6 مرات)
7. **client/components/ProductComparison.tsx** (5 مرات)

## 🔍 كيفية التحديث

### قبل:
```tsx
<span>${product.price}</span>
<span>${product.originalPrice}</span>
```

### بعد:
```tsx
import { formatPrice } from '@/lib/currency';

<span>{formatPrice(product.price)}</span>
<span>{formatPrice(product.originalPrice)}</span>
```

## 🎯 الفوائد

1. ✅ **توحيد العملة** - كل الموقع يستخدم ج.م
2. ✅ **سهولة التعديل** - تغيير واحد في ملف currency.ts
3. ✅ **تنسيق موحد** - فواصل الآلاف تلقائياً
4. ✅ **مرونة** - يمكن إضافة عملات أخرى لاحقاً

## 📦 الخطوات التالية

1. ابحث عن `$` في كل ملفات TSX
2. استبدل بـ `formatPrice()`
3. أضف import للدالة
4. اختبر الصفحات

## 🔧 أمثلة إضافية

```tsx
// سعر بسيط
{formatPrice(299)} // "299 ج.م"

// سعر مع كسور
{formatPrice(299.99, true)} // "299.99 ج.م"

// نطاق أسعار
{formatPriceRange(100, 500)} // "100 ج.م - 500 ج.م"

// خصم
{formatDiscount(500, 350)} // "وفر 150 ج.م"

// نسبة خصم
{calculateDiscount(500, 350)}% // "30%"
```

## ✨ ملاحظات

- العملة الافتراضية: **الجنيه المصري (ج.م)**
- الفواصل تضاف تلقائياً للأرقام الكبيرة
- الكسور العشرية اختيارية (افتراضياً مخفية)
- يمكن تغيير الرمز من `currency.ts`
