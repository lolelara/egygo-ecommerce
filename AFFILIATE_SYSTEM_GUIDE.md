# 🚀 نظام التسويق بالعمولة - دليل التطبيق

## ✅ ما تم إنجازه

### 1. **Collections في Appwrite**
- ✅ `affiliate_links` - للروابط التتبعية
  - affiliateId, productId, linkCode, clicks, conversions, revenue
- ✅ `coupons` - للكوبونات
  - code, affiliateId, type, value, usageLimit, active

### 2. **حساب مسوق تجريبي**
```
📧 Email: almlmibrahym574@gmail.com
🔑 Password: Affiliatex8k3cmsq4ktmgaiwrlo
```

---

## 📋 ما يجب إكماله

### المرحلة 1: صفحة Landing Page (أولوية عالية)

**الملف:** `client/pages/ProductLanding.tsx`

```typescript
// صفحة /l/{linkCode}
// - عرض المنتج بتصميم محسّن
// - تتبع النقرات (increment clicks)
// - زر شراء يحفظ affiliateId في الـ order
```

**Route في App.tsx:**
```typescript
<Route path="/l/:linkCode" element={<ProductLanding />} />
```

---

### المرحلة 2: أدوات إنشاء الروابط

**إضافة في** `client/pages/AffiliateDashboard.tsx`:

```typescript
// قسم جديد: "إنشاء روابط تسويقية"
// - Select لاختيار المنتج
// - Button "إنشاء رابط"
// - عرض الرابط: https://egygo.me/l/{linkCode}
// - زر نسخ الرابط
// - جدول بكل الروابط المنشأة
```

**API Functions في** `client/lib/api.ts`:

```typescript
export const affiliateLinksApi = {
  create: async (affiliateId, productId) => {
    const linkCode = generateLinkCode(); // random 8 chars
    return await databases.createDocument(
      DATABASE_ID,
      'affiliate_links',
      ID.unique(),
      {
        affiliateId,
        productId,
        linkCode,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        createdAt: new Date().toISOString()
      }
    );
  },
  
  getByAffiliate: async (affiliateId) => {
    return await databases.listDocuments(
      DATABASE_ID,
      'affiliate_links',
      [Query.equal('affiliateId', affiliateId)]
    );
  },
  
  trackClick: async (linkCode) => {
    // Get link, increment clicks, update lastClickAt
  },
  
  trackConversion: async (linkCode, orderAmount) => {
    // Increment conversions, add to revenue
  }
};
```

---

### المرحلة 3: تتبع الطلبات مع العمولة

**تحديث** `client/pages/Checkout.tsx`:

```typescript
// عند إنشاء الطلب:
// 1. تحقق من وجود affiliateId في sessionStorage/cookie
// 2. أضف affiliateId للطلب
// 3. استدعِ trackConversion()
// 4. أنشئ سجل في commissions collection
```

**في** `client/pages/ProductLanding.tsx`:

```typescript
useEffect(() => {
  // حفظ affiliateId عند الدخول للصفحة
  sessionStorage.setItem('referralAffiliateId', affiliateId);
}, []);
```

---

### المرحلة 4: Dashboard التحليلات

**صفحة جديدة:** `client/pages/AffiliateAnalytics.tsx`

```typescript
// عرض:
// - إجمالي النقرات
// - إجمالي التحويلات
// - معدل التحويل
// - إجمالي المبيعات
// - العمولات المكتسبة
// - Chart للأداء خلال الشهر
// - جدول أفضل المنتجات
```

---

### المرحلة 5: نظام البنرات الإعلانية

**صفحة:** `client/pages/AffiliateCreatives.tsx`

```typescript
// بنرات جاهزة:
// - 728x90 (Leaderboard)
// - 300x250 (Medium Rectangle)
// - 160x600 (Wide Skyscraper)
// - 320x50 (Mobile Banner)

// لكل بنر:
// - معاينة
// - كود HTML للتضمين (مع رابط التتبع)
// - زر "تحميل"
```

