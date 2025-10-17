@echo off
echo ========================================
echo Adding Product Approval Fields
echo ========================================
echo.

echo [1/2] Checking node-appwrite...
npm list node-appwrite >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing node-appwrite...
    npm install node-appwrite --save-dev
    if %errorlevel% neq 0 (
        echo Failed to install node-appwrite!
        pause
        exit /b 1
    )
)
echo ✓ node-appwrite is ready

echo.
echo [2/2] Running script...
node scripts/add-product-approval-fields.js

if %errorlevel% neq 0 (
    echo.
    echo ❌ Script failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ All fields added successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Open Appwrite Dashboard to verify
echo 2. Run: npm run build
echo 3. Run: npm run deploy
echo.
pause
