# ====================================================================
#  🚀 FINAL DEPLOYMENT SCRIPT - PowerShell Version
# ====================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🚀 FINAL BUILD AND DEPLOY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Clean old build
Write-Host "[1/5] Cleaning old build..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
    Write-Host "✅ Old dist removed" -ForegroundColor Green
}

# Step 2: Build
Write-Host ""
Write-Host "[2/5] Building fresh version..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Step 3: Git add
Write-Host ""
Write-Host "[3/5] Adding all changes..." -ForegroundColor Yellow
git add .

# Step 4: Git commit
Write-Host ""
Write-Host "[4/5] Committing..." -ForegroundColor Yellow
git commit -m "fix: remove unused useEffect causing React Error #310 + homepage improvements

✅ Fixed Issues:
- Removed unused useEffect import from ProductDetail.tsx
- Fixed React Error #310 (useEffect infinite loop)
- COLOR_MAPPINGS moved outside component
- All hooks now use useMemo correctly

✅ Homepage Improvements:
- Added Platform Statistics section
- Added How It Works section (3 user types)
- Added Final CTA section
- Improved GSAP animations

Files modified:
- client/pages/ProductDetail.tsx (removed useEffect import)
- client/pages/Index.tsx (added 3 new sections)
- dist/* (fresh build)"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Committed successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️ Nothing to commit or commit failed" -ForegroundColor Yellow
}

# Step 5: Git push
Write-Host ""
Write-Host "[5/5] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   ✅ SUCCESS! DEPLOYED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "⏱️  Wait 2-3 minutes for deployment" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then test:" -ForegroundColor Cyan
Write-Host "1. Open: https://egygo.me" -ForegroundColor White
Write-Host "2. Hard refresh: Ctrl + Shift + R" -ForegroundColor White
Write-Host "3. Clear cache if needed" -ForegroundColor White
Write-Host "4. Test product page" -ForegroundColor White
Write-Host ""
Write-Host "Expected Result:" -ForegroundColor Cyan
Write-Host "✅ No React Error #310" -ForegroundColor Green
Write-Host "✅ First load works" -ForegroundColor Green
Write-Host "✅ New homepage sections visible" -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit"
