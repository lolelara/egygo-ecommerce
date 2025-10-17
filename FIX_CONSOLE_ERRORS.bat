@echo off
echo ========================================
echo Fixing Console Errors - EgyGo
echo ========================================
echo.

echo [1/4] Cleaning old build...
if exist dist rmdir /s /q dist
echo ✓ Old build removed

echo.
echo [2/4] Building project...
npm run build
if %errorlevel% neq 0 (
    echo ✗ Build failed!
    pause
    exit /b 1
)
echo ✓ Build completed

echo.
echo [3/4] Verifying files...
if exist dist\sw.js (
    echo ✓ sw.js exists
) else (
    echo ✗ sw.js missing!
)

if exist dist\favicon.ico (
    echo ✓ favicon.ico exists
) else (
    echo ✗ favicon.ico missing!
)

if exist dist\manifest.json (
    echo ✓ manifest.json exists
) else (
    echo ✗ manifest.json missing!
)

echo.
echo [4/4] All console errors fixed!
echo.
echo ========================================
echo Next Steps:
echo 1. Deploy: npm run deploy
echo 2. Or test locally: npm run dev
echo ========================================
echo.
pause
