# نظام الموافقة على الحسابات - دليل شامل

**تاريخ الإضافة**: 9 أكتوبر 2025  
**الإصدار**: 1.0  
**Commit**: 157f053

---

## 📋 نظرة عامة

تم إضافة نظام موافقة احترافي لحسابات التجار والمسوقين لضمان جودة الخدمة وحماية المنصة.

### الأهداف:
- ✅ التحقق من هوية التجار والمسوقين قبل منحهم الصلاحيات
- ✅ ضمان جودة المنتجات والخدمات المقدمة
- ✅ حماية المنصة من الحسابات الوهمية أو المشبوهة
- ✅ تحسين تجربة المستخدم النهائي

---

## 🔄 آلية عمل النظام

### 1. أنواع الحسابات

| نوع الحساب | الموافقة | الحالة الافتراضية | الوصول |
|------------|----------|-------------------|--------|
| 👤 **عميل** | فورية | `approved` | كامل فوراً |
| 💰 **مسوق** | تتطلب موافقة | `pending` | محدود حتى الموافقة |
| 🏪 **تاجر** | تتطلب موافقة | `pending` | محدود حتى الموافقة |

### 2. مراحل الحساب

```
التسجيل → pending → (مراجعة الأدمن) → approved/rejected
```

#### حالة `pending` (قيد المراجعة):
- ✅ يمكن تسجيل الدخول
- ❌ لا يمكن إضافة منتجات (تجار)
- ❌ لا يمكن إنشاء روابط تسويقية (مسوقين)
- ⚠️ رسالة تنبيه تظهر في لوحة التحكم

#### حالة `approved` (مو��ق عليه):
- ✅ وصول كامل لجميع المميزات
- ✅ يمكن إضافة منتجات (تجار)
- ✅ يمكن إنشاء روابط تسويقية (مسوقين)
- ✅ يظهر في قوائم التجار/المسوقين النشطين

#### حالة `rejected` (مرفوض):
- ❌ حساب معطل
- ℹ️ رسالة توضح سبب الرفض
- 🔄 يمكن التواصل مع الدعم لإعادة التقديم

---

## 📝 التعديلات على صفحة التسجيل

### 1. حقول جديدة

#### رقم الهاتف الأساسي (مطلوب):
```tsx
<Input
  id="phone"
  name="phone"
  type="tel"
  required
  placeholder="مثال: 01012345678"
/>
```

#### تأكيد توفر WhatsApp (مطلوب):
```tsx
<Checkbox
  id="whatsapp-available"
  checked={phoneAvailableOnWhatsApp}
  onCheckedChange={(checked) => setPhoneAvailableOnWhatsApp(!!checked)}
/>
<Label>
  هذا الرقم متاح على WhatsApp أو للاتصال *
</Label>
```

**لماذا مهم؟**
- 📞 يضمن إمكانية التواصل مع التاجر/المسوق
- ✅ يزيد من مصداقية الحساب
- 🔒 يقلل من الحسابات الوهمية

#### رقم هاتف بديل (اختياري):
```tsx
<Input
  id="alternativePhone"
  name="alternativePhone"
  type="tel"
  placeholder="رقم إضافي للتواصل (اختياري)"
/>
```

**الفائدة**:
- يوفر وسيلة تواصل بديلة
- مفيد في حالة عدم توفر الرقم الأساسي

### 2. مؤشرات الموافقة

```tsx
{/* للمسوقين */}
<p className="text-xs text-amber-600 mt-1 font-medium">
  ⏳ يتطلب موافقة الإدارة
</p>

{/* للتجار */}
<p className="text-xs text-purple-600 mt-1 font-medium">
  ⏳ يتطلب موافقة الإدارة
</p>
```

### 3. رسالة بعد التسجيل

```javascript
if (accountType === 'affiliate' || accountType === 'merchant') {
  const accountTypeArabic = accountType === 'affiliate' ? 'مسوق' : 'تاجر';
  alert(
    `تم إنشاء حسابك كـ${accountTypeArabic} بنجاح!\n\n` +
    `⏳ حسابك قيد المراجعة من قبل الإدارة\n` +
    `📧 سيتم إخطارك عبر البريد الإلكتروني فور الموافقة\n` +
    `⚠️ لن تتمكن من الوصول لكامل المميزات حتى تتم الموافقة على حسابك`
  );
  navigate("/login");
}
```

---

## 🗄️ التعديلات على قاعدة البيانات

### الحقول الجديدة في جدول `users`:

| الحقل | النوع | مطلوب | القيمة الافتراضية | الوصف |
|------|------|-------|-------------------|-------|
| `alternativePhone` | String(255) | ❌ | `""` | رقم هاتف بديل |
| `accountStatus` | Enum | ❌ | `approved` | حالة الحساب |
| `approvedAt` | DateTime | ❌ | `null` | تاريخ الموافقة |
| `approvedBy` | String(255) | ❌ | `null` | معرف الأدمن الذي وافق |
| `rejectionReason` | String(1000) | ❌ | `null` | سبب الرفض |

