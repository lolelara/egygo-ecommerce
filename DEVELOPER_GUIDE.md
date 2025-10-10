# 👨‍💻 دليل المطورين - EgyGo

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- pnpm 8+
- Git

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/lolelara/egygo-ecommerce.git
cd egygo-main

# تثبيت الحزم
pnpm install

# نسخ ملف البيئة
cp .env.example .env

# تشغيل المشروع
pnpm dev
```

---

## 📦 الحزم المثبتة

### Core
- `react` ^18.3.1
- `react-dom` ^18.3.1
- `typescript` ^5.6.3
- `vite` ^6.0.11

### UI & Styling
- `tailwindcss` ^3.4.17
- `@radix-ui/*` - مكونات UI
- `lucide-react` - الأيقونات
- `clsx` + `tailwind-merge` - إدارة الـ classes

### Animation & 3D
- `gsap` - الأنيميشن
- `three` + `three-stdlib` - الرسومات 3D
- `@react-three/fiber` - Three.js في React
- `swiper` - السلايدرات

### Charts & Visualization
- `recharts` - الرسوم البيانية
- `qrcode` - توليد QR Codes

### Forms & Validation
- `react-hook-form` - إدارة النماذج
- `zod` - التحقق من البيانات

### Backend & API
- `appwrite` - قاعدة البيانات والمصادقة
- `express` - خادم API
- `helmet` - الأمان
- `express-rate-limit` - تحديد المعدل

### Utilities
- `date-fns` - التعامل مع التواريخ
- `sonner` - الإشعارات (Toast)

---

## 🏗️ بنية الكود

### إضافة صفحة جديدة

```tsx
// 1. إنشاء الصفحة
// client/pages/MyNewPage.tsx
import { useAuth } from '@/contexts/AppwriteAuthContext';

export default function MyNewPage() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-6">
      <h1>صفحتي الجديدة</h1>
    </div>
  );
}

// 2. إضافة Lazy Loading
// client/lib/lazy-routes.tsx
export const MyNewPage = lazyLoad(() => import('@/pages/MyNewPage'));

// 3. إضافة Route
// client/App.tsx
import { MyNewPage } from '@/lib/lazy-routes';

<Route path="/my-page" element={<MyNewPage />} />
```

### إضافة مكون جديد

```tsx
// client/components/MyComponent.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onAction}>إجراء</Button>
      </CardContent>
    </Card>
  );
}
```

### إضافة صلاحية جديدة

```typescript
// client/lib/permissions.ts

// 1. إضافة الصلاحية للـ enum
export enum Permission {
  // ... existing permissions
  MY_NEW_PERMISSION = 'my_new_permission',
}

// 2. إضافتها للأدوار المناسبة
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.MERCHANT]: [
    // ... existing permissions
    Permission.MY_NEW_PERMISSION,
  ],
};

// 3. استخدامها في المكونات
import { hasPermission, Permission } from '@/lib/permissions';

if (hasPermission(user.role, Permission.MY_NEW_PERMISSION)) {
  // السماح بالإجراء
}
```

### حماية صفحة بالصلاحيات

```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Permission } from '@/lib/permissions';

<Route 
  path="/merchant/inventory" 
  element={
    <ProtectedRoute 
      requiredRole="merchant"
      requiredPermission={Permission.MANAGE_INVENTORY}
    >
      <InventoryManager />
    </ProtectedRoute>
  } 
/>
```

---

## 🎨 التصميم والـ UI

### استخدام TailwindCSS

```tsx
// الألوان الأساسية
<div className="bg-purple-600 text-white">
  محتوى بنفسجي
</div>

// Gradients
<div className="bg-gradient-to-r from-purple-600 to-pink-600">
  تدرج جميل
</div>

// Dark Mode
<div className="bg-white dark:bg-neutral-900">
  يتغير حسب الوضع
</div>

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  شبكة متجاوبة
</div>
```

### استخدام مكونات Shadcn/ui

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';

// Button variants
<Button variant="default">افتراضي</Button>
<Button variant="destructive">حذف</Button>
<Button variant="outline">محدد</Button>
<Button variant="ghost">شفاف</Button>

// Button sizes
<Button size="sm">صغير</Button>
<Button size="default">عادي</Button>
<Button size="lg">كبير</Button>
```

### إضافة أنيميشن GSAP

```tsx
import { GSAPAnimation } from '@/components/enhanced/GSAPAnimations';

<GSAPAnimation animation="fadeIn" duration={1}>
  <div>محتوى يظهر تدريجياً</div>
</GSAPAnimation>

<GSAPAnimation animation="slideUp" delay={0.2}>
  <div>محتوى ينزلق للأعلى</div>
</GSAPAnimation>
```

---

## 📊 الرسوم البيانية

### استخدام Recharts

```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: '1 يناير', sales: 450 },
  { date: '2 يناير', sales: 680 },
  { date: '3 يناير', sales: 520 },
];

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="date" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line 
      type="monotone" 
      dataKey="sales" 
      stroke="#8b5cf6" 
      strokeWidth={2}
      name="المبيعات"
    />
  </LineChart>
</ResponsiveContainer>
```

---

## 🔐 الأمان

### تنظيف المدخلات

```typescript
import { XSSProtection, InputValidator } from '@/lib/security';

// تنظيف HTML
const clean = XSSProtection.sanitizeHTML(userInput);

// التحقق من البريد
if (InputValidator.isValidEmail(email)) {
  // البريد صحيح
}

// التحقق من كلمة المرور
const { isValid, errors } = InputValidator.validatePassword(password);
if (!isValid) {
  console.log(errors); // قائمة الأخطاء
}
```

### CSRF Protection

```typescript
import { CSRFProtection } from '@/lib/security';

// إضافة Token للطلبات
const headers = CSRFProtection.addTokenToHeaders({
  'Content-Type': 'application/json'
});

fetch('/api/endpoint', {
  method: 'POST',
  headers,
  body: JSON.stringify(data)
});
```

### Rate Limiting

```typescript
import { RateLimiter } from '@/lib/security';

// فحص الحد الأقصى
if (RateLimiter.isAllowed('api-call', 10, 60000)) {
  // السماح بالطلب (10 طلبات في الدقيقة)
  makeAPICall();
} else {
  toast.error('تجاوزت الحد الأقصى للطلبات');
}
```

---

## ⚡ تحسين الأداء

### Lazy Loading للصور

```tsx
import { LazyImage } from '@/components/LazyImage';

<LazyImage
  src="/images/product.jpg"
  alt="منتج"
  className="w-full h-auto"
  loading="lazy"
/>
```

### Preload للموارد

```typescript
import { ResourcePreloader } from '@/lib/performance';

// تحميل مسبق للصور
ResourcePreloader.preloadImages([
  '/images/hero.jpg',
  '/images/banner.jpg'
]);

// تحميل مسبق للـ CSS
ResourcePreloader.preloadCSS('/styles/critical.css');
```

### Code Splitting

```typescript
import { CodeSplitter } from '@/lib/performance';

// تحميل جزء عند الحاجة
const module = await CodeSplitter.loadChunk(
  'admin-panel',
  () => import('./admin')
);
```

---

## 🧪 الاختبار

### Unit Tests مع Vitest

```typescript
// MyComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### تشغيل الاختبارات

```bash
# تشغيل جميع الاختبارات
pnpm test

# تشغيل مع Coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

---

## 🗄️ قاعدة البيانات (Appwrite)

### إنشاء Collection جديد

```typescript
// في Appwrite Console
1. Database > Create Collection
2. اسم: my_collection
3. Permissions: Document Security
4. Attributes:
   - name (string, required)
   - value (integer)
   - createdAt (datetime)
```

### استخدام Collection

```typescript
import { databases, appwriteConfig } from '@/lib/appwrite';

// إنشاء مستند
const doc = await databases.createDocument(
  appwriteConfig.databaseId,
  'my_collection_id',
  'unique()',
  {
    name: 'Test',
    value: 100,
    createdAt: new Date().toISOString()
  }
);

// قراءة المستندات
const docs = await databases.listDocuments(
  appwriteConfig.databaseId,
  'my_collection_id'
);

// تحديث مستند
await databases.updateDocument(
  appwriteConfig.databaseId,
  'my_collection_id',
  doc.$id,
  { value: 200 }
);

// حذف مستند
await databases.deleteDocument(
  appwriteConfig.databaseId,
  'my_collection_id',
  doc.$id
);
```

---

## 🔄 Git Workflow

### Commit Messages

```bash
# Features
git commit -m "✨ إضافة مولد الروابط للمسوقين"

# Fixes
git commit -m "🐛 إصلاح مشكلة عرض المخزون"

# Performance
git commit -m "⚡ تحسين سرعة تحميل الصفحة الرئيسية"

# Security
git commit -m "🔐 إضافة CSRF protection"

# Docs
git commit -m "📝 تحديث دليل المطورين"

# Style
git commit -m "💄 تحسين تصميم لوحة التحكم"

# Refactor
git commit -m "♻️ إعادة هيكلة نظام الصلاحيات"
```

### Branching Strategy

```bash
# Feature branch
git checkout -b feature/link-generator
# ... work ...
git commit -m "✨ إضافة مولد الروابط"
git push origin feature/link-generator

# Bugfix branch
git checkout -b fix/inventory-display
# ... work ...
git commit -m "🐛 إصلاح عرض المخزون"
git push origin fix/inventory-display

# Merge to main
git checkout main
git merge feature/link-generator
git push origin main
```

---

## 📝 أوامر مفيدة

```bash
# Development
pnpm dev              # تشغيل المشروع
pnpm build            # بناء للإنتاج
pnpm preview          # معاينة البناء

# Quality
pnpm typecheck        # فحص TypeScript
pnpm lint             # فحص ESLint
pnpm format           # تنسيق الكود

# Testing
pnpm test             # تشغيل الاختبارات
pnpm test:ui          # واجهة الاختبارات

# Dependencies
pnpm add <package>    # إضافة حزمة
pnpm remove <package> # حذف حزمة
pnpm update           # تحديث الحزم
```

---

## 🐛 حل المشاكل الشائعة

### مشكلة: TypeScript errors

```bash
# حذف الـ cache وإعادة التثبيت
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
pnpm typecheck
```

### مشكلة: Port already in use

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

### مشكلة: Appwrite connection

```typescript
// تحقق من .env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id

// تحقق من الاتصال
import { client } from '@/lib/appwrite';
console.log(client.config);
```

---

## 📚 موارد إضافية

### التوثيق
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [TailwindCSS](https://tailwindcss.com)
- [Appwrite](https://appwrite.io/docs)
- [Recharts](https://recharts.org)
- [GSAP](https://greensock.com/docs)

### الأدوات
- [VS Code](https://code.visualstudio.com)
- [Postman](https://www.postman.com) - اختبار API
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Appwrite Console](https://cloud.appwrite.io)

---

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء Feature Branch
3. Commit التغييرات
4. Push للـ Branch
5. فتح Pull Request

---

## 📞 الدعم الفني

- 📧 Email: dev@egygo.me
- 💬 Discord: [EgyGo Developers](https://discord.gg/egygo)
- 📖 Docs: [docs.egygo.me](https://docs.egygo.me)

---

**Happy Coding! 🚀**
