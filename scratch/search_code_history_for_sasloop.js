const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\Sajad\\AppData\\Roaming\\Code\\User\\History';

if (fs.existsSync(dir)) {
    const subdirs = fs.readdirSync(dir);
    for (const subdir of subdirs) {
        const subdirPath = path.join(dir, subdir);
        if (fs.statSync(subdirPath).isDirectory()) {
            const entriesPath = path.join(subdirPath, 'entries.json');
            if (fs.existsSync(entriesPath)) {
                try {
                    const entries = JSON.parse(fs.readFileSync(entriesPath, 'utf8'));
                    if (entries.resource && (entries.resource.includes('SaSLoop') || entries.resource.includes('App.jsx') || entries.resource.includes('App.js'))) {
                        console.log(`Found resource: ${entries.resource} in ${subdirPath}`);
                        const files = fs.readdirSync(subdirPath);
                        for (const file of files) {
                            if (file !== 'entries.json') {
                                const filePath = path.join(subdirPath, file);
                                const stat = fs.statSync(filePath);
                                console.log(`  File: ${file} (${stat.size} bytes) - Modified: ${stat.mtime.toISOString()}`);
                            }
                        }
                    }
                } catch (e) {}
            }
        }
    }
}
console.log("Done");
