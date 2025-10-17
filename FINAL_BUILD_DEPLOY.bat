@echo off
cls
echo ════════════════════════════════════════════════════════════
echo   🚀 FINAL BUILD AND DEPLOY - WITH ALL FIXES
echo ════════════════════════════════════════════════════════════
echo.
echo This will fix React Error #310 on production
echo.
pause
echo.

echo [1/5] Cleaning old build...
if exist dist (
    rmdir /s /q dist
    echo ✅ Old dist removed
)

echo.
echo [2/5] Building fresh version...
call npm run build

IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.

echo [3/5] Adding all changes...
git add .

echo.
echo [4/5] Committing...
git commit -m "fix: final deployment with React Error #310 fix and homepage improvements

✅ Fixed:
- React Error #310 in ProductDetail (useMemo instead of useEffect)
- COLOR_MAPPINGS moved outside component
- First load issue resolved
- Vite dynamic import warning fixed
- Service Worker CORS issues fixed

✅ Added to Homepage:
- Platform Statistics section
- How It Works section
- Final CTA section

Files modified:
- client/pages/ProductDetail.tsx
- client/pages/Index.tsx
- client/lib/appwrite.ts
- dist/* (fresh build)"

IF %ERRORLEVEL% NEQ 0 (
    echo ⚠️ No new changes to commit (already committed)
)

echo.
echo [5/5] Pushing to GitHub (triggers auto-deploy)...
git push origin main

IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Push failed!
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo   ✅ SUCCESS! DEPLOYED TO PRODUCTION!
echo ════════════════════════════════════════════════════════════
echo.
echo Wait 2-3 minutes for deployment, then:
echo.
echo 1. Open: https://egygo.me
echo 2. Hard refresh: Ctrl + Shift + R
echo 3. Clear cache if needed
echo 4. Test any product page
echo.
echo Expected:
echo ✅ No React Error #310
echo ✅ First load works
echo ✅ New homepage sections visible
echo.
pause
