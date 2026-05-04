# SaSLoop Hyper-Speed Deployment Script (v7 - Deep Scan)
$IP = "80.225.240.191"
$USER = "ubuntu"
$KEY = "./ssh-key-2026-04-19.key"
$REMOTE_DIR = "/home/ubuntu/SaSLoop"

Write-Host "--- INITIALIZING DEEP SCAN DEPLOYMENT ---" -ForegroundColor Cyan

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

# 5. DEEP SCAN AND RESTART
$REMOTE_CMD = @"
cd $REMOTE_DIR
git pull origin main
npm install

# Fix permissions and recreate build folder
rm -rf backend/SaSLoop-dashboard/build
mkdir -p backend/SaSLoop-dashboard/build
tar -xzf dashboard_build.tar.gz -C backend/SaSLoop-dashboard/build
rm -f dashboard_build.tar.gz

# --- DEEP SCAN: Verify file existence ---
echo "--- SCANNING SERVER FOR FILES ---"
ls -la backend/SaSLoop-dashboard/build/index.html || echo "❌ index.html NOT FOUND!"
pwd

# NUCLEAR RESTART
pm2 delete all
pm2 start ecosystem.config.js --cwd $REMOTE_DIR/backend
pm2 save
pm2 logs server --lines 10 --no-daemon & sleep 5 ; kill $!
"@

& $SSH_EXE -i $KEY -o StrictHostKeyChecking=no "$($USER)@$($IP)" $REMOTE_CMD

Write-Host "✅ DEPLOYMENT FINISHED. CHECK THE SCAN ABOVE!" -ForegroundColor Green
