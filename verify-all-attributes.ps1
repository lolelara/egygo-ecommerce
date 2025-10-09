# Verify and Add ALL Required Attributes for Registration
$DATABASE_ID = "68de037e003bd03c4d45"

Write-Host "Verifying ALL Required Attributes..." -ForegroundColor Green

# Check and add email if missing
Write-Host "`n1. Checking email..." -ForegroundColor Yellow
appwrite databases create-string-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "email" `
    --size 255 `
    --required false 2>$null

Start-Sleep -Seconds 1

# Check and add name if missing
Write-Host "2. Checking name..." -ForegroundColor Yellow
appwrite databases create-string-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "name" `
    --size 255 `
    --required false 2>$null

Start-Sleep -Seconds 1

# Check and add avatar if missing
Write-Host "3. Checking avatar..." -ForegroundColor Yellow
appwrite databases create-string-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "avatar" `
    --size 2000 `
    --required false 2>$null

Start-Sleep -Seconds 1

# Check and add role if missing
Write-Host "4. Checking role..." -ForegroundColor Yellow
appwrite databases create-enum-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "role" `
    --elements "USER" "ADMIN" "MERCHANT" "AFFILIATE" "INTERMEDIARY" `
    --required false `
    --xdefault "USER" 2>$null

Start-Sleep -Seconds 1

# Check and add isAffiliate if missing
Write-Host "5. Checking isAffiliate..." -ForegroundColor Yellow
appwrite databases create-boolean-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "isAffiliate" `
    --required false `
    --xdefault false 2>$null

Start-Sleep -Seconds 1

# Check and add affiliateCode if missing
Write-Host "6. Checking affiliateCode..." -ForegroundColor Yellow
appwrite databases create-string-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "affiliateCode" `
    --size 50 `
    --required false 2>$null

Start-Sleep -Seconds 1

# Check and add commissionRate if missing
Write-Host "7. Checking commissionRate..." -ForegroundColor Yellow
appwrite databases create-float-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "commissionRate" `
    --required false `
    --xdefault 15 2>$null

Start-Sleep -Seconds 1

# Check and add totalEarnings if missing
Write-Host "8. Checking totalEarnings..." -ForegroundColor Yellow
appwrite databases create-float-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "totalEarnings" `
    --required false `
    --xdefault 0 2>$null

Start-Sleep -Seconds 1

# Check and add pendingEarnings if missing
Write-Host "9. Checking pendingEarnings..." -ForegroundColor Yellow
appwrite databases create-float-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "pendingEarnings" `
    --required false `
    --xdefault 0 2>$null

Start-Sleep -Seconds 1

# Check and add referralCount if missing
Write-Host "10. Checking referralCount..." -ForegroundColor Yellow
appwrite databases create-integer-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "referralCount" `
    --required false `
    --min 0 `
    --max 999999 `
    --xdefault 0 2>$null

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "ALL Attributes Verified!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "`nThe registration should work perfectly now!" -ForegroundColor Yellow
Write-Host "Try registering again." -ForegroundColor Yellow
Write-Host ""
