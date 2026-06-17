const fs = require('fs');
const path = require('path');

function scan(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            scan(fullPath);
        } else {
            if (file.includes('BillingScreen')) {
                console.log(`Found: ${fullPath} (${stats.size} bytes)`);
            }
        }
    }
}

scan('scratch/decompiled_dex/sources');
console.log('Done scanning decompiled_dex.');
