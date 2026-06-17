const fs = require('fs');
const path = require('path');

const dirs = [
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity IDE\\User\\History',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Antigravity\\User\\History',
    'C:\\Users\\Sajad\\AppData\\Roaming\\Code\\User\\History'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        console.log(`Dir does not exist: ${dir}`);
        return;
    }
    console.log(`Scanning: ${dir}`);
    try {
        const subdirs = fs.readdirSync(dir);
        let count = 0;
        for (const subdir of subdirs) {
            const subdirPath = path.join(dir, subdir);
            if (fs.statSync(subdirPath).isDirectory()) {
                const entriesPath = path.join(subdirPath, 'entries.json');
                if (fs.existsSync(entriesPath)) {
                    try {
                        const entries = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
                        count++;
                        if (count < 20) {
                            console.log(`  Resource: ${entries.resource}`);
                        }
                    } catch (e) {}
                }
            }
        }
        console.log(`Total subdirs with entries in ${dir}: ${count}`);
    } catch (e) {
        console.log(`Error: ${e.message}`);
    }
});
