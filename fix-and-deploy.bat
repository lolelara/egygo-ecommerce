@echo off
echo ========================================
echo    Fixing and Deploying EgyGo Project
echo ========================================
echo.

echo [1/4] Installing dependencies...
call pnpm install
if errorlevel 1 (
    echo Failed to install dependencies with pnpm, trying npm...
    call npm install
)

echo.
echo [2/4] Building project...
call pnpm build
if errorlevel 1 (
    echo Failed to build with pnpm, trying npm...
    call npm run build
)

echo.
echo [3/4] Adding changes to git...
git add -A

echo.
echo [4/4] Creating commit...
git commit -m "fix: resolve TypeScript errors, optimize chunk sizes, and fix product variants display"

echo.
echo [5/5] Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo    Process Complete!
echo ========================================
pause
