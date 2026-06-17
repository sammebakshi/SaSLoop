const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

function search(dir) {
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
                search(fullPath);
            } else if (file.toLowerCase().includes('billingscreen')) {
                console.log(`Found: ${fullPath} (${stats.size} bytes)`);
            }
        }
    } catch (e) {}
}

search(brainDir);
console.log('Done searching brain directory.');
