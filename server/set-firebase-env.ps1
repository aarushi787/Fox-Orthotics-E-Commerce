<#
.SYNOPSIS
  Helper to set FIREBASE_SERVICE_ACCOUNT_JSON_B64 environment variable from a local service account JSON file.

.DESCRIPTION
  Reads a Firebase service account JSON file, base64-encodes it and sets the
  `FIREBASE_SERVICE_ACCOUNT_JSON_B64` environment variable in the chosen scope.

.PARAMETER Path
  Full path to the service account JSON file.

.PARAMETER Scope
  Environment variable scope: 'Process' (default) or 'User'. Use 'Process' for current session only.

EXAMPLES
  # Set for current PowerShell session
  .\set-firebase-env.ps1 -Path C:\keys\service-account.json

  # Persist for current user (you may need to restart shells)
  .\set-firebase-env.ps1 -Path C:\keys\service-account.json -Scope User

SECURITY
  Avoid committing service account JSON files to source control. Prefer 'Process' scope when possible.
  If you persist the env var at 'User' scope, be aware it will remain on the machine until removed.
#>

param(
    [Parameter(Mandatory=$true)][string]$Path,
    [ValidateSet('Process','User')][string]$Scope = 'Process'
)

if (-not (Test-Path -Path $Path)) {
    Write-Error "Service account file not found at: $Path"
    exit 1
}

try {
    $raw = Get-Content -Path $Path -Raw -ErrorAction Stop
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($raw)
    $encoded = [Convert]::ToBase64String($bytes)
    [System.Environment]::SetEnvironmentVariable('FIREBASE_SERVICE_ACCOUNT_JSON_B64', $encoded, $Scope)
    Write-Host "Set FIREBASE_SERVICE_ACCOUNT_JSON_B64 in scope: $Scope"
    if ($Scope -eq 'User') { Write-Host 'Persistent env var set; you may need to restart your shells to pick it up.' }
} catch {
    Write-Error "Failed to set env var: $_"
    exit 1
}
