# SaSLoop Hyper-Speed Deployment Script (v2 - Tar Version)
$IP = "80.225.240.191"
$USER = "ubuntu"
$KEY = "./ssh-key-2026-04-19.key"
$REMOTE_DIR = "/home/ubuntu/SaSLoop"

Write-Host "--- INITIALIZING HYPER-SPEED DEPLOYMENT ---" -ForegroundColor Cyan

# 1. Build the Dashboard LOCALLY
Write-Host "-> Building Dashboard locally..." -ForegroundColor Yellow
Push-Location backend/SaSLoop-dashboard
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; Pop-Location; exit }
Pop-Location

# 2. Compress using TAR (Works on Windows & Linux)
Write-Host "-> Compressing build files..." -ForegroundColor Gray
if (Test-Path "dashboard_build.tar.gz") { Remove-Item "dashboard_build.tar.gz" }
# Use tar to compress the build folder
tar -czf dashboard_build.tar.gz -C backend/SaSLoop-dashboard/build .

# 3. Sync code to GitHub
Write-Host "-> Pushing code to GitHub..." -ForegroundColor Yellow
git add -A
git commit -m "Fast Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin main

# 4. Upload and Refresh
Write-Host "-> Uploading to Oracle Cloud ($IP)..." -ForegroundColor Blue
$SSH_EXE = if (Get-Command ssh -ErrorAction SilentlyContinue) { "ssh" } else { "C:\Windows\System32\OpenSSH\ssh.exe" }
$SCP_EXE = if (Get-Command scp -ErrorAction SilentlyContinue) { "scp" } else { "C:\Windows\System32\OpenSSH\scp.exe" }

# Upload tar.gz
$REMOTE_DEST = "$($USER)@$($IP):$($REMOTE_DIR)/dashboard_build.tar.gz"
& $SCP_EXE -i $KEY -o StrictHostKeyChecking=no "dashboard_build.tar.gz" $REMOTE_DEST

# Extract using tar on server
$REMOTE_CMD = "cd $REMOTE_DIR && git pull origin main && npm install && mkdir -p backend/SaSLoop-dashboard/build && tar -xzf dashboard_build.tar.gz -C backend/SaSLoop-dashboard/build && rm dashboard_build.tar.gz && pm2 restart ecosystem.config.js && pm2 save"

& $SSH_EXE -i $KEY -o StrictHostKeyChecking=no "$($USER)@$($IP)" $REMOTE_CMD

Write-Host "✅ ALL SYSTEMS GO! Visit: https://sasloop.in" -ForegroundColor Green
