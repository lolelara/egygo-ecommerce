# 📦 فهرس المكونات الشامل - إيجي جو

## 🗂️ تصنيف المكونات

### 1️⃣ Core Features Components

| Component | الموقع | الوصف | Props |
|-----------|--------|-------|-------|
| **UniversalSearch** | `components/UniversalSearch.tsx` | بحث شامل Cmd+K | - |
| **EnhancedAnalyticsDashboard** | `components/EnhancedAnalyticsDashboard.tsx` | لوحة إحصائيات متقدمة | `userId, userRole` |
| **PerformanceAlerts** | `components/PerformanceAlerts.tsx` | تنبيهات أداء للمسوقين | `userId, userRole` |
| **SmartLinkGenerator** | `components/SmartLinkGenerator.tsx` | مولد روابط ذكي | `affiliateId` |
| **NotificationsCenter** | `components/NotificationsCenter.tsx` | مركز إشعارات موحد | `userId, userRole` |
| **QuickReorder** | `components/QuickReorder.tsx` | إعادة طلب سريع | `orderId, orderItems?` |
| **AutoReorderSubscription** | `components/QuickReorder.tsx` | اشتراك تلقائي | `productId, productName, productPrice, productImage?` |
| **FrequentlyPurchased** | `components/QuickReorder.tsx` | منتجات متكررة | `userId` |
| **InventoryAlerts** | `components/InventoryAlerts.tsx` | تنبيهات مخزون | `merchantId` |
| **LoyaltyBadge** | `components/LoyaltyBadges.tsx` | شارة ولاء | `tier, size?, showLabel?` |
| **LoyaltyDashboard** | `components/LoyaltyBadges.tsx` | لوحة برنامج الولاء | `userId` |
| **MultiCurrencyPrice** | `components/MultiCurrencyPrice.tsx` | أسعار متعددة العملات | `priceUSD, showShipping?, size?, onCurrencyChange?` |
| **CompactCurrencyPrice** | `components/MultiCurrencyPrice.tsx` | سعر مدمج | `priceUSD` |
| **EnhancedProductEditor** | `components/EnhancedProductEditor.tsx` | محرر منتجات متقدم | `productId?, onSave?` |

---

### 2️⃣ Advanced Admin Components

| Component | الموقع | الوصف | Props |
|-----------|--------|-------|-------|
| **RBACSystem** | `advanced/RBACSystem.tsx` | نظام الصلاحيات + Audit Logs | - |
| **SmartContracts** | `advanced/SmartContracts.tsx` | عقود ذكية للمسوقين/التجار | - |
| **CustomerExperienceCenter** | `advanced/SmartContracts.tsx` | مركز تجربة العميل (VoC/NPS/CSAT) | - |

---

### 3️⃣ Experiment & Testing Components

| Component | الموقع | الوصف | Props |
|-----------|--------|-------|-------|
| **ExperimentHub** | `advanced/ExperimentHub.tsx` | مختبر التجارب A/B | - |
| **NextBestOffer** | `advanced/ExperimentHub.tsx` | محرك العرض الأفضل | `userId` |
| **MultiChannelCampaigns** | `advanced/ExperimentHub.tsx` | حملات متعددة القنوات | - |

---

### 4️⃣ Supply Chain & Pricing Components

| Component | الموقع | الوصف | Props |
|-----------|--------|-------|-------|
| **SupplyOffersComparison** | `advanced/SupplyChainTools.tsx` | مقارنة عروض الموردين | - |
| **MarginAnalyzer** | `advanced/SupplyChainTools.tsx` | محلل الهوامش | - |
| **SmartBundlesBuilder** | `advanced/SupplyChainTools.tsx` | بناء حزم ذكية | - |
| **PriceSimulator** | `advanced/SupplyChainTools.tsx` | محاكي الأسعار | - |

---

### 5️⃣ Customer Experience Components

| Component | الموقع | الوصف | Props |
|-----------|--------|-------|-------|
| **AIShoppingAssistant** | `advanced/CustomerExperience.tsx` | مساعد تسوق ذكي | - |
| **ARProductViewer** | `advanced/CustomerExperience.tsx` | عرض الواقع المعزز | `productId` |
| **FamilyAccounts** | `advanced/CustomerExperience.tsx` | حسابات عائلية | - |
| **LiveShipmentTracking** | `advanced/CustomerExperience.tsx` | تتبع شحن مباشر | `orderId` |

---

## 🎯 أمثلة الاستخدام

### مثال 1: Dashboard كامل

```tsx
import { EnhancedAnalyticsDashboard } from "@/components/EnhancedAnalyticsDashboard";
import { PerformanceAlerts } from "@/components/PerformanceAlerts";
import { NotificationsCenter } from "@/components/NotificationsCenter";

export default function Dashboard() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      {/* Analytics */}
      <EnhancedAnalyticsDashboard 
        userId={user.id} 
        userRole={user.role} 
      />
      
      {/* Alerts للمسوقين فقط */}
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

### مثال 2: Header مع Notifications

```tsx
import { NotificationsCenter } from "@/components/NotificationsCenter";
import { UniversalSearch } from "@/components/UniversalSearch";

