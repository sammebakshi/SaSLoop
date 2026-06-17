$pagesDir = 'c:\Users\Sajad\Desktop\SaSLoop\SaSLoop-dashboard\src\pages'
$files = Get-ChildItem $pagesDir -Filter '*Report.jsx'
$count = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Pattern: hidden div with Operating Hub / Target Operating Hub / Outlet Hub
    # Handles both space-y-1.5 and space-y-1 variants
    $patterns = @(
        '(?s)\s*<div className="space-y-1\.5 hidden">\s*<label[^>]*>(?:Target )?Operating Hub</label>\s*<select[^>]*>.*?</select>\s*</div>'
        '(?s)\s*<div className="space-y-1 hidden">\s*<label[^>]*>(?:Target )?Operating Hub</label>\s*<select[^>]*>.*?</select>\s*</div>'
        '(?s)\s*<div className="space-y-1\.5 hidden">\s*<label[^>]*>Outlet Hub</label>\s*<select[^>]*>.*?</select>\s*</div>'
        '(?s)\s*<div className="space-y-1 hidden">\s*<label[^>]*>Outlet Hub</label>\s*<select[^>]*>.*?</select>\s*</div>'
    )
    
    foreach ($pattern in $patterns) {
        $content = [regex]::Replace($content, $pattern, "`n")
    }
    
    if ($content -ne $original) {
        Set-Content $file.FullName -Value $content -NoNewline
        $count++
        Write-Host "Cleaned: $($file.Name)"
    }
}
Write-Host "Total files cleaned: $count"
