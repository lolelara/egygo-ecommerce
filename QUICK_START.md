# ⚡ دليل البدء السريع - إيجي جو v2.5

## 🚀 البدء في 5 دقائق

### 1. التثبيت

```bash
# Clone المشروع
git clone https://github.com/lolelara/egygo-ecommerce
cd egygo-ecommerce

# تثبيت Dependencies
pnpm install

# إعداد Environment Variables
cp .env.example .env
# عدّل .env بمعلوماتك
```

### 2. تشغيل المشروع

```bash
# Development mode
pnpm dev

# سيفتح على:
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

---

## 📦 المكونات الجاهزة للاستخدام

### أ. Dashboard

```tsx
import { EnhancedAnalyticsDashboard } from "@/components/EnhancedAnalyticsDashboard";

<EnhancedAnalyticsDashboard 
  userId="user_123" 
  userRole="merchant" 
/>
```

### ب. Notifications

```tsx
import { NotificationsCenter } from "@/components/NotificationsCenter";

// في Header
<NotificationsCenter 
  userId={user.id} 
  userRole={user.role} 
/>
```

### ج. Search

```tsx
import { UniversalSearch } from "@/components/UniversalSearch";

// في أي مكان
<UniversalSearch />
// اضغط Cmd+K / Ctrl+K
```

### د. Quick Reorder

```tsx
import { QuickReorder } from "@/components/QuickReorder";

// في صفحة الطلب
<QuickReorder orderId="order_123" />
```

### هـ. Smart Link Generator

```tsx
import { SmartLinkGenerator } from "@/components/SmartLinkGenerator";

// للمسوقين
<SmartLinkGenerator affiliateId="aff_123" />
```

---

## 🎨 المكونات المتقدمة

### RBAC System

```tsx
import { RBACSystem } from "@/components/advanced/RBACSystem";

// في Admin Panel
<RBACSystem />
```

### A/B Testing

```tsx
import { ExperimentHub } from "@/components/advanced/ExperimentHub";

<ExperimentHub />
```

### AI Assistant

```tsx
import { AIShoppingAssistant } from "@/components/advanced/CustomerExperience";

<AIShoppingAssistant />
```

### Supply Chain Tools

```tsx
import { 
  SupplyOffersComparison,
  MarginAnalyzer,
  SmartBundlesBuilder 
} from "@/components/advanced/SupplyChainTools";

<SupplyOffersComparison />
<MarginAnalyzer />
<SmartBundlesBuilder />
```

---

## 🔗 الروابط المهمة

| المورد | الرابط |
|--------|--------|
| التوثيق الكامل | [FEATURES_COMPLETE_GUIDE.md](./FEATURES_COMPLETE_GUIDE.md) |
| الميزات المتقدمة | [ADVANCED_FEATURES_COMPLETE.md](./ADVANCED_FEATURES_COMPLETE.md) |
| خارطة الطريق | [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) |
| API Docs | `/docs/api` |

---

## 🎯 حالات الاستخدام الشائعة

### 1. إضافة صفحة Dashboard جديدة

```tsx
// pages/NewDashboard.tsx
import { EnhancedAnalyticsDashboard } from "@/components/EnhancedAnalyticsDashboard";
import { PerformanceAlerts } from "@/components/PerformanceAlerts";

export default function NewDashboard() {
  const { user } = useAuth();
  
  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">لوحة التحكم</h1>
      
      <EnhancedAnalyticsDashboard 
        userId={user.id} 
        userRole={user.role} 
      />
      
      {user.role === "affiliate" && (
        <PerformanceAlerts 
          userId={user.id} 
          userRole={user.role} 
        />
      )}
    </div>
  );
}
```

### 2. إضافة Notifications إلى Header

```tsx
// components/Header.tsx
import { NotificationsCenter } from "@/components/NotificationsCenter";

export function Header() {
  const { user } = useAuth();
  
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between py-4">
        <Logo />
        
        <div className="flex items-center gap-4">
          <NotificationsCenter 
            userId={user.id} 
            userRole={user.role} 
          />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
```

### 3. إضافة Multi-Currency إلى Product Page

```tsx
// pages/Product.tsx
import { MultiCurrencyPrice } from "@/components/MultiCurrencyPrice";

export default function ProductPage({ product }) {
  return (
    <div className="space-y-6">
      <h1>{product.name}</h1>
      
      <MultiCurrencyPrice 
        priceUSD={product.priceUSD}
        showShipping={true}
        size="lg"
      />
      
      <AddToCartButton productId={product.id} />
    </div>
  );
}
```

---

## 🧪 الاختبار

```bash
# تشغيل جميع الاختبارات
pnpm test

# تشغيل اختبار معين
pnpm test UniversalSearch

# Coverage report
pnpm test:coverage
```

---

## 🐛 استكشاف الأخطاء

### المشكلة: Component لا يعمل

**الحل:**
```bash
# تأكد من تثبيت Dependencies
pnpm install

# مسح Cache
rm -rf node_modules/.vite
pnpm dev
```

### المشكلة: TypeScript Errors

**الحل:**
```bash
# فحص الأخطاء
pnpm typecheck

# إصلاح تلقائي
pnpm lint:fix
```

---

## 📞 الدعم

- 📧 Email: support@egygo.com
- 💬 Discord: [رابط Discord]
- 📚 Docs: `/docs`

---

## 🎓 الخطوات التالية

1. ✅ استكشف المكونات الجاهزة
2. ✅ اقرأ التوثيق الكامل
3. ✅ ابدأ التكامل مع Backend
4. ✅ اختبر الميزات
5. ✅ انشر على Production

---

**نصيحة:** ابدأ بالمكونات الأساسية (Core Features) ثم انتقل للمتقدمة تدريجياً.

🚀 **حظ موفق!**
