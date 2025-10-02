# إنشاء Collections لقاعدة البيانات egygo

## معلومات قاعدة البيانات:
- **Database ID**: `68de037e003bd03c4d45`
- **Name**: `egygo`

## Collections المطلوبة:

### 1. Collection: users
**إعدادات عامة:**
- Collection ID: `users`
- Name: `Users`
- Document Security: ✅ **Enabled**

**Attributes:**
```
name         | String  | Size: 255 | Required: ✅ | Array: ❌
email        | String  | Size: 255 | Required: ✅ | Array: ❌
phone        | String  | Size: 20  | Required: ❌ | Array: ❌
address      | String  | Size: 500 | Required: ❌ | Array: ❌
isAffiliate  | Boolean | Required: ❌ | Default: false
affiliateCode| String  | Size: 10  | Required: ❌ | Array: ❌
commissionRate| Double | Required: ❌ | Default: 0.15
```

**Indexes:**
- `email_index` | Type: Key | Attributes: `email` | Orders: ASC

---

### 2. Collection: categories
**إعدادات عامة:**
- Collection ID: `categories`
- Name: `Categories`
- Document Security: ❌ **Disabled**

**Attributes:**
```
name         | String  | Size: 255  | Required: ✅ | Array: ❌
description  | String  | Size: 1000 | Required: ❌ | Array: ❌
image        | String  | Size: 255  | Required: ❌ | Array: ❌
isActive     | Boolean | Required: ❌ | Default: true
```

---

### 3. Collection: products
**إعدادات عامة:**
- Collection ID: `products`
- Name: `Products`
- Document Security: ❌ **Disabled**

**Attributes:**
```
name         | String  | Size: 255  | Required: ✅ | Array: ❌
description  | String  | Size: 2000 | Required: ✅ | Array: ❌
price        | Double  | Required: ✅ | Array: ❌
comparePrice | Double  | Required: ❌ | Array: ❌
stock        | Integer | Required: ✅ | Default: 0 | Array: ❌
images       | String  | Size: 2000 | Required: ❌ | Array: ✅
categoryId   | String  | Size: 36   | Required: ✅ | Array: ❌
tags         | String  | Size: 50   | Required: ❌ | Array: ✅
isActive     | Boolean | Required: ❌ | Default: true | Array: ❌
isFeatured   | Boolean | Required: ❌ | Default: false | Array: ❌
rating       | Double  | Required: ❌ | Default: 0 | Array: ❌
reviewCount  | Integer | Required: ❌ | Default: 0 | Array: ❌
```

**Indexes:**
- `category_index` | Type: Key | Attributes: `categoryId` | Orders: ASC
- `price_index` | Type: Key | Attributes: `price` | Orders: ASC
- `featured_index` | Type: Key | Attributes: `isFeatured` | Orders: DESC

---

### 4. Collection: orders
**إعدادات عامة:**
- Collection ID: `orders`
- Name: `Orders`
- Document Security: ✅ **Enabled**

**Attributes:**
```
userId           | String | Size: 36   | Required: ✅ | Array: ❌
total            | Double | Required: ✅ | Array: ❌
status           | String | Size: 20   | Required: ✅ | Default: "pending" | Array: ❌
customerName     | String | Size: 255  | Required: ✅ | Array: ❌
customerEmail    | String | Size: 255  | Required: ✅ | Array: ❌
customerPhone    | String | Size: 20   | Required: ✅ | Array: ❌
shippingAddress  | String | Size: 1000 | Required: ✅ | Array: ❌
paymentMethod    | String | Size: 50   | Required: ✅ | Array: ❌
affiliateCode    | String | Size: 10   | Required: ❌ | Array: ❌
affiliateCommission | Double | Required: ❌ | Default: 0 | Array: ❌
```

**Indexes:**
- `user_orders_index` | Type: Key | Attributes: `userId` | Orders: ASC
- `status_index` | Type: Key | Attributes: `status` | Orders: ASC

---

### 5. Collection: order_items
**إعدادات عامة:**
- Collection ID: `order_items`
- Name: `Order Items`
- Document Security: ✅ **Enabled**

**Attributes:**
```
orderId      | String | Size: 36  | Required: ✅ | Array: ❌
productId    | String | Size: 36  | Required: ✅ | Array: ❌
productName  | String | Size: 255 | Required: ✅ | Array: ❌
productImage | String | Size: 255 | Required: ❌ | Array: ❌
price        | Double | Required: ✅ | Array: ❌
quantity     | Integer| Required: ✅ | Array: ❌
total        | Double | Required: ✅ | Array: ❌
```

**Indexes:**
- `order_items_index` | Type: Key | Attributes: `orderId` | Orders: ASC
- `product_sales_index` | Type: Key | Attributes: `productId` | Orders: ASC

---

### 6. Collection: reviews
**إعدادات عامة:**
- Collection ID: `reviews`
- Name: `Reviews`
- Document Security: ✅ **Enabled**

**Attributes:**
```
productId    | String  | Size: 36   | Required: ✅ | Array: ❌
userId       | String  | Size: 36   | Required: ✅ | Array: ❌
userName     | String  | Size: 255  | Required: ✅ | Array: ❌
rating       | Integer | Required: ✅ | Array: ❌
comment      | String  | Size: 1000 | Required: ❌ | Array: ❌
isApproved   | Boolean | Required: ❌ | Default: false | Array: ❌
```

**Indexes:**
- `product_reviews_index` | Type: Key | Attributes: `productId` | Orders: ASC
- `user_reviews_index` | Type: Key | Attributes: `userId` | Orders: ASC

---

### 7. Collection: affiliates
**إعدادات عامة:**
- Collection ID: `affiliates`
- Name: `Affiliates`
- Document Security: ✅ **Enabled**

**Attributes:**
```
userId         | String  | Size: 36 | Required: ✅ | Array: ❌
code           | String  | Size: 10 | Required: ✅ | Array: ❌
commissionRate | Double  | Required: ❌ | Default: 0.15 | Array: ❌
totalEarnings  | Double  | Required: ❌ | Default: 0 | Array: ❌
totalSales     | Integer | Required: ❌ | Default: 0 | Array: ❌
isActive       | Boolean | Required: ❌ | Default: true | Array: ❌
```

**Indexes:**
- `affiliate_code_index` | Type: Unique | Attributes: `code` | Orders: ASC
- `user_affiliate_index` | Type: Unique | Attributes: `userId` | Orders: ASC

---

## خطوات الإنشاء:

1. **اذهب إلى**: https://fra.cloud.appwrite.io/console/project-68d8b9db00134c41e7c8/databases/database-68de037e003bd03c4d45

2. **لكل Collection:**
   - اضغط **"Create Collection"**
   - أدخل **Collection ID** و **Name**
   - اختر **Document Security** حسب المطلوب
   - اضغط **"Create"**

3. **إضافة Attributes:**
   - في كل Collection، اضغط **"Create Attribute"**
   - اختر نوع البيانات (String/Boolean/Integer/Double)
   - أدخل التفاصيل حسب الجدول أعلاه

4. **إضافة Indexes:**
   - في كل Collection، اضغط **"Create Index"**
   - أدخل التفاصيل حسب الجدول أعلاه

بعد إنشاء جميع Collections، سيكون موقعك جاهز للاستخدام مع Appwrite!