const fs = require('fs');
const path = require('path');

const historyDir = 'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity\\User\\History';

if (fs.existsSync(historyDir)) {
    const subdirs = fs.readdirSync(historyDir);
    console.log(`Found ${subdirs.length} subdirectories in History.`);
    let matchCount = 0;
    for (const subdir of subdirs) {
        const subdirPath = path.join(historyDir, subdir);
        const entriesPath = path.join(subdirPath, 'entries.json');
        if (fs.existsSync(entriesPath)) {
            try {
                const entries = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
                const res = entries.resource || '';
                if (res.toLowerCase().includes('billing') || res.toLowerCase().includes('screen') || res.toLowerCase().includes('sasloop')) {
                    console.log(`Match: ${res} in ${subdir}`);
                    matchCount++;
                }
            } catch (e) {}
        }
    }
    console.log(`Found ${matchCount} matches.`);
} else {
    console.log("History directory does not exist.");
}
