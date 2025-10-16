@echo off
echo.
echo ========================================
echo   Rebuild and Redeploy
echo ========================================
echo.

echo [1/4] Installing dependencies...
npm install

echo.
echo [2/4] Building for production...
npm run build

IF %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Build successful!
    echo.
    echo [3/4] Committing changes...
    git add .
    git commit -m "fix: rebuild assetsassets404 errors for bundled files"
    
    echo.
    echo [4/4] Pushing to GitHub...
    git push origin main
    
    IF %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo   ✅ Deploy successful!
        echo ========================================
        echo.
        echo الملفات المبنية تم رفعها بنجاح
        echo انتظر ~2 دقيقة حتى يكتمل Deploy
        echo.
    ) ELSE (
        echo.
        echo ❌ Push failed
        echo.
    )
) ELSE (
    echo.
    echo ❌ Build failed! Check errors above.
    echo.
)

pause
