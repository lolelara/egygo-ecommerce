# المسارات المطلوب إضافتها في App.tsx

## 1. إضافة Imports في أعلى الملف (بعد السطر 42):

```tsx
import ProductLanding from "./pages/ProductLanding";
import AffiliateLinkManager from "./pages/AffiliateLinkManager";
import AffiliateAnalytics from "./pages/AffiliateAnalytics";
import AffiliateCreatives from "./pages/AffiliateCreatives";
```

## 2. إضافة مسار صفحة Landing (بعد السطر 69):

```tsx
<Route path="/l/:linkCode" element={<ProductLanding />} />
```

يجب أن يكون بين:
```tsx
<Route path="/product/:id" element={<ProductDetail />} />
<Route path="/l/:linkCode" element={<ProductLanding />} />  ← أضف هذا السطر
<Route path="/category/:slug" element={<Products />} />
```

## 3. إضافة مسارات صفحات المسوق (بعد السطر 91):

```tsx
<Route
  path="/affiliate/links"
  element={<AffiliateLinkManager />}
/>
<Route
  path="/affiliate/analytics"
  element={<AffiliateAnalytics />}
/>
<Route
  path="/affiliate/creatives"
  element={<AffiliateCreatives />}
/>
```

يجب أن تكون بين:
```tsx
<Route
  path="/affiliate/dashboard"
  element={<EnhancedAffiliateDashboard />}
/>
← أضف المسارات الثلاثة هنا
<Route
  path="/affiliate/withdraw"
  element={<PlaceholderPage title="سحب الأرباح" />}
/>
```

---

## ✅ بعد الإضافة، احفظ الملف وشغل:
```bash
pnpm dev
```
