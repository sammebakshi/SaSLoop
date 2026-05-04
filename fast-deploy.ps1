# SaSLoop Fast Deployment Script (PowerShell)
$IP = "80.225.240.191"
$USER = "ubuntu"
$KEY = "./ssh-key-2026-04-19.key"
$REMOTE_DIR = "/home/ubuntu/SaSLoop"

Write-Host "--- INITIALIZING HIGH-TECH DEPLOYMENT ---" -ForegroundColor Cyan

# 1. Force add all changes (including subfolders)
Write-Host "-> Committing changes..." -ForegroundColor Gray
git add -A
git commit -m "Fast Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# 2. Push to Repository
Write-Host "-> Pushing to origin main..." -ForegroundColor Yellow
git push origin main

# 3. Find SSH path
$SSH_EXE = "ssh"
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    $SYSTEM_SSH = "C:\Windows\System32\OpenSSH\ssh.exe"
    if (Test-Path $SYSTEM_SSH) {
        $SSH_EXE = $SYSTEM_SSH
    }
}

# 4. Connect to Oracle and Sync
Write-Host "-> Connecting to Oracle Cloud ($IP)..." -ForegroundColor Blue
if ($SSH_EXE) {
    & $SSH_EXE -i $KEY -o StrictHostKeyChecking=no "$USER@$IP" "cd $REMOTE_DIR && git pull origin main && npm install && pm2 restart ecosystem.config.js && pm2 save"
    Write-Host "DONE! Your new features are now LIVE on https://sasloop.in" -ForegroundColor Green
} else {
    Write-Host "ERROR: SSH is still not detected." -ForegroundColor Red
    Write-Host "Please restart VS Code or your computer." -ForegroundColor Red
}
