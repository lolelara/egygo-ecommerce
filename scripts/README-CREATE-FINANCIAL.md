# 📦 سكريبت إنشاء Collections المالية

## 🎯 الهدف
إنشاء الـ Collections والـ Storage Buckets الناقصة في النظام المالي.

---

## ✅ ما سيتم إنشاؤه

### 1. **merchantPayments Collection**
مدفوعات التجار للمنصة (العمولات + رسوم المنصة)

**الحقول:**
- `merchantId` - معرف التاجر
- `merchantName` - اسم التاجر
- `orderId` - رقم الطلب
- `totalAmount` - المبلغ الإجمالي
- `commissionAmount` - مبلغ العمولة
- `platformFee` - رسوم المنصة
- `transferProof` - إثبات التحويل (صورة)
- `notes` - ملاحظات
- `status` - الحالة (pending, verified, completed, rejected)
- `paymentMethod` - طريقة الدفع
- `accountDetails` - تفاصيل الحساب
- `createdAt` - تاريخ الإنشاء
- `verifiedAt` - تاريخ التحقق
- `verifiedBy` - من قام بالتحقق

**Indexes:**
- `merchantId_idx` - للبحث بمعرف التاجر
- `status_idx` - للبحث بالحالة
- `createdAt_idx` - للترتيب بالتاريخ

---

### 2. **withdrawalRequests Collection**
طلبات سحب الأرباح (مسوقين وتجار)

**الحقول:**
- `userId` - معرف المستخدم
- `userName` - اسم المستخدم
- `userType` - نوع المستخدم (affiliate, merchant)
- `amount` - المبلغ المطلوب
- `method` - طريقة السحب (vodafone, instapay, bank, fawry)
- `accountDetails` - تفاصيل الحساب
- `phoneNumber` - رقم الهاتف (للمحافظ)
- `bankName` - اسم البنك
- `accountNumber` - رقم الحساب
- `accountHolder` - صاحب الحساب
- `status` - الحالة (pending, processing, completed, rejected)
- `rejectionReason` - سبب الرفض
- `paymentProof` - إثبات الدفع
- `transactionId` - رقم المعاملة
- `notes` - ملاحظات
- `createdAt` - تاريخ الطلب
- `processedAt` - تاريخ المعالجة
- `processedBy` - من قام بالمعالجة

**Indexes:**
- `userId_idx` - للبحث بمعرف المستخدم
- `status_idx` - للبحث بالحالة
- `userType_idx` - للبحث بنوع المستخدم
- `createdAt_idx` - للترتيب بالتاريخ

---

### 3. **payment-proofs Storage Bucket**
تخزين إثباتات الدفع (صور وملفات PDF)

**المواصفات:**
- الحد الأقصى لحجم الملف: **5MB**
- الامتدادات المسموحة: **jpg, jpeg, png, webp, pdf**
- الضغط: **gzip**
- التشفير: **مُفعّل**
- الحماية من الفيروسات: **مُفعّلة**

---

## 🔧 المتطلبات

### 1. تثبيت node-appwrite (إذا لم يكن مثبتاً)
```bash
npm install node-appwrite
```

### 2. ملف .env صحيح
تأكد من وجود الملف `.env` في المجلد الرئيسي مع القيم التالية:

```env
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=68d8b9db00134c41e7c8
VITE_APPWRITE_DATABASE_ID=68de037e003bd03c4d45
APPWRITE_API_KEY=standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5
APPWRITE_PROJECT_ID=68d8b9db00134c41e7c8
```

**ملاحظة:** المفتاح `APPWRITE_API_KEY` يجب أن يكون لديه الصلاحيات التالية:
- `databases.write` - لإنشاء Collections
- `storage.write` - لإنشاء Storage Buckets

---

## 🚀 طريقة التشغيل

### من المجلد الرئيسي للمشروع:
```bash
node scripts/create-financial-collections.js
```

---

## 📊 الناتج المتوقع

