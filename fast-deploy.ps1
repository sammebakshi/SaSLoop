# SaSLoop Hyper-Speed Deployment Script (v9 - Total Sync)
$IP = "80.225.240.191"
$USER = "ubuntu"
$KEY = "./ssh-key-2026-04-19.key"
$REMOTE_DIR = "/home/ubuntu/SaSLoop"

Write-Host "--- INITIALIZING TOTAL SYNC DEPLOYMENT ---" -ForegroundColor Cyan

# 1. Build the Dashboard LOCALLY
Write-Host "-> Building Dashboard locally..." -ForegroundColor Yellow
Push-Location SaSLoop-dashboard
$env:GENERATE_SOURCEMAP = "false"
npm run build
if (-not (Test-Path "build/index.html")) { 
    Write-Host "CRITICAL ERROR: Local build failed!" -ForegroundColor Red
    Pop-Location; exit 
}
Pop-Location

# 2. Compress the ENTIRE project folder (Excluding node_modules)
$TIMESTAMP = Get-Date -Format "yyyyMMddHHmmss"
$SYNC_FILE = "project_sync_$TIMESTAMP.tar.gz"
Write-Host "-> Compressing project for sync ($SYNC_FILE)..." -ForegroundColor Gray
# We use tar to grab everything except the heavy node_modules and native/app directories
tar -czf $SYNC_FILE --exclude="node_modules" --exclude="SaSLoop-dashboard/node_modules" --exclude=".git" --exclude="*.tar.gz" --exclude="*.apk" --exclude="*.exe" --exclude="pos-app" --exclude="rider-app" --exclude="sasloop-android" --exclude="sasloop-mobile" --exclude="backups" --exclude=".wwebjs_auth" --exclude=".wwebjs_cache" --exclude="uploads" --exclude="dist" .

# 3. Sync code to GitHub (DISABLED TEMPORARILY FOR SPEED)
# Write-Host "-> Pushing to GitHub (Skipped for speed)..." -ForegroundColor Yellow
# git add -A
# git reset $SYNC_FILE
# git commit -m "Fast Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
# git push origin main

# 4. Upload and Refresh
Write-Host "-> Uploading to Oracle Cloud ($IP)..." -ForegroundColor Blue
$SSH_EXE = if (Get-Command ssh -ErrorAction SilentlyContinue) { "ssh" } else { "C:\Windows\System32\OpenSSH\ssh.exe" }
$SCP_EXE = if (Get-Command scp -ErrorAction SilentlyContinue) { "scp" } else { "C:\Windows\System32\OpenSSH\scp.exe" }

& $SCP_EXE -i $KEY -o StrictHostKeyChecking=no "$SYNC_FILE" "$($USER)@$($IP):$($REMOTE_DIR)/$SYNC_FILE"
Remove-Item $SYNC_FILE -Force

# 5. EXTRACT AND FORCE RESTART
$REMOTE_CMD = @"
cd $REMOTE_DIR
git pull origin main
# Extract the entire project we just sent
rm -f .env
tar -xzf $SYNC_FILE
rm -f $SYNC_FILE

npm install
cd SaSLoop-dashboard
npm install --production
cd ..

# NUCLEAR RESTART
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
"@

$REMOTE_CMD_LF = $REMOTE_CMD -replace "`r`n", "`n"
& $SSH_EXE -i $KEY -o StrictHostKeyChecking=no "$($USER)@$($IP)" $REMOTE_CMD_LF

Write-Host "✅ TOTAL RECOVERY COMPLETE! Visit: https://backend.sasloop.in" -ForegroundColor Green
