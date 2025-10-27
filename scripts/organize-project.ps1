# =====================================
# Script: Organize EgyGo Project Files
# =====================================

Write-Host "Starting project organization..." -ForegroundColor Cyan

# Create folders
$folders = @(
    "docs",
    "docs\setup",
    "docs\guides",
    "docs\features",
    "docs\fixes",
    "docs\admin",
    "docs\affiliate",
    "exports"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "Created: $folder" -ForegroundColor Green
    }
}

# Organize documentation files
Write-Host "`nOrganizing documentation files..." -ForegroundColor Yellow

# Setup & Configuration files
$setupFiles = @(
    "APPWRITE_*.md",
    "*SETUP*.md",
    "DATABASE_*.md",
    "DEPLOY_*.md",
    "*INSTALL*.md"
)

# Feature documentation
$featureFiles = @(
    "ADVANCED_FEATURES.md",
    "COMPLETE_FEATURES_GUIDE.md",
    "DASHBOARD_FEATURES*.md",
    "*INTEGRATION*.md",
    "BANNERS_*.md",
    "CAPTCHA_*.md",
    "COOKIE_*.md"
)

# Fix & Improvement docs
$fixFiles = @(
    "*FIX*.md",
    "*ERROR*.md",
    "CONSOLE_*.md",
    "*CLEANUP*.md",
    "*IMPROVEMENT*.md"
)

# Admin docs
$adminFiles = @(
    "ADMIN_*.md",
    "SIDEBAR_*.md",
    "BACK_BUTTON*.md"
)

# Affiliate docs
$affiliateFiles = @(
    "AFFILIATE_*.md",
    "ADVERTISING_*.md",
    "ADS_*.md"
)

function Move-DocsToFolder {
    param($patterns, $destination)
    
    foreach ($pattern in $patterns) {
        $files = Get-ChildItem -Path "." -Filter $pattern -File -ErrorAction SilentlyContinue
        foreach ($file in $files) {
            $dest = Join-Path $destination $file.Name
            if (!(Test-Path $dest)) {
                Move-Item -Path $file.FullName -Destination $destination -ErrorAction SilentlyContinue
                Write-Host "  Moved: $($file.Name) -> $destination" -ForegroundColor Gray
            }
        }
    }
}

Move-DocsToFolder $setupFiles "docs\setup"
Move-DocsToFolder $featureFiles "docs\features"
Move-DocsToFolder $fixFiles "docs\fixes"
Move-DocsToFolder $adminFiles "docs\admin"
Move-DocsToFolder $affiliateFiles "docs\affiliate"

# Move remaining docs
$remainingDocs = Get-ChildItem -Path "." -Filter "*.md" -File | Where-Object { 
    $_.Name -notmatch "README|CHANGELOG|CONTRIBUTING|LICENSE|PROJECT_|VENDOOR_"
}

foreach ($doc in $remainingDocs) {
    $dest = Join-Path "docs\guides" $doc.Name
    if (!(Test-Path $dest)) {
        Move-Item -Path $doc.FullName -Destination "docs\guides" -ErrorAction SilentlyContinue
        Write-Host "  Moved: $($doc.Name) -> docs\guides" -ForegroundColor Gray
    }
}

# Delete duplicate folders
Write-Host "`nRemoving duplicate folders..." -ForegroundColor Yellow

$duplicateFolders = @(
    "egygo-ecommerce"
)

foreach ($folder in $duplicateFolders) {
    if (Test-Path $folder) {
        Remove-Item -Path $folder -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  Deleted: $folder" -ForegroundColor Green
    }
}

# Clean old build files
Write-Host "`nCleaning old build files..." -ForegroundColor Yellow

if (Test-Path "dist") {
    Remove-Item -Path "dist\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  Cleaned dist folder" -ForegroundColor Green
}

# Delete old node_modules
$oldNodeModules = @(
    "digitalocean-api\node_modules",
    "functions\vendoor-scraper\node_modules",
    "workers\node_modules"
)

foreach ($nm in $oldNodeModules) {
    if (Test-Path $nm) {
        Write-Host "  Deleting: $nm (this may take a while...)" -ForegroundColor Gray
        Remove-Item -Path $nm -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  Deleted successfully" -ForegroundColor Green
    }
}

# Update .gitignore
Write-Host "`nUpdating .gitignore..." -ForegroundColor Yellow

$gitignoreContent = @"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
package-lock.json
yarn.lock

# Build & Dist
dist/
dist-ssr/
build/
*.local

# Environment
.env
.env.local
.env.production
.env.development

# IDE
.vscode/*
!.vscode/extensions.json
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
desktop.ini

# Logs
logs/
*.log

# Exports & Temp
exports/
temp/
tmp/
*.tmp

# Test coverage
coverage/
.nyc_output/

# TypeScript
*.tsbuildinfo

# Misc
.cache/
.parcel-cache/
.vercel/
.netlify/
"@

Set-Content -Path ".gitignore" -Value $gitignoreContent -Encoding UTF8
Write-Host "  Updated .gitignore" -ForegroundColor Green

Write-Host "`nProject organization completed successfully!" -ForegroundColor Cyan
Write-Host "`nSummary:" -ForegroundColor White
Write-Host "  - Organized documentation files into docs folder" -ForegroundColor Green
Write-Host "  - Removed duplicate folders" -ForegroundColor Green
Write-Host "  - Cleaned build files" -ForegroundColor Green
Write-Host "  - Updated .gitignore" -ForegroundColor Green
Write-Host ""
