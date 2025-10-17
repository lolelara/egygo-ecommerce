# ====================================================================
#  FINAL FIX - Rebuild Everything
# ====================================================================

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  REBUILDING & DEPLOYING" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Remove old dist completely
Write-Host "Step 1: Removing old dist folder..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Removed" -ForegroundColor Green
}

# 2. Build fresh
Write-Host ""
Write-Host "Step 2: Building..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Built" -ForegroundColor Green

# 3. Add everything
Write-Host ""
Write-Host "Step 3: Adding files..." -ForegroundColor Yellow
git add -A

# 4. Commit
Write-Host ""
Write-Host "Step 4: Committing..." -ForegroundColor Yellow
git commit -m "fix: React Error #310 - removed useEffect import from ProductDetail + fresh build"

# 5. Push
Write-Host ""
Write-Host "Step 5: Pushing..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  ✅ DONE!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Wait 2-3 minutes, then test:" -ForegroundColor Yellow
Write-Host "https://egygo.me" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+Shift+R to hard refresh" -ForegroundColor Yellow