### Enum Values لـ `accountStatus`:
- `pending` - قيد المراجعة
- `approved` - موافق عليه
- `rejected` - مرفوض

### تشغيل السكريبت:

```bash
# 1. احصل على API Key من Appwrite Console
# Settings → API Keys → Create API Key
# الصلاحيات المطلوبة: databases.write

# 2. قم بتعيين المفتاح
$env:APPWRITE_API_KEY="YOUR_API_KEY_HERE"

# 3. شغل السكريبت
node add-approval-system-attributes.mjs
```

---

## 🔧 التعديلات على AppwriteAuthContext

### دالة register المحدثة:

```typescript
const register = async (
  email: string, 
  password: string, 
  name: string, 
  accountType: 'customer' | 'affiliate' | 'merchant' | 'intermediary' = 'customer', 
  phone?: string,
  alternativePhone?: string  // ← جديد
) => {
  // تحديد إذا كان الحساب يحتاج موافقة
  const needsApproval = accountType === 'affiliate' || accountType === 'merchant';
  const accountStatus = needsApproval ? 'pending' : 'approved';
  
  const preferences = {
    role: accountType,
    phone: phone || '',
    alternativePhone: alternativePhone || '',  // ← جديد
    accountStatus: accountStatus,              // ← جديد
    approvedAt: needsApproval ? null : new Date().toISOString(),  // ← جديد
    // ... باقي الحقول
  };
  
  // حفظ في قاعدة البيانات
  await databases.createDocument(
    DATABASE_ID,
    'users',
    currentUser.$id,
    {
      email,
      name,
      phone: phone || '',
      alternativePhone: alternativePhone || '',
      accountStatus,
      approvedAt: preferences.approvedAt,
      isActive: !needsApproval, // نشط فقط إذا لا يحتاج موافقة
      // ... باقي الحقول
    }
  );
};
```

---

## 👨‍💼 لوحة تحكم الأدمن (مطلوب تطويرها)

### الصفحات المطلوبة:

#### 1. صفحة الحسابات المعلقة
```
/admin/pending-accounts
```

**المميزات**:
- قائمة بجميع الحسابات بحالة `pending`
- فلترة حسب النوع (مسوق/تاجر)
- عرض معلومات الحساب:
  * الاسم والبريد الإلكتروني
  * رقم الهاتف (مع رابط WhatsApp)
  * رقم الهاتف البديل
  * تاريخ التسجيل
  * نوع الحساب

**الإجراءات**:
```tsx
// موافقة
<Button onClick={() => approveAccount(userId)}>
  ✅ موافقة
</Button>

// رفض مع سبب
<Button onClick={() => rejectAccount(userId, reason)}>
  ❌ رفض
</Button>
```

#### 2. دوال الموافقة/الرفض

```typescript
// الموافقة على الحساب
const approveAccount = async (userId: string) => {
  await databases.updateDocument(
    DATABASE_ID,
    'users',
    userId,
    {
      accountStatus: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: currentAdminId,
      isActive: true
    }
  );
  
  // إرسال إيميل للمستخدم
  await sendApprovalEmail(userId);
};

// رفض الحساب
const rejectAccount = async (userId: string, reason: string) => {
  await databases.updateDocument(
    DATABASE_ID,
    'users',
    userId,
    {
      accountStatus: 'rejected',
      rejectionReason: reason,
      isActive: false
    }
  );
  
  // إرسال إيميل للمستخدم
  await sendRejectionEmail(userId, reason);
};
```

---

## 🚧 حماية Routes والمميزات

### 1. في لوحة تحكم التاجر:

```typescript
// MerchantDashboard.tsx
useEffect(() => {
  if (user?.accountStatus === 'pending') {
    // عرض رسالة تنبيه
    alert('حسابك قيد المراجعة. سيتم إخطارك عند الموافقة.');
  }
  
  if (user?.accountStatus === 'rejected') {
    alert(`تم رفض حسابك: ${user.rejectionReason}`);
    navigate('/');
  }
}, [user]);

// تعطيل زر إضافة منتج
<Button 
  disabled={user?.accountStatus !== 'approved'}
  onClick={addProduct}
>
  {user?.accountStatus === 'pending' 
    ? '⏳ قيد المراجعة' 
    : 'إضافة منتج'}
</Button>
```

### 2. في API endpoints:

```typescript
// server/routes/products.ts
app.post('/api/merchant/products', async (req, res) => {
  const user = await getUser(req);
  
  // التحقق من الموافقة
  if (user.accountStatus !== 'approved') {
    return res.status(403).json({
      error: 'حسابك قيد المراجعة. يرجى الانتظار حتى تتم الموافقة.'
    });
  }
  
  // إضافة المنتج
  // ...
});
```

