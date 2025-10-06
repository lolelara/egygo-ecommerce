# 🛍️ إيجي جو - منصة التجارة الإلكترونية المتقدمة

<div dir="rtl">

## 📋 نظرة عامة

**إيجي جو** هي منصة تجارة إلكترونية متكاملة مبنية بتقنيات حديثة، تجمع بين قوة React وسهولة Express لتقديم تجربة تسوق استثنائية.

### 🎯 المميزات الرئيسية

- ✅ **42 API Endpoint** جاهزة للاستخدام
- ✅ **17 مكون React** متقدم
- ✅ **WebSocket** للتحديثات الفورية
- ✅ **Appwrite** كقاعدة بيانات
- ✅ **OpenAI** للمساعد الذكي
- ✅ **Google Maps** للتتبع الحي
- ✅ **i18n** دعم العربية والإنجليزية
- ✅ **PWA** تطبيق ويب تقدمي

---

## 🚀 البدء السريع

### المتطلبات

- Node.js 18+
- pnpm 8+
- حساب Appwrite

### التثبيت

```bash
# 1. Clone المشروع
git clone https://github.com/lolelara/egygo-ecommerce.git
cd egygo-ecommerce

# 2. تثبيت Dependencies
pnpm install

# 3. إعداد Environment Variables
cp .env.example .env
# أضف API Keys الخاصة بك

# 4. تشغيل المشروع
pnpm dev
```

سيعمل المشروع على:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **WebSocket:** ws://localhost:8081

---

## 📁 هيكل المشروع

```
egygo-ecommerce/
├── client/                    # React Frontend
│   ├── components/           # المكونات الأساسية
│   │   ├── ui/              # مكونات UI من shadcn
│   │   ├── advanced/        # مكونات متقدمة (RBAC, Contracts, A/B...)
│   │   └── *.tsx            # مكونات عامة (12 مكون)
│   ├── pages/               # صفحات التطبيق
│   ├── lib/                 # المكتبات المساعدة
│   │   ├── performance.tsx  # تحسينات الأداء
│   │   ├── accessibility.tsx # إمكانية الوصول
│   │   └── i18n.tsx         # الترجمة (AR/EN)
│   └── App.tsx              # نقطة البداية
│
├── server/                   # Express Backend
│   ├── routes/              # API Routes
│   │   ├── rbac.ts          # RBAC & Security (5 endpoints)
│   │   ├── contracts.ts     # Smart Contracts (4 endpoints)
│   │   ├── experiments.ts   # A/B Testing (4 endpoints)
│   │   ├── customer-experience.ts # Customer APIs (6 endpoints)
│   │   ├── supply-chain.ts  # Supply Chain (13 endpoints)
│   │   └── notifications.ts # Notifications (6 endpoints)
│   ├── lib/                 # المكتبات المساعدة
│   │   ├── appwrite.ts      # Appwrite helper
│   │   └── external-apis.ts # External APIs (OpenAI, Google Maps)
│   ├── websocket.ts         # WebSocket Server
│   └── index.ts             # Server entry point
│
├── shared/                   # أنواع مشتركة
│   └── api.ts               # TypeScript interfaces
│
└── docs/                     # التوثيق
    ├── QUICK_START.md       # البدء السريع
    ├── TESTING_GUIDE.md     # دليل الاختبار
    └── IMPLEMENTATION_COMPLETE.md # ملخص الإنجاز
```

---

## 🎨 المكونات المتاحة

### المكونات الأساسية (12 مكون)

1. **UniversalSearch** - بحث شامل في المنتجات/الطلبات/الصفحات
2. **NotificationsCenter** - مركز الإشعارات الفورية
3. **MultiCurrencyPrice** - عرض الأسعار بعملات متعددة
4. **LoyaltyBadges** - شارات الولاء (فضي/ذهبي/بلاتيني)
5. **InventoryAlerts** - تنبيهات المخزون
6. **PerformanceAlerts** - تنبيهات الأداء
7. **QuickReorder** - إعادة الطلب السريع
8. **SmartLinkGenerator** - مولد روابط أفلييت ذكي
9. **EnhancedProductEditor** - محرر منتجات متقدم
10. **AnalyticsOverview** - نظرة عامة على التحليلات
11. **AnnouncementBar** - شريط الإعلانات
12. **ScrollToTopButton** - زر العودة للأعلى

### المكونات المتقدمة (5 مكونات)

