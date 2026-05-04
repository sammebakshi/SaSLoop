# SaSLoop Hyper-Speed Deployment Script (v8 - Submodule Fix)
$IP = "80.225.240.191"
$USER = "ubuntu"
$KEY = "./ssh-key-2026-04-19.key"
$REMOTE_DIR = "/home/ubuntu/SaSLoop"

Write-Host "--- INITIALIZING SUBMODULE-AWARE DEPLOYMENT ---" -ForegroundColor Cyan

# 1. Build the Dashboard LOCALLY
Write-Host "-> Building Dashboard locally..." -ForegroundColor Yellow
Push-Location backend/SaSLoop-dashboard
npm run build
if (-not (Test-Path "build/index.html")) { 
    Write-Host "CRITICAL ERROR: Local build failed!" -ForegroundColor Red
    Pop-Location; exit 
}
Pop-Location

# 2. Compress using TAR
Write-Host "-> Compressing build files..." -ForegroundColor Gray
if (Test-Path "dashboard_build.tar.gz") { Remove-Item "dashboard_build.tar.gz" }
tar -czf dashboard_build.tar.gz -C backend/SaSLoop-dashboard/build .

# 3. Sync code to GitHub
Write-Host "-> Pushing code to GitHub..." -ForegroundColor Yellow
git add -A
git reset dashboard_build.tar.gz
git commit -m "Fast Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin main

# 4. Upload and Refresh
Write-Host "-> Uploading to Oracle Cloud ($IP)..." -ForegroundColor Blue
$SSH_EXE = if (Get-Command ssh -ErrorAction SilentlyContinue) { "ssh" } else { "C:\Windows\System32\OpenSSH\ssh.exe" }
$SCP_EXE = if (Get-Command scp -ErrorAction SilentlyContinue) { "scp" } else { "C:\Windows\System32\OpenSSH\scp.exe" }

& $SCP_EXE -i $KEY -o StrictHostKeyChecking=no "dashboard_build.tar.gz" "$($USER)@$($IP):$($REMOTE_DIR)/dashboard_build.tar.gz"

# 5. SUBMODULE INIT AND RESTART
$REMOTE_CMD = @"
cd $REMOTE_DIR
git pull origin main
# CRITICAL: Initialize submodules (The Missing Step!)
git submodule update --init --recursive

cd backend
npm install

# Restore the dashboard build we uploaded
rm -rf SaSLoop-dashboard/build
mkdir -p SaSLoop-dashboard/build
tar -xzf ../dashboard_build.tar.gz -C SaSLoop-dashboard/build
rm -f ../dashboard_build.tar.gz

# NUCLEAR RESTART
pm2 delete all
pm2 start ../ecosystem.config.js
pm2 save
"@

& $SSH_EXE -i $KEY -o StrictHostKeyChecking=no "$($USER)@$($IP)" $REMOTE_CMD

Write-Host "✅ SUBMODULES SYNCED! Visit: https://sasloop.in" -ForegroundColor Green
