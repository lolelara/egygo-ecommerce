# ========================================
# سكريبت تلقائي لرفع وتشغيل Vendoor Scraper
# ========================================

$VM_IP = "20.208.131.121"
$VM_USER = "azureuser"
$SSH_KEY = "egygo-scraper_key.pem"
$PROJECT_DIR = "C:\Users\NoteBook\Desktop\goegy-main"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 بدء رفع وتشغيل Vendoor Scraper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# التأكد من وجود المفتاح
if (-not (Test-Path "$PROJECT_DIR\$SSH_KEY")) {
    Write-Host "❌ لم يتم العثور على مفتاح SSH!" -ForegroundColor Red
    Write-Host "   المسار: $PROJECT_DIR\$SSH_KEY" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ تم العثور على مفتاح SSH" -ForegroundColor Green
Write-Host ""

# الانتقال لمجلد المشروع
Set-Location $PROJECT_DIR

# الخطوة 1: رفع الملفات
Write-Host "📤 الخطوة 1: رفع الملفات إلى الـ VM..." -ForegroundColor Yellow
Write-Host ""

Write-Host "   📄 رفع setup-vm.sh..." -ForegroundColor Gray
scp -i $SSH_KEY scripts\setup-vm.sh ${VM_USER}@${VM_IP}:~/

Write-Host "   📄 رفع vendoor-to-appwrite.mjs..." -ForegroundColor Gray
scp -i $SSH_KEY scripts\vendoor-to-appwrite.mjs ${VM_USER}@${VM_IP}:~/

Write-Host ""
Write-Host "✅ تم رفع الملفات بنجاح!" -ForegroundColor Green
Write-Host ""

# الخطوة 2: تنفيذ الإعداد
Write-Host "⚙️  الخطوة 2: تنفيذ الإعداد على الـ VM..." -ForegroundColor Yellow
Write-Host "   ⏳ هذا قد يستغرق 3-5 دقائق..." -ForegroundColor Gray
Write-Host ""

$setupCommands = @"
chmod +x ~/setup-vm.sh
bash ~/setup-vm.sh
"@

ssh -i $SSH_KEY ${VM_USER}@${VM_IP} $setupCommands

Write-Host ""
Write-Host "✅ تم الإعداد بنجاح!" -ForegroundColor Green
Write-Host ""

# الخطوة 3: تشغيل السكريبت
Write-Host "🚀 الخطوة 3: تشغيل السكريبت..." -ForegroundColor Yellow
Write-Host ""

$runCommands = @"
mv ~/vendoor-to-appwrite.mjs ~/vendoor-scraper/ 2>/dev/null || true
cd ~/vendoor-scraper
pm2 delete vendoor-scraper 2>/dev/null || true
pm2 start vendoor-to-appwrite.mjs --name vendoor-scraper
pm2 save
echo ""
echo "========================================" 
echo "✅ تم تشغيل السكريبت بنجاح!"
echo "========================================" 
echo ""
echo "📊 لعرض اللوج:"
echo "   pm2 logs vendoor-scraper"
echo ""
echo "📁 لعرض النتائج:"
echo "   cat ~/vendoor-scraper/vendoor-scraping-results.json"
echo ""
"@

ssh -i $SSH_KEY ${VM_USER}@${VM_IP} $runCommands

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "🎉 تمت العملية بنجاح!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 الخطوات التالية:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. لمراقبة السكريبت:" -ForegroundColor White
Write-Host "      ssh -i $SSH_KEY ${VM_USER}@${VM_IP}" -ForegroundColor Gray
Write-Host "      pm2 logs vendoor-scraper" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. لعرض النتائج:" -ForegroundColor White
Write-Host "      ssh -i $SSH_KEY ${VM_USER}@${VM_IP}" -ForegroundColor Gray
Write-Host "      cat ~/vendoor-scraper/vendoor-scraping-results.json" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. للدخول للـ VM:" -ForegroundColor White
Write-Host "      ssh -i $SSH_KEY ${VM_USER}@${VM_IP}" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# خيار: الاتصال مباشرة
$connect = Read-Host "هل تريد الاتصال بالـ VM الآن لمراقبة اللوج؟ (y/n)"
if ($connect -eq "y" -or $connect -eq "Y") {
    Write-Host ""
    Write-Host "🔌 جاري الاتصال بالـ VM..." -ForegroundColor Yellow
    ssh -i $SSH_KEY ${VM_USER}@${VM_IP}
}
