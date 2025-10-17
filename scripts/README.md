# 📜 Appwrite Database Scripts

مجموعة من السكريبتات لإعداد وإدارة قاعدة البيانات في Appwrite.

---

## 🚀 **البدء السريع**

### **1. التثبيت**

```bash
npm install
```

### **2. إعداد قاعدة البيانات الكاملة**

```bash
npm run setup:all
```

هذا الأمر يقوم بـ:
1. ✅ إنشاء collections نظام الإحالة
2. ✅ إضافة affiliate codes لجميع المستخدمين

---

## 📦 **Scripts المتاحة**

### **نظام الإحالة (Referral System)**

#### `npm run setup:referrals`
إنشاء collections الخاصة بنظام الإحالة:
- `referrals` - سجل الإحالات
- `referral_earnings` - الأرباح والعمولات

**المخرجات:**
- 2 collections جديدة
- 20 attributes
- 6 indexes

---

#### `npm run setup:preferences`
إضافة affiliate codes لجميع المستخدمين:
- إضافة حقل `affiliateCode`
- توليد كود فريد لكل مستخدم
- إنشاء unique index

**المخرجات:**
- Attribute جديد
- Codes لجميع المستخدمين الموجودين

---

#### `npm run setup:all`
تشغيل جميع scripts دفعة واحدة.

---

## 📚 **التوثيق الكامل**

اقرأ [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md) للتعليمات التفصيلية.

---

## 🔑 **متطلبات .env**

```env
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
APPWRITE_API_KEY=your_server_api_key
```

---

## ✅ **تحقق من النجاح**

بعد تشغيل Scripts:

1. افتح [Appwrite Console](https://cloud.appwrite.io/)
2. تحقق من Collections الجديدة
3. تحقق من Attributes و Indexes
4. اختبر في التطبيق

---

## 🐛 **حل المشاكل**

### Collection already exists
```
⚠️  Collection already exists
```
هذا طبيعي - سيتخطى Script التكرار.

### API Key error
تأكد من استخدام `APPWRITE_API_KEY` (Server) وليس `VITE_APPWRITE_API_KEY` (Browser).

### Network error
تحقق من الاتصال بالإنترنت و endpoint.

---

## 📞 **الدعم**

للمساعدة، راجع:
- [SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)
- [REFERRAL_SYSTEM_AUDIT.md](../REFERRAL_SYSTEM_AUDIT.md)
- Appwrite Documentation

---

**🎯 جاهز؟ شغّل:**

```bash
npm run setup:all
```
