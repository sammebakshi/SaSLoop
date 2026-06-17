const fs = require('fs');
const path = require('path');

const dirs = [
    'C:\\Users\\Sajad\\Downloads',
    'C:\\Users\\Sajad\\Documents'
];

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
                if (file !== 'node_modules' && file !== '.git' && file !== 'build' && file !== '.gradle') {
                    search(fullPath);
                }
            } else if (file.toLowerCase().includes('billingscreen')) {
                console.log(`Found: ${fullPath} (${stats.size} bytes) - Modified: ${stats.mtime.toISOString()}`);
            }
        }
    } catch (e) {}
}

for (const d of dirs) {
    console.log(`Scanning ${d}...`);
    search(d);
}
console.log('Finished scanning downloads/documents.');
