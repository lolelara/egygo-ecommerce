====================================
📦 Financial Collections Setup Guide
====================================

This script creates the required Appwrite collections and storage bucket for the financial management system.

📋 PREREQUISITES:
-----------------
1. Node.js installed
2. Appwrite API Key with admin permissions
3. Access to your Appwrite project

🔧 SETUP STEPS:
---------------

Step 1: Install dependencies (if not already installed)
-------------------------------------------------------
npm install node-appwrite

Step 2: Get your Appwrite API Key
----------------------------------
1. Go to: https://cloud.appwrite.io/console
2. Select your project
3. Go to "Settings" → "API Keys"
4. Click "Create API Key"
5. Name: "Financial Setup"
6. Scopes: Select ALL (or at least databases.write, storage.write)
7. Copy the API Key

Step 3: Set environment variable
---------------------------------
Windows (PowerShell):
$env:APPWRITE_API_KEY="your_api_key_here"

Windows (CMD):
set APPWRITE_API_KEY=your_api_key_here

Linux/Mac:
export APPWRITE_API_KEY="your_api_key_here"

Step 4: Run the setup script
-----------------------------
node scripts/setup-financial-collections.js

✅ WHAT WILL BE CREATED:
------------------------

1. merchantPayments Collection
   - Stores merchant payment submissions
   - Tracks commission and platform fee payments
   - Includes transfer proof URLs

2. withdrawalRequests Collection
   - Stores affiliate/merchant withdrawal requests
   - Tracks payment methods (Vodafone Cash, InstaPay)
   - Manages request status

3. payment-proofs Storage Bucket
   - Stores payment proof images
   - Max file size: 5MB
   - Allowed: JPEG, PNG, WebP
   - Encrypted and virus-scanned

🎯 PAYMENT METHODS:
-------------------
Vodafone Cash: 01034324551
InstaPay: ebank_hema@instapay

📊 EXPECTED OUTPUT:
-------------------
🚀 Starting Financial Collections Setup...

📦 Creating merchantPayments collection...
✅ merchantPayments collection created
✅ merchantPayments attributes created
✅ merchantPayments indexes created

📦 Creating withdrawalRequests collection...
✅ withdrawalRequests collection created
✅ withdrawalRequests attributes created
✅ withdrawalRequests indexes created

📦 Creating payment-proofs storage bucket...
✅ payment-proofs bucket created

🎉 Financial Collections Setup Complete!

📋 Summary:
  ✅ merchantPayments collection
  ✅ withdrawalRequests collection
  ✅ payment-proofs storage bucket

✨ You can now use the financial management system!

⚠️ TROUBLESHOOTING:
-------------------

Error: "Invalid API key"
→ Make sure you copied the API key correctly
→ Check that the API key has the required scopes

Error: "Collection already exists" (409)
→ This is OK! The collection was already created
→ The script will skip and continue

Error: "Database not found"
→ Check that DATABASE_ID in the script matches your database
→ Default: 68d8b9db00134c41e7c8

🔗 NEXT STEPS:
--------------
1. Run the script
2. Verify collections in Appwrite Console
3. Test the financial pages:
   - /admin/financial
   - /affiliate/earnings
   - /merchant/financial
4. Deploy to production!

📞 SUPPORT:
-----------
If you encounter any issues, check:
- Appwrite Console logs
- Browser console for errors
- Network tab for API calls

====================================
Made with ❤️ for EgyGo
====================================