---

## 📧 نظام الإشعارات (موصى به)

### إيميلات يجب إرسالها:

#### 1. بعد التسجيل (للمسوق/التاجر):
```
الموضوع: تم استلام طلبك - إيجي جو

مرحباً [الاسم],

شكراً لتسجيلك كـ[تاجر/مسوق] في إيجي جو!

⏳ حسابك قيد المراجعة حالياً
📧 سنرسل لك إيميل فور الموافقة على حسابك
⏱️ عادة تستغرق المراجعة 24-48 ساعة

في حالة وجود أي استفسار، تواصل معنا على:
📞 WhatsApp: [رقم الدعم]
📧 Email: support@egygo.me

مع تحيات فريق إيجي جو
```

#### 2. عند الموافقة:
```
الموضوع: 🎉 تمت الموافقة على حسابك!

مرحباً [الاسم],

نبارك لك! تمت الموافقة على حسابك كـ[تاجر/مسوق] ✅

يمكنك الآن:
✓ [للتاجر] إضافة وإدارة منتجاتك
✓ [للمسوق] إنشاء روابط تسويقية
✓ الوصول لكامل مميزات المنصة

ابدأ الآن: https://egygo.me/login

مع تحيات فريق إيجي جو
```

#### 3. عند الرفض:
```
الموضوع: تحديث حول طلب حسابك

مرحباً [الاسم],

للأسف، لم نتمكن من الموافقة على حسابك حالياً.

السبب: [سبب الرفض]

🔄 يمكنك:
• مراجعة المعلومات وإعادة التقديم
• التواصل معنا للاستفسار

📞 WhatsApp: [رقم الدعم]
📧 Email: support@egygo.me

نتطلع لخدمتك!
فريق إيجي جو
```

---

## 📊 إحصائيات الموافقة

### Dashboard metrics:

```typescript
// عدد الحسابات المعلقة
const pendingCount = await databases.listDocuments(
  DATABASE_ID,
  'users',
  [Query.equal('accountStatus', 'pending')]
).total;

// متوسط وقت المراجعة
const avgApprovalTime = calculateAverage(
  approvedAccounts.map(acc => 
    new Date(acc.approvedAt) - new Date(acc.$createdAt)
  )
);

// معدل الموافقة
const approvalRate = (approvedCount / totalApplications) * 100;
```

---

## ✅ Checklist للتطبيق الكامل

### مطلوب فوراً:
- [x] تعديل صفحة التسجيل (حقول + تحقق)
- [x] تعديل AppwriteAuthContext (نظام الموافقة)
- [x] إنشاء سكريبت إضافة الحقول
- [x] تحديث User interface/type
- [ ] تشغيل السكريبت على قاعدة البيانات
- [ ] اختبار التسجيل

### لوحة تحكم الأدمن:
- [ ] صفحة الحسابات المعلقة
- [ ] دالة الموافقة
- [ ] دالة الرفض (مع سبب)
- [ ] فلترة وبحث
- [ ] عرض تفاصيل الحساب

### الحماية:
- [ ] تعطيل مميزات التجار (pending)
- [ ] تعطيل مميزات المسوقين (pending)
- [ ] رسائل تنبيه في Dashboards
- [ ] حماية API endpoints

### الإشعارات:
- [ ] إيميل بعد التسجيل
- [ ] إيميل عند الموافقة
- [ ] إيميل عند الرفض
- [ ] إشعارات داخل التطبيق

### UX Enhancements:
- [ ] Badge للحالة في Profile
- [ ] Progress indicator
- [ ] FAQ للحسابات المعلقة
- [ ] نموذج إعادة التقديم

---

## 🔒 اعتبارات الأمان

### 1. التحقق من الصلاحيات:
```typescript
// قبل أي عملية حساسة
if (user.accountStatus !== 'approved') {
  throw new Error('Unauthorized: Account not approved');
}
```

### 2. Rate Limiting:
```typescript
// حماية من إعادة التقديم المتكرر
const recentApplications = await checkRecentApplications(email);
if (recentApplications > 3) {
  throw new Error('Too many applications. Please wait 24 hours.');
}
```

### 3. Logging:
```typescript
// تسجيل جميع عمليات الموافقة/الرفض
await logApprovalAction({
  userId,
  action: 'approve',
  adminId: currentAdminId,
  timestamp: new Date()
});
```

---

## 📞 معلومات التواصل

للدعم والاستفسارات:
- **WhatsApp**: [أضف الرقم]
- **Email**: support@egygo.me
- **الموقع**: https://egygo.me

---

**آخر تحديث**: 9 أكتوبر 2025  
**الإصدار**: 1.0  
**الحالة**: ✅ جاهز للاستخدام (يحتاج تشغيل السكريبت)
