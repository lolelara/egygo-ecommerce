# Quick Test Vendoor Scraping
Write-Host "Testing Vendoor Enhanced Scraping..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"
$email = "almlmibrahym574@gmail.com"
$password = "hema2004"

Write-Host "1. Starting scraping (2 pages, JSON, basic info)..." -ForegroundColor Yellow

$body = @{
    email = $email
    password = $password
    maxPages = 2
    format = "json"
    includeDetails = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/vendoor/scrape-and-save" -Method Post -Body $body -ContentType "application/json" -TimeoutSec 300
    
    Write-Host "  Success!" -ForegroundColor Green
    Write-Host "  Total Products: $($response.totalProducts)" -ForegroundColor White
    Write-Host "  File: $($response.file.filename)" -ForegroundColor White
    Write-Host "  Download URL: $($response.downloadUrl)" -ForegroundColor White
    
    $filename = $response.file.filename
    
    # Download the file
    Write-Host "`n2. Downloading file..." -ForegroundColor Yellow
    $downloadPath = Join-Path (Get-Location) "exports"
    if (!(Test-Path $downloadPath)) {
        New-Item -ItemType Directory -Path $downloadPath | Out-Null
    }
    
    $filePath = Join-Path $downloadPath $filename
    Invoke-WebRequest -Uri "$baseUrl/api/vendoor/download/$filename" -OutFile $filePath
    
    Write-Host "  Downloaded to: $filePath" -ForegroundColor Green
    
    # Show preview
    Write-Host "`n3. Preview (first 3 products):" -ForegroundColor Cyan
    $data = Get-Content $filePath | ConvertFrom-Json
    $data[0..2] | ForEach-Object {
        Write-Host "  - $($_.name)" -ForegroundColor White
        Write-Host "    Price: $($_.price) EGP | Stock: $($_.stock) | Commission: $($_.commission) EGP" -ForegroundColor Gray
    }
    
    Write-Host "`n==================================" -ForegroundColor Green
    Write-Host "SUCCESS! File ready for bulk upload!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    
} catch {
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nDetails:" -ForegroundColor Yellow
    Write-Host $_.Exception -ForegroundColor Gray
}
