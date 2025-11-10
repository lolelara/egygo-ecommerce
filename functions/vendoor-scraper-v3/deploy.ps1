# Deploy Vendoor Scraper V3

Write-Host "🚀 Deploying Vendoor Scraper V3..." -ForegroundColor Cyan
Write-Host ""

# Check CLI
try {
    appwrite --version | Out-Null
    Write-Host "✅ Appwrite CLI found" -ForegroundColor Green
} catch {
    Write-Host "Installing Appwrite CLI..." -ForegroundColor Yellow
    npm install -g appwrite-cli
}

# Login check
Write-Host ""
Write-Host "Checking login..." -ForegroundColor Yellow
try {
    appwrite client --version
} catch {
    appwrite login
}

# Install
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Deploy
Write-Host ""
Write-Host "🚀 Deploying function..." -ForegroundColor Yellow
appwrite deploy function

Write-Host ""
Write-Host "✅ Deploy complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Test it in Appwrite Console:" -ForegroundColor Cyan
Write-Host "  Functions → Vendoor Scraper V3 → Execute" -ForegroundColor White
Write-Host ""
