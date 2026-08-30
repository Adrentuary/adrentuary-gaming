$path = 'c:\Users\skyle\OneDrive\Desktop\Website\app\corporate-clash-personal-tracker\data-street-shops.ts'

# Read existing file (UTF-8 BOM)
$bytes = [System.IO.File]::ReadAllBytes($path)
$enc = New-Object System.Text.UTF8Encoding($true) # with BOM
$content = $enc.GetString($bytes)

# Keep only lines 1-142 (header + TTC blocks), trim trailing whitespace
$lines = $content -split "`n"
$header = ($lines[0..141] -join "`n").TrimEnd()

# Write header back (we'll append BB section separately)
[System.IO.File]::WriteAllText($path, $header + "`n", $enc)
Write-Host "Header written: $($lines[0..141].Count) lines"
