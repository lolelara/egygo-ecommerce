# دليل إعداد Appwrite لمتجر شوب كو

## الخطوة 1: إعداد المشروع في Appwrite Cloud

1. **افتح Appwrite Console**: https://cloud.appwrite.io/console/project-fra-68d8b9db00134c41e7c8
2. **تأكد من معرف المشروع**: `fra-68d8b9db00134c41e7c8`

## الخطوة 2: إنشاء قاعدة البيانات والمجموعات

### إنشاء قاعدة البيانات:
1. اذهب إلى **Databases** في لوحة التحكم
2. اضغط **Create Database**
3. الاسم: `E-commerce Database`
4. Database ID: `ecommerce-db`

### إنشاء المجموعات (Collections):

#### 1. مجموعة المستخدمين (users)
- Collection ID: `users`
- Document Security: **enabled**
- Attributes:
  ```
  name (string, 255, required)
  email (string, 255, required, unique index)
  phone (string, 20)
  address (string, 500)
  isAffiliate (boolean, default: false)
  affiliateCode (string, 10, unique index)
  commissionRate (double, default: 0.15)
  ```

#### 2. مجموعة الفئات (categories)
- Collection ID: `categories`
- Document Security: **disabled**
- Attributes:
  ```
  name (string, 255, required)
  description (string, 1000)
  image (string, 255)
  isActive (boolean, default: true)
  ```

#### 3. مجموعة المنتجات (products)
- Collection ID: `products`
- Document Security: **disabled**
- Attributes:
  ```
  name (string, 255, required)
  description (string, 2000, required)
  price (double, required, index)
  comparePrice (double)
  stock (integer, default: 0)
  images (string array, 2000)
  categoryId (string, 36, required, index)
  tags (string array, 50)
  isActive (boolean, default: true)
  isFeatured (boolean, default: false, index)
  rating (double, default: 0)
  reviewCount (integer, default: 0)
  ```

#### 4. مجموعة الطلبات (orders)
- Collection ID: `orders`
- Document Security: **enabled**
- Attributes:
  ```
  userId (string, 36, required, index)
  total (double, required)
  status (string, 20, default: "pending", index)
  customerName (string, 255, required)
  customerEmail (string, 255, required)
  customerPhone (string, 20, required)
  shippingAddress (string, 1000, required)
  paymentMethod (string, 50, required)
  affiliateCode (string, 10, index)
  affiliateCommission (double, default: 0)
  ```

#### 5. مجموعة عناصر الطلبات (order-items)
- Collection ID: `order-items`
- Document Security: **enabled**
- Attributes:
  ```
  orderId (string, 36, required, index)
  productId (string, 36, required, index)
  productName (string, 255, required)
  productImage (string, 255)
  price (double, required)
  quantity (integer, required)
  total (double, required)
  ```

#### 6. مجموعة التقييمات (reviews)
- Collection ID: `reviews`
- Document Security: **enabled**
- Attributes:
  ```
  productId (string, 36, required, index)
  userId (string, 36, required, index)
  userName (string, 255, required)
  rating (integer, required)
  comment (string, 1000)
  isApproved (boolean, default: false)
  ```

#### 7. مجموعة الشركاء (affiliates)
- Collection ID: `affiliates`
- Document Security: **enabled**
- Attributes:
  ```
  userId (string, 36, required, unique index)
  code (string, 10, required, unique index)
  commissionRate (double, default: 0.15)
  totalEarnings (double, default: 0)
  totalSales (integer, default: 0)
  isActive (boolean, default: true)
  ```

## الخطوة 3: إعداد Storage Bucket

1. اذهب إلى **Storage** في لوحة التحكم
2. اضغط **Create Bucket**
3. Bucket ID: `product-images`
4. الاسم: `Product Images`
5. الحد الأقصى لحجم الملف: `10MB`
6. الملفات المسموحة: `jpg, jpeg, png, webp, gif`
7. Permissions:
   ```
   read("any")
   create("users")
   update("users")
   delete("users")
   ```

## الخطوة 4: إعداد المصادقة (Authentication)

1. اذهب إلى **Auth** في لوحة التحكم
2. فعّل **Email/Password** authentication
3. اضبط **Password Policy**:
   - الحد الأدنى: 8 أحرف
   - يجب أن يحتوي على أرقام وحروف

## الخطوة 5: ضبط الصلاحيات (Permissions)

### للمجموعات مع Document Security:
- **users**: `read("user:self")`, `write("user:self")`
- **orders**: `read("user:self")`, `create("users")`, `update("user:self")`
- **order-items**: `read("user:self")`, `create("users")`
- **reviews**: `read("any")`, `create("users")`, `update("user:self")`
- **affiliates**: `read("user:self")`, `create("users")`, `update("user:self")`

### للمجموعات بدون Document Security:
- **categories**: `read("any")`, `create("role:admin")`, `update("role:admin")`
- **products**: `read("any")`, `create("role:admin")`, `update("role:admin")`

## الخطوة 6: نشر البيانات التجريبية

سيتم إنشاء سكريبت لإضافة بيانات تجريبية للفئات والمنتجات.

## الخطوة 7: التحقق من الإعداد

1. افتح الموقع: http://localhost:8080
2. سجل حساب جديد
3. جرب إضافة منتج إلى السلة
4. جرب إنشاء طلب جديد

## ملاحظات مهمة:

1. **أمان البيانات**: تأكد من ضبط الصلاحيات بدقة
2. **النسخ الاحتياطي**: فعّل النسخ الاحتياطي التلقائي
3. **المراقبة**: راقب استخدام قاعدة البيانات والتخزين
4. **التحديثات**: تابع تحديثات Appwrite

## روابط مفيدة:

- [Appwrite Documentation](https://appwrite.io/docs)
- [Appwrite React SDK](https://appwrite.io/docs/sdks/web)
- [Appwrite Dashboard](https://cloud.appwrite.io/console/project-fra-68d8b9db00134c41e7c8)