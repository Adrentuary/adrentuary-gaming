$base = 'C:\Users\skyle\OneDrive\Pictures\adrentuary-website\games\toon-town\corporate-clash-personal-tracker\Streets Page\Barnacle Boatyard'
$streets = @('Anchor Avenue','Buccaneer Boulevard','Lighthouse Lane','Seaweed Street')
foreach ($s in $streets) {
    Write-Host "=== $s ==="
    $dir = "$base\$s"
    Write-Host "-- shops:"
    Get-ChildItem "$dir\shops" -File 2>$null | ForEach-Object { Write-Host "  $($_.Name)" }
    Write-Host "-- shop-owners:"
    Get-ChildItem "$dir\shop-owners" -File 2>$null | ForEach-Object { Write-Host "  $($_.Name)" }
    Write-Host "-- shop-maps:"
    Get-ChildItem "$dir\shop-maps" -File 2>$null | ForEach-Object { Write-Host "  $($_.Name)" }
    Write-Host "-- fishing:"
    Get-ChildItem "$dir\fishing" -File 2>$null | ForEach-Object { Write-Host "  $($_.Name)" }
    Write-Host "-- main-map:"
    if (Test-Path "$dir\$s-main-map.png") { Write-Host "  $s-main-map.png" }
    Get-ChildItem "$dir" -File 2>$null | ForEach-Object { Write-Host "  ROOT: $($_.Name)" }
}
