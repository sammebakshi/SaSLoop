const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\sasloop-android';

function scan(dir) {
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
                if (file !== 'build' && file !== '.gradle' && file !== '.idea') {
                    scan(fullPath);
                }
            } else {
                const today = '2026-06-09';
                if (stats.mtime.toISOString().startsWith(today)) {
                    console.log(`Modified: ${fullPath} (${stats.size} bytes) - ${stats.mtime.toISOString()}`);
                }
            }
        }
    } catch (e) {}
}

scan(srcDir);
console.log('Done scanning source files.');
