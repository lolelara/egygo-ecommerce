# 🗄️ دليل إعداد قاعدة البيانات

## 📋 المتطلبات

قبل تشغيل السكريبت، تأكد من:

1. ✅ تثبيت Node.js (v18+)
2. ✅ تثبيت جميع الحزم: `npm install`
3. ✅ إعداد ملف `.env` بالمعلومات الصحيحة

## 🔑 إعداد ملف .env

تأكد من وجود المتغيرات التالية في ملف `.env`:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
APPWRITE_API_KEY=your_api_key
```

### كيفية الحصول على API Key:

1. افتح [Appwrite Console](https://cloud.appwrite.io)
2. اذهب إلى **Settings** → **API Keys**
3. اضغط **Create API Key**
4. اختر الصلاحيات:
   - ✅ databases.read
   - ✅ databases.write
   - ✅ collections.read
   - ✅ collections.write
   - ✅ attributes.read
   - ✅ attributes.write
   - ✅ indexes.read
   - ✅ indexes.write
5. انسخ الـ API Key وضعه في `.env`

## 🚀 تشغيل السكريبت

```bash
npm run setup:database
```

## 📊 ما الذي سيتم إنشاؤه؟

السكريبت سينشئ 7 Collections جديدة:

### 1. **stock_notifications** 📦
إشعارات عند توفر المنتج
- `productId` - معرف المنتج
- `productName` - اسم المنتج
- `email` - البريد الإلكتروني
- `userId` - معرف المستخدم (اختياري)
- `notified` - هل تم الإشعار؟
- `createdAt` - تاريخ الإنشاء

**Indexes:**
- `idx_email` - للبحث بالبريد
- `idx_product` - للبحث بالمنتج

---

### 2. **addresses** 📍
عناوين المستخدمين
- `userId` - معرف المستخدم
- `label` - نوع العنوان (home/work/other)
- `name` - الاسم الكامل
- `phone` - رقم الهاتف
- `street` - الشارع والعنوان التفصيلي
- `city` - المدينة
- `governorate` - المحافظة
- `postalCode` - الرمز البريدي (اختياري)
- `isDefault` - عنوان افتراضي؟

**Indexes:**
- `idx_user` - للبحث بالمستخدم

---

### 3. **loyalty_points** ⭐
نقاط الولاء
- `userId` - معرف المستخدم
- `points` - النقاط الحالية
- `totalEarned` - إجمالي النقاط المكتسبة
- `totalRedeemed` - إجمالي النقاط المستخدمة
- `level` - المستوى (برونزي/فضي/ذهبي...)

**Indexes:**
- `idx_user` - للبحث بالمستخدم

---

### 4. **loyalty_history** 📜
سجل نقاط الولاء
- `userId` - معرف المستخدم
- `points` - عدد النقاط
- `type` - نوع العملية (earned/redeemed)
- `description` - الوصف

**Indexes:**
- `idx_user` - للبحث بالمستخدم

---

### 5. **flash_sales** ⚡
عروض الفلاش سيل
- `title` - عنوان العرض
- `discount` - نسبة الخصم
- `startDate` - تاريخ البداية
- `endDate` - تاريخ النهاية
- `merchantId` - معرف التاجر
- `merchantName` - اسم التاجر
- `status` - الحالة (scheduled/active/ended)
- `productIds` - معرفات المنتجات (array)
- `createdAt` - تاريخ الإنشاء

**Indexes:**
- `idx_merchant` - للبحث بالتاجر
- `idx_status` - للبحث بالحالة

---

### 6. **affiliate_goals** 🎯
أهداف المسوقين
- `userId` - معرف المستخدم
- `title` - عنوان الهدف
- `target` - الهدف المطلوب
- `current` - التقدم الحالي
- `deadline` - الموعد النهائي
- `type` - نوع الهدف (sales/earnings/clicks)
- `status` - الحالة (active/completed/failed)
- `createdAt` - تاريخ الإنشاء

**Indexes:**
- `idx_user` - للبحث بالمستخدم

---

### 7. **product_variants** 🎨
تنويعات المنتجات (ألوان ومقاسات)
- `productId` - معرف المنتج
- `type` - نوع التنويع (color/size)
- `value` - القيمة (أحمر/كبير...)
- `price` - سعر إضافي (اختياري)
- `stock` - الكمية المتاحة

**Indexes:**
- `idx_product` - للبحث بالمنتج

---

## ✅ التحقق من النجاح

بعد تشغيل السكريبت، يجب أن ترى:

```
🚀 Starting database setup...

📦 Creating stock_notifications...
✅ stock_notifications created

📍 Creating addresses...
✅ addresses created

⭐ Creating loyalty_points...
✅ loyalty_points created

📜 Creating loyalty_history...
✅ loyalty_history created

⚡ Creating flash_sales...
✅ flash_sales created

🎯 Creating affiliate_goals...
✅ affiliate_goals created

🎨 Creating product_variants...
✅ product_variants created

✅ Database setup completed!

📊 Collections created:
   1. stock_notifications ✅
   2. addresses ✅
   3. loyalty_points ✅
   4. loyalty_history ✅
   5. flash_sales ✅
   6. affiliate_goals ✅
   7. product_variants ✅

🎉 Ready to use!
```

## 🔍 التحقق من Appwrite Console

1. افتح [Appwrite Console](https://cloud.appwrite.io)
2. اذهب إلى **Databases**
3. اختر قاعدة البيانات الخاصة بك
4. يجب أن ترى جميع الـ Collections الجديدة

## ⚠️ ملاحظات مهمة

1. **السكريبت آمن للتشغيل المتكرر**
   - إذا كانت Collection موجودة، سيتم تخطيها
   - لن يتم حذف أي بيانات موجودة

2. **الصلاحيات**
   - جميع Collections لها صلاحيات قراءة عامة
   - الكتابة والتعديل للمستخدمين المسجلين فقط

3. **الـ Indexes**
   - تم إنشاء indexes لتحسين الأداء
   - تسريع عمليات البحث والاستعلام

## 🐛 حل المشاكل

### خطأ: "Invalid API Key"
- تأكد من صحة `APPWRITE_API_KEY` في `.env`
- تأكد من أن الـ API Key لديه الصلاحيات المطلوبة

### خطأ: "Database not found"
- تأكد من صحة `VITE_APPWRITE_DATABASE_ID`
- تأكد من وجود قاعدة البيانات في Appwrite

### خطأ: "Collection already exists"
- هذا طبيعي! يعني أن Collection موجودة بالفعل
- السكريبت سيتخطاها ويكمل

### خطأ: "Attribute already exists"
- هذا طبيعي أيضاً
- يعني أن الـ attribute موجود بالفعل

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من ملف `.env`
2. تأكد من صلاحيات الـ API Key
3. راجع console logs للتفاصيل
4. افتح issue على GitHub

## 🎉 الخطوات التالية

بعد إعداد قاعدة البيانات:

1. ✅ شغل التطبيق: `npm run dev`
2. ✅ جرب المكونات الجديدة
3. ✅ تحقق من عمل كل شيء بشكل صحيح

---

**تم إنشاء هذا الدليل بواسطة EgyGo Team** 🇪🇬
