# 🚀 دليل الاستخدام السريع - Merchant Dashboard

## 📋 ملخص سريع

تم تحويل **Merchant Dashboard** من بيانات وهمية إلى بيانات حقيقية من Appwrite بالكامل! ✅

---

## 🎯 الملفات الجديدة

### 1. `client/lib/merchant-api.ts`
API كامل يحتوي على:
- `getMerchantStats()` - إحصائيات التاجر
- `getMerchantProducts()` - المنتجات مع الإحصائيات
- `getMerchantOrders()` - الطلبات
- `getMerchantProduct()` - تفاصيل منتج واحد

### 2. `shared/prisma-types.ts` (تم التحديث)
إضافة الأنواع:
- `MerchantStats`
- `MerchantProduct`
- `MerchantOrder`

### 3. `client/pages/MerchantDashboard.tsx` (تم التحديث)
- استبدال Mock Data بـ Real API
- Loading States
- Error Handling
- Smart Alerts
- Empty States

---

## 🔥 الميزات الجديدة

### ✅ بيانات حقيقية من Appwrite
```typescript
// قبل
const merchantStats = {
  totalProducts: 45, // بيانات ثابتة
  ...
};

// بعد
const [merchantStats, setMerchantStats] = useState<MerchantStats | null>(null);
useEffect(() => {
  const stats = await getMerchantStats(user.$id); // بيانات حقيقية
  setMerchantStats(stats);
}, [user]);
```

### ✅ Loading State
```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin" />
      <p>جاري تحميل البيانات...</p>
    </div>
  );
}
```

### ✅ Error Handling
```tsx
if (error) {
  return (
    <Card>
      <CardTitle className="text-destructive">خطأ</CardTitle>
      <Button onClick={() => window.location.reload()}>
        إعادة المحاولة
      </Button>
    </Card>
  );
}
```

### ✅ Smart Alerts (تنبيهات ذكية)
```tsx
{merchantStats.outOfStock > 0 && (
  <Alert variant="warning">
    لديك {merchantStats.outOfStock} منتجات نفذت من المخزون
  </Alert>
)}

{merchantStats.revenueChange > 0 && (
  <Alert variant="success">
    مبيعاتك زادت بنسبة {merchantStats.revenueChange}%
  </Alert>
)}
```

---

## 📊 الإحصائيات المتاحة

### MerchantStats:
```typescript
{
  totalProducts: number;       // إجمالي المنتجات
  activeProducts: number;       // المنتجات النشطة
  outOfStock: number;          // نفذت من المخزون
  totalSales: number;          // إجمالي المبيعات
  totalRevenue: number;        // إجمالي الإيرادات
  revenueChange: number;       // نسبة التغيير (%)
  pendingOrders: number;       // طلبات معلقة
  completedOrders: number;     // طلبات مكتملة
  avgRating: number;           // متوسط التقييم
  totalReviews: number;        // إجمالي التقييمات
}
```

### MerchantProduct:
```typescript
{
  id: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  sales: number;               // المبيعات
  revenue: number;             // الإيرادات
  views: number;               // المشاهدات
  rating: number;              // التقييم
  status: 'active' | 'out_of_stock' | 'draft';
}
```

### MerchantOrder:
```typescript
{
  id: string;
  orderId: string;
  product: string;
  customer: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}
```

---

## 🧪 كيفية الاختبار

### 1. تشغيل المشروع:
```bash
pnpm dev
```

### 2. تسجيل الدخول كـ Merchant:
```
URL: http://localhost:5173/login
Email: merchant@egygo.me
Password: merchant123
```

### 3. افتح Dashboard:
```
URL: http://localhost:5173/merchant/dashboard
```

### 4. تحقق من:
- ✅ Loading spinner يظهر عند التحميل
- ✅ البيانات تظهر من Appwrite
- ✅ الإحصائيات صحيحة
- ✅ المنتجات تعرض المبيعات والإيرادات
- ✅ الطلبات الأخيرة تظهر
- ✅ التنبيهات تظهر حسب البيانات
- ✅ Empty states تظهر إذا لم يكن هناك بيانات

---

## 🔧 API Usage

### استخدام مباشر:
```typescript
import { 
  getMerchantStats, 
  getMerchantProducts, 
  getMerchantOrders 
} from '@/lib/merchant-api';

// الحصول على الإحصائيات
const stats = await getMerchantStats(userId);
console.log(stats.totalRevenue); // 18560

// الحصول على المنتجات
const products = await getMerchantProducts(userId);
console.log(products[0].sales); // 67

// الحصول على الطلبات
const orders = await getMerchantOrders(userId);
console.log(orders[0].status); // 'pending'
```

