# 🔧 Quick Fix - Appwrite Collection Error

## ❌ The Error

```
GET https://fra.cloud.appwrite.io/v1/databases/.../collections/addresses/documents 404 (Not Found)
Error: Collection with the requested ID could not be found.
```

## ✅ Solution

Your Appwrite database is missing required collections. Follow these steps:

---

## 🚀 Option 1: Automatic Setup (Recommended)

### Step 1: Install Dependencies
```bash
npm install node-appwrite --save-dev
```

### Step 2: Set Environment Variables

Create/Update `.env`:
```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id_here
APPWRITE_DATABASE_ID=68de037e003bd03c4d45
APPWRITE_API_KEY=your_api_key_here
```

**Get API Key:**
1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your project
3. Go to **Settings** → **API Keys**
4. Create new API Key with **Database** permissions

### Step 3: Run Setup Script
```bash
npm run setup-appwrite
```

This will automatically create all collections:
- ✅ addresses
- ✅ products
- ✅ orders
- ✅ cart
- ✅ points
- ✅ spins
- ✅ reviews
- ✅ wishlist
- ✅ notifications

---

## 🛠️ Option 2: Manual Setup

### Step 1: Login to Appwrite Console
Go to: https://cloud.appwrite.io

### Step 2: Select Your Project
Click on your project

### Step 3: Go to Databases
Navigate to **Databases** → Select your database

### Step 4: Create "addresses" Collection

Click **Create Collection**:
- **Collection ID:** `addresses`
- **Name:** User Addresses
- **Enable Document Security:** ✅ Yes

### Step 5: Add Attributes

Click on **attributes** collection and add these:

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| userId | String | 255 | ✅ | - |
| name | String | 255 | ✅ | - |
| phone | String | 50 | ✅ | - |
| street | String | 500 | ✅ | - |
| city | String | 100 | ✅ | - |
| state | String | 100 | ❌ | - |
| postalCode | String | 20 | ❌ | - |
| country | String | 100 | ✅ | Egypt |
| isDefault | Boolean | - | ✅ | false |
| type | String | 50 | ❌ | home |

### Step 6: Create Indexes

Go to **Indexes** tab and create:

1. **userId_index**
   - Type: Key
   - Attributes: userId

2. **isDefault_index**
   - Type: Key
   - Attributes: isDefault

### Step 7: Set Permissions

Go to **Settings** tab:

**Collection Permissions:**
- Read: `user`
- Write: `user`
- Delete: `user`

**Document Permissions Template:**
```
read('user:$userId')
write('user:$userId')
delete('user:$userId')
```

---

## ⚡ Quick Test

After setup, test in your browser console:

```javascript
// Test if collection exists
fetch('https://fra.cloud.appwrite.io/v1/databases/68de037e003bd03c4d45/collections/addresses', {
  headers: {
    'X-Appwrite-Project': 'your_project_id'
  }
})
.then(r => r.json())
.then(data => console.log('✅ Collection exists!', data))
.catch(err => console.error('❌ Still error:', err));
```

---

## 📋 All Required Collections

Make sure these collections exist:

```
✅ addresses      - User shipping addresses
✅ products       - Product catalog
✅ categories     - Product categories  
✅ orders         - Customer orders
✅ cart           - Shopping carts
✅ reviews        - Product reviews
✅ wishlist       - User wishlists
✅ coupons        - Discount coupons
✅ points         - Gamification points
✅ spins          - Spin wheel data
✅ notifications  - User notifications
✅ analytics      - Analytics events
```

---

## 🐛 Still Having Issues?

### Check Database ID

In your `.env`:
```env
VITE_APPWRITE_DATABASE_ID=68de037e003bd03c4d45
```

Make sure this matches your Appwrite Console Database ID!

### Check Collection ID

In Appwrite Console, verify collection is named exactly: **`addresses`** (lowercase, plural)

### Check Permissions

Make sure:
1. Document Security is enabled
2. User has read/write permissions
3. You're logged in when testing

### Check API Version

Make sure you're using Appwrite SDK v13+:
```bash
npm update appwrite
```

---

## 📞 Need Help?

1. Check full setup guide: `APPWRITE_SETUP.md`
2. Discord: #appwrite-help
3. Email: dev@egygo.me

---

## ✅ Success!

Once setup is complete, refresh your app and the error should be gone! 🎉

**Test by:**
1. Go to your profile
2. Add a new address
3. Should work without errors ✅
