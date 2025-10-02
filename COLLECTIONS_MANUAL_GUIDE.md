# دليل إنشاء Collections في Appwrite Console بشكل يدوي

هذا الدليل لإنشاء 7 Collections مطلوبة للمشروع في Appwrite Console بشكل يدوي.

## 📋 القائمة المطلوبة
- [x] إنشاء Database: egygo (ID: 68de037e003bd03c4d45) ✅ تم
- [ ] Collection 1: users
- [ ] Collection 2: categories  
- [ ] Collection 3: products
- [ ] Collection 4: orders
- [ ] Collection 5: order_items
- [ ] Collection 6: reviews
- [ ] Collection 7: affiliates
- [ ] Storage Bucket: product-images

---

## 1️⃣ Collection: users

### الخطوات:
1. في Appwrite Console، اذهب إلى Database > egygo
2. اضغط **Create Collection**
3. املأ البيانات:
   - **Collection ID**: `users`
   - **Collection Name**: `Users`
   - **Document Security**: ✅ Enable (مُفعّل)

### Attributes:
```
name          | String  | Size: 255 | Required: ✅ | Array: ❌
email         | String  | Size: 255 | Required: ✅ | Array: ❌  
phone         | String  | Size: 20  | Required: ❌ | Array: ❌
address       | String  | Size: 500 | Required: ❌ | Array: ❌
isAffiliate   | Boolean |           | Required: ❌ | Default: false
affiliateCode | String  | Size: 10  | Required: ❌ | Array: ❌
commissionRate| Float   |           | Required: ❌ | Default: 0.15
```

### Indexes:
```
Key: email_index
Type: Key
Attributes: [email]
```

---

## 2️⃣ Collection: categories

### الخطوات:
1. اضغط **Create Collection**
2. املأ البيانات:
   - **Collection ID**: `categories`
   - **Collection Name**: `Categories`
   - **Document Security**: ❌ Disable (مُعطّل)

### Attributes:
```
name        | String  | Size: 255  | Required: ✅ | Array: ❌
description | String  | Size: 1000 | Required: ❌ | Array: ❌
image       | String  | Size: 255  | Required: ❌ | Array: ❌
isActive    | Boolean |            | Required: ❌ | Default: true
```

### Indexes: لا توجد

---

## 3️⃣ Collection: products

### الخطوات:
1. اضغط **Create Collection**
2. املأ البيانات:
   - **Collection ID**: `products`
   - **Collection Name**: `Products`
   - **Document Security**: ❌ Disable (مُعطّل)

### Attributes:
```
name         | String  | Size: 255  | Required: ✅ | Array: ❌
description  | String  | Size: 2000 | Required: ✅ | Array: ❌
price        | Float   |            | Required: ✅ | Array: ❌
comparePrice | Float   |            | Required: ❌ | Array: ❌
stock        | Integer |            | Required: ✅ | Default: 0
images       | String  | Size: 2000 | Required: ❌ | Array: ✅
categoryId   | String  | Size: 36   | Required: ✅ | Array: ❌
tags         | String  | Size: 50   | Required: ❌ | Array: ✅
isActive     | Boolean |            | Required: ❌ | Default: true
isFeatured   | Boolean |            | Required: ❌ | Default: false
rating       | Float   |            | Required: ❌ | Default: 0
reviewCount  | Integer |            | Required: ❌ | Default: 0
```

### Indexes:
```
Key: category_index
Type: Key  
Attributes: [categoryId]

Key: price_index
Type: Key
Attributes: [price]

Key: featured_index  
Type: Key
Attributes: [isFeatured]
```

---

## 4️⃣ Collection: orders

### الخطوات:
1. اضغط **Create Collection**
2. املأ البيانات:
   - **Collection ID**: `orders`
   - **Collection Name**: `Orders`
   - **Document Security**: ✅ Enable (مُفعّل)

### Attributes:
```
userId             | String | Size: 36   | Required: ✅ | Array: ❌
total              | Float  |            | Required: ✅ | Array: ❌
status             | String | Size: 20   | Required: ✅ | Default: "pending"
customerName       | String | Size: 255  | Required: ✅ | Array: ❌
customerEmail      | String | Size: 255  | Required: ✅ | Array: ❌
customerPhone      | String | Size: 20   | Required: ✅ | Array: ❌
shippingAddress    | String | Size: 1000 | Required: ✅ | Array: ❌
paymentMethod      | String | Size: 50   | Required: ✅ | Array: ❌
affiliateCode      | String | Size: 10   | Required: ❌ | Array: ❌
affiliateCommission| Float  |            | Required: ❌ | Default: 0
```

