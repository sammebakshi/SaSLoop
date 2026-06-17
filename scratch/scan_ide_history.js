const fs = require('fs');
const path = require('path');

const historyDirs = [
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code\\User\\History',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity IDE\\User\\History',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code - Insiders\\User\\History'
];

console.log("Scanning IDE history with case-insensitive search...");

historyDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        console.log(`Dir does not exist: ${dir}`);
        return;
    }
    const subdirs = fs.readdirSync(dir);
    console.log(`Found ${subdirs.length} entries in ${dir}`);
    
    subdirs.forEach(subdir => {
        const subdirPath = path.join(dir, subdir);
        const entriesPath = path.join(subdirPath, 'entries.json');
        if (fs.existsSync(entriesPath)) {
            try {
                const entries = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
                if (entries.resource && entries.resource.toLowerCase().includes('billing')) {
                    console.log(`Found resource match: ${entries.resource} in subdir ${subdirPath}`);
                    const files = fs.readdirSync(subdirPath);
                    files.forEach(f => {
                        if (f !== 'entries.json') {
                            const fp = path.join(subdirPath, f);
                            const stat = fs.statSync(fp);
                            console.log(`  File: ${f} (${stat.size} bytes), Modified: ${stat.mtime.toISOString()}`);
                        }
                    });
                }
            } catch (e) {
                // ignore
            }
        }
    });
});

console.log("Done scanning.");
