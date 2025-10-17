@echo off
echo ════════════════════════════════════════════════════════════
echo   🚀 BUILD AND DEPLOY - All Fixes
echo ════════════════════════════════════════════════════════════
echo.
echo This will:
echo 1. Build the project
echo 2. Add all changes to git
echo 3. Commit with message
echo 4. Push to GitHub (auto-deploys)
echo.
echo Fixes included:
echo ✅ React Error #310 (useMemo fix)
echo ✅ Product First Load (COLOR_MAPPINGS)
echo ✅ Vite Dynamic Import Warning
echo.
pause
echo.

echo [1/4] Building...
call npm run build
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Adding changes...
git add .

echo.
echo [3/4] Committing...
git commit -m "fix: deploy all critical fixes - React Error #310, First Load, Vite Warning"

echo.
echo [4/4] Pushing...
git push origin main

echo.
echo ════════════════════════════════════════════════════════════
echo   ✅ DEPLOYED! Wait 2-3 minutes then test
echo ════════════════════════════════════════════════════════════
echo.
echo Test URL: https://egygo.me
echo Hard refresh: Ctrl + Shift + R
echo.
pause