### Indexes:
```
Key: user_orders_index
Type: Key
Attributes: [userId]

Key: status_index
Type: Key  
Attributes: [status]
```

---

## 5️⃣ Collection: order_items

### الخطوات:
1. اضغط **Create Collection**
2. املأ البيانات:
   - **Collection ID**: `order_items`
   - **Collection Name**: `Order Items`
   - **Document Security**: ✅ Enable (مُفعّل)

### Attributes:
```
orderId      | String | Size: 36  | Required: ✅ | Array: ❌
productId    | String | Size: 36  | Required: ✅ | Array: ❌
productName  | String | Size: 255 | Required: ✅ | Array: ❌
productImage | String | Size: 255 | Required: ❌ | Array: ❌
price        | Float  |           | Required: ✅ | Array: ❌
quantity     | Integer|           | Required: ✅ | Array: ❌
total        | Float  |           | Required: ✅ | Array: ❌
```

### Indexes:
```
Key: order_items_index
Type: Key
Attributes: [orderId]

Key: product_sales_index
Type: Key
Attributes: [productId]
```

---

## 6️⃣ Collection: reviews

### الخطوات:
1. اضغط **Create Collection**
2. املأ البيانات:
   - **Collection ID**: `reviews`
   - **Collection Name**: `Reviews`
   - **Document Security**: ✅ Enable (مُفعّل)

### Attributes:
```
productId  | String  | Size: 36   | Required: ✅ | Array: ❌
userId     | String  | Size: 36   | Required: ✅ | Array: ❌
userName   | String  | Size: 255  | Required: ✅ | Array: ❌
rating     | Integer |            | Required: ✅ | Array: ❌
comment    | String  | Size: 1000 | Required: ❌ | Array: ❌
isApproved | Boolean |            | Required: ❌ | Default: false
```

### Indexes:
```
Key: product_reviews_index
Type: Key
Attributes: [productId]

Key: user_reviews_index
Type: Key  
Attributes: [userId]
```

---

## 7️⃣ Collection: affiliates

### الخطوات:
1. اضغط **Create Collection**
2. املأ البيانات:
   - **Collection ID**: `affiliates`
   - **Collection Name**: `Affiliates`
   - **Document Security**: ✅ Enable (مُفعّل)

### Attributes:
```
userId        | String | Size: 36 | Required: ✅ | Array: ❌
code          | String | Size: 10 | Required: ✅ | Array: ❌
commissionRate| Float  |          | Required: ❌ | Default: 0.15
totalEarnings | Float  |          | Required: ❌ | Default: 0
totalSales    | Integer|          | Required: ❌ | Default: 0
isActive      | Boolean|          | Required: ❌ | Default: true
```

### Indexes:
```
Key: affiliate_code_index
Type: Unique
Attributes: [code]

Key: user_affiliate_index
Type: Unique
Attributes: [userId]
```

---

## 🗂️ Storage Bucket: product-images

### الخطوات:
1. في Appwrite Console، اذهب إلى **Storage**
2. اضغط **Create Bucket**
3. املأ البيانات:
   - **Bucket ID**: `product-images`
   - **Bucket Name**: `Product Images`
   - **File Security**: ❌ Disable
   - **Maximum file size**: 5MB
   - **Allowed file extensions**: jpg, jpeg, png, webp

---

## ✅ التحقق من النتيجة

بعد إنشاء جميع Collections، يجب أن تشاهد في Database "egygo":
- 7 Collections
- كل Collection بـ Attributes و Indexes المطلوبة
- Document Security مضبوط بشكل صحيح

## 🚀 الخطوة التالية

بعد إنشاء Collections، شغّل الموقع:
```bash
npm run dev
```

واذهب إلى: http://localhost:8080

يجب أن تشاهد:
- 🟢 Appwrite Status: Connected
- إمكانية التسجيل وتسجيل الدخول
- عرض المنتجات والفئات