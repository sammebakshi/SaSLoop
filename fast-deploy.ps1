# SaSLoop Fast Deployment Script (PowerShell)
$IP = "80.225.240.191"
$USER = "ubuntu"
$KEY = "./ssh-key-2026-04-19.key"
$REMOTE_DIR = "/home/ubuntu/SaSLoop"

Write-Host "--- INITIALIZING HIGH-TECH DEPLOYMENT ---" -ForegroundColor Cyan

# 1. Force add all changes
Write-Host "-> Committing changes..." -ForegroundColor Gray
git add -A
git commit -m "Fast Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# 2. Push to Repository
Write-Host "-> Pushing to origin main..." -ForegroundColor Yellow
git push origin main

# 3. Find SSH path
$SSH_EXE = "ssh"
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    $SSH_EXE = "C:\Windows\System32\OpenSSH\ssh.exe"
}

# 4. Connect to Oracle and Build Dashboard
Write-Host "-> Connecting to Oracle Cloud ($IP)..." -ForegroundColor Blue
Write-Host "-> Rebuilding Dashboard (This may take a minute)..." -ForegroundColor Yellow

# We run pull, build dashboard, and restart PM2
$REMOTE_CMD = "cd $REMOTE_DIR && git pull origin main && npm install && cd SaSLoop-dashboard && npm install && npm run build && cd .. && pm2 restart ecosystem.config.js && pm2 save"

& $SSH_EXE -i $KEY -o StrictHostKeyChecking=no "$USER@$IP" $REMOTE_CMD

Write-Host "✅ ALL SYSTEMS GO! Visit: https://sasloop.in" -ForegroundColor Green
