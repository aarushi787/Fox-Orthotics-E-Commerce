<#
Batch AI recommender for "laptops" (PowerShell)
Usage:
  Open PowerShell in the repo root (or run this script from anywhere).
  ./scripts/batch_ai_laptops.ps1 -Query "laptop" -OutputDir .\ai-results

What it does:
  - Loads `products.json` from the repo root
  - Filters products whose `name`, `description` or `category` contains the word "laptop" (case-insensitive)
  - Posts the filtered product list to `http://localhost:5000/api/ai/recommend` with the provided query
  - Saves the JSON response to `OutputDir\laptops_recommendation.json`
#>

param(
  [string]$Query = "laptop",
  [string]$ServerUrl = "http://localhost:5000/api/ai/recommend",
  [string]$ProductsFile = "products.json",
  [string]$OutputDir = "./ai-results"
)

try {
  $scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
  # If script invoked via relative path, try repo root heuristic
  $productsPath = Join-Path $scriptRoot "..\$ProductsFile"
  if (-not (Test-Path $productsPath)) { $productsPath = Join-Path (Get-Location) $ProductsFile }
  if (-not (Test-Path $productsPath)) { throw "Could not find products.json at $productsPath" }

  Write-Host "Loading products from: $productsPath"
  $raw = Get-Content $productsPath -Raw
  $allProducts = $raw | ConvertFrom-Json

  $keyword = ($Query -replace '[^a-zA-Z0-9]', ' ') -split '\s+' | Where-Object { $_ -ne '' } | Select-Object -First 1
  if (-not $keyword) { $keyword = "laptop" }
  $k = $keyword.ToLower()

  $filtered = $allProducts | Where-Object {
    ($_.name -as [string] -match "(?i)$k") -or
    ($_.description -as [string] -match "(?i)$k") -or
    ($_.category -as [string] -match "(?i)$k") -or
    (($_.features -join ' ') -as [string] -match "(?i)$k")
  }

  if (-not $filtered -or $filtered.Count -eq 0) {
    Write-Warning "No products matched keyword '$k'. Sending full product list instead."
    $filtered = $allProducts
  }

  # Prepare body with simplified product objects to reduce payload size
  $simplified = $filtered | ForEach-Object {
    @{
      sku = $_.sku
      name = $_.name
      description = $_.description
      category = $_.category
      features = $_.features
    }
  }

  $body = @{
    query = $Query
    products = $simplified
  } | ConvertTo-Json -Depth 10

  if (-not (Test-Path $OutputDir)) { New-Item -ItemType Directory -Path $OutputDir | Out-Null }
  $outFile = Join-Path $OutputDir "laptops_recommendation.json"

  Write-Host "Posting $($filtered.Count) products to $ServerUrl with query '$Query'..."
  $resp = Invoke-RestMethod -Method Post -Uri $ServerUrl -Body $body -ContentType 'application/json'

  $resp | ConvertTo-Json -Depth 10 | Set-Content -Path $outFile -Encoding UTF8
  Write-Host "Saved response to: $outFile"
  Write-Host "assistantResponse:`n$($resp.assistantResponse)"
} catch {
  Write-Error "Error: $_"
  exit 1
}
