# SaSLoop Hyper-Speed Deployment Script
$IP = "80.225.240.191"
$USER = "ubuntu"
$KEY = "./ssh-key-2026-04-19.key"
$REMOTE_DIR = "/home/ubuntu/SaSLoop"

Write-Host "--- INITIALIZING HYPER-SPEED DEPLOYMENT ---" -ForegroundColor Cyan

# 1. Build the Dashboard LOCALLY (Super Fast)
Write-Host "-> Building Dashboard locally..." -ForegroundColor Yellow
Push-Location backend/SaSLoop-dashboard
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; Pop-Location; exit }
Pop-Location

# 2. Compress the build for fast transfer
Write-Host "-> Compressing build files..." -ForegroundColor Gray
if (Test-Path "dashboard_build.zip") { Remove-Item "dashboard_build.zip" }
Compress-Archive -Path "backend/SaSLoop-dashboard/build/*" -DestinationPath "dashboard_build.zip"

# 3. Sync code to GitHub
Write-Host "-> Pushing code to GitHub..." -ForegroundColor Yellow
git add -A
git commit -m "Fast Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin main

# 4. Upload build to Oracle and Refresh
Write-Host "-> Uploading build to Oracle Cloud ($IP)..." -ForegroundColor Blue
$SSH_EXE = if (Get-Command ssh -ErrorAction SilentlyContinue) { "ssh" } else { "C:\Windows\System32\OpenSSH\ssh.exe" }
$SCP_EXE = if (Get-Command scp -ErrorAction SilentlyContinue) { "scp" } else { "C:\Windows\System32\OpenSSH\scp.exe" }

# Upload zip (Fixed Syntax)
$REMOTE_DEST = "$($USER)@$($IP):$($REMOTE_DIR)/dashboard_build.zip"
& $SCP_EXE -i $KEY -o StrictHostKeyChecking=no "dashboard_build.zip" $REMOTE_DEST

# Extract zip on server and restart
$REMOTE_CMD = "cd $REMOTE_DIR && git pull origin main && npm install && unzip -o dashboard_build.zip -d backend/SaSLoop-dashboard/build && rm dashboard_build.zip && pm2 restart ecosystem.config.js && pm2 save"

& $SSH_EXE -i $KEY -o StrictHostKeyChecking=no "$($USER)@$($IP)" $REMOTE_CMD

Write-Host "✅ DEPLOYMENT COMPLETE IN SECONDS! Visit: https://sasloop.in" -ForegroundColor Green