---

### المرحلة 6: نظام الكوبونات

**صفحة:** `client/pages/AffiliateCoupons.tsx`

```typescript
// إنشاء كوبون:
// - Code (مثل: SALE20)
// - Type (percentage/fixed)
// - Value (20%)
// - Usage Limit
// - Expiry Date

// عرض الكوبونات:
// - جدول بكل الكوبونات
// - عدد مرات الاستخدام
// - الحالة (active/expired)
```

**تحديث Checkout:**
```typescript
// إضافة حقل "كود الخصم"
// التحقق من الكوبون
// تطبيق الخصم
// ربط الطلب بالكوبون
```

---

## 🔧 Utils و Helpers المطلوبة

### 1. **Link Code Generator**

```typescript
// client/lib/utils.ts
export function generateLinkCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}
```

### 2. **QR Code Generator**

```bash
pnpm add qrcode
```

```typescript
import QRCode from 'qrcode';

export async function generateQRCode(url: string): Promise<string> {
  return await QRCode.toDataURL(url);
}
```

### 3. **Copy to Clipboard**

```typescript
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  // Show toast
}
```

---

## 📊 نظام التتبع والإحصائيات

### Google Analytics (اختياري)

```typescript
// Track affiliate link clicks
gtag('event', 'affiliate_click', {
  link_code: linkCode,
  product_id: productId,
  affiliate_id: affiliateId
});

// Track conversions
gtag('event', 'purchase', {
  transaction_id: orderId,
  affiliation: affiliateId,
  value: orderTotal,
  currency: 'EGP'
});
```

---

## 🎨 تصميم Landing Page المقترح

```tsx
<div className="landing-page">
  {/* Hero Section */}
  <section className="hero bg-gradient-to-r from-primary to-orange-500">
    <h1>عرض خاص لفترة محدودة! 🔥</h1>
    <Timer countdown={24} />
  </section>

  {/* Product Images */}
  <section className="product-gallery">
    <Carousel images={product.images} />
  </section>

  {/* Benefits */}
  <section className="benefits grid-cols-3">
    <Benefit icon="✓" text="ضمان استرجاع المال" />
    <Benefit icon="🚚" text="شحن مجاني" />
    <Benefit icon="⭐" text="تقييم 4.8 نجوم" />
  </section>

  {/* Price + CTA */}
  <section className="cta sticky-bottom">
    <Price original={299} discounted={199} />
    <Button size="lg" className="w-full">
      اشترِ الآن - وفّر 100 جنيه!
    </Button>
  </section>

  {/* Reviews */}
  <section className="reviews">
    <ReviewCard rating={5} comment="..." />
  </section>

  {/* FAQ */}
  <section className="faq">
    <Accordion items={faqs} />
  </section>
</div>
```

---

## 🚀 الخطوات التالية (بالترتيب)

1. ✅ إنشاء Collections (**تم**)
2. ✅ إنشاء حساب المسوق (**تم**)
3. ⏳ إنشاء صفحة Landing Page
4. ⏳ إضافة أدوات إنشاء الروابط في Dashboard
5. ⏳ ربط الطلبات بالمسوقين
6. ⏳ صفحة التحليلات
7. ⏳ مكتبة البنرات
8. ⏳ نظام الكوبونات

---

## 💡 أفكار إضافية

- **Email Marketing**: إرسال تنبيهات للمسوقين عن المبيعات
- **Leaderboard**: ترتيب أفضل المسوقين
- **Referral Program**: مكافأة المسوقين على جلب مسوقين جدد
- **Mobile App Deep Links**: روابط تفتح التطبيق مباشرة
- **A/B Testing**: اختبار Landing Pages مختلفة

---

**📝 ملاحظة:** جميع الأكواد أعلاه هي أمثلة إرشادية. يجب تكييفها مع بنية المشروع الحالية.
