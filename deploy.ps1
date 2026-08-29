# deploy.ps1 — stage all changes, commit with a message, and push to origin/main
param(
  [Parameter(Mandatory=$true)][string]$msg
)
Set-Location $PSScriptRoot
git add -A
git commit -m $msg
if ($LASTEXITCODE -ne 0) { Write-Host "Nothing to commit or commit failed." ; exit 1 }
git push origin main
if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Pushed to GitHub. Vercel will deploy automatically." -ForegroundColor Green
} else {
  Write-Host "Push FAILED." -ForegroundColor Red
  exit 1
}
