const fs = require('fs');
const path = require('path');

const pathsToSearch = [
    'c:\\Users\\Sajad\\Desktop',
    'd:\\18 may 6pm',
    'C:\\Users\\Sajad\\Desktop\\18 may 6pm',
    'c:\\Users\\Sajad\\Desktop\\SaSLoop\\backups',
    'c:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain'
];

function searchFile(dir, fileName) {
    if (!fs.existsSync(dir)) return;
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
            if (stat.isDirectory()) {
                // Avoid node_modules, .git, etc.
                if (file !== 'node_modules' && file !== '.git' && file !== '.gradle' && file !== 'build') {
                    searchFile(fullPath, fileName);
                }
            } else if (file === fileName) {
                console.log(`Found match: ${fullPath} (Size: ${stat.size} bytes, Modified: ${stat.mtime.toISOString()}`);
            }
        }
    } catch (e) {
        // ignore
    }
}

pathsToSearch.forEach(dir => {
    console.log(`Searching in: ${dir}`);
    searchFile(dir, 'BillingScreen.kt');
});
console.log('Search finished.');
