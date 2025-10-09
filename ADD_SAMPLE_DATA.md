# 📝 إضافة بيانات تجريبية - دليل سريع

## المشكلة الحالية
صفحة `/admin/affiliates` تظهر رسالة: "لا يوجد شركاء تسويق" لأن collection `users` فارغ.

---

## ✅ الحل: إضافة مستخدمين تجريبيين

### الطريقة 1: عبر Appwrite Console (الأسهل) ⭐

1. **افتح Appwrite Console**:
   ```
   https://cloud.appwrite.io/console
   ```

2. **اذهب للـ Collection**:
   - Databases → main (68de037e003bd03c4d45)
   - Collections → users

3. **أضف Documents**:
   اضغط "Create Document" وأضف البيانات التالية:

---

#### مسوق 1 (Ahmed) 🎯
```json
{
  "email": "ahmed@egygo.com",
  "name": "Ahmed Mohamed",
  "role": "AFFILIATE",
  "isActive": true,
  "isAffiliate": true,
  "isMerchant": false,
  "affiliateCode": "AFF001",
  "commissionRate": 20,
  "totalEarnings": 5420.50,
  "pendingEarnings": 1200.00,
  "referralCount": 34
}
```

**Document ID**: `aff001`

---

#### مسوق 2 (Fatima) 🎯
```json
{
  "email": "fatima@egygo.com",
  "name": "Fatima Ali",
  "role": "AFFILIATE",
  "isActive": true,
  "isAffiliate": true,
  "isMerchant": false,
  "affiliateCode": "AFF002",
  "commissionRate": 15,
  "totalEarnings": 3200.00,
  "pendingEarnings": 800.00,
  "referralCount": 22
}
```

**Document ID**: `aff002`

---

#### مسوق 3 (Mohamed) 🎯
```json
{
  "email": "mohamed@egygo.com",
  "name": "Mohamed Abdullah",
  "role": "AFFILIATE",
  "isActive": true,
  "isAffiliate": true,
  "isMerchant": false,
  "affiliateCode": "AFF003",
  "commissionRate": 18,
  "totalEarnings": 8900.00,
  "pendingEarnings": 2100.00,
  "referralCount": 56
}
```

**Document ID**: `aff003`

---

#### مدير النظام 👨‍💼
```json
{
  "email": "admin@egygo.com",
  "name": "Admin User",
  "role": "ADMIN",
  "isActive": true,
  "isAdmin": true,
  "isAffiliate": false,
  "isMerchant": false
}
```

**Document ID**: `admin001`

---

#### تاجر 🏪
```json
{
  "email": "merchant@egygo.com",
  "name": "Electronics Store",
  "role": "MERCHANT",
  "isActive": true,
  "isAffiliate": false,
  "isMerchant": true
}
```

**Document ID**: `merchant001`

---

#### مستخدم عادي 👤
```json
{
  "email": "user@egygo.com",
  "name": "Regular User",
  "role": "USER",
  "isActive": true,
  "isAffiliate": false,
  "isMerchant": false
}
```

**Document ID**: `user001`

---

### الطريقة 2: عبر Appwrite CLI (للمتقدمين)

```bash
# تأكد من تسجيل الدخول أولاً
appwrite login

# أضف مسوق
appwrite databases create-document \
  --database-id "68de037e003bd03c4d45" \
  --collection-id "users" \
  --document-id "aff001" \
  --data '{"email":"ahmed@egygo.com","name":"Ahmed Mohamed","role":"AFFILIATE","isActive":true,"isAffiliate":true,"isMerchant":false,"affiliateCode":"AFF001","commissionRate":20,"totalEarnings":5420.50,"pendingEarnings":1200.00,"referralCount":34}'
```

**ملاحظة**: استخدم PowerShell أو Bash حسب نظامك.

---

### الطريقة 3: استيراد من JSON (للمحترفين)

