const fs = require('fs');
const path = require('path');

const paths = [
    'c:\\Users\\Sajad\\Desktop\\SaSLoop',
    'C:\\Users\\Sajad\\Desktop\\18 may 6pm\\SaSLoop',
    'D:\\18 may 6pm\\SaSLoop'
];

function searchDir(dir) {
    if (!fs.existsSync(dir)) return;
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
                    searchDir(fullPath);
                }
            } else if (file === 'BillingScreen.kt') {
                console.log(`Found: ${fullPath}`);
                console.log(`Size: ${stats.size} bytes`);
                console.log(`Modified: ${stats.mtime.toISOString()}`);
                console.log('---');
            }
        }
    } catch (e) {
        // ignore
    }
}

for (const p of paths) {
    console.log(`Searching in ${p}...`);
    searchDir(p);
}
console.log('Done searching.');