```bash
🚀 بدء إنشاء Collections المالية...

📋 DATABASE_ID: 68de037e003bd03c4d45
📋 PROJECT_ID: 68d8b9db00134c41e7c8
─────────────────────────────────────────

📦 إنشاء merchantPayments collection...
✅ merchantPayments collection created
✅ merchantPayments attributes created
✅ merchantPayments indexes created

📦 إنشاء withdrawalRequests collection...
✅ withdrawalRequests collection created
✅ withdrawalRequests attributes created
✅ withdrawalRequests indexes created

📦 إنشاء payment-proofs storage bucket...
✅ payment-proofs bucket created

─────────────────────────────────────────
🎉 تم إنشاء جميع Collections بنجاح!

📋 الملخص:
  ✅ merchantPayments collection
  ✅ withdrawalRequests collection
  ✅ payment-proofs storage bucket

✨ يمكنك الآن استخدام النظام المالي!

🔗 الخطوات التالية:
  1. تحقق من Collections في Appwrite Console
  2. اختبر الصفحات المالية
  3. قم بإنشاء Server Routes
─────────────────────────────────────────
```

---

## ⚠️ حل المشاكل

### خطأ: "Invalid API key"
**الحل:**
1. تأكد من نسخ الـ API Key بشكل صحيح
2. تأكد أن الـ API Key لديه الصلاحيات المطلوبة
3. جرب إنشاء API Key جديد

### خطأ: "Collection already exists" (409)
**الحل:**
- هذا عادي! Collection موجودة بالفعل
- السكريبت سيتخطاها ويكمل

### خطأ: "Database not found"
**الحل:**
1. تحقق من `VITE_APPWRITE_DATABASE_ID` في `.env`
2. تأكد من أن قاعدة البيانات موجودة في Appwrite Console
3. المعرف الحالي: `68de037e003bd03c4d45`

### خطأ: "node-appwrite not found"
**الحل:**
```bash
npm install node-appwrite
```

---

## ✅ التحقق من النجاح

### في Appwrite Console:
1. اذهب إلى: https://cloud.appwrite.io/console
2. افتح مشروعك: `68d8b9db00134c41e7c8`
3. افتح قاعدة البيانات: `68de037e003bd03c4d45`
4. تأكد من وجود:
   - ✅ Collection: `merchantPayments`
   - ✅ Collection: `withdrawalRequests`
5. افتح Storage
6. تأكد من وجود:
   - ✅ Bucket: `payment-proofs`

---

## 🔗 الصفحات التي ستعمل بعد التشغيل

### للتاجر:
- `/merchant/financial` - صفحة المعاملات المالية
- رفع إثبات الدفع

### للمسوق:
- `/affiliate/withdraw` - طلب سحب الأرباح
- `/affiliate/earnings` - تاريخ العمولات

### للأدمن:
- `/admin/financial` - إدارة المعاملات المالية
- `/admin/withdrawals` - إدارة طلبات السحب (قريباً)
- `/admin/merchant-payments` - إدارة مدفوعات التجار (قريباً)

---

## 📞 طرق الدفع المدعومة

### للسحب:
- ✅ **Vodafone Cash:** 01034324551
- ✅ **InstaPay:** ebank_hema@instapay
- ✅ **Bank Transfer** (تحويل بنكي)
- ✅ **Fawry** (فوري)

### الحد الأدنى للسحب:
- **100 جنيه مصري**

### مدة المعالجة:
- **7 أيام عمل**

---

## 🎯 الخطوة التالية

بعد نجاح السكريبت، قم بـ:

1. ✅ **إنشاء Server Routes المالية**
   ```
   server/routes/financial.ts
   server/routes/withdrawals.ts
   server/routes/merchant-payments.ts
   ```

2. ✅ **اختبار الصفحات المالية**
   - جرب رفع إثبات دفع
   - جرب طلب سحب
   - تحقق من عمل الأدمن

3. ✅ **إنشاء الصفحات الناقصة**
   - AdminWithdrawalsManager.tsx
   - AdminMerchantPaymentsManager.tsx

---

**✨ بالتوفيق! النظام المالي الآن جاهز للعمل!**
