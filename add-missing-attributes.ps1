# Add Missing Attributes to Collections
$DATABASE_ID = "68de037e003bd03c4d45"

Write-Host "Adding Missing Attributes to Collections..." -ForegroundColor Green

# Add isMerchant to users collection
Write-Host "`n1. Adding isMerchant to users..." -ForegroundColor Yellow
appwrite databases create-boolean-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "isMerchant" `
    --required false `
    --xdefault false

Start-Sleep -Seconds 3

# Add isRead to notifications collection
Write-Host "`n2. Adding isRead to notifications..." -ForegroundColor Yellow
appwrite databases create-boolean-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "isRead" `
    --required false `
    --xdefault false

Start-Sleep -Seconds 3

# Add other potentially missing attributes to users
Write-Host "`n3. Adding isAdmin to users..." -ForegroundColor Yellow
appwrite databases create-boolean-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "isAdmin" `
    --required false `
    --xdefault false

Start-Sleep -Seconds 3

# Add userName as alternative to name
Write-Host "`n4. Adding userName to users..." -ForegroundColor Yellow
appwrite databases create-string-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "userName" `
    --size 255 `
    --required false

Start-Sleep -Seconds 3

# Add profileImage as alternative to avatar
Write-Host "`n5. Adding profileImage to users..." -ForegroundColor Yellow
appwrite databases create-string-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "profileImage" `
    --size 2000 `
    --required false

Start-Sleep -Seconds 3

# Add phone to users
Write-Host "`n6. Adding phone to users..." -ForegroundColor Yellow
appwrite databases create-string-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "phone" `
    --size 50 `
    --required false

Start-Sleep -Seconds 3

# Add status to users
Write-Host "`n7. Adding status to users..." -ForegroundColor Yellow
appwrite databases create-string-attribute `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --key "status" `
    --size 50 `
    --required false `
    --xdefault "active"

Start-Sleep -Seconds 3

# Add targetAudience to notifications
Write-Host "`n8. Adding targetAudience to notifications..." -ForegroundColor Yellow
appwrite databases create-string-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "targetAudience" `
    --size 50 `
    --required false `
    --xdefault "all"

Start-Sleep -Seconds 3

# Add channels array to notifications (as JSON string for now)
Write-Host "`n9. Adding channels to notifications..." -ForegroundColor Yellow
appwrite databases create-string-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "channels" `
    --size 500 `
    --required false `
    --xdefault '["inApp"]'

Start-Sleep -Seconds 3

# Add status to notifications
Write-Host "`n10. Adding status to notifications..." -ForegroundColor Yellow
appwrite databases create-enum-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "status" `
    --elements "draft" "sent" "scheduled" "failed" `
    --required false `
    --xdefault "sent"

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "Attributes Added Successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "`nNow try registering again!" -ForegroundColor Yellow
Write-Host ""
