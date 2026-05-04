# SaSLoop Fast Deployment Script (PowerShell)
$IP = "80.225.240.191"
$USER = "ubuntu"
$KEY = "./ssh-key-2026-04-19.key"
$REMOTE_DIR = "/home/ubuntu/SaSLoop"

Write-Host "--- INITIALIZING HIGH-TECH DEPLOYMENT ---" -ForegroundColor Cyan

# 1. Commit local changes
Write-Host "-> Committing changes..." -ForegroundColor Gray
git add .
git commit -m "Fast Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# 2. Push to Repository
Write-Host "-> Pushing to origin main..." -ForegroundColor Yellow
git push origin main

# 3. Connect to Oracle and Sync
Write-Host "-> Connecting to Oracle Cloud ($IP)..." -ForegroundColor Blue
# We check if ssh exists before running
if (Get-Command ssh -ErrorAction SilentlyContinue) {
    ssh -i $KEY "$USER@$IP" "cd $REMOTE_DIR && git pull origin main && npm install && pm2 restart ecosystem.config.js && pm2 save"
    Write-Host "DONE! Your new features are now LIVE on https://sasloop.in" -ForegroundColor Green
} else {
    Write-Host "ERROR: SSH is not installed on this Windows machine." -ForegroundColor Red
    Write-Host "Please run this as Admin to fix it: Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0" -ForegroundColor Red
}
