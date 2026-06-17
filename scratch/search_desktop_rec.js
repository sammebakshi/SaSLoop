const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\Sajad\\Desktop';

function search(dir) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            let stats;
            try {
                stats = fs.statSync(fullPath);
            } catch (e) {
                continue;
            }
            if (stats.isDirectory()) {
                if (file !== 'node_modules' && file !== '.git' && file !== 'build' && file !== '.gradle' && file !== 'AppData') {
                    search(fullPath);
                }
            } else if (file.toLowerCase().includes('billingscreen')) {
                console.log(`Found: ${fullPath} (${stats.size} bytes) - Modified: ${stats.mtime.toISOString()}`);
            }
        }
    } catch (e) {}
}

search(rootDir);
console.log('Finished recursive search of Desktop.');
