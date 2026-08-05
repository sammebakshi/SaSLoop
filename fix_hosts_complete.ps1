$hostsPath = "C:\Windows\System32\drivers\etc\hosts"
$content = Get-Content $hostsPath -ErrorAction SilentlyContinue
$entries = @(
    "80.225.240.191 backend.sasloop.in",
    "80.225.240.191 menu.sasloop.in",
    "80.225.240.191 sasloop.in",
    "80.225.240.191 www.sasloop.in"
)

foreach ($entry in $entries) {
    if ($content -notcontains $entry) {
        Add-Content -Path $hostsPath -Value "`n$entry"
    }
}
ipconfig /flushdns
Write-Host "HOSTS UPDATED SUCCESSFULLY"
