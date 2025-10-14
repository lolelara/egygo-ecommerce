# Fix Permissions for All Collections
$DATABASE_ID = "68de037e003bd03c4d45"

Write-Host "Fixing Permissions for EgyGo Collections..." -ForegroundColor Green

# Fix users permissions
Write-Host "`n1. Fixing users permissions..." -ForegroundColor Yellow
appwrite databases update-collection `
    --database-id $DATABASE_ID `
    --collection-id "users" `
    --name "Users" `
    --permissions 'read("any")' 'create("users")' 'update("users")' 'delete("users")'

Start-Sleep -Seconds 2

# Fix notifications permissions  
Write-Host "`n2. Fixing notifications permissions..." -ForegroundColor Yellow
appwrite databases update-collection `
    --database-id $DATABASE_ID `
    --collection-id "notifications" `
    --name "Notifications" `
    --permissions 'read("any")' 'create("users")' 'update("users")' 'delete("users")'

Start-Sleep -Seconds 2

# Fix notification_templates permissions
Write-Host "`n3. Fixing notification_templates permissions..." -ForegroundColor Yellow
appwrite databases update-collection `
    --database-id $DATABASE_ID `
    --collection-id "notification_templates" `
    --name "Notification Templates" `
    --permissions 'read("any")' 'create("users")' 'update("users")' 'delete("users")'

Start-Sleep -Seconds 2

# Fix scheduled_notifications permissions
Write-Host "`n4. Fixing scheduled_notifications permissions..." -ForegroundColor Yellow
appwrite databases update-collection `
    --database-id $DATABASE_ID `
    --collection-id "scheduled_notifications" `
    --name "Scheduled Notifications" `
    --permissions 'read("any")' 'create("users")' 'update("users")' 'delete("users")'

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "Permissions Fixed Successfully!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "`nNow refresh the page and it should work!" -ForegroundColor Yellow
Write-Host ""
