# SaSLoop Hyper-Speed Deployment Script (v9 - Total Sync)
$IP = "80.225.240.191"
$USER = "ubuntu"
$KEY = "./ssh-key-2026-04-19.key"
$REMOTE_DIR = "/home/ubuntu/SaSLoop"

Write-Host "--- INITIALIZING TOTAL SYNC DEPLOYMENT ---" -ForegroundColor Cyan

# 1. Build the Dashboard LOCALLY
Write-Host "-> Building Dashboard locally..." -ForegroundColor Yellow
Push-Location backend/SaSLoop-dashboard
npm run build
if (-not (Test-Path "build/index.html")) { 
    Write-Host "CRITICAL ERROR: Local build failed!" -ForegroundColor Red
    Pop-Location; exit 
}
Pop-Location

# 2. Compress the ENTIRE backend folder (Excluding node_modules)
Write-Host "-> Compressing backend for sync..." -ForegroundColor Gray
if (Test-Path "backend_sync.tar.gz") { Remove-Item "backend_sync.tar.gz" }
# We use tar to grab everything except the heavy node_modules folders
tar -czf backend_sync.tar.gz --exclude="node_modules" --exclude=".git" backend

# 3. Sync code to GitHub (For backup)
Write-Host "-> Pushing to GitHub..." -ForegroundColor Yellow
git add -A
git reset backend_sync.tar.gz
git commit -m "Fast Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git push origin main

# 4. Upload and Refresh
Write-Host "-> Uploading to Oracle Cloud ($IP)..." -ForegroundColor Blue
$SSH_EXE = if (Get-Command ssh -ErrorAction SilentlyContinue) { "ssh" } else { "C:\Windows\System32\OpenSSH\ssh.exe" }
$SCP_EXE = if (Get-Command scp -ErrorAction SilentlyContinue) { "scp" } else { "C:\Windows\System32\OpenSSH\scp.exe" }

& $SCP_EXE -i $KEY -o StrictHostKeyChecking=no "backend_sync.tar.gz" "$($USER)@$($IP):$($REMOTE_DIR)/backend_sync.tar.gz"

# 5. EXTRACT AND FORCE RESTART
$REMOTE_CMD = @"
cd $REMOTE_DIR
git pull origin main
# Extract the entire backend we just sent
tar -xzf backend_sync.tar.gz
rm -f backend_sync.tar.gz

cd backend
npm install
cd SaSLoop-dashboard
npm install --production
cd ..

# NUCLEAR RESTART
pm2 delete all
pm2 start ../ecosystem.config.js
pm2 save
"@

& $SSH_EXE -i $KEY -o StrictHostKeyChecking=no "$($USER)@$($IP)" $REMOTE_CMD

Write-Host "✅ TOTAL RECOVERY COMPLETE! Visit: https://sasloop.in" -ForegroundColor Green
