@echo off
echo Step 1: Committing changes...
git commit -m "feat: comprehensive AI improvements with testing tools and better error handling"

echo.
echo Step 2: Pulling latest changes...
git pull origin main --rebase

echo.
echo Step 3: Pushing to GitHub...
git push origin main

echo.
echo Done!
pause
