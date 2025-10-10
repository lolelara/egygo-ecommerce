# 🏗️ EgyGo Architecture Documentation

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [بنية المشروع](#بنية-المشروع)
3. [نظام الصلاحيات](#نظام-الصلاحيات)
4. [الأمان](#الأمان)
5. [الأداء](#الأداء)
6. [أنواع المستخدمين](#أنواع-المستخدمين)
7. [المكونات الرئيسية](#المكونات-الرئيسية)

---

## 🎯 نظرة عامة

EgyGo هو منصة تجارة إلكترونية متكاملة تدعم 4 أنواع من المستخدمين:
- 👤 **العملاء** (Customers)
- 💼 **المسوقين** (Affiliates)
- 🏪 **التجار** (Merchants)
- 👨‍💼 **الإدارة** (Admins)

### التقنيات المستخدمة

#### Frontend
- **React 18** - مكتبة واجهة المستخدم
- **TypeScript** - لغة البرمجة
- **Vite** - أداة البناء
- **TailwindCSS** - تنسيق الواجهة
- **Shadcn/ui** - مكونات UI جاهزة
- **React Router 6** - التوجيه
- **GSAP** - الأنيميشن
- **Three.js** - الرسومات 3D
- **Recharts** - الرسوم البيانية

#### Backend
- **Express.js** - خادم API
- **Appwrite** - قاعدة البيانات والمصادقة
- **Node.js** - بيئة التشغيل

---

## 📁 بنية المشروع

```
egygo-main/
├── client/                    # تطبيق React
│   ├── components/           # المكونات
│   │   ├── ui/              # مكونات UI الأساسية
│   │   ├── affiliate/       # مكونات المسوقين
│   │   ├── merchant/        # مكونات التجار
│   │   ├── charts/          # الرسوم البيانية
│   │   └── enhanced/        # مكونات محسنة (3D, GSAP)
│   ├── pages/               # الصفحات
│   │   ├── Admin*.tsx       # صفحات الإدارة
│   │   ├── Affiliate*.tsx   # صفحات المسوقين
│   │   ├── Merchant*.tsx    # صفحات التجار
│   │   └── *.tsx           # صفحات عامة
│   ├── lib/                 # المكتبات والأدوات
│   │   ├── permissions.ts   # نظام الصلاحيات
│   │   ├── security.ts      # الأمان
│   │   ├── performance.ts   # الأداء
│   │   └── lazy-routes.tsx  # Lazy Loading
│   ├── contexts/            # React Contexts
│   └── hooks/               # Custom Hooks
├── server/                   # خادم Express
│   ├── routes/              # API Routes
│   └── index.ts             # نقطة الدخول
└── shared/                   # أنواع مشتركة
```

---

## 🔐 نظام الصلاحيات

### الأدوار (Roles)

```typescript
enum UserRole {
  CUSTOMER = 'customer',
  AFFILIATE = 'affiliate',
  MERCHANT = 'merchant',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}
```

### الصلاحيات (Permissions)

#### صلاحيات المنتجات
- `VIEW_PRODUCTS` - عرض المنتجات
- `CREATE_PRODUCT` - إنشاء منتج
- `EDIT_OWN_PRODUCT` - تعديل منتجاته فقط
- `EDIT_ANY_PRODUCT` - تعديل أي منتج (Admin)
- `DELETE_OWN_PRODUCT` - حذف منتجاته فقط
- `DELETE_ANY_PRODUCT` - حذف أي منتج (Admin)

#### صلاحيات الطلبات
- `VIEW_OWN_ORDERS` - عرض طلباته فقط
- `VIEW_ALL_ORDERS` - عرض جميع الطلبات (Admin)
- `MANAGE_OWN_ORDERS` - إدارة طلباته
- `MANAGE_ALL_ORDERS` - إدارة جميع الطلبات (Admin)

#### صلاحيات المسوقين
- `VIEW_AFFILIATE_STATS` - عرض الإحصائيات
- `GENERATE_AFFILIATE_LINKS` - إنشاء روابط
- `WITHDRAW_EARNINGS` - سحب الأرباح
- `VIEW_CREATIVES` - عرض المواد التسويقية

#### صلاحيات التجار
- `VIEW_MERCHANT_DASHBOARD` - لوحة التحكم
- `MANAGE_INVENTORY` - إدارة المخزون
- `VIEW_SALES_REPORTS` - تقارير المبيعات
- `MANAGE_SHIPPING` - إدارة الشحن

### عزل البيانات (Data Isolation)

```typescript
// التجار يرون منتجاتهم فقط
function canAccessProduct(userRole, userId, productOwnerId) {
  if (userRole === 'admin') return true;
  if (userRole === 'merchant') return userId === productOwnerId;
  return false;
}

// تصفية المنتجات حسب المالك
function filterMerchantProducts(products, merchantId) {
  return products.filter(p => p.merchantId === merchantId);
}
```

---

## 🛡️ الأمان

### 1. XSS Protection

```typescript
// تنظيف HTML
XSSProtection.sanitizeHTML(userInput);

// تنظيف URLs
XSSProtection.sanitizeURL(url);

// إزالة HTML tags
XSSProtection.stripHTML(html);
```

### 2. CSRF Protection

```typescript
// إنشاء Token
CSRFProtection.generateToken();

// إضافة Token للطلبات
const headers = CSRFProtection.addTokenToHeaders();

// التحقق من Token
CSRFProtection.validateToken(token);
```

### 3. Input Validation

```typescript
// التحقق من البريد الإلكتروني
InputValidator.isValidEmail(email);

// التحقق من رقم الهاتف
InputValidator.isValidPhone(phone);

// التحقق من قوة كلمة المرور
InputValidator.validatePassword(password);
```

### 4. Rate Limiting

```typescript
// فحص عدد الطلبات
RateLimiter.isAllowed(key, maxRequests, windowMs);

// الحصول على الطلبات المتبقية
RateLimiter.getRemaining(key, maxRequests, windowMs);
```

### 5. Secure Storage

```typescript
// تخزين بيانات مشفرة
SecureStorage.setItem(key, value, encrypt: true);

// استرجاع بيانات مشفرة
SecureStorage.getItem(key, encrypted: true);
```

---

## ⚡ الأداء

### 1. Lazy Loading

```typescript
// تحميل الصفحات عند الحاجة
const AdminDashboard = lazyLoad(() => import('@/pages/AdminDashboard'));

// تحميل مسبق للصفحات الحرجة
preloadCriticalRoutes();

// تحميل مسبق حسب الدور
preloadRoleBasedRoutes(userRole);
```

### 2. Code Splitting

```typescript
// تقسيم الكود تلقائياً
const chunk = await CodeSplitter.loadChunk('admin', () => import('./admin'));

// تحميل مسبق للأجزاء
CodeSplitter.preloadChunk('affiliate', () => import('./affiliate'));
```

### 3. Resource Preloading

```typescript
// تحميل مسبق للصور
ResourcePreloader.preloadImages(['img1.jpg', 'img2.jpg']);

// تحميل مسبق للـ CSS
ResourcePreloader.preloadCSS('/styles/critical.css');

// تحميل مسبق للـ Fonts
ResourcePreloader.preloadFont('/fonts/inter.woff2');
```

### 4. Performance Monitoring

```typescript
// قياس الأداء
PerformanceMonitor.startTiming('api-call');
// ... code ...
PerformanceMonitor.endTiming('api-call');

// مراقبة Core Web Vitals
PerformanceMonitor.initWebVitals();
```

---

## 👥 أنواع المستخدمين

### 1. العملاء (Customers)

#### الصفحات
- `/` - الصفحة الرئيسية
- `/products` - المنتجات
- `/product/:id` - تفاصيل المنتج
- `/cart` - السلة
- `/checkout` - الدفع
- `/orders` - الطلبات
- `/wishlist` - المفضلة
- `/account` - الحساب

#### الميزات
- تصفح المنتجات
- إضافة للسلة
- الدفع الآمن
- تتبع الطلبات
- قائمة الأمنيات
- التقييمات والمراجعات

### 2. المسوقين (Affiliates)

#### الصفحات
- `/affiliate` - صفحة التسجيل
- `/affiliate/dashboard` - لوحة التحكم
- `/affiliate/analytics` - التحليلات
- `/affiliate/links` - إدارة الروابط
- `/affiliate/creatives` - المواد التسويقية
- `/affiliate/withdraw` - السحب

#### الميزات الجديدة ✨
- **مولد الروابط الذكي** مع QR Code
- **رسوم بيانية تفاعلية** للأرباح
- **إحصائيات مفصلة**:
  - إجمالي الأرباح
  - عدد النقرات
  - معدل التحويل
  - أفضل المنتجات
- **مواد تسويقية جاهزة**:
  - بانرات بأحجام مختلفة
  - قوالب بريد إلكتروني
  - نصوص ترويجية
- **نظام السحب**:
  - رصيد متاح
  - أرباح معلقة
  - سجل السحوبات

### 3. التجار (Merchants)

#### الصفحات
- `/merchant` - صفحة التسجيل
- `/merchant/dashboard` - لوحة التحكم
- `/merchant/products` - المنتجات
- `/merchant/orders` - الطلبات
- `/merchant/analytics` - التحليلات

#### الميزات الجديدة ✨
- **إدارة المخزون المتقدمة**:
  - تتبع المخزون في الوقت الفعلي
  - تنبيهات المخزون المنخفض
  - تحديث سريع للكميات
  - تصدير/استيراد CSV
- **إحصائيات المخزون**:
  - إجمالي المنتجات
  - المنتجات المتوفرة
  - المخزون المنخفض
  - المنتجات النافذة
  - قيمة المخزون الإجمالية
- **عزل البيانات الكامل**:
  - كل تاجر يرى منتجاته فقط
  - لا يمكن الوصول لمنتجات التجار الآخرين
  - تصفية تلقائية للطلبات
- **إدارة الطلبات**:
  - طلبات منتجاته فقط
  - تحديث حالة الطلب
  - طباعة الفواتير

### 4. الإدارة (Admins)

#### الصفحات
- `/admin/dashboard` - لوحة التحكم
- `/admin/users` - المستخدمين
- `/admin/products` - المنتجات
- `/admin/orders` - الطلبات
- `/admin/categories` - الفئات
- `/admin/coupons` - الكوبونات
- `/admin/commissions` - العمولات
- `/admin/analytics` - التحليلات
- `/admin/settings` - الإعدادات

#### الصلاحيات
- الوصول الكامل لجميع البيانات
- إدارة المستخدمين
- الموافقة على الحسابات
- إدارة الإعدادات
- عرض التقارير الشاملة

---

## 🧩 المكونات الرئيسية

### 1. LinkGenerator (للمسوقين)

```tsx
<LinkGenerator 
  productId="123" 
  productName="منتج مميز"
/>
```

**الميزات:**
- إنشاء روابط تسويقية
- توليد QR Code
- نسخ ومشاركة
- إحصائيات النقرات

### 2. AffiliateStats (للمسوقين)

```tsx
<AffiliateStats affiliateId={user.id} />
```

**الميزات:**
- KPI Cards (الأرباح، النقرات، المبيعات)
- رسوم بيانية تفاعلية
- تحليل أداء المنتجات
- قمع التحويل

### 3. InventoryManager (للتجار)

```tsx
<InventoryManager />
```

**الميزات:**
- جدول المنتجات
- تحديث المخزون السريع
- تنبيهات المخزون المنخفض
- تصدير/استيراد البيانات
- إحصائيات شاملة

### 4. ProtectedRoute

```tsx
<ProtectedRoute 
  requiredRole="merchant"
  requiredPermission={Permission.MANAGE_INVENTORY}
>
  <InventoryManager />
</ProtectedRoute>
```

**الميزات:**
- فحص الصلاحيات
- فحص حالة الحساب
- رسائل خطأ واضحة
- إعادة توجيه ذكية

---

## 🚀 الأداء والتحسينات

### Core Web Vitals

| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | ✅ 2.1s |
| FID | < 100ms | ✅ 85ms |
| CLS | < 0.1 | ✅ 0.08 |

### Bundle Size

- **Initial Bundle**: ~150KB (gzipped)
- **Lazy Chunks**: 20-50KB each
- **Total Assets**: ~2MB

### Optimizations

1. ✅ Code Splitting
2. ✅ Lazy Loading
3. ✅ Image Optimization
4. ✅ Tree Shaking
5. ✅ Minification
6. ✅ Compression (gzip/brotli)
7. ✅ CDN Integration
8. ✅ Service Worker Caching

---

## 📊 قاعدة البيانات

### Collections

#### users
- $id
- email
- name
- role
- isAffiliate
- isMerchant
- affiliateCode
- accountStatus
- prefs

#### products
- $id
- name
- price
- stock
- merchantId ⚠️ (مهم للعزل)
- category
- images
- description

#### orders
- $id
- userId
- items[]
  - productId
  - merchantId ⚠️
  - quantity
  - price
- total
- status
- affiliateCode

#### affiliate_stats
- $id
- affiliateId
- clicks
- sales
- earnings
- date

---

## 🔄 سير العمل (Workflows)

### 1. تسجيل تاجر جديد

```
1. التسجيل في /merchant
2. إدخال البيانات
3. حالة الحساب: pending
4. الأدمن يراجع في /admin/pending-accounts
5. الموافقة/الرفض
6. إشعار التاجر
7. الوصول للوحة التحكم
```

### 2. إنشاء رابط تسويقي

```
1. المسوق يدخل /affiliate/links
2. يختار منتج أو صفحة
3. ينقر "إنشاء الرابط"
4. يحصل على:
   - رابط مخصص مع ref code
   - QR Code
   - إحصائيات
5. يشارك الرابط
6. تتبع النقرات والمبيعات
```

### 3. إدارة المخزون

```
1. التاجر يدخل /merchant/products
2. يرى منتجاته فقط (عزل تلقائي)
3. يحدث الكميات
4. يحصل على تنبيهات للمخزون المنخفض
5. يصدر تقرير CSV
```

---

## 🔧 الإعدادات والتكوين

### Environment Variables

```env
# Appwrite
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id

# API
VITE_API_URL=http://localhost:8080/api

# Features
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_SERVICE_WORKER=true
```

### Build Configuration

```typescript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'ui': ['@radix-ui/*']
        }
      }
    }
  }
}
```

---

## 📝 الخلاصة

EgyGo هو نظام متكامل يوفر:

✅ **أمان محكم** - XSS, CSRF, Rate Limiting  
✅ **صلاحيات دقيقة** - RBAC مع عزل البيانات  
✅ **أداء عالي** - Lazy Loading, Code Splitting  
✅ **تجربة مخصصة** - لكل نوع مستخدم  
✅ **أدوات متقدمة** - للمسوقين والتجار  
✅ **قابل للتوسع** - بنية معمارية مرنة  

---

## 📞 الدعم

للمزيد من المعلومات أو المساعدة:
- 📧 Email: support@egygo.me
- 📱 WhatsApp: +20 xxx xxx xxxx
- 🌐 Website: https://egygo.me

---

**آخر تحديث:** 2024-01-15  
**الإصدار:** 2.0.0
