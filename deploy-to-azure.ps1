# ========================================
# Deploy Vendoor Scraper to Azure VM
# ========================================

$VM_IP = "20.208.131.121"
$VM_USER = "azureuser"
$SSH_KEY = "egygo-scraper_key.pem"
$SCRIPT_NAME = "vendoor-scraper-with-live-updates.mjs"

Write-Host "🚀 Deploy Vendoor Scraper to Azure VM" -ForegroundColor Cyan
Write-Host "======================================"
Write-Host ""

# 1. Check if SSH key exists
if (-Not (Test-Path $SSH_KEY)) {
    Write-Host "❌ SSH Key not found: $SSH_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "✅ SSH Key found" -ForegroundColor Green
Write-Host ""

# 2. Fix SSH key permissions (Windows)
Write-Host "🔒 Setting SSH key permissions..." -ForegroundColor Yellow
icacls $SSH_KEY /inheritance:r | Out-Null
icacls $SSH_KEY /grant:r "${env:USERNAME}:R" | Out-Null
Write-Host "✅ Permissions set" -ForegroundColor Green
Write-Host ""

# 3. Test connection
Write-Host "🔌 Testing connection to $VM_IP..." -ForegroundColor Yellow
$testCmd = "ssh -i $SSH_KEY -o ConnectTimeout=10 -o StrictHostKeyChecking=no $VM_USER@$VM_IP 'echo Connection OK'"
$result = Invoke-Expression $testCmd 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Connection successful" -ForegroundColor Green
} else {
    Write-Host "❌ Connection failed. Please check:" -ForegroundColor Red
    Write-Host "   - VM is Running (start from Azure Portal)" -ForegroundColor Yellow
    Write-Host "   - IP address is correct: $VM_IP" -ForegroundColor Yellow
    Write-Host "   - SSH Port 22 is open" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Start VM: https://portal.azure.com" -ForegroundColor Cyan
    exit 1
}
Write-Host ""

# 4. Create remote directory
Write-Host "📁 Creating remote directory..." -ForegroundColor Yellow
ssh -i $SSH_KEY $VM_USER@$VM_IP "mkdir -p ~/vendoor-scraper"
Write-Host "✅ Directory created" -ForegroundColor Green
Write-Host ""

# 5. Upload script
Write-Host "📤 Uploading script to Azure VM..." -ForegroundColor Yellow
scp -i $SSH_KEY "scripts/$SCRIPT_NAME" "${VM_USER}@${VM_IP}:~/vendoor-scraper/"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Script uploaded successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Upload failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 6. Install Node.js and dependencies
Write-Host "📦 Installing Node.js and dependencies on Azure VM..." -ForegroundColor Yellow
Write-Host "    (This may take a few minutes...)" -ForegroundColor Gray

$installScript = @"
# Check Node.js
if ! command -v node &> /dev/null; then
    echo '📥 Installing Node.js 20.x...'
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo '✅ Node.js already installed'
fi

echo ''
echo 'Node version:'
node --version
echo 'NPM version:'
npm --version
echo ''

# Install npm packages
cd ~/vendoor-scraper
echo '📦 Installing puppeteer and node-appwrite...'
npm install puppeteer node-appwrite

# Install Chromium dependencies
echo '📦 Installing Chromium dependencies...'
sudo apt-get update -qq
sudo apt-get install -y -qq chromium-browser libgbm-dev

echo ''
echo '✅ All dependencies installed!'
"@

ssh -i $SSH_KEY $VM_USER@$VM_IP $installScript

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""

# 7. Show run commands
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎯 الخطوات التالية:" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣ للاتصال بالـ VM:" -ForegroundColor White
Write-Host "   ssh -i $SSH_KEY $VM_USER@$VM_IP" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣ لتشغيل السكريبت:" -ForegroundColor White
Write-Host "   cd ~/vendoor-scraper" -ForegroundColor Gray
Write-Host "   node $SCRIPT_NAME" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣ للتشغيل في الخلفية (Recommended):" -ForegroundColor White
Write-Host "   screen -S vendoor-scraper" -ForegroundColor Gray
Write-Host "   node $SCRIPT_NAME" -ForegroundColor Gray
Write-Host "   # اضغط Ctrl+A ثم D للخروج" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣ للعودة إلى screen:" -ForegroundColor White
Write-Host "   screen -r vendoor-scraper" -ForegroundColor Gray
Write-Host ""
Write-Host "════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 سيتم إرسال التحديثات على بوت Telegram تلقائياً!" -ForegroundColor Green
Write-Host ""

# Ask if user wants to connect now
$response = Read-Host "هل تريد الاتصال بالـ VM الآن؟ (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "🔌 Connecting to Azure VM..." -ForegroundColor Cyan
    ssh -i $SSH_KEY $VM_USER@$VM_IP
}
