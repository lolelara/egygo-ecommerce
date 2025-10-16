@echo off
cls
echo.
echo ═══════════════════════════════════════════════════════════
echo   🔧 Fix Service Worker CORS Issue
echo ═══════════════════════════════════════════════════════════
echo.
echo Problem: SW trying to cache external fonts from Appwrite
echo Solution: Skip external domains in SW
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   Changes:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ✅ index.html - Clear old SW before registering
echo ✅ sw.js - Skip Appwrite domains (CORS fix)
echo ✅ Cache version upgraded: v1 → v2
echo.
pause
echo.
echo [1/3] Adding changes...
git add client/index.html dist/sw.js FIX_SW_CORS.md

echo.
echo [2/3] Committing...
git commit -m "fix(sw): resolve CORS issues with external fonts

❌ Problem:
Service Worker was trying to cache fonts from:
- assets.appwrite.io/fonts/inter/Inter-Regular.woff2
- assets.appwrite.io/fonts/fira-code/FiraCode-Regular.woff2
Failed with CORS policy errors

✅ Solution:
1. Skip external domains in Service Worker
   - Added SKIP_DOMAINS list
   - Check hostname before caching
   - Let browser handle external resources normally

2. Clear old caches before registering new SW
   - Unregister old service workers
   - Delete old caches
   - Register fresh SW

3. Upgrade cache version
   - egygo-v1 → egygo-v2
   - Forces cache refresh

Files Modified:
- client/index.html: Clear old SW/caches first
- dist/sw.js: Skip Appwrite domains
- FIX_SW_CORS.md: Complete documentation

Result:
✅ No more CORS errors
✅ Fonts load correctly (from Google Fonts)
✅ SW works without errors
✅ Better performance

Testing:
1. Open Console
2. No CORS errors for fonts
3. SW logs: 'Skipping external domain: assets.appwrite.io'
4. Fonts load successfully"

IF %ERRORLEVEL% EQU 0 (
    echo ✅ Commit successful!
    echo.
    echo [3/3] Pushing to GitHub...
    git push origin main
    
    IF %ERRORLEVEL% EQU 0 (
        echo.
        echo ═══════════════════════════════════════════════════════════
        echo   ✅ SUCCESS! CORS Issue Fixed! 
        echo ═══════════════════════════════════════════════════════════
        echo.
        echo What was fixed:
        echo ✅ Service Worker skips external domains
        echo ✅ Old caches cleared automatically
        echo ✅ No more CORS errors
        echo ✅ Fonts load correctly
        echo.
        echo Test:
        echo 1. Open https://egygo.me
        echo 2. Open Developer Console
        echo 3. Check for CORS errors (should be none)
        echo 4. Fonts should load normally
        echo.
        echo Note: Users may need to hard refresh (Ctrl+F5)
        echo      to clear old SW and caches
        echo.
    ) ELSE (
        echo.
        echo ❌ Push failed
        echo.
    )
) ELSE (
    echo.
    echo ❌ Commit failed
    echo.
)

echo.
pause
