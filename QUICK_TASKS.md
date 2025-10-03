# ✅ قائمة المهام السريعة

## 1️⃣ إضافة المسارات في App.tsx

راجع ملف `ROUTES_TO_ADD.md` للتعليمات التفصيلية.

**الخطوات السريعة:**
1. افتح `client/App.tsx`
2. أضف الـ imports في السطر 43:
   ```tsx
   import ProductLanding from "./pages/ProductLanding";
   import AffiliateLinkManager from "./pages/AffiliateLinkManager";
   import AffiliateAnalytics from "./pages/AffiliateAnalytics";
   import AffiliateCreatives from "./pages/AffiliateCreatives";
   ```
3. أضف مسار Landing في السطر 70:
   ```tsx
   <Route path="/l/:linkCode" element={<ProductLanding />} />
   ```
4. أضف مسارات المسوق في السطر 92:
   ```tsx
   <Route path="/affiliate/links" element={<AffiliateLinkManager />} />
   <Route path="/affiliate/analytics" element={<AffiliateAnalytics />} />
   <Route path="/affiliate/creatives" element={<AffiliateCreatives />} />
   ```
5. احفظ وشغل `pnpm dev`

---

## 2️⃣ تصميم الصور والشعارات

راجع ملف `IMAGE_PROMPTS.md` للـ prompts الكاملة.

### الأولويات:

#### 🔴 عاجل (للإطلاق):
- [ ] **لوجو EGYGO** (300x100px)
  - استخدم Canva أو Figma
  - الألوان: برتقالي `#ea580c` + وردي `#ec4899`
  - نص عربي: "إيجي جو"

- [ ] **Favicon** (32x32px)
  - حرف "E" أو pyramid icon
  - برتقالي على أبيض

- [ ] **Hero Banner** (1920x600px)
  - صورة تسوق إلكتروني
  - أو تصميم gradient abstract

- [ ] **Product Placeholder** (800x800px)
  - أيقونة صورة بسيطة
  - خلفية رمادية فاتحة

#### 🟡 مهم (خلال أسبوع):
- [ ] Category Images (4 صور):
  - Electronics (800x600px)
  - Fashion (800x600px)  
  - Home & Living (800x600px)
  - Beauty (800x600px)

- [ ] Trust Badges (3 أيقونات):
  - Payment Secure (200x200px)
  - Free Shipping (200x200px)
  - Money-back Guarantee (200x200px)

#### ⚪ تحسينات (اختياري):
- [ ] Empty State Illustrations
- [ ] Affiliate Banners (4 أحجام)
- [ ] Background Patterns

---

## 3️⃣ أدوات مقترحة

### مجانية:
- **Canva** - لتصميم اللوجو والبانرات
- **Figma** - لتصميم الأيقونات
- **Unsplash/Pexels** - صور جاهزة مجانية
- **Bing Image Creator** - AI مجاني (DALL-E)
- **Remove.bg** - إزالة الخلفية
- **TinyPNG** - ضغط الصور

### مدفوعة (أفضل جودة):
- **Midjourney** - $10/شهر
- **ChatGPT Plus** - $20/شهر (DALL-E 3)
- **Adobe Firefly** - $5/شهر

---

## 4️⃣ مواقع الصفحات الجديدة

بعد إضافة المسارات، ستكون الروابط:

- 🎯 **صفحة Landing**: `/l/:linkCode` (مثال: `/l/ABC12345`)
- 🔗 **إدارة الروابط**: `/affiliate/links`
- 📊 **التحليلات**: `/affiliate/analytics`
- 🎨 **البانرات**: `/affiliate/creatives`

---

## 5️⃣ اختبار النظام

### خطوات الاختبار:

1. **إنشاء رابط تسويقي:**
   - سجل دخول: `almlmibrahym574@gmail.com`
   - اذهب إلى `/affiliate/links`
   - اختر منتج واضغط "إنشاء رابط"
   - انسخ الرابط

2. **اختبار صفحة Landing:**
   - افتح الرابط في نافذة جديدة
   - تأكد من تتبع النقرة
   - جرب زر "اشترِ الآن"

3. **تحقق من التحليلات:**
   - اذهب إلى `/affiliate/analytics`
   - شاهد الرسم البياني للنقرات
   - تحقق من جدول الأداء

4. **جرب البانرات:**
   - اذهب إلى `/affiliate/creatives`
   - انسخ كود HTML
   - حمل QR code

---

## 6️⃣ نشر التحديثات

```bash
# بعد إضافة المسارات والصور
git add .
git commit -m "✨ إضافة المسارات والصور للموقع"
git push origin main
```

---

## 📞 دعم

إذا واجهت مشاكل:
1. راجع ملف `AFFILIATE_SYSTEM_GUIDE.md`
2. تأكد من أن الـ collections موجودة في Appwrite
3. تحقق من Console للأخطاء
4. راجع ملف `.env` للـ environment variables

---

## 🎯 الخطوات التالية (بعد الإطلاق)

- [ ] نظام الكوبونات
- [ ] تتبع التحويلات في Checkout
- [ ] تقارير العمولات الشهرية
- [ ] نظام الإشعارات للمسوقين
- [ ] صفحات المنتجات المخصصة
- [ ] A/B Testing للـ Landing Pages