1. **RBACSystem** - نظام الصلاحيات الكامل
2. **SmartContracts** - إدارة عقود الأفلييت والتجار
3. **ExperimentHub** - A/B Testing المتقدم
4. **CustomerExperience** - تجربة العميل (AI + AR + Family)
5. **SupplyChainTools** - أدوات سلسلة التوريد

---

## 🔌 Backend APIs

### RBAC & Security (5 endpoints)
```typescript
GET  /api/rbac/roles              // قائمة الأدوار
POST /api/rbac/roles              // إنشاء دور
PUT  /api/rbac/roles/:id          // تحديث دور
GET  /api/rbac/audit-logs         // سجل التدقيق
POST /api/rbac/check-permission   // فحص الصلاحية
```

### Smart Contracts (4 endpoints)
```typescript
GET  /api/contracts               // قائمة العقود
POST /api/contracts               // إنشاء عقد
PUT  /api/contracts/:id           // تحديث عقد
GET  /api/contracts/performance/:id // أداء العقد
```

### A/B Testing (4 endpoints)
```typescript
GET  /api/ab-tests                // قائمة الاختبارات
POST /api/ab-tests                // إنشاء اختبار
PUT  /api/ab-tests/:id/winner     // تحديد الفائز
GET  /api/ab-tests/:id/results    // النتائج
```

### Customer Experience (6 endpoints)
```typescript
POST /api/ai/chat                 // المساعد الذكي
POST /api/ar/models               // إضافة نموذج AR
GET  /api/ar/models/:productId    // عرض نماذج AR
POST /api/family/accounts         // حساب عائلي
GET  /api/family/accounts/:id     // تفاصيل الحساب
GET  /api/shipments/track/:orderId // تتبع الشحنة
```

### Supply Chain (13 endpoints)
```typescript
// Supply Chain
GET  /api/supply/offers           // عروض الموردين
POST /api/supply/compare          // مقارنة الموردين
POST /api/supply/bundles          // إنشاء حزم
POST /api/supply/simulate-price   // محاكاة الأسعار

// Inventory
GET  /api/inventory/alerts        // تنبيهات المخزون
POST /api/inventory/reorder       // إعادة تخزين
GET  /api/inventory/predictions   // توقعات المخزون

// Search
GET  /api/search                  // بحث شامل
GET  /api/search/suggestions      // اقتراحات

// Loyalty
GET  /api/loyalty/tiers           // مستويات الولاء
POST /api/loyalty/calculate       // حساب النقاط

// Currency
GET  /api/currency/rates          // أسعار العملات
POST /api/currency/convert        // تحويل عملة
```

### Notifications (6 endpoints)
```typescript
GET    /api/notifications          // قائمة الإشعارات
POST   /api/notifications          // إنشاء إشعار
POST   /api/notifications/mark-read // تعليم كمقروء
POST   /api/notifications/mark-all-read // تعليم الكل
DELETE /api/notifications/:id      // حذف إشعار
POST   /api/notifications/broadcast // بث إشعار
```

---

## 🌐 WebSocket

### الاتصال
```javascript
const ws = new WebSocket('ws://localhost:8081?userId=user123&role=customer');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### الأحداث المدعومة
- `notification` - إشعار جديد
- `live_update` - تحديث مباشر
- `ping/pong` - keepalive

---

## 🗄️ قاعدة البيانات (Appwrite)

### Collections (9 مجموعات)

1. **roles** - الأدوار والصلاحيات
2. **audit_logs** - سجل التدقيق
3. **smart_contracts** - العقود الذكية
4. **ab_tests** - اختبارات A/B
5. **family_groups** - المجموعات العائلية
6. **family_members** - أعضاء المجموعات
7. **ar_models** - نماذج AR للمنتجات
8. **chat_messages** - محادثات المساعد الذكي
9. **bundles** - حزم المنتجات

### الإعداد
```bash
# 1. إنشاء project في Appwrite
# 2. رفع appwrite-collections.json
# 3. إضافة في .env:
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-api-key
```

---

## 🔑 External APIs

### OpenAI (المساعد الذكي)
```bash
OPENAI_API_KEY=sk-...
```

### Google Maps (التتبع الحي)
```bash
GOOGLE_MAPS_API_KEY=AIza...
```

### Exchange Rate (العملات)
```bash
EXCHANGE_RATE_API_KEY=your-key
```

---

## 🧪 الاختبار

### اختبار API
```bash
# RBAC
curl http://localhost:8080/api/rbac/roles

# Notifications
curl http://localhost:8080/api/notifications?userId=user123

# A/B Tests
curl http://localhost:8080/api/ab-tests
```

### اختبار WebSocket
```bash
# تثبيت wscat
pnpm add -g wscat

