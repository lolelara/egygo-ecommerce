# PowerShell Script to Add Product Approval Fields to Appwrite
# Author: EgyGo Team
# Description: Adds verification video and approval status fields to products collection

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🔐 إضافة حقول موافقة المنتجات" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ ملف .env غير موجود!" -ForegroundColor Red
    Write-Host "يرجى التأكد من وجود ملف .env في المجلد الرئيسي" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "[1/3] التحقق من node-appwrite..." -ForegroundColor Cyan

# Check if node-appwrite is installed
$appwriteInstalled = npm list node-appwrite 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "   📦 تثبيت node-appwrite..." -ForegroundColor Yellow
    npm install node-appwrite --save-dev
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ فشل تثبيت node-appwrite!" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "   ✅ تم تثبيت node-appwrite بنجاح" -ForegroundColor Green
} else {
    Write-Host "   ✅ node-appwrite جاهز" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/3] التحقق من السكريبت..." -ForegroundColor Cyan

if (-not (Test-Path "scripts/add-product-approval-fields.js")) {
    Write-Host "   ❌ ملف السكريبت غير موجود!" -ForegroundColor Red
    pause
    exit 1
}
Write-Host "   ✅ السكريبت موجود" -ForegroundColor Green

Write-Host ""
Write-Host "[3/3] تشغيل السكريبت..." -ForegroundColor Cyan
Write-Host ""

# Run the script
node scripts/add-product-approval-fields.js

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ فشل السكريبت!" -ForegroundColor Red
    pause
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   ✅ تمت الإضافة بنجاح!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 الحقول المضافة:" -ForegroundColor Yellow
Write-Host "   1. verificationVideo (String)" -ForegroundColor White
Write-Host "   2. approvalStatus (Enum: pending, approved, rejected)" -ForegroundColor White
Write-Host "   3. rejectionReason (String)" -ForegroundColor White
Write-Host "   4. approvedAt (String)" -ForegroundColor White
Write-Host "   5. approvedBy (String)" -ForegroundColor White
Write-Host ""

Write-Host "🎯 الخطوات التالية:" -ForegroundColor Yellow
Write-Host "   1. افتح Appwrite Dashboard للتحقق" -ForegroundColor White
Write-Host "   2. تحقق من Permissions للـ Collection" -ForegroundColor White
Write-Host "   3. قم بتشغيل: npm run build" -ForegroundColor White
Write-Host "   4. قم بتشغيل: npm run deploy" -ForegroundColor White
Write-Host ""

pause