export function Header() {
  const { user } = useAuth();
  
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between">
        <Logo />
        <UniversalSearch />
        <div className="flex gap-2">
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

### مثال 3: Product Page متقدمة

```tsx
import { MultiCurrencyPrice } from "@/components/MultiCurrencyPrice";
import { ARProductViewer, AIShoppingAssistant } from "@/components/advanced/CustomerExperience";
import { AutoReorderSubscription } from "@/components/QuickReorder";

export default function ProductPage({ product }) {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* AR Viewer */}
      <ARProductViewer productId={product.id} />
      
      {/* Product Info */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        
        {/* Multi-Currency Price */}
        <MultiCurrencyPrice 
          priceUSD={product.priceUSD}
          showShipping={true}
          size="lg"
        />
        
        <AddToCartButton />
        
        {/* Auto-Reorder */}
        <AutoReorderSubscription 
          productId={product.id}
          productName={product.name}
          productPrice={product.price}
        />
      </div>
      
      {/* AI Assistant */}
      <div className="lg:col-span-2">
        <AIShoppingAssistant />
      </div>
    </div>
  );
}
```

### مثال 4: Merchant Dashboard

```tsx
import { InventoryAlerts } from "@/components/InventoryAlerts";
import { EnhancedProductEditor } from "@/components/EnhancedProductEditor";
import { SupplyOffersComparison, MarginAnalyzer } from "@/components/advanced/SupplyChainTools";

export default function MerchantDashboard() {
  const { user } = useAuth();
  
  return (
    <Tabs defaultValue="inventory">
      <TabsList>
        <TabsTrigger value="inventory">المخزون</TabsTrigger>
        <TabsTrigger value="products">المنتجات</TabsTrigger>
        <TabsTrigger value="pricing">التسعير</TabsTrigger>
      </TabsList>
      
      <TabsContent value="inventory">
        <InventoryAlerts merchantId={user.id} />
      </TabsContent>
      
      <TabsContent value="products">
        <EnhancedProductEditor 
          onSave={(data) => console.log(data)} 
        />
      </TabsContent>
      
      <TabsContent value="pricing" className="space-y-6">
        <SupplyOffersComparison />
        <MarginAnalyzer />
      </TabsContent>
    </Tabs>
  );
}
```

### مثال 5: Admin Panel

```tsx
import { RBACSystem } from "@/components/advanced/RBACSystem";
import { SmartContracts } from "@/components/advanced/SmartContracts";
import { ExperimentHub } from "@/components/advanced/ExperimentHub";

export default function AdminPanel() {
  return (
    <Tabs defaultValue="rbac">
      <TabsList>
        <TabsTrigger value="rbac">الصلاحيات</TabsTrigger>
        <TabsTrigger value="contracts">العقود</TabsTrigger>
        <TabsTrigger value="experiments">التجارب</TabsTrigger>
      </TabsList>
      
      <TabsContent value="rbac">
        <RBACSystem />
      </TabsContent>
      
      <TabsContent value="contracts">
        <SmartContracts />
      </TabsContent>
      
      <TabsContent value="experiments">
        <ExperimentHub />
      </TabsContent>
    </Tabs>
  );
}
```

---

## 🎨 Props Types Reference

### EnhancedAnalyticsDashboard

```typescript
interface Props {
  userId: string;
  userRole: "customer" | "affiliate" | "merchant" | "admin";
}
```

### MultiCurrencyPrice

```typescript
interface Props {
  priceUSD: number;
  showShipping?: boolean;
  size?: "sm" | "md" | "lg";
  onCurrencyChange?: (currency: Currency) => void;
}
```

### LoyaltyBadge

```typescript
interface Props {
  tier: "silver" | "gold" | "platinum";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}
```

### AutoReorderSubscription

```typescript
interface Props {
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
}
```

---

## 🔧 Utility Functions

### استيراد مجموعة كاملة

```typescript
// Core Features
export * from "@/components/UniversalSearch";
export * from "@/components/EnhancedAnalyticsDashboard";
export * from "@/components/NotificationsCenter";

// Advanced Features
export * from "@/components/advanced/RBACSystem";
export * from "@/components/advanced/ExperimentHub";
export * from "@/components/advanced/CustomerExperience";
```

---

## 📚 الموارد الإضافية

- [FEATURES_COMPLETE_GUIDE.md](./FEATURES_COMPLETE_GUIDE.md) - دليل الميزات الكامل
- [ADVANCED_FEATURES_COMPLETE.md](./ADVANCED_FEATURES_COMPLETE.md) - الميزات المتقدمة
- [QUICK_START.md](./QUICK_START.md) - البدء السريع

---

**آخر تحديث:** أكتوبر 2025  
**الإصدار:** 2.5.0
