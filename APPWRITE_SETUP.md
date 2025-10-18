# 🚀 Appwrite Setup Guide

## 📋 Overview

دليل شامل لإعداد Appwrite Database و Collections للمشروع.

---

## ⚙️ Prerequisites

1. حساب Appwrite (Cloud أو Self-hosted)
2. Project ID من Appwrite Console
3. API Key (للـ Server-side operations)

---

## 🗄️ Database Structure

### Database Info
```
Database ID: egygo-database
Database Name: EgyGo E-commerce
```

### Collections Overview

```
📦 Database: egygo-database
├── 👤 users          (User profiles)
├── 📦 products       (Products catalog)
├── 🏷️  categories     (Product categories)
├── 🛒 cart           (Shopping carts)
├── 📝 orders         (Orders)
├── 📍 addresses      (User addresses)
├── ⭐ reviews        (Product reviews)
├── ❤️  wishlist       (User wishlists)
├── 🎁 coupons        (Discount coupons)
├── 📊 analytics      (Analytics data)
├── 🎮 points         (User points/gamification)
├── 🎰 spins          (Spin wheel data)
└── 🔔 notifications  (User notifications)
```

---

## 🔨 Quick Setup

### Method 1: Appwrite Console (Manual)

#### Step 1: Create Database
1. Login to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project
3. Go to **Databases**
4. Click **Create Database**
5. Name: `egygo-database`
6. Database ID: `egygo-database` (or auto-generate)

#### Step 2: Create Collections

##### 1️⃣ **addresses** Collection

```json
{
  "collectionId": "addresses",
  "name": "User Addresses",
  "permissions": ["read", "write"],
  "documentSecurity": true
}
```

**Attributes:**
```javascript
{
  userId: {
    type: "string",
    size: 255,
    required: true,
    array: false
  },
  name: {
    type: "string",
    size: 255,
    required: true
  },
  phone: {
    type: "string",
    size: 50,
    required: true
  },
  street: {
    type: "string",
    size: 500,
    required: true
  },
  city: {
    type: "string",
    size: 100,
    required: true
  },
  state: {
    type: "string",
    size: 100,
    required: false
  },
  postalCode: {
    type: "string",
    size: 20,
    required: false
  },
  country: {
    type: "string",
    size: 100,
    required: true,
    default: "Egypt"
  },
  isDefault: {
    type: "boolean",
    required: true,
    default: false
  },
  type: {
    type: "string",
    size: 50,
    required: false,
    default: "home"
  }
}
```

**Indexes:**
```javascript
[
  {
    key: "userId",
    type: "key",
    attributes: ["userId"]
  },
  {
    key: "isDefault",
    type: "key",
    attributes: ["isDefault"]
  }
]
```

**Permissions:**
```javascript
[
  "read('user:$userId')",
  "write('user:$userId')",
  "delete('user:$userId')"
]
```

##### 2️⃣ **products** Collection

**Attributes:**
```javascript
{
  name: { type: "string", size: 255, required: true },
  nameEn: { type: "string", size: 255, required: false },
  description: { type: "string", size: 10000, required: true },
  descriptionEn: { type: "string", size: 10000, required: false },
  price: { type: "double", required: true },
  originalPrice: { type: "double", required: false },
  discount: { type: "integer", required: false, default: 0 },
  image: { type: "string", size: 500, required: true },
  images: { type: "string", size: 5000, required: false, array: true },
  images360: { type: "string", size: 5000, required: false, array: true },
  category: { type: "string", size: 255, required: true },
  brand: { type: "string", size: 255, required: false },
  stock: { type: "integer", required: true, default: 0 },
  sku: { type: "string", size: 100, required: false },
  specs: { type: "string", size: 10000, required: false }, // JSON string
  rating: { type: "double", required: false, default: 0 },
  reviewCount: { type: "integer", required: false, default: 0 },
  featured: { type: "boolean", required: false, default: false },
  active: { type: "boolean", required: true, default: true },
  views: { type: "integer", required: false, default: 0 },
  sales: { type: "integer", required: false, default: 0 }
}
```

**Indexes:**
```javascript
[
  { key: "category", type: "key", attributes: ["category"] },
  { key: "brand", type: "key", attributes: ["brand"] },
  { key: "price", type: "key", attributes: ["price"] },
  { key: "featured", type: "key", attributes: ["featured"] },
  { key: "active", type: "key", attributes: ["active"] }
]
```

##### 3️⃣ **orders** Collection

**Attributes:**
```javascript
{
  userId: { type: "string", size: 255, required: true },
  orderNumber: { type: "string", size: 50, required: true },
  items: { type: "string", size: 50000, required: true }, // JSON array
  subtotal: { type: "double", required: true },
  shipping: { type: "double", required: true },
  tax: { type: "double", required: false, default: 0 },
  discount: { type: "double", required: false, default: 0 },
  total: { type: "double", required: true },
  status: { 
    type: "string", 
    size: 50, 
    required: true, 
    default: "pending" 
  },
  paymentMethod: { type: "string", size: 50, required: true },
  paymentStatus: { 
    type: "string", 
    size: 50, 
    required: true, 
    default: "pending" 
  },
  shippingAddress: { type: "string", size: 5000, required: true }, // JSON
  trackingNumber: { type: "string", size: 100, required: false },
  notes: { type: "string", size: 1000, required: false }
}
```

**Indexes:**
```javascript
[
  { key: "userId", type: "key", attributes: ["userId"] },
  { key: "orderNumber", type: "unique", attributes: ["orderNumber"] },
  { key: "status", type: "key", attributes: ["status"] }
]
```

