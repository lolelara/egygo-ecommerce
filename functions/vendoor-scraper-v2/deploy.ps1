# Deploy Vendoor Scraper V2 to Appwrite

Write-Host "🚀 Deploying Vendoor Scraper V2 to Appwrite..." -ForegroundColor Cyan
Write-Host ""

# Check if appwrite CLI is installed
try {
    appwrite --version | Out-Null
    Write-Host "✅ Appwrite CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Appwrite CLI not found. Installing..." -ForegroundColor Red
    npm install -g appwrite-cli
}

# Check if logged in
Write-Host ""
Write-Host "✅ Checking Appwrite login..." -ForegroundColor Yellow
try {
    appwrite client --version
} catch {
    Write-Host "Please login to Appwrite:" -ForegroundColor Yellow
    appwrite login
}

# Install dependencies
Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Deploy function
Write-Host ""
Write-Host "🚀 Deploying function..." -ForegroundColor Yellow
appwrite deploy function

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next steps:" -ForegroundColor Cyan
Write-Host "1. Check Appwrite Console: https://cloud.appwrite.io"
Write-Host "2. Test the function in Executions tab"
Write-Host "3. Monitor logs for any errors"
Write-Host ""
Write-Host "🎉 Done!" -ForegroundColor Green
