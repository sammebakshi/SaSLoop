# SaSLoop Hyper-Speed Backoffice-Only Deployment Script
$IP = "80.225.240.191"
$USER = "ubuntu"
$KEY = "./ssh-key-2026-04-19.key"
$REMOTE_DIR = "/home/ubuntu/SaSLoop"

Write-Host "--- INITIALIZING FAST BACKOFFICE DEPLOYMENT ---" -ForegroundColor Cyan

# 1. Compress ONLY the backend files (excludes android, dashboard, pos-app, rider-app)
$TIMESTAMP = Get-Date -Format "yyyyMMddHHmmss"
$SYNC_FILE = "backend_sync_$TIMESTAMP.tar.gz"
Write-Host "-> Compressing backoffice files ($SYNC_FILE)..." -ForegroundColor Gray

# Create tar archive of only backend files and folders
tar -czf $SYNC_FILE server.js db.js dbInit.js package.json package-lock.json ecosystem.config.js whatsappManager.js routes middleware utils google-key.json nodemon.json

# 2. Upload to Oracle Cloud
Write-Host "-> Uploading to Oracle Cloud ($IP)..." -ForegroundColor Blue
$SSH_EXE = if (Get-Command ssh -ErrorAction SilentlyContinue) { "ssh" } else { "C:\Windows\System32\OpenSSH\ssh.exe" }
$SCP_EXE = if (Get-Command scp -ErrorAction SilentlyContinue) { "scp" } else { "C:\Windows\System32\OpenSSH\scp.exe" }

& $SCP_EXE -i $KEY -o StrictHostKeyChecking=no "$SYNC_FILE" "$($USER)@$($IP):$($REMOTE_DIR)/$SYNC_FILE"
Remove-Item $SYNC_FILE -Force

# 3. Extract on Server and Restart Server process in PM2
Write-Host "-> Extracting and restarting backend server on OCI..." -ForegroundColor Yellow
$REMOTE_CMD = @"
cd $REMOTE_DIR
# Extract the sync archive over existing files
tar -xzf $SYNC_FILE
rm -f $SYNC_FILE

# Install node modules (production only)
npm install --production

# Restart PM2 server process
pm2 start ecosystem.config.js
pm2 save
"@

& $SSH_EXE -i $KEY -o StrictHostKeyChecking=no "$($USER)@$($IP)" $REMOTE_CMD

Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
