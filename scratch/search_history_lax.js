const fs = require('fs');
const path = require('path');

const historyDirs = [
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code\\User\\History',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code - Insiders\\User\\History',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity IDE\\User\\History',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity\\User\\History'
];

function searchHistory(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    console.log(`Scanning: ${dir}`);
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
                        if (entries.resource && entries.resource.toLowerCase().includes('app.jsx')) {
                            console.log(`Found: ${entries.resource} in ${subdirPath}`);
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
        console.error(e.message);
    }
}

for (const dir of historyDirs) {
    searchHistory(dir);
}
console.log("Done");
