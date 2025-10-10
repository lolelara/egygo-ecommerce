# 📋 دليل نظام الحسابات المعلقة - EgyGo

## 🎯 نظرة عامة

نظام شامل لمراجعة والموافقة على حسابات التجار والمسوقين الجدد قبل منحهم الوصول الكامل للوحات التحكم.

---

## 🔄 كيف يعمل النظام؟

### 1️⃣ **التسجيل (للتاجر/المسوق)**

#### الخطوات:
1. المستخدم يفتح صفحة التسجيل:
   - `/register?type=merchant` للتجار
   - `/register?type=affiliate` للمسوقين

2. يملأ البيانات:
   - الاسم
   - البريد الإلكتروني
   - رقم الهاتف (مطلوب)
   - رقم بديل (اختياري)
   - كلمة المرور

3. عند الضغط على "إنشاء حساب":
   ```typescript
   // يتم إنشاء الحساب في Appwrite Auth
   await register(email, password, name, accountType, phone, alternativePhone);
   
   // يتم حفظ البيانات في users collection:
   {
     email: "user@example.com",
     name: "اسم المستخدم",
     phone: "01234567890",
     alternativePhone: "01098765432",
     isAffiliate: true,  // أو isMerchant: true
     affiliateCode: "AFF123ABC",  // يتم توليده تلقائياً
     commissionRate: 0.15,  // 15% عمولة افتراضية
     accountStatus: "pending",  // ⭐ الحالة: معلق
     isActive: false,  // غير نشط حتى الموافقة
     approvedAt: null
   }
   ```

4. يرى رسالة:
   ```
   ⏳ حسابك قيد المراجعة من قبل الإدارة
   📧 سيتم إخطارك عبر البريد الإلكتروني فور الموافقة
   ⚠️ لن تتمكن من الوصول لكامل المميزات حتى تتم الموافقة
   ```

5. يتم إنشاء إشعار ترحيبي:
   ```
   👋 مرحباً بك في إيجي جو
   ⏳ تم استلام طلبك وجاري المراجعة
   ```

---

### 2️⃣ **المراجعة (للأدمن)**

#### الوصول:
1. المدير يسجل دخول
2. يرى في القائمة الجانبية: **"الحسابات المعلقة"**
3. إذا كان هناك حسابات معلقة، يظهر badge أحمر بالعدد

#### الواجهة:
```
📊 الإحصائيات:
- إجمالي الحسابات المعلقة: 5
- التجار: 3
- المسوقين: 2

🔍 البحث والفلترة:
- بحث بالاسم/البريد/الهاتف
- فلترة: الكل | التجار | المسوقين

📋 الجدول:
┌─────────────┬──────────────────┬──────────────┬────────────┬──────────┐
│ المستخدم    │ البريد           │ الهاتف       │ النوع      │ الإجراءات│
├─────────────┼──────────────────┼──────────────┼────────────┼──────────┤
│ أحمد محمد   │ ahmed@mail.com   │ 01234567890  │ 🏪 تاجر   │ ✅ ❌ 👁️ │
│ سارة علي    │ sara@mail.com    │ 01098765432  │ 💰 مسوق   │ ✅ ❌ 👁️ │
└─────────────┴──────────────────┴──────────────┴────────────┴──────────┘
```

#### الإجراءات:
- ✅ **موافقة**: قبول الحساب
- ❌ **رفض**: رفض الحساب مع ذكر السبب
- 👁️ **تفاصيل**: عرض معلومات كاملة
- 💬 **WhatsApp**: التواصل المباشر

---

### 3️⃣ **الموافقة**

عند الضغط على ✅ **موافقة**:

```typescript
// 1. تحديث حالة الحساب
await databases.updateDocument(
  appwriteConfig.databaseId,
  appwriteConfig.collections.users,
  userId,
  {
    accountStatus: 'approved',  // ✅ تمت الموافقة
    approvedAt: new Date().toISOString(),
    approvedBy: adminId,
    isActive: true  // الحساب نشط الآن
  }
);

// 2. إنشاء إشعار للمستخدم
await databases.createDocument(
  appwriteConfig.databaseId,
  appwriteConfig.collections.notifications,
  'unique()',
  {
    userId: userId,
    title: '🎉 تمت الموافقة على حسابك',
    message: 'مرحباً بك! تم قبول حسابك ويمكنك الآن الاستفادة من جميع المميزات',
    type: 'account_approved',
    isRead: false,
    link: '/dashboard'
  }
);

// 3. إرسال بريد إلكتروني (TODO)
// await sendApprovalEmail(userId);
```

