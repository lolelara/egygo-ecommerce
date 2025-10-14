# ========================================
# اختبار Vendoor Scraping بـ PowerShell
# ========================================

$FUNCTION_URL = "https://68e1f6240030405882c5.fra.appwrite.run"
$EMAIL = "almlmibrahym574@gmail.com"
$PASSWORD = "hema2004"

Write-Host "🧪 اختبار Vendoor Scraping..." -ForegroundColor Cyan
Write-Host ""

# 1. Health Check
Write-Host "1️⃣ Health Check..." -ForegroundColor Yellow
$body = @{
    action = "health"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $FUNCTION_URL -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ النتيجة:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ خطأ: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# 2. جلب منتج واحد
Write-Host "2️⃣ جلب منتج واحد (4259)..." -ForegroundColor Yellow
$body = @{
    action = "scrape-single"
    productId = "4259"
    email = $EMAIL
    password = $PASSWORD
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $FUNCTION_URL -Method Post -Body $body -ContentType "application/json" -TimeoutSec 120
    Write-Host "✅ النتيجة:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ خطأ: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "---" -ForegroundColor Gray
Write-Host ""

# 3. جلب صفحة واحدة
Write-Host "3️⃣ جلب الصفحة 1..." -ForegroundColor Yellow
$body = @{
    action = "scrape-page"
    page = 1
    email = $EMAIL
    password = $PASSWORD
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $FUNCTION_URL -Method Post -Body $body -ContentType "application/json" -TimeoutSec 120
    Write-Host "✅ النتيجة:" -ForegroundColor Green
    Write-Host "عدد المنتجات: $($response.products.Count)" -ForegroundColor Cyan
    $response.products | Select-Object -First 3 | Format-Table
} catch {
    Write-Host "❌ خطأ: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ الاختبار مكتمل!" -ForegroundColor Green
