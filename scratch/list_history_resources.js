const fs = require('fs');
const path = require('path');

const historyDirs = [
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code\\User\\History',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity IDE\\User\\History'
];

historyDirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    const subdirs = fs.readdirSync(dir);
    subdirs.forEach(subdir => {
        const subdirPath = path.join(dir, subdir);
        const entriesPath = path.join(subdirPath, 'entries.json');
        if (fs.existsSync(entriesPath)) {
            try {
                const entries = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
                console.log(entries.resource);
            } catch (e) {}
        }
    });
});
