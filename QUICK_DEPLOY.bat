@echo off
echo ═══════════════════════════════════════════════════════════
echo   🚀 QUICK DEPLOY - All Fixes
echo ═══════════════════════════════════════════════════════════
echo.
echo Building + Deploying all fixes...
echo.

npm run build && git add . && git commit -m "fix: deploy all critical fixes - React Error #310, First Load, Vite Warning" && git push origin main

echo.
echo ═══════════════════════════════════════════════════════════
echo   ✅ DONE! Check https://egygo.me in 2-3 minutes
echo ═══════════════════════════════════════════════════════════
pause