### في Component:
```typescript
import { getMerchantStats } from '@/lib/merchant-api';

function MyComponent() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      const data = await getMerchantStats(user.$id);
      setStats(data);
    };
    fetchStats();
  }, [user]);
  
  return (
    <div>
      <h1>Total Products: {stats?.totalProducts}</h1>
      <h2>Revenue: ${stats?.totalRevenue}</h2>
    </div>
  );
}
```

---

## 🎨 UI Components المستخدمة

### Shadcn/ui:
- ✅ Card, CardHeader, CardContent
- ✅ Badge (مع variants مختلفة)
- ✅ Button
- ✅ Progress
- ✅ Loader2 (spinner)

### Lucide Icons:
- ✅ Package, ShoppingCart, DollarSign
- ✅ TrendingUp, TrendingDown
- ✅ Star, Eye, AlertCircle
- ✅ Edit, Plus, BarChart3

---

## 📈 Performance Optimizations

### 1. Parallel API Calls:
```typescript
const [stats, products, orders] = await Promise.all([
  getMerchantStats(user.$id),
  getMerchantProducts(user.$id),
  getMerchantOrders(user.$id)
]);
```

### 2. Query Limits:
```typescript
Query.limit(1000) // حد أقصى للبيانات
```

### 3. Efficient Filtering:
```typescript
Query.equal('merchantId', userId)
Query.greaterThan('$createdAt', date)
```

---

## 🐛 Troubleshooting

### المشكلة: لا تظهر البيانات
**الحل:**
1. تأكد من أن المستخدم merchant
2. تأكد من وجود منتجات في Database
3. افتح Console وتحقق من الأخطاء

### المشكلة: Loading لا ينتهي
**الحل:**
1. تحقق من اتصال Appwrite
2. تحقق من الأذونات (Permissions)
3. راجع Console للأخطاء

### المشكلة: Error في API
**الحل:**
1. تحقق من `DATABASE_ID` في appwrite.ts
2. تحقق من `COLLECTIONS` names
3. تحقق من أن Collections موجودة في Appwrite

---

## 🎯 المتطلبات

### Appwrite Collections:
- ✅ products (مع merchantId attribute)
- ✅ orderItems
- ✅ orders
- ✅ reviews
- ✅ users

### Permissions:
التاجر يحتاج صلاحيات قراءة على:
- منتجاته (`merchantId` matching)
- الطلبات المرتبطة بمنتجاته
- التقييمات لمنتجاته
- بيانات العملاء الأساسية

---

## 📚 الملفات للمراجعة

1. **`MERCHANT_DASHBOARD_IMPLEMENTATION.md`**
   - توثيق تفصيلي كامل
   - شرح كل function
   - أمثلة على الاستخدام

2. **`MERCHANT_DASHBOARD_SUMMARY.md`**
   - ملخص سريع
   - قائمة الميزات
   - خطوات الاختبار

3. **`client/lib/merchant-api.ts`**
   - الكود الكامل
   - التعليقات بالعربي
   - Error handling

4. **`client/pages/MerchantDashboard.tsx`**
   - Dashboard UI
   - State management
   - Loading & Error states

---

## ✅ Checklist

- [x] إنشاء Merchant API
- [x] تحديث MerchantDashboard
- [x] إضافة TypeScript types
- [x] Loading states
- [x] Error handling
- [x] Dynamic alerts
- [x] Empty states
- [x] Documentation
- [x] Testing

---

## 🚀 الخطوات القادمة

راجع `NEXT_IMPROVEMENTS.md` للمراحل التالية:

### أولوية عالية:
1. [ ] إكمال Admin APIs
2. [ ] تحسين صفحة تفاصيل المنتج
3. [ ] نظام التقييمات الكامل

### أولوية متوسطة:
1. [ ] تحسين Checkout Flow
2. [ ] تحسين My Orders
3. [x] ✅ Merchant Dashboard (مكتمل!)

---

**تم بنجاح!** 🎉

الآن جرب Dashboard وتأكد من أن كل شيء يعمل بشكل صحيح!

```bash
pnpm dev
```

ثم افتح: `http://localhost:5173/merchant/dashboard`
