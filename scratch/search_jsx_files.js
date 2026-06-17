const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';

function findAppFiles(dir) {
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
                if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'release' && file !== 'build') {
                    findAppFiles(fullPath);
                }
            } else {
                if (file.toLowerCase().startsWith('app') && (file.toLowerCase().endsWith('.jsx') || file.toLowerCase().endsWith('.js') || file.toLowerCase().endsWith('.bak') || file.toLowerCase().endsWith('.tmp'))) {
                    console.log(`Found: ${fullPath} (${stat.size} bytes) - Modified: ${stat.mtime.toISOString()}`);
                }
            }
        }
    } catch (e) {}
}

console.log("Searching for files starting with 'app' in workspace...");
findAppFiles(rootDir);
console.log("Done searching.");
