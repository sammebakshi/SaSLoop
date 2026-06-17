const fs = require('fs');
const path = require('path');

const trackerDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\code_tracker\\history';

function scan(dir) {
    if (!fs.existsSync(dir)) {
        console.log("Tracker dir doesn't exist");
        return;
    }
    console.log(`Scanning tracker: ${dir}`);
    try {
        const files = fs.readdirSync(dir);
        console.log(`Found ${files.length} items in tracker directory.`);
        
        // Let's print details of the first 50 files
        let printCount = 0;
        for (const file of files) {
            const full = path.join(dir, file);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) {
                console.log(`Directory: ${file}`);
            } else {
                printCount++;
                if (printCount <= 50) {
                    console.log(`File: ${file} (${stat.size} bytes) - Modified: ${stat.mtime.toISOString()}`);
                }
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

scan(trackerDir);
