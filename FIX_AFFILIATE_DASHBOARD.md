# 🔧 حل مشكلة عدم ظهور لوحة تحكم المسوق

## المشكلة:
لوحة تحكم المسوق لا تظهر في القائمة لأن حساب المسوق يحتاج إلى `isAffiliate: true` في الـ preferences.

---

## ✅ الحل السريع (3 طرق)

### الطريقة 1: استخدام صفحة التحديث (الأسهل)

1. **سجل دخول بحساب المسوق:**
   - Email: `almlmibrahym574@gmail.com`
   - Password: `Affiliatex8k3cmsq4ktmgaiwrlo`

2. **اذهب إلى الصفحة:**
   ```
   http://localhost:8080/update-affiliate-prefs
   ```

3. **اضغط على "تحديث الإعدادات"**

4. **انتظر رسالة النجاح وسيتم توجيهك تلقائياً**

---

### الطريقة 2: استخدام Console المتصفح

1. **سجل دخول بحساب المسوق**

2. **افتح Console (اضغط F12 ثم اختر Console)**

3. **انسخ والصق الكود التالي:**
   ```javascript
   import('https://cdn.jsdelivr.net/npm/appwrite@14.0.1').then(async (Appwrite) => {
     const client = new Appwrite.Client()
       .setEndpoint('https://fra.cloud.appwrite.io/v1')
       .setProject('68d8b9db00134c41e7c8');
     
     const account = new Appwrite.Account(client);
     
     await account.updatePrefs({
       isAffiliate: true,
       role: 'affiliate',
       commissionRate: 15
     });
     
     console.log('✅ تم التحديث بنجاح!');
     location.reload();
   });
   ```

4. **اضغط Enter وانتظر رسالة النجاح**

---

### الطريقة 3: من Appwrite Console

1. **اذهب إلى Appwrite Console:**
   ```
   https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/auth/user-68df7b4700066549020a
   ```

2. **في قسم "Preferences"، اضغط "Update"**

3. **أضف هذا JSON:**
   ```json
   {
     "isAffiliate": true,
     "role": "affiliate",
     "commissionRate": 15
   }
   ```

4. **احفظ التغييرات**

5. **سجل دخول مرة أخرى في الموقع**

---

## 🔍 التحقق من النجاح

بعد تطبيق أي من الحلول:

1. **حدّث الصفحة (F5)**
2. **افتح القائمة**
3. **يجب أن تظهر "لوحة تحكم المسوق" باللون البرتقالي**
4. **اضغط عليها للذهاب إلى `/affiliate/dashboard`**

---

## 📱 ما ستراه بعد الإصلاح:

### في القائمة (Mobile):
```
┌─────────────────────────────┐
│ 🟠 لوحة تحكم المسوق        │ ← جديد!
│    (برتقالي)                │
└─────────────────────────────┘
│ 🏠 الرئيسية                │
│ 📦 المنتجات                │
│ ...                         │
```

### في القائمة (Desktop Dropdown):
```
┌──────────────────────┐
│ أهلاً، إبراهيم      │
├──────────────────────┤
│ 🟠 لوحة تحكم المسوق  │ ← جديد!
├──────────────────────┤
│ 👤 حسابي            │
│ 📦 طلباتي           │
│ ❤️  المفضلة         │
│ 🚪 تسجيل خروج       │
└──────────────────────┘
```

---

## 🎯 الصفحات التي ستعمل بعد الإصلاح:

- ✅ `/affiliate/dashboard` - لوحة المسوق الرئيسية
- ✅ `/affiliate/links` - إنشاء وإدارة الروابط
- ✅ `/affiliate/analytics` - التحليلات والإحصائيات
- ✅ `/affiliate/creatives` - البانرات والأدوات التسويقية

---

## ❓ إذا لم تظهر بعد:

1. **امسح الـ Cache:**
   - اضغط `Ctrl + Shift + Delete`
   - احذف Cookies & Cache
   - أعد تحميل الصفحة

2. **تحقق من Console:**
   - افتح F12
   - ابحث عن أخطاء
   - تأكد من تحميل الـ user بشكل صحيح

3. **تحقق من الـ Preferences:**
   ```javascript
   // في Console
   import { account } from '@/lib/appwrite';
   const user = await account.get();
   console.log('User Prefs:', user.prefs);
   ```
   
   يجب أن ترى:
   ```json
   {
     "isAffiliate": true,
     "role": "affiliate",
     "commissionRate": 15
   }
   ```

---

## 🔄 تطبيق التحديثات على جميع المسوقين

إذا أردت تطبيق نفس الإعدادات على أي مسوق جديد، استخدم الكود التالي في صفحة التسجيل:

```typescript
// في Register.tsx بعد إنشاء الحساب
if (userEmail.includes('affiliate') || isAffiliateCheckbox) {
  await account.updatePrefs({
    isAffiliate: true,
    role: 'affiliate',
    commissionRate: 15
  });
}
```

---

## 📝 ملاحظات:

- ✅ صفحة `/update-affiliate-prefs` متاحة الآن للتحديث السريع
- ✅ الكود في `Header.tsx` يتحقق من `user?.isAffiliate`
- ✅ الكود في `AppwriteAuthContext.tsx` يحمّل الـ preferences
- ⚠️  يجب تسجيل الدخول أولاً قبل التحديث
- ⚠️  بعد التحديث، قد تحتاج لتحديث الصفحة

---

## 🎉 بعد الإصلاح يمكنك:

1. ✅ إنشاء روابط تسويقية للمنتجات
2. ✅ مشاهدة التحليلات والإحصائيات
3. ✅ تحميل البانرات والأدوات التسويقية
4. ✅ تتبع العمولات والنقرات
5. ✅ توليد QR Codes للروابط

---

**اختر الطريقة الأسهل لك وابدأ!** 🚀
