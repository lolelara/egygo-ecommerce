# ⚠️ مشكلة في صلاحيات API Key

## المشكلة
API Key الحالي لا يملك الصلاحيات الكافية لإنشاء Collections.

الخطأ: `"The current user is not authorized to perform the requested action"`

## الحل

### 1. احذف API Key القديم
1. اذهب إلى: https://cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/settings
2. Overview > Integrations > API Keys
3. احذف API Key الحالي (egygo)

### 2. أنشئ API Key جديد
1. اضغط **Create API Key**
2. الاسم: `Collections Creator`
3. **مهم جداً**: حدد **ALL SCOPES** (جميع الصلاحيات)
   - أو على الأقل حدد هذه الصلاحيات:
     - ✅ `databases.read`
     - ✅ `databases.write`
     - ✅ `collections.read`
     - ✅ `collections.write`
     - ✅ `attributes.read`
     - ✅ `attributes.write`
     - ✅ `indexes.read`
     - ✅ `indexes.write`
     - ✅ `buckets.read`
     - ✅ `buckets.write`

### 3. شغّل السكريبت مرة أخرى
بعد الحصول على API Key الجديد، افتح `create-collections.mjs` وغيّر السطر الأول:

```javascript
const API_KEY = 'ضع_API_KEY_الجديد_هنا';
```

ثم شغّل:
```bash
node create-collections.mjs
```

---

## بديل: إنشاء Collections يدوياً
إذا استمرت المشكلة، يمكنك إنشاء Collections يدوياً باتباع `COLLECTIONS_MANUAL_GUIDE.md`

هذا أبسط وأسرع في معظم الحالات! 🚀