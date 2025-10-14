# Add ALL Missing Attributes for Complete Setup
$DATABASE_ID = "68de037e003bd03c4d45"

Write-Host "Adding ALL Missing Attributes..." -ForegroundColor Green

# For notifications collection - add missing numeric attributes
Write-Host "`n1. Adding totalRecipients to notifications..." -ForegroundColor Yellow
appwrite databases create-integer-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "totalRecipients" `
    --required false `
    --min 0 `
    --max 999999 `
    --xdefault 0

Start-Sleep -Seconds 2

Write-Host "`n2. Adding readCount to notifications..." -ForegroundColor Yellow
appwrite databases create-integer-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "readCount" `
    --required false `
    --min 0 `
    --max 999999 `
    --xdefault 0

Start-Sleep -Seconds 2

Write-Host "`n3. Adding clickCount to notifications..." -ForegroundColor Yellow
appwrite databases create-integer-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "clickCount" `
    --required false `
    --min 0 `
    --max 999999 `
    --xdefault 0

Start-Sleep -Seconds 2

# Add datetime attributes for notifications
Write-Host "`n4. Adding sentAt to notifications..." -ForegroundColor Yellow
appwrite databases create-datetime-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "sentAt" `
    --required false

Start-Sleep -Seconds 2

Write-Host "`n5. Adding readAt to notifications..." -ForegroundColor Yellow
appwrite databases create-datetime-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "readAt" `
    --required false

Start-Sleep -Seconds 2

Write-Host "`n6. Adding scheduledFor to notifications..." -ForegroundColor Yellow
appwrite databases create-datetime-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "scheduledFor" `
    --required false

Start-Sleep -Seconds 2

# Add link to notifications
Write-Host "`n7. Adding link to notifications..." -ForegroundColor Yellow
appwrite databases create-string-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "link" `
    --size 2000 `
    --required false

Start-Sleep -Seconds 2

# Add lastActivity to users
Write-Host "`n8. Adding lastActivity to users..." -ForegroundColor Yellow
appwrite databases create-datetime-attribute `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --key "lastActivity" `
    --required false

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "ALL Attributes Added Successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "`nThe system should work perfectly now!" -ForegroundColor Yellow
Write-Host "Try registering or refreshing the page." -ForegroundColor Yellow
Write-Host ""
