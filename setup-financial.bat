@echo off
echo ====================================
echo  Financial Collections Setup
echo ====================================
echo.
echo This script will create:
echo  - merchantPayments collection
echo  - withdrawalRequests collection  
echo  - payment-proofs storage bucket
echo.
echo ====================================
echo.

REM Check if API key is provided
if "%1"=="" (
    echo ERROR: API Key required!
    echo.
    echo Usage:
    echo   setup-financial.bat YOUR_API_KEY
    echo.
    echo Get your API Key:
    echo   1. Go to: https://cloud.appwrite.io/console
    echo   2. Select your project
    echo   3. Settings - API Keys - Create API Key
    echo   4. Select ALL scopes
    echo   5. Copy the key and run this script again
    echo.
    pause
    exit /b 1
)

echo Running setup with provided API key...
echo.

node scripts/setup-financial-collections-simple.js %1

echo.
echo ====================================
echo Setup complete!
echo ====================================
echo.
pause
