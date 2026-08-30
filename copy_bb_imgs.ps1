$src = 'C:\Users\skyle\OneDrive\Pictures\adrentuary-website\games\toon-town\corporate-clash-personal-tracker\Streets Page\Barnacle Boatyard'
$pub = 'c:\Users\skyle\OneDrive\Desktop\Website\public\icons\streets\Barnacle-Boatyard'

$streets = @(
  @{ folder='Anchor Avenue';       dest='Anchor-Avenue' },
  @{ folder='Buccaneer Boulevard'; dest='Buccaneer-Boulevard' },
  @{ folder='Lighthouse Lane';     dest='Lighthouse-Lane' },
  @{ folder='Seaweed Street';      dest='Seaweed-Street' }
)

foreach ($s in $streets) {
    $d = "$pub\$($s.dest)"
    New-Item -ItemType Directory -Path $d -Force | Out-Null
    # main map
    $srcDir = "$src\$($s.folder)"
    Get-ChildItem "$srcDir" -File | ForEach-Object { Copy-Item $_.FullName "$d\$($_.Name)" -Force }
    # subdirs
    foreach ($sub in @('shops','shop-owners','shop-maps','fishing')) {
        $subSrc = "$srcDir\$sub"
        if (Test-Path $subSrc) {
            $subDst = "$d\$sub"
            New-Item -ItemType Directory -Path $subDst -Force | Out-Null
            Get-ChildItem $subSrc -File | ForEach-Object { Copy-Item $_.FullName "$subDst\$($_.Name)" -Force }
        }
    }
    Write-Host "Copied $($s.folder) -> $($s.dest)"
}
Write-Host "Done."
