# دليل إعداد Appwrite - الربط الفعلي

## الخطوة 1: إنشاء مشروع جديد

1. **اذهب إلى**: https://cloud.appwrite.io/
2. **سجل الدخول** أو **أنشئ حساب جديد**
3. **اضغط "Create Project"**
4. **اسم المشروع**: `EgyGo E-commerce`
5. **احفظ معرف المشروع** الذي سيظهر (مثل: `667xxxxxxxxxxxxx`)

## الخطوة 2: إضافة منصة الويب

1. في لوحة تحكم المشروع، اذهب إلى **Settings > Platforms**
2. اضغط **"Add Platform"**
3. اختر **"Web App"**
4. **الاسم**: `EgyGo Frontend`
5. **Hostname**: `localhost` (للتطوير المحلي)
6. اضغط **"Create"**

## الخطوة 3: تحديث التكوين في الكود

بعد إنشاء المشروع، احصل على:
- **Project ID**
- **Endpoint**: `https://cloud.appwrite.io/v1`

## الخطوة 4: إنشاء قاعدة البيانات

1. اذهب إلى **Databases**
2. اضغط **"Create Database"**
3. **Database ID**: `ecommerce-db`
4. **الاسم**: `E-commerce Database`

## الخطوة 5: إنشاء Collections

### المجموعة 1: users
- **Collection ID**: `users`
- **Name**: `Users`
- **Permissions**: Document-level permissions

**Attributes:**
```json
{
  "name": "string (255, required)",
  "email": "string (255, required, unique)",
  "phone": "string (20, optional)",
  "address": "string (500, optional)", 
  "isAffiliate": "boolean (default: false)",
  "affiliateCode": "string (10, optional, unique)",
  "commissionRate": "double (default: 0.15)"
}
```

### المجموعة 2: categories
- **Collection ID**: `categories`
- **Name**: `Categories`
- **Permissions**: Read: Any, Create/Update/Delete: Admins

**Attributes:**
```json
{
  "name": "string (255, required)",
  "description": "string (1000, optional)",
  "image": "string (255, optional)",
  "isActive": "boolean (default: true)"
}
```

### المجموعة 3: products
- **Collection ID**: `products`
- **Name**: `Products`
- **Permissions**: Read: Any, Create/Update/Delete: Admins

**Attributes:**
```json
{
  "name": "string (255, required)",
  "description": "string (2000, required)",
  "price": "double (required)",
  "comparePrice": "double (optional)",
  "stock": "integer (default: 0)",
  "images": "string array (2000)",
  "categoryId": "string (36, required)",
  "tags": "string array (50)",
  "isActive": "boolean (default: true)",
  "isFeatured": "boolean (default: false)",
  "rating": "double (default: 0)",
  "reviewCount": "integer (default: 0)"
}
```

### المجموعة 4: orders
- **Collection ID**: `orders`
- **Name**: `Orders` 
- **Permissions**: Document-level permissions

**Attributes:**
```json
{
  "userId": "string (36, required)",
  "total": "double (required)",
  "status": "string (20, default: 'pending')",
  "customerName": "string (255, required)",
  "customerEmail": "string (255, required)",
  "customerPhone": "string (20, required)",
  "shippingAddress": "string (1000, required)",
  "paymentMethod": "string (50, required)",
  "affiliateCode": "string (10, optional)",
  "affiliateCommission": "double (default: 0)"
}
```

## الخطوة 6: إنشاء Storage Bucket

1. اذهب إلى **Storage**
2. اضغط **"Create Bucket"**
3. **Bucket ID**: `product-images`
4. **Name**: `Product Images`
5. **Permissions**: 
   - Read: `any`
   - Create: `users`
   - Update: `users`
   - Delete: `users`
6. **File Security**: Disabled
7. **Maximum File Size**: 10MB
8. **Allowed File Extensions**: `jpg,jpeg,png,webp,gif`

## الخطوة 7: تحديث المتغيرات

بعد إنشاء كل شيء، حدث المتغيرات في الملف:
`.env`

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=[YOUR_PROJECT_ID_HERE]
VITE_APPWRITE_DATABASE_ID=ecommerce-db
VITE_APPWRITE_STORAGE_ID=product-images
```

## اختبار الاتصال

بعد التحديث، أعد تشغيل الخادم:
```bash
pnpm dev
```

## إضافة بيانات تجريبية

بعد التأكد من الاتصال، يمكنك إضافة فئات ومنتجات تجريبية من لوحة تحكم Appwrite.

---

**هل تريد مني مساعدتك في أي من هذه الخطوات؟**