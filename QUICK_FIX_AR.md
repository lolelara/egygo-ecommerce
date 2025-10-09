# ⚡ حل سريع لمشكلة /admin/users

## المشكلة
الصفحة تعرض بيانات ثابتة أو رسالة تحذير

## الحل السريع (5 دقائق)

### 1️⃣ افتح Appwrite Console
https://cloud.appwrite.io/console

### 2️⃣ اذهب للـ Database
- اختر مشروعك
- Databases → main (ID: `68de037e003bd03c4d45`)

### 3️⃣ أنشئ Collection اسمها `users`
- اضغط "Create Collection"
- Collection ID: **users**
- Name: **Users**

### 4️⃣ أضف Attributes الأساسية:

**Attribute 1:**
- Key: `email`
- Type: String
- Size: 255
- Required: ✅

**Attribute 2:**
- Key: `name`
- Type: String  
- Size: 255
- Required: ❌

**Attribute 3:**
- Key: `role`
- Type: Enum
- Elements: `USER`, `ADMIN`, `MERCHANT`, `AFFILIATE`
- Required: ✅
- Default: `USER`

**Attribute 4:**
- Key: `isActive`
- Type: Boolean
- Required: ❌
- Default: `true`

**Attribute 5:**
- Key: `isAffiliate`
- Type: Boolean
- Required: ❌
- Default: `false`

**Attribute 6:**
- Key: `isMerchant`
- Type: Boolean
- Required: ❌
- Default: `false`

### 5️⃣ أضف مستخدم تجريبي

في Appwrite Console → Collection "users" → Add Document:

```json
{
  "email": "test@egygo.com",
  "name": "مستخدم تجريبي",
  "role": "USER",
  "isActive": true,
  "isAffiliate": false,
  "isMerchant": false
}
```

### 6️⃣ أعد تحميل الصفحة
افتح: https://egygo.me/#/admin/users

---

## ✅ النتيجة
- ستختفي رسالة التحذير
- سيظهر المستخدم التجريبي الذي أضفته
- يمكنك الآن إدارة المستخدمين

---

## 📚 للمزيد من التفاصيل
راجع: `DATABASE_SETUP_MANUAL.md`

## 🤖 استخدام CLI
إذا كنت تفضل CLI:
1. `appwrite login`
2. `powershell -ExecutionPolicy Bypass -File setup-collections.ps1`

---

**💡 نصيحة**: لإضافة المزيد من Attributes للمسوقين (commissionRate, totalEarnings, etc.)، راجع الدليل الكامل في `DATABASE_SETUP_MANUAL.md`
