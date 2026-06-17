const fs = require('fs');
const path = require('path');

function searchDex(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    try {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                results = results.concat(searchDex(fullPath));
            } else {
                if (file.toLowerCase().includes('subtab') && file.endsWith('.dex')) {
                    results.push({
                        path: fullPath,
                        size: stat.size,
                        mtime: stat.mtime
                    });
                }
            }
        });
    } catch (e) {
        // ignore
    }
    return results;
}

const buildDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\sasloop-android\\app\\build';
console.log('Searching in build folder:', buildDir);
const found = searchDex(buildDir);
console.log(`Found ${found.length} dex files:`);
found.forEach(f => {
    console.log(`- ${f.path} (${f.size} bytes, modified ${f.mtime})`);
});
