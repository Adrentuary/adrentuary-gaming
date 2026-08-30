$path = 'c:\Users\skyle\OneDrive\Desktop\Website\app\corporate-clash-personal-tracker\data-street-shops.ts'
$enc = New-Object System.Text.UTF8Encoding($true)

$bb = @'

// ─────────────────────────────────────────────────────────────────────────────
// BARNACLE BOATYARD
// ─────────────────────────────────────────────────────────────────────────────

'@

# Append to file
[System.IO.File]::AppendAllText($path, $bb, $enc)
Write-Host "Header appended"