##### 4️⃣ **cart** Collection

**Attributes:**
```javascript
{
  userId: { type: "string", size: 255, required: true },
  productId: { type: "string", size: 255, required: true },
  quantity: { type: "integer", required: true, default: 1 },
  price: { type: "double", required: true },
  selectedOptions: { type: "string", size: 5000, required: false } // JSON
}
```

**Indexes:**
```javascript
[
  { key: "userId", type: "key", attributes: ["userId"] },
  { key: "productId", type: "key", attributes: ["productId"] }
]
```

##### 5️⃣ **points** Collection (Gamification)

**Attributes:**
```javascript
{
  userId: { type: "string", size: 255, required: true },
  total: { type: "integer", required: true, default: 0 },
  level: { type: "integer", required: true, default: 1 },
  streak: { type: "integer", required: false, default: 0 },
  lastLogin: { type: "datetime", required: false },
  rewards: { type: "string", size: 10000, required: false } // JSON array
}
```

**Indexes:**
```javascript
[
  { key: "userId", type: "unique", attributes: ["userId"] },
  { key: "total", type: "key", attributes: ["total"] }
]
```

##### 6️⃣ **spins** Collection (Spin Wheel)

**Attributes:**
```javascript
{
  userId: { type: "string", size: 255, required: true },
  spinsLeft: { type: "integer", required: true, default: 1 },
  lastSpin: { type: "datetime", required: false },
  history: { type: "string", size: 10000, required: false } // JSON array
}
```

**Indexes:**
```javascript
[
  { key: "userId", type: "unique", attributes: ["userId"] }
]
```

---

## 🤖 Automated Setup (Recommended)

### Using Appwrite CLI

#### Step 1: Install Appwrite CLI
```bash
npm install -g appwrite-cli
```

#### Step 2: Login
```bash
appwrite login
```

#### Step 3: Init Project
```bash
appwrite init project
```

#### Step 4: Deploy Collections
```bash
appwrite deploy collection
```

### Using Node.js Script

Create `scripts/setup-appwrite.js`:

```javascript
const sdk = require('node-appwrite');

const client = new sdk.Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

async function setupDatabase() {
  try {
    // Create Database
    const database = await databases.create(
      'egygo-database',
      'EgyGo E-commerce'
    );
    
    console.log('✅ Database created:', database.$id);
    
    // Create Collections
    await createAddressesCollection(database.$id);
    await createProductsCollection(database.$id);
    await createOrdersCollection(database.$id);
    // ... more collections
    
    console.log('✅ All collections created!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function createAddressesCollection(databaseId) {
  try {
    const collection = await databases.createCollection(
      databaseId,
      'addresses',
      'User Addresses',
      ['read("user")'],
      true
    );
    
    // Create attributes
    await databases.createStringAttribute(
      databaseId,
      collection.$id,
      'userId',
      255,
      true
    );
    
    await databases.createStringAttribute(
      databaseId,
      collection.$id,
      'name',
      255,
      true
    );
    
    // ... more attributes
    
    console.log('✅ Addresses collection created');
  } catch (error) {
    console.error('❌ Error creating addresses:', error.message);
  }
}

// Run
setupDatabase();
```

**Run the script:**
```bash
node scripts/setup-appwrite.js
```

---

## 🔑 Environment Variables

Update your `.env` file:

```env
# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=egygo-database

# Server-side only
APPWRITE_API_KEY=your_api_key
```

---

## ✅ Verification

### Check if Collections Exist

```javascript
// In your app
import { databases } from '@/lib/appwrite';

async function checkCollections() {
  try {
    const collections = await databases.listCollections('egygo-database');
    console.log('Available collections:', collections.collections.map(c => c.name));
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 🐛 Troubleshooting

### Error: "Collection not found"

**Solution:**
1. Verify Database ID in `.env`
2. Check Collection ID matches code
3. Ensure Collection is created in Appwrite Console

### Error: "Document permissions"

**Solution:**
1. Enable Document Security in Collection settings
2. Set proper permissions:
   ```javascript
   [
     "read('user:$userId')",
     "write('user:$userId')"
   ]
   ```

### Error: "Attribute does not exist"

**Solution:**
1. Check attribute spelling
2. Verify attribute was created
3. Wait for attribute to be available (can take a few seconds)

---

## 📚 Complete Collections List

| Collection | Purpose | Key Attributes |
|------------|---------|----------------|
| `users` | User profiles | email, name, role, avatar |
| `products` | Products catalog | name, price, stock, category |
| `categories` | Product categories | name, slug, image |
| `orders` | Customer orders | userId, items, status, total |
| `cart` | Shopping carts | userId, productId, quantity |
| `addresses` | Shipping addresses | userId, street, city, isDefault |
| `reviews` | Product reviews | productId, userId, rating, comment |
| `wishlist` | User wishlists | userId, productId |
| `coupons` | Discount coupons | code, discount, expiresAt |
| `points` | Gamification points | userId, total, level, streak |
| `spins` | Spin wheel data | userId, spinsLeft, history |
| `notifications` | User notifications | userId, title, message, read |
| `analytics` | Analytics events | event, userId, metadata |

---

## 🚀 Next Steps

1. ✅ Create Database
2. ✅ Create all Collections
3. ✅ Set Permissions
4. ✅ Create Indexes
5. ✅ Test API calls
6. ✅ Seed sample data (optional)

---

## 📞 Support

Need help?
- 📧 Email: dev@egygo.me
- 💬 Discord: #appwrite-help
- 📚 Appwrite Docs: https://appwrite.io/docs

---

**Last Updated:** October 2025
