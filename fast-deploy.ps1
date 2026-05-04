# SaSLoop Hyper-Speed Deployment Script (v5 - Auto-Repair)
$IP = "80.225.240.191"
$USER = "ubuntu"
$KEY = "./ssh-key-2026-04-19.key"
$REMOTE_DIR = "/home/ubuntu/SaSLoop"

Write-Host "--- INITIALIZING AUTO-REPAIR DEPLOYMENT ---" -ForegroundColor Cyan

# 1. Build the Dashboard LOCALLY
Write-Host "-> Building Dashboard locally..." -ForegroundColor Yellow
Push-Location backend/SaSLoop-dashboard
npm run build
if (-not (Test-Path "build/index.html")) { 
    Write-Host "CRITICAL ERROR: Local build failed! index.html not found." -ForegroundColor Red
    Pop-Location; exit 
}
Pop-Location

# 2. Compress using TAR
Write-Host "-> Compressing build files..." -ForegroundColor Gray
if (Test-Path "dashboard_build.tar.gz") { Remove-Item "dashboard_build.tar.gz" }
# Ensure we are in the root when zipping
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

# Upload tar.gz
$REMOTE_DEST = "$($USER)@$($IP):$($REMOTE_DIR)/dashboard_build.tar.gz"
& $SCP_EXE -i $KEY -o StrictHostKeyChecking=no "dashboard_build.tar.gz" $REMOTE_DEST

# Extract using tar on server with FORCE path cleanup
$REMOTE_CMD = @"
cd $REMOTE_DIR
git pull origin main
npm install
# Deep clean the build folder
rm -rf backend/SaSLoop-dashboard/build
mkdir -p backend/SaSLoop-dashboard/build
# Extract directly into the build folder
tar -xzf dashboard_build.tar.gz -C backend/SaSLoop-dashboard/build
rm -f dashboard_build.tar.gz
# Restart server
pm2 restart ecosystem.config.js
pm2 save
"@

& $SSH_EXE -i $KEY -o StrictHostKeyChecking=no "$($USER)@$($IP)" $REMOTE_CMD

Write-Host "✅ REPAIR COMPLETE! Visit: https://sasloop.in" -ForegroundColor Green
