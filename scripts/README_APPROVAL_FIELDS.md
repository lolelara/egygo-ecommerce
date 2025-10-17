# 🔧 سكريبت إضافة حقول موافقة المنتجات

## 📋 الوصف

هذا السكريبت يضيف تلقائياً الحقول المطلوبة لنظام موافقة المنتجات إلى Appwrite Collection.

---

## 🗄️ الحقول التي سيتم إضافتها

| الحقل | النوع | Required | Default | الحجم |
|------|------|----------|---------|-------|
| `verificationVideo` | String | ❌ No | null | 500 |
| `approvalStatus` | Enum | ✅ Yes | `pending` | - |
| `rejectionReason` | String | ❌ No | null | 1000 |
| `approvedAt` | String | ❌ No | null | 50 |
| `approvedBy` | String | ❌ No | null | 50 |

### **Enum Values for `approvalStatus`:**
- `pending` - قيد المراجعة
- `approved` - تمت الموافقة  
- `rejected` - مرفوض

---

## 🚀 التشغيل

### **الطريقة 1: PowerShell (موصى به)**
```powershell
.\ADD_APPROVAL_FIELDS.ps1
```

### **الطريقة 2: Batch File**
```cmd
ADD_APPROVAL_FIELDS.bat
```

### **الطريقة 3: Node.js مباشرة**
```bash
node scripts/add-product-approval-fields.js
```

---

## ✅ المتطلبات

### **1. ملف `.env` يجب أن يحتوي على:**
```env
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-project-id
VITE_APPWRITE_DATABASE_ID=your-database-id
VITE_APPWRITE_PRODUCTS_COLLECTION=products
APPWRITE_API_KEY=your-api-key
```

### **2. تثبيت node-appwrite:**
```bash
npm install node-appwrite --save-dev
```
(السكريبت سيقوم بتثبيته تلقائياً إذا لم يكن موجوداً)

---

## 📝 سير العمل

1. **التحقق من البيئة:**
   - يتحقق من وجود ملف `.env`
   - يتحقق من تثبيت `node-appwrite`

2. **الاتصال بـ Appwrite:**
   - يستخدم API Key من `.env`
   - يتصل بـ Database المحدد

3. **إضافة الحقول:**
   - يضيف كل حقل على حدة
   - يتخطى الحقول الموجودة مسبقاً
   - يعرض رسائل واضحة لكل خطوة

4. **التأكيد:**
   - يعرض ملخص بالحقول المضافة
   - يوضح الخطوات التالية

---

## 🔍 معالجة الأخطاء

### **خطأ 409: الحقل موجود**
```
⚠️ approvalStatus موجود بالفعل
```
**الحل:** هذا طبيعي - الحقل موجود مسبقاً

### **خطأ 401: Unauthorized**
```
❌ حدث خطأ: Unauthorized
```
**الحل:** تحقق من `APPWRITE_API_KEY` في ملف `.env`

### **خطأ 404: Collection not found**
```
❌ حدث خطأ: Collection not found
```
**الحل:** تحقق من:
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_PRODUCTS_COLLECTION`

---

## 🎯 الخطوات بعد التشغيل

### **1. التحقق من Appwrite Dashboard**
```
1. افتح Appwrite Dashboard
2. اذهب للـ Database
3. افتح Collection: products
4. تحقق من وجود الحقول الجديدة
```

### **2. تحديث Permissions**
تأكد من Permissions للـ Collection:
- **Create**: Merchants, Admins
- **Read**: All (مع فلترة في الكود)
- **Update**: Admins, Owner
- **Delete**: Admins, Owner

### **3. Build & Deploy**
```bash
npm run build
npm run deploy
```

---

## 📊 مخرجات السكريبت

### **ناجح:**
```
═══════════════════════════════════════════════
   🔐 إضافة حقول موافقة المنتجات
═══════════════════════════════════════════════

📋 المعلومات:
   Database ID: 68de037e003bd03c4d45
   Collection ID: products

1️⃣ إضافة حقل verificationVideo...
   ✅ تم إضافة verificationVideo بنجاح

2️⃣ إضافة حقل approvalStatus...
   ✅ تم إضافة approvalStatus بنجاح

3️⃣ إضافة حقل rejectionReason...
   ✅ تم إضافة rejectionReason بنجاح

4️⃣ إضافة حقل approvedAt...
   ✅ تم إضافة approvedAt بنجاح

5️⃣ إضافة حقل approvedBy...
   ✅ تم إضافة approvedBy بنجاح

═══════════════════════════════════════════════
✨ تم إضافة جميع الحقول بنجاح!
═══════════════════════════════════════════════
```

### **فشل:**
```
❌ حدث خطأ: [رسالة الخطأ]

التفاصيل: [تفاصيل الخطأ الكاملة]
```

---

## 🛠️ استكشاف الأخطاء

### **المشكلة: لا يعمل السكريبت**

1. تحقق من Node.js:
   ```bash
   node --version
   ```
   يجب أن يكون v16 أو أعلى

2. تحقق من npm:
   ```bash
   npm --version
   ```

3. أعد تثبيت Dependencies:
   ```bash
   npm install
   ```

### **المشكلة: خطأ في API Key**

1. تحقق من `.env`:
   ```bash
   cat .env | findstr APPWRITE_API_KEY
   ```

2. تأكد أن API Key صحيح من Appwrite Dashboard

3. تأكد أن API Key له صلاحيات كافية

---

## 📚 موارد إضافية

- [Appwrite Databases API](https://appwrite.io/docs/databases)
- [Appwrite Attributes](https://appwrite.io/docs/databases#attributes)
- [PRODUCT_APPROVAL_SYSTEM.md](../PRODUCT_APPROVAL_SYSTEM.md)

---

## 🤝 المساهمة

إذا واجهت أي مشاكل أو لديك اقتراحات، يرجى:
1. فتح Issue في GitHub
2. التواصل مع فريق التطوير

---

## 📜 الترخيص

هذا السكريبت جزء من مشروع EgyGo ومرخص تحت نفس الترخيص.

---

**✅ جاهز للاستخدام!**
