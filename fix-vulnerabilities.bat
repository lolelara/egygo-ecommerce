@echo off
echo.
echo ════════════════════════════════════════════════════════════
echo   Fix npm Security Vulnerabilities
echo ════════════════════════════════════════════════════════════
echo.
echo Current vulnerabilities: 8
echo   - 5 moderate
echo   - 1 high
echo   - 2 critical
echo.
echo [Option 1] Auto-fix (safe fixes only)
echo.

npm audit fix

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo If vulnerabilities remain, you can try:
echo   npm audit fix --force
echo.
echo ⚠️  Warning: --force may cause breaking changes
echo     Only use if needed and test afterwards
echo.
pause
