const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\Sajad\\Desktop\\SaSLoop';
console.log("Searching for BillingScreenKt class files...");

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
                // Do not skip build or .gradle folders here, as we are looking for class files
                if (file !== 'node_modules' && file !== '.git') {
                    scan(fullPath);
                }
            } else {
                if (file.includes('BillingScreenKt') && file.endsWith('.class')) {
                    console.log(`Found Class: ${fullPath} (${stat.size} bytes) - Modified: ${stat.mtime.toISOString()}`);
                }
            }
        }
    } catch (e) {
        // ignore
    }
}

scan(rootDir);
console.log("Class scan finished.");
