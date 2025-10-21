# EgyGo Deployment Script
# يقوم ببناء ورفع المشروع تلقائياً

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   EgyGo Deployment Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Git Status
Write-Host "📊 Checking Git status..." -ForegroundColor Yellow
git status

Write-Host ""
$continue = Read-Host "Do you want to commit changes? (y/n)"

if ($continue -eq "y") {
    Write-Host ""
    $commitMsg = Read-Host "Enter commit message"
    
    Write-Host "📝 Committing changes..." -ForegroundColor Yellow
    git add .
    git commit -m "$commitMsg"
    
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Yellow
    git push
    
    Write-Host "✅ Git operations complete!" -ForegroundColor Green
} else {
    Write-Host "⏭️  Skipping Git operations..." -ForegroundColor Gray
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 2. Build
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Build failed! Please fix errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""

# 3. Check dist folder
if (Test-Path "dist") {
    $fileCount = (Get-ChildItem -Path "dist" -Recurse | Measure-Object).Count
    Write-Host "📦 Build output: $fileCount files in dist/" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error: dist/ folder not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 4. Deploy options
Write-Host "🚀 Ready to deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "Choose deployment method:" -ForegroundColor Yellow
Write-Host "1. Netlify (automatic)"
Write-Host "2. Manual (copy dist/ folder)"
Write-Host "3. Skip deployment"
Write-Host ""

$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🌐 Deploying to Netlify..." -ForegroundColor Yellow
        netlify deploy --prod --dir=dist
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Deployment successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "🎉 Your site is now live!" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Yellow
            Write-Host "1. Clear browser cache (Ctrl + Shift + Delete)"
            Write-Host "2. Hard refresh (Ctrl + F5)"
            Write-Host "3. Check console for errors"
        } else {
            Write-Host ""
            Write-Host "❌ Deployment failed!" -ForegroundColor Red
        }
    }
    "2" {
        Write-Host ""
        Write-Host "📂 Opening dist/ folder..." -ForegroundColor Yellow
        explorer dist
        Write-Host ""
        Write-Host "📝 Manual deployment steps:" -ForegroundColor Cyan
        Write-Host "1. Copy all files from dist/ folder"
        Write-Host "2. Upload to your hosting service"
        Write-Host "3. Wait 5-10 minutes for CDN update"
        Write-Host "4. Clear cache and test"
    }
    "3" {
        Write-Host ""
        Write-Host "⏭️  Skipping deployment..." -ForegroundColor Gray
        Write-Host ""
        Write-Host "Build is ready in dist/ folder" -ForegroundColor Cyan
    }
    default {
        Write-Host ""
        Write-Host "❌ Invalid choice" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Deployment Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
