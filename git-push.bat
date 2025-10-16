@echo off
echo ===================================
echo    Pushing to GitHub
echo ===================================
echo.

echo Adding all changes...
git add .

echo.
echo Creating commit...
git commit -m "feat: add comprehensive AI features suite with 7 new components"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ===================================
echo    Push Complete!
echo ===================================
pause
