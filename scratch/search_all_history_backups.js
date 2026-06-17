const fs = require('fs');
const path = require('path');

const historyDirs = [
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code\\User\\History',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code - Insiders\\User\\History',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity IDE\\User\\History',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity\\User\\History'
];

const backupsDirs = [
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code\\Backups',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code - Insiders\\Backups',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity IDE\\Backups',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity\\Backups'
];

function searchHistory(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    console.log(`Scanning history: ${dir}`);
    try {
        const subdirs = fs.readdirSync(dir);
        for (const subdir of subdirs) {
            const subdirPath = path.join(dir, subdir);
            let stats;
            try {
                stats = fs.statSync(subdirPath);
            } catch (e) {
                continue;
            }
            if (stats.isDirectory()) {
                const entriesPath = path.join(subdirPath, 'entries.json');
                if (fs.existsSync(entriesPath)) {
                    try {
                        const entries = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
                        if (entries.resource && (entries.resource.includes('App.jsx') || entries.resource.includes('App.js')) && entries.resource.includes('pos-app')) {
                            console.log(`\nFound history entries for App.jsx in: ${subdirPath}`);
                            console.log(`Original resource path: ${entries.resource}`);
                            const files = fs.readdirSync(subdirPath);
                            for (const file of files) {
                                if (file !== 'entries.json') {
                                    const filePath = path.join(subdirPath, file);
                                    const fileStats = fs.statSync(filePath);
                                    console.log(`  File: ${filePath} (${fileStats.size} bytes) - Modified: ${fileStats.mtime.toISOString()}`);
                                }
                            }
                        }
                    } catch (e) {
                        // ignore
                    }
                }
            }
        }
    } catch (e) {
        console.error(`Error scanning history ${dir}:`, e.message);
    }
}

function searchBackups(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    console.log(`Scanning backups: ${dir}`);
    try {
        const subdirs = fs.readdirSync(dir);
        for (const subdir of subdirs) {
            const subdirPath = path.join(dir, subdir);
            let stats;
            try {
                stats = fs.statSync(subdirPath);
            } catch (e) {
                continue;
            }
            if (stats.isDirectory()) {
                const files = fs.readdirSync(subdirPath);
                for (const file of files) {
                    const filePath = path.join(subdirPath, file);
                    const fileStats = fs.statSync(filePath);
                    if (!fileStats.isDirectory()) {
                        try {
                            const content = fs.readFileSync(filePath, 'utf8');
                            if (content.includes('BillingScreen') || content.includes('sasloopmanager') || content.includes('appliedAdditionalCharges') || content.includes('SAVED')) {
                                console.log(`\nFound Backup File: ${filePath} (${fileStats.size} bytes) - Modified: ${fileStats.mtime.toISOString()}`);
                                console.log("Snippet:", content.slice(0, 300).replace(/\n/g, ' '));
                            }
                        } catch (e) {}
                    }
                }
            }
        }
    } catch (e) {
        console.error(`Error scanning backups ${dir}:`, e.message);
    }
}

console.log("=== SEARCHING IDE HISTORIES ===");
for (const dir of historyDirs) {
    searchHistory(dir);
}

console.log("\n=== SEARCHING IDE BACKUPS ===");
for (const dir of backupsDirs) {
    searchBackups(dir);
}
console.log("\nDone scanning history and backups.");
