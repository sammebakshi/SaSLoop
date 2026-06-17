const fs = require('fs');
const path = require('path');

const userDirs = [
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity IDE',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code - Insiders'
];

console.log("Searching for IDE Backups...");

function scanBackups(baseDir) {
    const backupsDir = path.join(baseDir, 'Backups');
    if (!fs.existsSync(backupsDir)) return;
    
    console.log(`Scanning backups folder: ${backupsDir}`);
    try {
        const subdirs = fs.readdirSync(backupsDir);
        for (const subdir of subdirs) {
            const subdirPath = path.join(backupsDir, subdir);
            const stats = fs.statSync(subdirPath);
            if (stats.isDirectory()) {
                const files = fs.readdirSync(subdirPath);
                for (const file of files) {
                    const filePath = path.join(subdirPath, file);
                    const fileStats = fs.statSync(filePath);
                    if (!fileStats.isDirectory()) {
                        try {
                            const content = fs.readFileSync(filePath, 'utf8');
                            if (content.includes('BillingScreen') || content.includes('sasloopmanager')) {
                                console.log(`Found Backup File: ${filePath} (${fileStats.size} bytes) - Modified: ${fileStats.mtime.toISOString()}`);
                                // Print first 100 characters of path/context
                                console.log("Snippet:", content.slice(0, 200).replace(/\n/g, ' '));
                            }
                        } catch (e) {}
                    }
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

userDirs.forEach(dir => {
    scanBackups(dir);
});

console.log("Scan finished.");