**النتيجة:**
- ✅ الحساب يصبح نشط
- ✅ المستخدم يمكنه الوصول للوحة التحكم
- ✅ يتلقى إشعار بالموافقة
- ✅ يختفي من قائمة الحسابات المعلقة

---

### 4️⃣ **الرفض**

عند الضغط على ❌ **رفض**:

1. يظهر نافذة لإدخال سبب الرفض (مطلوب)
2. عند التأكيد:

```typescript
// 1. تحديث حالة الحساب
await databases.updateDocument(
  appwriteConfig.databaseId,
  appwriteConfig.collections.users,
  userId,
  {
    accountStatus: 'rejected',  // ❌ تم الرفض
    rejectionReason: 'السبب...',
    isActive: false
  }
);

// 2. إنشاء إشعار للمستخدم
await databases.createDocument(
  appwriteConfig.databaseId,
  appwriteConfig.collections.notifications,
  'unique()',
  {
    userId: userId,
    title: 'تحديث حول طلب حسابك',
    message: `عذراً، لم يتم قبول حسابك. السبب: ${rejectionReason}`,
    type: 'account_rejected',
    isRead: false
  }
);

// 3. إرسال بريد إلكتروني (TODO)
// await sendRejectionEmail(userId, rejectionReason);
```

**النتيجة:**
- ❌ الحساب مرفوض
- ❌ لا يمكن الوصول للوحة التحكم
- 📧 يتلقى إشعار بالرفض مع السبب
- ✅ يختفي من قائمة الحسابات المعلقة

---

## 🔒 الحماية والأمان

### ProtectedRoute Component

يحمي جميع صفحات لوحات التحكم:

```typescript
<Route 
  path="/affiliate/dashboard" 
  element={
    <ProtectedRoute requiredRole="affiliate">
      <AffiliateDashboard />
    </ProtectedRoute>
  } 
/>
```

#### التحققات:
1. **المصادقة**: هل المستخدم مسجل دخول؟
2. **الدور**: هل لديه الدور المطلوب؟
3. **حالة الحساب**: هل تمت الموافقة عليه؟

#### السيناريوهات:

| الحالة | النتيجة |
|--------|---------|
| غير مسجل دخول | إعادة توجيه لـ `/login` |
| دور خاطئ | إعادة توجيه للوحة المناسبة |
| `accountStatus: 'pending'` | عرض شاشة "حسابك قيد المراجعة" |
| `accountStatus: 'rejected'` | عرض شاشة "تم رفض حسابك" + السبب |
| `accountStatus: 'approved'` | ✅ الوصول للوحة التحكم |

---

## 📊 الحالات الممكنة

### accountStatus Values:

| القيمة | الوصف | isActive | الوصول |
|--------|-------|----------|--------|
| `pending` | قيد المراجعة | `false` | ❌ محظور |
| `approved` | تمت الموافقة | `true` | ✅ مسموح |
| `rejected` | تم الرفض | `false` | ❌ محظور |

---

## 🗄️ هيكل البيانات

### Users Collection Schema:

```typescript
{
  $id: string,                    // User ID من Appwrite Auth
  email: string,                  // البريد الإلكتروني
  name: string,                   // الاسم
  phone: string,                  // رقم الهاتف
  alternativePhone?: string,      // رقم بديل
  
  // نوع الحساب
  isAffiliate: boolean,           // مسوق؟
  isMerchant: boolean,            // تاجر؟
  isIntermediary: boolean,        // وسيط؟
  
  // بيانات المسوق
  affiliateCode?: string,         // كود المسوق (AFF123ABC)
  commissionRate?: number,        // نسبة العمولة (0.15 = 15%)
  
  // حالة الحساب
  accountStatus: 'pending' | 'approved' | 'rejected',
  isActive: boolean,              // نشط؟
  
  // تواريخ
  approvedAt?: string,            // تاريخ الموافقة
  approvedBy?: string,            // من وافق (Admin ID)
  rejectionReason?: string,       // سبب الرفض
  
  $createdAt: string,             // تاريخ التسجيل
  $updatedAt: string              // آخر تحديث
}
```

---

## 🔧 الملفات المعدلة

### 1. **client/contexts/AppwriteAuthContext.tsx**
- دالة `register()`: إنشاء مستند المستخدم مع `accountStatus`
- استخدام `appwriteConfig.collections.users`

### 2. **client/pages/Register.tsx**
- إنشاء إشعار ترحيبي
- استخدام `appwriteConfig.collections.notifications`

### 3. **client/pages/AdminPendingAccounts.tsx**
- واجهة مراجعة الحسابات
- دوال الموافقة والرفض
- استخدام collection IDs الصحيحة

