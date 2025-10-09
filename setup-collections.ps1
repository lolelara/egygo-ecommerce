# Quick Appwrite Collections Setup
$DATABASE_ID = "68de037e003bd03c4d45"

Write-Host "🚀 Creating EgyGo Collections..." -ForegroundColor Green

# Create Users collection
Write-Host "`n1 Creating Users collection..." -ForegroundColor Yellow
appwrite databases create-collection --database-id $DATABASE_ID --collection-id "users" --name "Users" --permissions 'read("any")' 'create("users")' 'update("users")' 'delete("users")'
Start-Sleep -Seconds 2

# Add Users attributes
Write-Host "  Adding attributes..." -ForegroundColor Gray
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "users" --key "email" --size 255 --required true
Start-Sleep -Seconds 2
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "users" --key "name" --size 255 --required false
Start-Sleep -Seconds 2
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "users" --key "avatar" --size 2000 --required false
Start-Sleep -Seconds 2
appwrite databases create-enum-attribute --database-id $DATABASE_ID --collection-id "users" --key "role" --elements "USER" "ADMIN" "MERCHANT" "AFFILIATE" --required true --default "USER"
Start-Sleep -Seconds 2
appwrite databases create-boolean-attribute --database-id $DATABASE_ID --collection-id "users" --key "isActive" --required false --default true
Start-Sleep -Seconds 2
appwrite databases create-boolean-attribute --database-id $DATABASE_ID --collection-id "users" --key "isAffiliate" --required false --default false
Start-Sleep -Seconds 2
appwrite databases create-boolean-attribute --database-id $DATABASE_ID --collection-id "users" --key "isMerchant" --required false --default false
Start-Sleep -Seconds 2
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "users" --key "affiliateCode" --size 50 --required false
Start-Sleep -Seconds 2
appwrite databases create-float-attribute --database-id $DATABASE_ID --collection-id "users" --key "commissionRate" --required false --default 15
Start-Sleep -Seconds 2
appwrite databases create-float-attribute --database-id $DATABASE_ID --collection-id "users" --key "totalEarnings" --required false --default 0
Start-Sleep -Seconds 2
appwrite databases create-float-attribute --database-id $DATABASE_ID --collection-id "users" --key "pendingEarnings" --required false --default 0
Start-Sleep -Seconds 2
appwrite databases create-integer-attribute --database-id $DATABASE_ID --collection-id "users" --key "referralCount" --required false --default 0 --min 0 --max 999999

Write-Host "✅ Users collection created!" -ForegroundColor Green

# Create Notifications collection
Write-Host "`n2 Creating Notifications collection..." -ForegroundColor Yellow
appwrite databases create-collection --database-id $DATABASE_ID --collection-id "notifications" --name "Notifications" --permissions 'read("any")' 'create("users")' 'update("users")'
Start-Sleep -Seconds 2

appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "notifications" --key "userId" --size 255 --required false
Start-Sleep -Seconds 2
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "notifications" --key "title" --size 500 --required true
Start-Sleep -Seconds 2
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "notifications" --key "message" --size 2000 --required true
Start-Sleep -Seconds 2
appwrite databases create-enum-attribute --database-id $DATABASE_ID --collection-id "notifications" --key "type" --elements "info" "success" "warning" "error" "promotion" --required true --default "info"
Start-Sleep -Seconds 2
appwrite databases create-boolean-attribute --database-id $DATABASE_ID --collection-id "notifications" --key "isRead" --required false --default false
Start-Sleep -Seconds 2
appwrite databases create-integer-attribute --database-id $DATABASE_ID --collection-id "notifications" --key "readCount" --required false --default 0 --min 0 --max 999999
Start-Sleep -Seconds 2
appwrite databases create-integer-attribute --database-id $DATABASE_ID --collection-id "notifications" --key "clickCount" --required false --default 0 --min 0 --max 999999

Write-Host "✅ Notifications collection created!" -ForegroundColor Green

# Create Commissions collection
Write-Host "`n3 Creating Commissions collection..." -ForegroundColor Yellow
appwrite databases create-collection --database-id $DATABASE_ID --collection-id "commissions" --name "Commissions" --permissions 'read("any")' 'create("users")' 'update("users")'
Start-Sleep -Seconds 2

appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "commissions" --key "affiliateId" --size 255 --required true
Start-Sleep -Seconds 2
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "commissions" --key "orderId" --size 255 --required true
Start-Sleep -Seconds 2
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "commissions" --key "productName" --size 500 --required false
Start-Sleep -Seconds 2
appwrite databases create-float-attribute --database-id $DATABASE_ID --collection-id "commissions" --key "amount" --required true --default 0
Start-Sleep -Seconds 2
appwrite databases create-float-attribute --database-id $DATABASE_ID --collection-id "commissions" --key "percentage" --required false --default 15
Start-Sleep -Seconds 2
appwrite databases create-enum-attribute --database-id $DATABASE_ID --collection-id "commissions" --key "status" --elements "pending" "approved" "paid" "cancelled" --required true --default "pending"

Write-Host "✅ Commissions collection created!" -ForegroundColor Green

# Create Notification Templates collection
Write-Host "`n4 Creating Notification Templates collection..." -ForegroundColor Yellow
appwrite databases create-collection --database-id $DATABASE_ID --collection-id "notification_templates" --name "Notification Templates" --permissions 'read("any")' 'create("users")'
Start-Sleep -Seconds 2

appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "notification_templates" --key "name" --size 255 --required true
Start-Sleep -Seconds 2
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "notification_templates" --key "title" --size 500 --required true
Start-Sleep -Seconds 2
appwrite databases create-string-attribute --database-id $DATABASE_ID --collection-id "notification_templates" --key "message" --size 2000 --required true
Start-Sleep -Seconds 2
appwrite databases create-enum-attribute --database-id $DATABASE_ID --collection-id "notification_templates" --key "type" --elements "info" "success" "warning" "error" "promotion" --required true --default "info"
Start-Sleep -Seconds 2
appwrite databases create-boolean-attribute --database-id $DATABASE_ID --collection-id "notification_templates" --key "isActive" --required false --default true

Write-Host "✅ Notification Templates collection created!" -ForegroundColor Green

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Collections created:" -ForegroundColor Yellow
Write-Host "  1. Users (with affiliate fields)"
Write-Host "  2. Notifications"
Write-Host "  3. Commissions"
Write-Host "  4. Notification Templates"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  - Configure permissions in Appwrite Console"
Write-Host "  - Add indexes for better performance"
Write-Host "  - Update .env if needed"
Write-Host ""
Write-Host "Happy Coding!" -ForegroundColor Green
Write-Host ""
