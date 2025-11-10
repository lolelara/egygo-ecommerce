#!/bin/bash

# ==========================================
# سكريبت تلقائي لإعداد VM للـ Scraping
# ==========================================

echo "========================================"
echo "🚀 بدء إعداد VM للـ Vendoor Scraping"
echo "========================================"
echo ""

# 1. تحديث النظام
echo "📦 الخطوة 1: تحديث النظام..."
sudo apt update && sudo apt upgrade -y

# 2. تثبيت Node.js
echo ""
echo "📦 الخطوة 2: تثبيت Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# التحقق من الإصدار
echo "✅ Node.js version:"
node --version
echo "✅ NPM version:"
npm --version

# 3. تثبيت Chrome dependencies
echo ""
echo "📦 الخطوة 3: تثبيت Chrome dependencies..."
sudo apt install -y \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  lsb-release \
  wget \
  xdg-utils

# 4. إنشاء مجلد المشروع
echo ""
echo "📂 الخطوة 4: إنشاء مجلد المشروع..."
mkdir -p ~/vendoor-scraper
cd ~/vendoor-scraper

# 5. إنشاء package.json
echo ""
echo "📄 الخطوة 5: إنشاء package.json..."
cat > package.json <<EOF
{
  "name": "vendoor-scraper",
  "version": "1.0.0",
  "description": "Vendoor to Appwrite Scraper",
  "type": "module",
  "main": "vendoor-to-appwrite.mjs",
  "scripts": {
    "start": "node vendoor-to-appwrite.mjs",
    "test": "echo \\"No tests specified\\""
  },
  "keywords": ["vendoor", "scraping", "appwrite"],
  "author": "EgyGo",
  "license": "MIT"
}
EOF

# 6. تثبيت المكتبات
echo ""
echo "📦 الخطوة 6: تثبيت المكتبات المطلوبة..."
npm install puppeteer node-appwrite dotenv

# 7. تثبيت PM2
echo ""
echo "📦 الخطوة 7: تثبيت PM2..."
sudo npm install -g pm2

# 8. إضافة Swap (2GB)
echo ""
echo "💾 الخطوة 8: إضافة Swap Space (2GB)..."
if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ تم إضافة Swap بنجاح"
else
    echo "⚠️  Swap موجود بالفعل"
fi

# 9. إنشاء ملف .env
echo ""
echo "📄 الخطوة 9: إنشاء ملف .env..."
cat > .env <<EOF
VENDOOR_EMAIL=almlmibrahym574@gmail.com
VENDOOR_PASSWORD=hema2004
APPWRITE_API_KEY=standard_4cd223829de1f0735515eed5940137b7108cdcbd46e8da2514e45aee7c53eee86f6ff92fd801152e4fa919dca1f8382503562b56b30cd1b6d222dd5bca897d9fd1bbb98ac787b019c50b689bdff9613f0cd3f289d369c2c42f58aa9cceec97773dcd1f77d5389c2695fba800e3a644e7c3bd9f1e8479e8a2e89a4ffb79c14bc5
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=68d8b9db00134c41e7c8
APPWRITE_DATABASE_ID=main
APPWRITE_PRODUCTS_COLLECTION_ID=products
APPWRITE_STORAGE_BUCKET_ID=product-images
EOF

chmod 600 .env
echo "✅ تم إنشاء ملف .env بنجاح"

# 10. الانتهاء
echo ""
echo "========================================"
echo "✅ تم الإعداد بنجاح!"
echo "========================================"
echo ""
echo "📝 الخطوات التالية:"
echo ""
echo "1. انقل ملف السكريبت إلى هذا المجلد:"
echo "   scp vendoor-to-appwrite.mjs azureuser@20.208.131.121:~/vendoor-scraper/"
echo ""
echo "2. شغل السكريبت:"
echo "   cd ~/vendoor-scraper"
echo "   node vendoor-to-appwrite.mjs"
echo ""
echo "3. أو شغله في الخلفية بـ PM2:"
echo "   pm2 start vendoor-to-appwrite.mjs --name vendoor-scraper"
echo "   pm2 logs vendoor-scraper"
echo ""
echo "========================================"