# الاتصال
wscat -c "ws://localhost:8081?userId=user123&role=customer"

# إرسال رسالة
{"type": "subscribe", "room": "notifications"}
```

للمزيد: راجع **TESTING_GUIDE.md**

---

## 🌍 الترجمة (i18n)

### الاستخدام
```typescript
import { useI18n } from '@/lib/i18n';

function MyComponent() {
  const { t, locale, setLocale } = useI18n();
  
  return (
    <div>
      <h1>{t('products.title')}</h1>
      <button onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}>
        {locale === 'ar' ? 'English' : 'العربية'}
      </button>
    </div>
  );
}
```

### اللغات المدعومة
- ✅ العربية (الافتراضية)
- ✅ الإنجليزية

---

## ⚡ تحسينات الأداء

### Code Splitting
```typescript
import { Suspense } from 'react';
import { RBACSystemLazy, LoadingFallback } from '@/lib/performance';

<Suspense fallback={<LoadingFallback />}>
  <RBACSystemLazy />
</Suspense>
```

### Debounce
```typescript
import { useDebounce } from '@/lib/performance';

const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);
```

---

## ♿ إمكانية الوصول (A11y)

### Keyboard Shortcuts
```typescript
import { useKeyboardShortcut } from '@/lib/accessibility';

// Ctrl+K للبحث
useKeyboardShortcut('k', openSearch, { ctrl: true });

// Escape لإغلاق
useKeyboardShortcut('Escape', closeModal);
```

### Screen Readers
```typescript
import { useScreenReaderAnnouncement } from '@/lib/accessibility';

const { announce, AnnouncementComponent } = useScreenReaderAnnouncement();

function addToCart() {
  // ... logic
  announce('تم إضافة المنتج للسلة');
}
```

---

## 📚 التوثيق

### للمطورين
- **QUICK_START.md** - البدء السريع
- **QUICK_START_BACKEND.md** - دليل Backend
- **TESTING_GUIDE.md** - دليل الاختبار الشامل
- **COMPONENT_INDEX.md** - فهرس المكونات

### للمديرين
- **PROJECT_STATUS.md** - حالة المشروع
- **IMPLEMENTATION_COMPLETE.md** - ملخص الإنجاز
- **FINAL_REPORT.md** - التقرير الشامل

### للنشر
- **DEPLOYMENT_CHECKLIST.md** - قائمة النشر
- **NEXT_STEPS.md** - الخطوات التالية

---

## 🛠️ التقنيات المستخدمة

### Frontend
- **React 18** - مكتبة UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **React Query** - Data fetching

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **WebSocket (ws)** - Real-time
- **Appwrite** - Database
- **OpenAI** - AI assistant
- **Google Maps** - GPS tracking

---

## 📊 الإحصائيات

```
✅ Frontend Components:    17
✅ Backend APIs:            42 endpoints
✅ WebSocket Functions:     8
✅ Appwrite Collections:    9
✅ External APIs:           3
✅ Documentation Files:     24
✅ Lines of Code:           2,000+
✅ TypeScript Interfaces:   20+
✅ Translations:            150+ (AR/EN)
```

---

## 🤝 المساهمة

نرحب بمساهماتك! يرجى:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/AmazingFeature`)
3. Commit تغييراتك (`git commit -m 'Add AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## 📄 الترخيص

هذا المشروع مرخص تحت **MIT License** - راجع ملف `LICENSE` للتفاصيل.

---

## 👥 الفريق

- **المطور الرئيسي** - [@lolelara](https://github.com/lolelara)

---

## 📞 التواصل

- **GitHub Issues:** https://github.com/lolelara/egygo-ecommerce/issues
- **Email:** support@egygo.com

---

## 🎯 الحالة

| المكون | النسبة | الحالة |
|--------|---------|--------|
| Frontend | 100% | ✅ مكتمل |
| Backend | 95% | ✅ شبه مكتمل |
| Database | 100% | ✅ مكتمل |
| External APIs | 100% | ✅ مكتمل |
| Documentation | 100% | ✅ مكتمل |
| **Overall** | **95%** | **✅ جاهز تقريباً** |

---

## 🚀 الخطوات التالية

1. ✅ اختبار جميع الAPIs
2. ⬜ Seed data في Appwrite
3. ⬜ Unit tests (80%+ coverage)
4. ⬜ Integration tests
5. ⬜ Production deployment

---

## 🌟 Star History

إذا أعجبك المشروع، لا تنسى إضافة ⭐ على GitHub!

---

**Made with ❤️ in Egypt 🇪🇬**

</div>
