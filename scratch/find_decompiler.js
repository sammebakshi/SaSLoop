const fs = require('fs');
const path = require('path');

function findDecompiler(dir, depth = 0) {
    if (depth > 4) return [];
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
                if (file.startsWith('.') || file === 'AppData' || file === 'node_modules') continue;
                results = results.concat(findDecompiler(fullPath, depth + 1));
            } else {
                const lower = file.toLowerCase();
                if (lower.includes('jadx') || lower.includes('cfr') || lower.includes('dex2jar') || lower.includes('procyon')) {
                    results.push(fullPath);
                }
            }
        }
    } catch (e) {
        // ignore
    }
    return results;
}

const userHome = 'C:\\Users\\Sajad';
console.log('Searching in:', userHome);
console.log('Found decompilers:', findDecompiler(userHome));
