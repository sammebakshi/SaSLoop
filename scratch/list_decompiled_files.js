const fs = require('fs');
const path = require('path');

const dir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\decompiled_dex';

function listFiles(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    try {
        const files = fs.readdirSync(currentDir);
        for (const file of files) {
            const fullPath = path.join(currentDir, file);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                listFiles(fullPath);
            } else {
                console.log(`${fullPath.substring(dir.length)} (${stats.size} bytes)`);
            }
        }
    } catch (e) {}
}

listFiles(dir);
