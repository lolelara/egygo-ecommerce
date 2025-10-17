# 🚀 تعليمات إعداد قاعدة البيانات في Appwrite

## 📋 **المتطلبات**

1. ✅ حساب Appwrite نشط
2. ✅ Project ID و Database ID
3. ✅ API Key مع صلاحيات كاملة
4. ✅ Node.js مثبت (v16+)

---

## 🔧 **الإعداد الأولي**

### 1. تثبيت Dependencies

```bash
npm install node-appwrite dotenv tsx
```

### 2. التحقق من ملف `.env`

تأكد من وجود المتغيرات التالية في `.env`:

```env
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68d8b9db00134c41e7c8
VITE_APPWRITE_DATABASE_ID=68de037e003bd03c4d45
APPWRITE_API_KEY=your_api_key_here
```

**⚠️ مهم:** استخدم `APPWRITE_API_KEY` (بدون `VITE_`) للـ scripts

---

## 📦 **Scripts المتاحة**

### **1. إنشاء Collections نظام الإحالة**

يقوم بإنشاء:
- `referrals` collection
- `referral_earnings` collection

```bash
npm run setup:referrals
```

**ما يقوم به:**
- ✅ إنشاء collections بالصلاحيات المناسبة
- ✅ إضافة جميع الحقول (attributes)
- ✅ إنشاء الـ indexes للبحث السريع
- ✅ إعداد النظام بالكامل

**الحقول في `referrals`:**
- `referrerId` - معرف المُحيل
- `referredUserId` - معرف المُحال
- `referredUserName` - اسم المُحال
- `referredUserEmail` - بريد المُحال
- `referralCode` - كود الإحالة
- `status` - الحالة (pending, active, completed)
- `reward` - المكافأة (ج.م)
- `level` - مستوى الإحالة
- `createdAt` - تاريخ الإنشاء
- `completedAt` - تاريخ الإكمال

**الحقول في `referral_earnings`:**
- `referrerId` - معرف المستلم
- `referredUserId` - معرف المولد
- `orderId` - معرف الطلب
- `amount` - المبلغ (ج.م)
- `percentage` - نسبة العمولة
- `level` - مستوى الإحالة
- `type` - النوع (signup, first_purchase, commission)
- `status` - الحالة (pending, completed, paid)
- `createdAt` - تاريخ الإنشاء
- `paidAt` - تاريخ الدفع

---

### **2. تحديث User Preferences**

يقوم بإضافة `affiliateCode` لجميع المستخدمين:

```bash
npm run setup:preferences
```

**ما يقوم به:**
- ✅ إضافة حقل `affiliateCode` إلى `user_preferences`
- ✅ إنشاء unique index للكود
- ✅ توليد كود إحالة فريد لكل مستخدم موجود
- ✅ التحقق من عدم التكرار

**مثال على الكود المولد:** `ABCD1234`

---

### **3. تشغيل جميع Scripts دفعة واحدة**

```bash
npm run setup:all
```

يقوم بتشغيل جميع السكريبتات بالترتيب.

---

## 🎯 **خطوات الإعداد الكاملة**

### **الخطوة 1: إعداد Collections**

```bash
npm run setup:referrals
```

**النتيجة المتوقعة:**
```
🚀 Starting Appwrite Referral Collections Setup

📦 Creating referrals collection...
✅ Referrals collection created: referrals
📝 Adding attributes to referrals collection...
  ✓ referrerId
  ✓ referredUserId
  ✓ referredUserName
  ✓ referredUserEmail
  ✓ referralCode
  ✓ status
  ✓ reward
  ✓ level
  ✓ createdAt
  ✓ completedAt
⏳ Waiting for attributes to be available...
📊 Creating indexes...
  ✓ referrerId_idx
  ✓ referredUserId_idx
  ✓ status_idx
✅ Referrals collection setup complete!

📦 Creating referral_earnings collection...
✅ Referral earnings collection created: referral_earnings
📝 Adding attributes to referral_earnings collection...
  ✓ referrerId
  ✓ referredUserId
  ✓ orderId
  ✓ amount
  ✓ percentage
  ✓ level
  ✓ type
  ✓ status
  ✓ createdAt
  ✓ paidAt
⏳ Waiting for attributes to be available...
📊 Creating indexes...
  ✓ referrerId_idx
  ✓ status_idx
  ✓ type_idx
✅ Referral earnings collection setup complete!

🎉 All collections created successfully!
```

---

### **الخطوة 2: إعداد Affiliate Codes**

