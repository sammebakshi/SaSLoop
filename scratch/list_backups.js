const fs = require('fs');
const path = require('path');

const backupsDirs = [
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code\\Backups',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code - Insiders\\Backups',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity IDE\\Backups',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity\\Backups'
];

function listBackups(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    console.log(`Listing backups in: ${dir}`);
    try {
        const subdirs = fs.readdirSync(dir);
        for (const subdir of subdirs) {
            const subdirPath = path.join(dir, subdir);
            const stats = fs.statSync(subdirPath);
            if (stats.isDirectory()) {
                const files = fs.readdirSync(subdirPath);
                for (const file of files) {
                    const filePath = path.join(subdirPath, file);
                    const fileStats = fs.statSync(filePath);
                    console.log(`  File: ${filePath} (${fileStats.size} bytes) - Mod: ${fileStats.mtime.toISOString()}`);
                }
            } else {
                console.log(`  Root File: ${subdirPath} (${stats.size} bytes)`);
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

backupsDirs.forEach(listBackups);
console.log("Done");
