# 🗺️ Location Fields Setup Guide

## Overview
تم إضافة حقول المحافظة والمركز إلى نموذج التسجيل وقاعدة البيانات.

---

## 📋 الحقول المضافة

### 1. **governorate** (المحافظة)
- **النوع:** String
- **الحد الأقصى:** 255 حرف
- **إجباري:** نعم (للمستخدمين الجدد)
- **اختياري:** للمستخدمين الحاليين

### 2. **city** (المركز/المدينة)
- **النوع:** String
- **الحد الأقصى:** 255 حرف
- **إجباري:** نعم (للمستخدمين الجدد)
- **اختياري:** للمستخدمين الحاليين

---

## 🚀 Setup Instructions

### الخطوة 1: تشغيل Script إضافة الحقول

```bash
npm run setup:locations
```

هذا الأمر سيقوم بـ:
- ✅ إضافة حقل `governorate` إلى `userPreferences` collection
- ✅ إضافة حقل `city` إلى `userPreferences` collection

### الخطوة 2: التحقق من النجاح

بعد تشغيل الأمر، يجب أن ترى:
```
✅ Governorate field added
✅ City field added
✅ Location fields added successfully!
```

---

## 📊 البيانات المتاحة

### المحافظات (27 محافظة)
```
القاهرة، الجيزة، الإسكندرية، القليوبية، الشرقية، الدقهلية،
البحيرة، الغربية، المنوفية، كفر الشيخ، دمياط، بورسعيد،
الإسماعيلية، السويس، شمال سيناء، جنوب سيناء، الفيوم،
بني سويف، المنيا، أسيوط، سوهاج، قنا، الأقصر، أسوان،
البحر الأحمر، الوادي الجديد، مطروح
```

### المراكز (200+ مركز/مدينة)
- كل محافظة تحتوي على مراكزها ومدنها
- يتم تحميل المراكز ديناميكياً عند اختيار المحافظة

---

## 💻 استخدام الحقول في الكود

### في نموذج التسجيل:

```typescript
const [formData, setFormData] = useState({
  // ... حقول أخرى
  governorate: "",
  city: "",
});
```

### حفظ في قاعدة البيانات:

```typescript
await databases.createDocument(
  appwriteConfig.databaseId,
  'userPreferences',
  ID.unique(),
  {
    // ... حقول أخرى
    governorate: formData.governorate,
    city: formData.city,
  }
);
```

### استرجاع البيانات:

```typescript
const user = await databases.getDocument(
  appwriteConfig.databaseId,
  'userPreferences',
  userId
);

console.log(user.governorate); // "القاهرة"
console.log(user.city);        // "مدينة نصر"
```

---

## 🎯 الملفات المعدلة

### 1. **client/lib/egypt-locations.ts**
- قائمة كاملة بالمحافظات والمراكز
- دوال مساعدة للحصول على البيانات

### 2. **client/pages/Register.tsx**
- إضافة حقول المحافظة والمركز
- Validation للحقول
- حفظ البيانات في قاعدة البيانات

### 3. **scripts/add-location-fields.ts**
- Script لإضافة الحقول إلى Collection
- يمكن تشغيله بأمان عدة مرات

### 4. **package.json**
- إضافة `setup:locations` script

---

## ⚠️ ملاحظات مهمة

### للمستخدمين الحاليين:
- الحقول **اختيارية** للمستخدمين الحاليين
- لن يتم إجبارهم على إدخال البيانات
- يمكن إضافة صفحة لتحديث البيانات لاحقاً

### للمستخدمين الجدد:
- الحقول **إجبارية** عند التسجيل
- لا يمكن إكمال التسجيل بدونها
- يتم التحقق من البيانات قبل الحفظ

---

## 🔧 Troubleshooting

### المشكلة: "Attribute already exists"
**الحل:** الحقول موجودة بالفعل، لا حاجة لإعادة التشغيل

### المشكلة: "Collection not found"
**الحل:** تأكد من تشغيل `npm run setup:preferences` أولاً

### المشكلة: "Invalid API key"
**الحل:** تحقق من ملف `.env` وتأكد من وجود `APPWRITE_API_KEY`

---

## 📈 الإحصائيات

```
✅ 27 محافظة
✅ 200+ مركز/مدينة
✅ 2 حقل جديد
✅ Validation كامل
✅ Dynamic loading
✅ Database ready
```

---

## 🎉 الخلاصة

الآن نظام التسجيل يدعم:
- ✅ اختيار المحافظة (إجباري)
- ✅ اختيار المركز/المدينة (إجباري)
- ✅ حفظ البيانات في قاعدة البيانات
- ✅ Validation كامل
- ✅ تجربة مستخدم سلسة

---

**تم التطوير بواسطة:** EgyGo Team  
**التاريخ:** 2025-01-18