```bash
npm run setup:preferences
```

**النتيجة المتوقعة:**
```
🚀 Starting User Preferences Update

📝 Adding affiliateCode attribute to user_preferences...
✅ affiliateCode attribute added
⏳ Waiting for attribute to be available...
✅ Unique index created for affiliateCode

🔄 Generating affiliate codes for existing users...
📊 Found 25 user preferences
🔍 15 users need affiliate codes

  ✓ 1/15 - ABCD1234 → user_001
  ✓ 2/15 - EFGH5678 → user_002
  ✓ 3/15 - IJKL9012 → user_003
  ...
  ✓ 15/15 - WXYZ3456 → user_015

✅ Updated: 15
❌ Failed: 0

🎉 User preferences update complete!
```

---

## 🔍 **التحقق من النجاح**

### **في Appwrite Console:**

1. افتح [Appwrite Console](https://cloud.appwrite.io/)
2. اذهب إلى Database → Collections
3. تحقق من وجود:
   - ✅ `referrals` collection مع 10 attributes
   - ✅ `referral_earnings` collection مع 10 attributes
   - ✅ `user_preferences` مع حقل `affiliateCode`

### **في التطبيق:**

```tsx
// Test في أي component
import { useReferralSystem } from '@/hooks/useReferralSystem';

function TestComponent() {
  const { affiliateCode, referralLink } = useReferralSystem();
  
  console.log('My code:', affiliateCode);
  console.log('My link:', referralLink);
  
  return <div>Check console</div>;
}
```

---

## 🐛 **حل المشاكل**

### **مشكلة: Collection already exists**

```
⚠️  Referrals collection already exists
```

**الحل:** هذا طبيعي! يمكنك تجاهل هذا التحذير.

---

### **مشكلة: Attribute already exists**

```
⚠️  affiliateCode attribute already exists
```

**الحل:** الحقل موجود مسبقاً. Script سيستمر في توليد الأكواد.

---

### **مشكلة: API Key invalid**

```
❌ Error: Invalid API key
```

**الحل:**
1. تحقق من `APPWRITE_API_KEY` في `.env`
2. تأكد أنه **Server API Key** (ليس Browser)
3. تأكد من الصلاحيات الكاملة

---

### **مشكلة: Network error**

```
❌ Error: Network connection error
```

**الحل:**
1. تحقق من اتصال الإنترنت
2. تحقق من `VITE_APPWRITE_ENDPOINT`
3. جرب ping للـ endpoint:
   ```bash
   ping fra.cloud.appwrite.io
   ```

---

## 📊 **البنية النهائية**

بعد تشغيل جميع Scripts، ستكون قاعدة البيانات:

```
egygo_database/
├── referrals/
│   ├── Attributes (10)
│   └── Indexes (3)
├── referral_earnings/
│   ├── Attributes (10)
│   └── Indexes (3)
└── user_preferences/
    ├── Attributes (existing + affiliateCode)
    └── Indexes (existing + affiliateCode_idx)
```

---

## 🎉 **بعد الإعداد**

### **اختبر النظام:**

1. **تسجيل مستخدم جديد:**
   - استخدم رابط إحالة: `https://egygo.me/#/register?ref=ABCD1234`
   - تحقق من إنشاء سجل في `referrals`

2. **تتبع العمولات:**
   - عند أول عملية شراء للمُحال
   - تحقق من إنشاء سجل في `referral_earnings`

3. **عرض الإحصائيات:**
   - افتح `/affiliate/dashboard`
   - شاهد الإحالات والأرباح

---

## 📝 **ملاحظات مهمة**

1. ⚠️ **API Key Security:**
   - لا تشارك API Key أبداً
   - لا ترفعه على Git
   - استخدم `.env` فقط

2. ⏱️ **Rate Limiting:**
   - Scripts تحترم rate limits
   - تنتظر بين الطلبات
   - لا تقلق من السرعة

3. 🔄 **إعادة التشغيل:**
   - يمكنك تشغيل Scripts أكثر من مرة
   - لن تتكرر البيانات
   - سيتخطى ما هو موجود

---

## 🆘 **الدعم**

إذا واجهت مشكلة:

1. راجع الأخطاء في Console
2. تحقق من `.env`
3. تأكد من صلاحيات API Key
4. جرب إعادة تشغيل Script

---

**🎯 جاهز للبدء؟ شغّل:**

```bash
npm run setup:all
```

**والله ولي التوفيق! 🚀**
