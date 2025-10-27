# 🚀 إعداد Landing Pages في Appwrite

## 📋 المطلوب: إنشاء Collection جديدة

### **الخطوة 1: إنشاء Collection**

افتح Appwrite Console: https://cloud.appwrite.io

```
Database: egygo-database
Create New Collection:
  - Collection ID: landing_pages
  - Name: Landing Pages
```

---

### **الخطوة 2: إضافة Attributes**

أضف الحقول التالية بالترتيب:

#### **1. affiliateId** (String)
```
Type: String
Size: 100
Required: Yes
Array: No
```

#### **2. title** (String)
```
Type: String
Size: 200
Required: Yes
Array: No
```

#### **3. subtitle** (String)
```
Type: String
Size: 300
Required: No
Array: No
```

#### **4. description** (String)
```
Type: String
Size: 2000
Required: No
Array: No
```

#### **5. ctaText** (String)
```
Type: String
Size: 100
Required: No
Default: "اشترِ الآن"
Array: No
```

#### **6. productUrl** (String)
```
Type: String
Size: 500
Required: Yes
Array: No
```

#### **7. affiliateLink** (String)
```
Type: String
Size: 500
Required: Yes
Array: No
```

#### **8. template** (String)
```
Type: String
Size: 50
Required: No
Default: "modern"
Array: No
```

#### **9. colorScheme** (String)
```
Type: String
Size: 50
Required: No
Default: "blue"
Array: No
```

#### **10. features** (String Array)
```
Type: String
Size: 200
Required: No
Array: Yes ✅
```

#### **11. testimonials** (Boolean)
```
Type: Boolean
Required: No
Default: true
```

#### **12. countdown** (Boolean)
```
Type: Boolean
Required: No
Default: false
```

#### **13. slug** (String)
```
Type: String
Size: 200
Required: Yes
Array: No
```

#### **14. views** (Integer)
```
Type: Integer
Required: No
Default: 0
Min: 0
```

#### **15. clicks** (Integer)
```
Type: Integer
Required: No
Default: 0
Min: 0
```

#### **16. conversions** (Integer)
```
Type: Integer
Required: No
Default: 0
Min: 0
```

#### **17. isActive** (Boolean)
```
Type: Boolean
Required: No
Default: true
```

---

### **الخطوة 3: إعداد Indexes**

أضف Indexes لتحسين الأداء:

#### **Index 1: affiliateId**
```
Key: idx_affiliate
Type: key
Attributes: affiliateId (ASC)
```

#### **Index 2: slug**
```
Key: idx_slug
Type: unique
Attributes: slug (ASC)
```

#### **Index 3: isActive**
```
Key: idx_active
Type: key
Attributes: isActive (ASC)
```

---

### **الخطوة 4: Permissions**

```
Read Access:
  - Any (للسماح بعرض الصفحات للجميع)

Write Access:
  - Users (للسماح للمسوقين بإنشاء صفحات)

Update Access:
  - Users (للسماح بتحديث الإحصائيات)

Delete Access:
  - Users (للسماح بحذف الصفحات)
```

---

## ✅ **التحقق من الإعداد**

بعد إنشاء Collection، تحقق من:

```
✅ Collection ID: landing_pages
✅ 17 Attributes موجودة
✅ 3 Indexes موجودة
✅ Permissions مضبوطة
```

---

## 🔗 **كيف تعمل الروابط التسويقية**

### **قبل التحسين:**
```
❌ https://egygo.me/#/product/123
   (لا يعمل مع Appwrite - يحتوي على #)
```

### **بعد التحسين:**
```
✅ https://egygo.me/product/123?ref=AFFILIATE_CODE
   (يعمل بشكل صحيح - بدون #)
```

---

## 📊 **مثال على البيانات المحفوظة**

```json
{
  "affiliateId": "user123",
  "title": "عرض حصري - خصم 50%",
  "subtitle": "لفترة محدودة فقط",
  "description": "احصل على أفضل المنتجات بأقل الأسعار",
  "ctaText": "اشترِ الآن",
  "productUrl": "https://egygo.me/product/68f7043ee047d34e531e",
  "affiliateLink": "https://egygo.me/product/68f7043ee047d34e531e?ref=user123",
  "template": "modern",
  "colorScheme": "blue",
  "features": ["شحن مجاني", "ضمان سنة", "دعم 24/7"],
  "testimonials": true,
  "countdown": false,
  "slug": "عرض-حصري-خصم-50",
  "views": 150,
  "clicks": 45,
  "conversions": 8,
  "isActive": true
}
```

---

## 🎯 **الميزات الجديدة**

### **1. اختيار المنتج من القائمة**
```tsx
// الآن يمكن اختيار المنتج من dropdown
<Select>
  {products.map(product => (
    <SelectItem value={product.url}>
      {product.name} - {product.price} ج.م
    </SelectItem>
  ))}
</Select>
```

### **2. توليد روابط صحيحة**
```typescript
// بدون hash (#)
const affiliateLink = `https://egygo.me/product/${productId}?ref=${affiliateCode}`;
```

### **3. حفظ في قاعدة البيانات**
```typescript
await databases.createDocument(
  databaseId,
  'landing_pages',
  pageId,
  { ...pageData }
);
```

### **4. عرض الصفحات المحفوظة**
```
- قائمة بجميع الروابط التسويقية
- إحصائيات لكل رابط (مشاهدات، نقرات، تحويلات)
- أزرار نسخ وفتح
```

### **5. إحصائيات حقيقية**
```
- عدد الصفحات المنشأة
- إجمالي الزيارات
- إجمالي النقرات
```

---

## 🔄 **بعد الإعداد**

### **1. ارفع الكود:**
```powershell
git add .
git commit -m "feat: improve affiliate landing pages with Appwrite integration"
git push
```

### **2. ابني المشروع:**
```powershell
npm run build
```

### **3. ارفع للموقع:**
```powershell
netlify deploy --prod --dir=dist
```

---

## 🧪 **اختبار الصفحة**

1. **افتح الصفحة:**
   ```
   https://egygo.me/#/affiliate/landing-pages
   ```

2. **اختر منتج:**
   - من القائمة المنسدلة
   - أو أدخل الرابط يدوياً

3. **أنشئ الصفحة:**
   - اضغط "إنشاء الصفحة"
   - انتظر التأكيد

4. **انسخ الرابط:**
   - اضغط زر "نسخ"
   - استخدم الرابط في حملاتك التسويقية

5. **تحقق من الإحصائيات:**
   - شاهد عدد المشاهدات
   - شاهد عدد النقرات
   - شاهد عدد التحويلات

---

## ⚠️ **ملاحظات مهمة**

1. **Collection يجب أن يكون موجود:**
   - بدون Collection، الصفحة ستعمل لكن لن تحفظ البيانات
   - سيظهر تحذير في Console

2. **Permissions مهمة:**
   - تأكد أن Users لديهم صلاحية Write
   - وإلا لن يستطيعوا إنشاء صفحات

3. **الروابط بدون Hash:**
   - الروابط الجديدة لا تحتوي على `#`
   - تعمل بشكل أفضل مع Appwrite
   - أسهل في التتبع

4. **Affiliate Code:**
   - يُستخدم `user.affiliateCode` إن وُجد
   - وإلا يُستخدم `user.$id`

---

**آخر تحديث:** 21 أكتوبر 2025  
**الحالة:** جاهز للتطبيق ✅  
**الأولوية:** متوسطة 🟡
