# Add Sample Data to Appwrite
$DATABASE_ID = "68de037e003bd03c4d45"

Write-Host "Adding sample data to EgyGo..." -ForegroundColor Green

# Sample Admin User
Write-Host "`n1. Adding Admin User..." -ForegroundColor Yellow
$adminData = @{
    email = "admin@egygo.com"
    name = "مدير النظام"
    role = "ADMIN"
    isActive = $true
    isAdmin = $true
    isAffiliate = $false
    isMerchant = $false
} | ConvertTo-Json

appwrite databases create-document `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --document-id "admin001" `
    --data $adminData

# Sample Affiliate 1
Write-Host "`n2. Adding Affiliate 1..." -ForegroundColor Yellow
$affiliate1Data = @{
    email = "ahmed.affiliate@egygo.com"
    name = "أحمد محمد"
    role = "AFFILIATE"
    isActive = $true
    isAffiliate = $true
    isMerchant = $false
    affiliateCode = "AFF001"
    commissionRate = 20
    totalEarnings = 5420.50
    pendingEarnings = 1200.00
    referralCount = 34
} | ConvertTo-Json

appwrite databases create-document `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --document-id "aff001" `
    --data $affiliate1Data

# Sample Affiliate 2
Write-Host "`n3. Adding Affiliate 2..." -ForegroundColor Yellow
$affiliate2Data = @{
    email = "fatima.affiliate@egygo.com"
    name = "فاطمة علي"
    role = "AFFILIATE"
    isActive = $true
    isAffiliate = $true
    isMerchant = $false
    affiliateCode = "AFF002"
    commissionRate = 15
    totalEarnings = 3200.00
    pendingEarnings = 800.00
    referralCount = 22
} | ConvertTo-Json

appwrite databases create-document `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --document-id "aff002" `
    --data $affiliate2Data

# Sample Affiliate 3
Write-Host "`n4. Adding Affiliate 3..." -ForegroundColor Yellow
$affiliate3Data = @{
    email = "mohamed.affiliate@egygo.com"
    name = "محمد عبدالله"
    role = "AFFILIATE"
    isActive = $true
    isAffiliate = $true
    isMerchant = $false
    affiliateCode = "AFF003"
    commissionRate = 18
    totalEarnings = 8900.00
    pendingEarnings = 2100.00
    referralCount = 56
} | ConvertTo-Json

appwrite databases create-document `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --document-id "aff003" `
    --data $affiliate3Data

# Sample Merchant
Write-Host "`n5. Adding Merchant..." -ForegroundColor Yellow
$merchantData = @{
    email = "merchant@egygo.com"
    name = "متجر الإلكترونيات"
    role = "MERCHANT"
    isActive = $true
    isAffiliate = $false
    isMerchant = $true
} | ConvertTo-Json

appwrite databases create-document `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --document-id "merchant001" `
    --data $merchantData

# Sample Regular User
Write-Host "`n6. Adding Regular User..." -ForegroundColor Yellow
$userData = @{
    email = "user@egygo.com"
    name = "عميل عادي"
    role = "USER"
    isActive = $true
    isAffiliate = $false
    isMerchant = $false
} | ConvertTo-Json

appwrite databases create-document `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --document-id "user001" `
    --data $userData

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "Sample Data Added Successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "`nAdded:" -ForegroundColor Yellow
Write-Host "  1 Admin"
Write-Host "  3 Affiliates"
Write-Host "  1 Merchant"
Write-Host "  1 Regular User"
Write-Host "`nNow visit:" -ForegroundColor Yellow
Write-Host "  - https://egygo.me/#/admin/users"
Write-Host "  - https://egygo.me/#/admin/affiliates"
Write-Host ""