### 4. **client/components/AdminLayout.tsx**
- إضافة رابط "الحسابات المعلقة"
- عداد الحسابات المعلقة (Badge)

### 5. **client/components/ProtectedRoute.tsx**
- حماية المسارات
- التحقق من `accountStatus`
- عرض رسائل مناسبة

### 6. **client/hooks/usePendingAccountsCount.ts** (جديد)
- Hook لجلب عدد الحسابات المعلقة
- تحديث تلقائي كل دقيقة

### 7. **client/lib/appwrite.ts**
- إضافة `notifications` إلى collections

---

## ✅ اختبار النظام

### 1. **اختبار التسجيل:**
```bash
# 1. افتح صفحة التسجيل كمسوق
https://egygo.me/#/register?type=affiliate

# 2. املأ البيانات وسجل
# 3. تحقق من:
- ✅ ظهور رسالة "حسابك قيد المراجعة"
- ✅ إعادة توجيه لصفحة تسجيل الدخول
```

### 2. **اختبار لوحة الأدمن:**
```bash
# 1. سجل دخول كأدمن
https://egygo.me/#/admin

# 2. تحقق من:
- ✅ ظهور رابط "الحسابات المعلقة" في القائمة
- ✅ ظهور badge أحمر بعدد الحسابات
- ✅ فتح الصفحة وعرض الحسابات

# 3. افتح Console وابحث عن:
"Pending users fetched: [...]"
```

### 3. **اختبار الموافقة:**
```bash
# 1. اضغط على ✅ موافقة لحساب معلق
# 2. تحقق من:
- ✅ اختفاء الحساب من القائمة
- ✅ ظهور رسالة نجاح
- ✅ تحديث العداد

# 3. سجل دخول بالحساب الموافق عليه
# 4. تحقق من:
- ✅ الوصول للوحة التحكم
- ✅ ظهور إشعار الموافقة
```

### 4. **اختبار الرفض:**
```bash
# 1. اضغط على ❌ رفض لحساب معلق
# 2. أدخل سبب الرفض
# 3. تحقق من:
- ✅ اختفاء الحساب من القائمة
- ✅ ظهور رسالة نجاح

# 4. سجل دخول بالحساب المرفوض
# 5. تحقق من:
- ❌ عدم الوصول للوحة التحكم
- ✅ ظهور رسالة الرفض + السبب
```

---

## 🚀 التحسينات المستقبلية

### 1. **إرسال البريد الإلكتروني**
```typescript
// TODO: Implement email notifications
await sendApprovalEmail(userId, userEmail);
await sendRejectionEmail(userId, userEmail, reason);
```

### 2. **إشعارات فورية**
- استخدام Appwrite Realtime
- إشعار فوري عند الموافقة/الرفض

### 3. **تقارير وإحصائيات**
- عدد الحسابات المعلقة يومياً
- متوسط وقت المراجعة
- معدل الموافقة/الرفض

### 4. **تصدير البيانات**
- تصدير قائمة الحسابات المعلقة (CSV/Excel)
- تقارير شهرية

---

## 🐛 استكشاف الأخطاء

### المشكلة: الحسابات القديمة لا تظهر

**السبب**: الحسابات القديمة ليس لديها حقل `accountStatus`

**الحل**:
```typescript
// في Appwrite Console > Database > users collection
// قم بتحديث الحسابات القديمة:
{
  accountStatus: 'approved',  // أو 'pending' حسب الحاجة
  isActive: true
}
```

### المشكلة: خطأ 404 عند جلب الحسابات

**السبب**: استخدام `'users'` بدلاً من collection ID

**الحل**: تأكد من استخدام `appwriteConfig.collections.users`

### المشكلة: العداد لا يتحدث

**السبب**: Hook لا يعمل أو خطأ في API

**الحل**: 
1. افتح Console
2. ابحث عن أخطاء في `usePendingAccountsCount`
3. تحقق من صلاحيات Appwrite

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. افتح Console في المتصفح (F12)
2. ابحث عن الأخطاء
3. تحقق من Network tab
4. تأكد من صلاحيات Appwrite

---

## 🎉 الخلاصة

✅ **نظام كامل ومتكامل** لمراجعة الحسابات  
✅ **واجهة سهلة الاستخدام** للأدمن  
✅ **حماية شاملة** لجميع المسارات  
✅ **إشعارات تلقائية** للمستخدمين  
✅ **تحديث فوري** للعدادات  

**الموقع جاهز لاستقبال التسجيلات الجديدة! 🚀**
