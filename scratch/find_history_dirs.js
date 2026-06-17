const fs = require('fs');
const path = require('path');

const appDataDir = 'C:\\Users\\Sajad\\AppData';

function findHistory(dir) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            let stat;
            try {
                stat = fs.statSync(fullPath);
            } catch (e) {
                continue;
            }
            if (stat.isDirectory()) {
                if (file.toLowerCase() === 'history' || file.toLowerCase() === 'backups') {
                    console.log(`Found: ${fullPath}`);
                } else {
                    // Do not recurse too deep to avoid performance issues, only recurse up to 4 levels
                    const depth = fullPath.split(path.sep).length - appDataDir.split(path.sep).length;
                    if (depth <= 4) {
                        findHistory(fullPath);
                    }
                }
            }
        }
    } catch (e) {}
}

console.log("Searching for History/Backups directories under AppData...");
findHistory(appDataDir);
console.log("Done searching.");
