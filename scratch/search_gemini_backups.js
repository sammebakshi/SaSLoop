const fs = require('fs');
const path = require('path');

function searchBackups(dir, depth = 0) {
    if (depth > 6) return [];
    let results = [];
    try {
        const list = fs.readdirSync(dir);
        for (const file of list) {
            const fullPath = path.join(dir, file);
            let stat;
            try {
                stat = fs.statSync(fullPath);
            } catch (e) {
                continue;
            }
            if (stat && stat.isDirectory()) {
                results = results.concat(searchBackups(fullPath, depth + 1));
            } else {
                if (file.toLowerCase().includes('billingscreen')) {
                    results.push(fullPath);
                }
            }
        }
    } catch (e) {
        // ignore
    }
    return results;
}

const geminiDir = 'C:\\Users\\Sajad\\.gemini';
console.log('Searching IDE backups in:', geminiDir);
console.log('Found:', searchBackups(geminiDir));
