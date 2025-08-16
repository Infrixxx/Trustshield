# TrustShield API Test Script
param (
    [string]$merchant = "Taxi Scam Pty",
    [int]$amount = 15000
)

$url = "http://localhost:3001/score"
$headers = @{
    "Content-Type" = "application/json"
}

# Using here-string for perfect JSON formatting
$body = @"
{
    "merchant": "$merchant",
    "amount": $amount
}
"@

try {
    Write-Host "Testing with merchant: $merchant, amount: R$amount" -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
    
    Write-Host "Response:" -ForegroundColor Green
    $response | Format-List | Out-Host
    
} catch {
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Red
    
    # Read the error response stream properly
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $errorBody = $reader.ReadToEnd()
    
    try {
        $errorObj = $errorBody | ConvertFrom-Json
        Write-Host "Error Details:" -ForegroundColor Red
        $errorObj | Format-List | Out-Host
    } catch {
        Write-Host "Raw Error Response:" -ForegroundColor Red
        Write-Host $errorBody -ForegroundColor Red
    }
}