# SaSLoop Auto-Backup Script
# Runs silently via Task Scheduler every 5 minutes
# If there are any file changes, it commits and pushes to GitHub automatically

$projectDir = "c:\Users\Sajad\Desktop\SaSLoop"
$logFile = "$projectDir\backup.log"

Set-Location $projectDir

# Check if there are any changes
$status = git status --porcelain 2>&1
if ([string]::IsNullOrWhiteSpace($status)) {
    # No changes, skip
    exit 0
}

# There are changes — commit and push
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

git add -A 2>&1 | Out-Null
git commit -m "Auto-backup: $timestamp" 2>&1 | Out-Null
$pushResult = git push origin main 2>&1

# Log the result
$logEntry = "[$timestamp] Backup pushed — $($status.Split("`n").Count) file(s) changed"
Add-Content -Path $logFile -Value $logEntry