1. استخدم ملف `sample-users.json` الموجود في المشروع
2. استخدم أداة استيراد البيانات في Appwrite
3. أو استخدم script مخصص

---

## 🔒 ضبط Permissions (مهم!)

قبل إضافة البيانات، تأكد من ضبط Permissions:

1. افتح Collection "users" في Appwrite Console
2. اذهب لـ Settings → Permissions
3. أضف:
   - `read("any")` - للقراءة العامة
   - `create("users")` - للإضافة
   - `update("users")` - للتعديل
   - `delete("role:admin")` - للحذف (المديرين فقط)

---

## ✅ التحقق من النجاح

بعد إضافة البيانات:

### 1. افتح `/admin/users`
يجب أن ترى:
- ✅ 6 مستخدمين
- ✅ لا توجد رسالة تحذير

### 2. افتح `/admin/affiliates`
يجب أن ترى:
- ✅ 3 مسوقين (Ahmed, Fatima, Mohamed)
- ✅ معلومات العمولات والأرباح
- ✅ لا توجد رسالة تحذير

---

## 🎯 البيانات التجريبية المضافة

| Type | Email | Name | Code | Earnings |
|------|-------|------|------|----------|
| 🎯 Affiliate | ahmed@egygo.com | Ahmed Mohamed | AFF001 | 5,420 ج.م |
| 🎯 Affiliate | fatima@egygo.com | Fatima Ali | AFF002 | 3,200 ج.م |
| 🎯 Affiliate | mohamed@egygo.com | Mohamed Abdullah | AFF003 | 8,900 ج.م |
| 👨‍💼 Admin | admin@egygo.com | Admin User | - | - |
| 🏪 Merchant | merchant@egygo.com | Electronics Store | - | - |
| 👤 User | user@egygo.com | Regular User | - | - |

**إجمالي**: 6 مستخدمين (3 مسوقين)

---

## 🆘 حل المشاكل

### المشكلة: "لا يمكن إنشاء document"
**الحل**: 
- تأكد من ضبط Permissions
- تأكد من تسجيل الدخول في Appwrite CLI
- تحقق من أن Collection ID صحيح

### المشكلة: "Document already exists"
**الحل**:
- غيّر Document ID (مثلاً: `aff004` بدلاً من `aff001`)
- أو احذف الـ document القديم أولاً

### المشكلة: "لا تزال الصفحة فارغة"
**الحل**:
1. تحقق من Console logs في المتصفح (F12)
2. تأكد من Permissions مضبوطة صح
3. جرب إعادة تحميل الصفحة (Ctrl+Shift+R)
4. تحقق من أن البيانات موجودة في Appwrite Console

---

## 📊 الإحصائيات المتوقعة بعد الإضافة

### في `/admin/users`:
- إجمالي المستخدمين: **6**
- المديرين: **1**
- الشركاء: **3**
- التجار: **1**

### في `/admin/affiliates`:
- إجمالي الشركاء: **3**
- إجمالي الأرباح: **17,520 ج.م**
- الأرباح المعلقة: **4,100 ج.م**
- إجمالي الإحالات: **112**

---

## 🎉 النتيجة النهائية

بعد إضافة البيانات:
- ✅ صفحة `/admin/users` تعرض المستخدمين الحقيقيين
- ✅ صفحة `/admin/affiliates` تعرض المسوقين مع إحصائياتهم
- ✅ يمكن البحث والفلترة
- ✅ يمكن تعديل البيانات
- ✅ النظام جاهز للاستخدام!

---

**💡 نصيحة**: بعد إضافة البيانات التجريبية، يمكنك تعديلها أو إضافة المزيد من Appwrite Console مباشرة.

**🔗 روابط سريعة**:
- [Appwrite Console](https://cloud.appwrite.io/console)
- [Project Dashboard](https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8)
- [Users Collection](https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/databases/database-68de037e003bd03c4d45/collection-users)
