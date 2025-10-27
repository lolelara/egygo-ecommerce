# 🔧 دليل إصلاح مشكلة Appwrite Permissions

## ❌ المشكلة

```
Error: AppwriteException: The current user is not authorized to perform the requested action.
Status: 401 Unauthorized
Collection: featuredDeals
```

---

## 🔍 السبب

الـ **Permissions** للـ collection `featuredDeals` غير صحيحة:
- الإعداد الحالي: `sdk.Role.team('admin')` 
- المشكلة: المستخدمون ليسوا في team اسمها "admin"

---

## ✅ الحل السريع (3 طرق)

### **الطريقة 1: تشغيل Script الإصلاح (الأسهل) ⭐**

```bash
# 1. افتح terminal
cd c:\Users\NoteBook\Desktop\goegy-main

# 2. شغل script الإصلاح
node scripts/fix-featured-deals-permissions.js
```

**ماذا سيفعل؟**
- ✅ سيحدث الـ permissions تلقائياً
- ✅ أو سينشئ الـ collection إذا لم يكن موجوداً
- ✅ سيضبط كل شيء بشكل صحيح

---

### **الطريقة 2: يدوياً من Appwrite Console**

1. **افتح Appwrite Console:**
   ```
   https://fra.cloud.appwrite.io/console
   ```

2. **اذهب إلى:**
   ```
   Projects → [Your Project] → Databases → [Database] → featuredDeals
   ```

3. **اضغط على Settings (⚙️)**

4. **عدل Permissions:**
   ```
   ✅ Read: Any
   ✅ Create: Users
   ✅ Update: Users
   ✅ Delete: Users
   ```

5. **احفظ التغييرات**

---

### **الطريقة 3: حذف وإعادة إنشاء**

إذا لم تنجح الطرق السابقة:

```bash
# 1. احذف Collection يدوياً من Appwrite Console

# 2. شغل script الإنشاء
node scripts/create-featured-deals-collection.js
```

---

## 📋 التحقق من الحل

بعد تطبيق أي طريقة:

### 1. **افتح المتصفح:**
```
http://localhost:5173/#/admin/deals
```

### 2. **جرب إضافة عرض جديد**

### 3. **تحقق من Console:**
```javascript
// يجب ألا ترى أي أخطاء 401
// يجب أن ترى: "Deal added successfully"
```

---

## 🔐 فهم Permissions

### **Roles في Appwrite:**

```javascript
sdk.Role.any()        // أي شخص (حتى غير مسجل)
sdk.Role.users()      // جميع المستخدمين المسجلين
sdk.Role.user('[userId]')  // مستخدم معين
sdk.Role.team('admin')     // أعضاء team معين
sdk.Role.label('admin')    // مستخدمون بـ label معين
```

### **الإعداد الأمثل لـ featuredDeals:**

```javascript
[
  sdk.Permission.read(sdk.Role.any()),     // أي شخص يقرأ
  sdk.Permission.create(sdk.Role.users()), // مسجلين يضيفون
  sdk.Permission.update(sdk.Role.users()), // مسجلين يعدلون
  sdk.Permission.delete(sdk.Role.users()), // مسجلين يحذفون
]
```

---

## 🛠️ إعدادات متقدمة

### **إذا أردت صلاحيات أكثر تحديداً:**

#### **Option 1: Admin فقط (بـ Label)**

```javascript
// في AdminDealsManager.tsx
const { user } = useAuth();

// تحقق من أن المستخدم admin
if (user?.labels?.includes('admin')) {
  // سماح بالعمليات
}
```

**الـ Permissions:**
```javascript
[
  sdk.Permission.read(sdk.Role.any()),
  sdk.Permission.create(sdk.Role.label('admin')),
  sdk.Permission.update(sdk.Role.label('admin')),
  sdk.Permission.delete(sdk.Role.label('admin')),
]
```

#### **Option 2: Admin بـ Custom Attribute**

```javascript
// في users collection، أضف attribute: role
// القيم: 'admin', 'merchant', 'affiliate', 'customer'

// ثم في الكود:
if (user?.prefs?.role === 'admin') {
  // سماح
}
```

---

## 🔍 Troubleshooting

### **Problem 1: لا يزال خطأ 401**

✅ **الحل:**
```bash
1. تأكد من تسجيل الدخول
2. امسح localStorage
3. سجل دخول من جديد
4. حاول مرة أخرى
```

### **Problem 2: Collection لا يظهر**

✅ **الحل:**
```bash
1. تحقق من DATABASE_ID في .env
2. تأكد من أنك في نفس الـ Project
3. انتظر دقيقة (propagation)
```

### **Problem 3: Attributes missing**

✅ **الحل:**
```bash
# شغل script الإنشاء مرة أخرى
node scripts/create-featured-deals-collection.js
```

---

## 📊 الـ Attributes المطلوبة

يجب أن يحتوي `featuredDeals` على:

```typescript
interface FeaturedDeal {
  productId: string;        // required
  productName: string;      // required
  productImage: string;     // optional
  price: number;            // required (float)
  originalPrice: number;    // required (float)
  discount: number;         // required (integer %)
  order: number;            // required (for sorting)
  active: boolean;          // optional (default: true)
  createdAt: string;        // required (datetime)
}
```

---

## 🎯 الخطوات التالية

بعد إصلاح Permissions:

### 1. **أضف بعض العروض:**
```
/admin/deals → Add Deal
```

### 2. **تحقق من الصفحة الرئيسية:**
```
/ → يجب أن ترى "Featured Deals Section"
```

### 3. **تحقق من صفحة العروض:**
```
/deals → يجب أن ترى جميع العروض
```

---

## 📝 Notes

### **للتطوير (Development):**
```javascript
// استخدم permissions مفتوحة
sdk.Role.users()  // أي مستخدم مسجل
```

### **للإنتاج (Production):**
```javascript
// استخدم permissions محددة
sdk.Role.label('admin')  // admin فقط
```

---

## 🔐 Security Best Practices

1. **في Production:**
   - استخدم `sdk.Role.label('admin')` للكتابة
   - استخدم `sdk.Role.any()` للقراءة فقط

2. **Validate في الكود:**
   ```typescript
   if (!user || user.labels?.includes('admin') === false) {
     throw new Error('Unauthorized');
   }
   ```

3. **Rate Limiting:**
   - أضف rate limiting للـ API calls
   - استخدم advanced-rate-limiter

---

## 🚀 Quick Commands

```bash
# إصلاح سريع
node scripts/fix-featured-deals-permissions.js

# إنشاء من الصفر
node scripts/create-featured-deals-collection.js

# تحقق من الـ database
node scripts/list-collections.js

# حذف collection (احذر!)
# اعمله يدوياً من Appwrite Console
```

---

## ✅ Checklist النهائي

قبل أن تبدأ:

```
☐ APPWRITE_PROJECT_ID صحيح في .env
☐ APPWRITE_API_KEY موجود في .env
☐ APPWRITE_API_KEY له صلاحيات databases.*
☐ DATABASE_ID صحيح في .env
☐ مسجل دخول كـ admin/user
☐ Collection موجود أو سيتم إنشاؤه
☐ Permissions محدثة
```

---

## 📞 الدعم

إذا استمرت المشكلة:

1. **تحقق من Appwrite Console Logs**
2. **تحقق من Browser Console**
3. **تحقق من Network Tab (401 requests)**
4. **تأكد من صحة .env variables**

---

**آخر تحديث:** 23 أكتوبر 2025  
**الحالة:** ✅ جاهز للتطبيق
