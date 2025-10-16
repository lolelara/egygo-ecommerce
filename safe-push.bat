@echo off
echo ===================================
echo   Safe Push to GitHub
echo ===================================
echo.

echo Step 1: Adding all files...
git add .

echo.
echo Step 2: Creating commit...
git commit -m "feat: add AI features with improved error handling and testing tools"

echo.
echo Step 3: Pushing to GitHub...
git push origin main

echo.
echo ===================================
echo   Done!
echo ===================================
pause
