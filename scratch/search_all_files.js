const fs = require('fs');
const path = require('path');

const searchDirs = [
    'C:\\Users\\Sajad\\Desktop',
    'C:\\Users\\Sajad\\Downloads',
    'C:\\Users\\Sajad\\Documents'
];

console.log("Searching for BillingScreen backups...");

function scan(dir) {
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
                // Skip node_modules, .git, etc.
                if (file !== 'node_modules' && file !== '.git' && file !== 'build' && file !== 'intermediates') {
                    scan(fullPath);
                }
            } else {
                if (file.toLowerCase().includes('billingscreen')) {
                    console.log(`Found: ${fullPath} (${stat.size} bytes) - Modified: ${stat.mtime.toISOString()}`);
                }
            }
        }
    } catch (e) {
        // ignore
    }
}

searchDirs.forEach(dir => {
    console.log(`Scanning: ${dir}`);
    scan(dir);
});

console.log("Scan finished.");
