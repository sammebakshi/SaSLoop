Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "`n80.225.240.191 backend.sasloop.in"
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "80.225.240.191 menu.sasloop.in"
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "80.225.240.191 sasloop.in"
Add-Content -Path "C:\Windows\System32\drivers\etc\hosts" -Value "80.225.240.191 www.sasloop.in"
ipconfig /flushdns
Write-Host "DONE - hosts file updated"
