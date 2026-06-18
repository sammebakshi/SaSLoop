# SaSLoop Shadow Git Auto-Backup Script
# Runs silently via Task Scheduler every 5 minutes
# Detects changed files in the project directory, copies them to a shadow backup directory,
# and commits them to a local backup-only Git repository.

$projectDir = "c:\Users\Sajad\Desktop\SaSLoop"
$backupDir = "C:\Users\Sajad\Desktop\SaSLoop_Backups"
$logFile = "$projectDir\backup.log"

Set-Location $projectDir

# Disable quoting of non-ASCII characters to keep paths clean
git config core.quotePath false 2>&1 | Out-Null

# Check if there are any changes (modified, added, deleted, renamed)
$status = git status --porcelain 2>&1
if ([string]::IsNullOrWhiteSpace($status)) {
    # No changes, skip
    exit 0
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Ensure backup directory exists
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

# Ensure backup directory is initialized as a Git repo
if (-not (Test-Path "$backupDir\.git")) {
    Set-Location $backupDir
    git init 2>&1 | Out-Null
    # Configure git in the backup repo to prevent global settings warnings
    git config user.name "SaSLoop Backup" 2>&1 | Out-Null
    git config user.email "backup@sasloop.in" 2>&1 | Out-Null
    Set-Location $projectDir
}

# Track statistics
$copiedCount = 0
$deletedCount = 0

# Parse git status output
# Output format is: XY path or XY "path" or XY oldpath -> newpath
# We use regex to match the status and file path
$statusLines = $status -split "`n"
foreach ($line in $statusLines) {
    $line = $line.Replace("`r", "")
    if ([string]::IsNullOrWhiteSpace($line)) { continue }

    # Regex to extract the 2-character status code and the path
    if ($line -match '^([MADRC\? ]{2})\s+(.+)$') {
        $statusCode = $Matches[1].Trim()
        $pathPart = $Matches[2].Trim()

        # Handle renamed files (e.g. "oldpath -> newpath")
        if ($pathPart -like "* -> *") {
            $parts = $pathPart -split " -> "
            $oldRelPath = $parts[0].Trim('"')
            $newRelPath = $parts[1].Trim('"')

            # Delete old file in backup
            $oldBackupFile = Join-Path $backupDir $oldRelPath
            if (Test-Path $oldBackupFile) {
                Remove-Item -Path $oldBackupFile -Force | Out-Null
                $deletedCount++
            }

            # Copy new file to backup
            $sourceFile = Join-Path $projectDir $newRelPath
            $targetFile = Join-Path $backupDir $newRelPath
            if (Test-Path $sourceFile) {
                $targetParent = Split-Path $targetFile -Parent
                if (-not (Test-Path $targetParent)) {
                    New-Item -ItemType Directory -Path $targetParent -Force | Out-Null
                }
                Copy-Item -Path $sourceFile -Destination $targetFile -Force | Out-Null
                $copiedCount++
            }
        }
        else {
            $relPath = $pathPart.Trim('"')
            $sourceFile = Join-Path $projectDir $relPath
            $targetFile = Join-Path $backupDir $relPath

            # If the file is deleted
            if ($statusCode -eq "D") {
                if (Test-Path $targetFile) {
                    Remove-Item -Path $targetFile -Force | Out-Null
                    $deletedCount++
                }
            }
            # If the file is modified, added, untracked, etc.
            else {
                if (Test-Path $sourceFile) {
                    $targetParent = Split-Path $targetFile -Parent
                    if (-not (Test-Path $targetParent)) {
                        New-Item -ItemType Directory -Path $targetParent -Force | Out-Null
                    }
                    Copy-Item -Path $sourceFile -Destination $targetFile -Force | Out-Null
                    $copiedCount++
                }
            }
        }
    }
}

# Commit the changes in the backup repository
Set-Location $backupDir
git add -A 2>&1 | Out-Null

# Commit only if there are changes staged in the backup repo
$backupStatus = git status --porcelain 2>&1
if (-not [string]::IsNullOrWhiteSpace($backupStatus)) {
    git commit -m "Auto-backup: $timestamp ($copiedCount copied, $deletedCount deleted)" 2>&1 | Out-Null
    
    # Log the result
    $logEntry = "[$timestamp] Backup success - $copiedCount file(s) copied, $deletedCount file(s) deleted"
    Add-Content -Path $logFile -Value $logEntry
} else {
    $logEntry = "[$timestamp] Backup skipped - Backup directory already up-to-date"
    Add-Content -Path $logFile -Value $logEntry
}

# Go back to project directory
Set-Location $projectDir
