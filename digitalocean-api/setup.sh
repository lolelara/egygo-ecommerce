#!/bin/bash

echo "🚀 إعداد Vendoor API على DigitalOcean"
echo "========================================"

# التحديث
echo "📦 تحديث النظام..."
apt update && apt upgrade -y

# تثبيت Node.js 20
echo "📦 تثبيت Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# تثبيت المكتبات المطلوبة لـ Puppeteer
echo "📦 تثبيت متطلبات Chromium..."
apt install -y \
  chromium-browser \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
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

# تثبيت pnpm
echo "📦 تثبيت pnpm..."
npm install -g pnpm

# تثبيت PM2
echo "📦 تثبيت PM2..."
npm install -g pm2

# تثبيت Nginx
echo "📦 تثبيت Nginx..."
apt install -y nginx

# إنشاء مجلد المشروع
echo "📁 إنشاء مجلد المشروع..."
mkdir -p /var/www/vendoor-api
cd /var/www/vendoor-api

# نسخ الملفات (يجب رفع الملفات أولاً)
echo "📋 انسخ الملفات الآن (index.js و package.json)"
echo "يمكنك استخدام: scp -r digitalocean-api/* root@YOUR_IP:/var/www/vendoor-api/"
echo ""
echo "بعد نسخ الملفات، قم بتشغيل:"
echo "1. cd /var/www/vendoor-api"
echo "2. pnpm install"
echo "3. pm2 start index.js --name vendoor-api"
echo "4. pm2 save"
echo "5. pm2 startup"

echo ""
echo "✅ تم تثبيت جميع المتطلبات!"
