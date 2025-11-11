#!/bin/bash

# ========================================
# Deploy Vendoor Scraper to Azure VM
# ========================================

VM_IP="20.208.131.121"
VM_USER="azureuser"
SSH_KEY="egygo-scraper_key.pem"
SCRIPT_NAME="vendoor-scraper-with-live-updates.mjs"

echo "🚀 Deploy Vendoor Scraper to Azure VM"
echo "======================================"
echo ""

# 1. Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH Key not found: $SSH_KEY"
    exit 1
fi

echo "✅ SSH Key found"
echo ""

# 2. Fix SSH key permissions
echo "🔒 Setting SSH key permissions..."
chmod 400 "$SSH_KEY"
echo "✅ Permissions set (400)"
echo ""

# 3. Test connection
echo "🔌 Testing connection to $VM_IP..."
ssh -i "$SSH_KEY" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$VM_USER@$VM_IP" "echo 'Connection OK'" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Connection successful"
else
    echo "❌ Connection failed. Please check:"
    echo "   - VM is Running (start from Azure Portal)"
    echo "   - IP address is correct: $VM_IP"
    echo "   - SSH Port 22 is open"
    echo ""
    echo "Start VM: https://portal.azure.com"
    exit 1
fi
echo ""

# 4. Create remote directory
echo "📁 Creating remote directory..."
ssh -i "$SSH_KEY" "$VM_USER@$VM_IP" "mkdir -p ~/vendoor-scraper"
echo "✅ Directory created"
echo ""

# 5. Upload script
echo "📤 Uploading script to Azure VM..."
scp -i "$SSH_KEY" "scripts/$SCRIPT_NAME" "$VM_USER@$VM_IP:~/vendoor-scraper/"

if [ $? -eq 0 ]; then
    echo "✅ Script uploaded successfully"
else
    echo "❌ Upload failed"
    exit 1
fi
echo ""

# 6. Install Node.js and dependencies
echo "📦 Installing Node.js and dependencies on Azure VM..."
echo "    (This may take a few minutes...)"

ssh -i "$SSH_KEY" "$VM_USER@$VM_IP" << 'ENDSSH'
# Check Node.js
if ! command -v node &> /dev/null; then
    echo "📥 Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js already installed"
fi

echo ""
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo ""

# Install npm packages
cd ~/vendoor-scraper
echo "📦 Installing puppeteer and node-appwrite..."
npm install puppeteer node-appwrite

# Install Chromium dependencies
echo "📦 Installing Chromium dependencies..."
sudo apt-get update -qq
sudo apt-get install -y -qq chromium-browser libgbm-dev

echo ""
echo "✅ All dependencies installed!"
ENDSSH

echo ""
echo "✅ Setup complete!"
echo ""

# 7. Show run commands
echo "════════════════════════════════════════"
echo "🎯 الخطوات التالية:"
echo "════════════════════════════════════════"
echo ""
echo "1️⃣ للاتصال بالـ VM:"
echo "   ssh -i $SSH_KEY $VM_USER@$VM_IP"
echo ""
echo "2️⃣ لتشغيل السكريبت:"
echo "   cd ~/vendoor-scraper"
echo "   node $SCRIPT_NAME"
echo ""
echo "3️⃣ للتشغيل في الخلفية (Recommended):"
echo "   screen -S vendoor-scraper"
echo "   node $SCRIPT_NAME"
echo "   # اضغط Ctrl+A ثم D للخروج"
echo ""
echo "4️⃣ للعودة إلى screen:"
echo "   screen -r vendoor-scraper"
echo ""
echo "════════════════════════════════════════"
echo ""
echo "📱 سيتم إرسال التحديثات على بوت Telegram تلقائياً!"
echo ""

# Ask if user wants to connect now
read -p "هل تريد الاتصال بالـ VM الآن؟ (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔌 Connecting to Azure VM..."
    ssh -i "$SSH_KEY" "$VM_USER@$VM_IP"
fi
