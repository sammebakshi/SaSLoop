const fs = require('fs');
const path = require('path');

const baseDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide';

function findHistory(dir) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                if (file.toLowerCase().includes('history') || file.toLowerCase().includes('backup')) {
                    console.log(`Found: ${fullPath}`);
                } else {
                    const depth = fullPath.split(path.sep).length - baseDir.split(path.sep).length;
                    if (depth <= 4) {
                        findHistory(fullPath);
                    }
                }
            }
        }
    } catch (e) {}
}

console.log("Searching in Antigravity appData directory...");
findHistory(baseDir);
console.log("Done");
