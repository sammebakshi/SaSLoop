const fs = require('fs');
const path = require('path');

const dir = path.join(process.env.APPDATA, 'Code - Insiders', 'User', 'History');
console.log('Inspecting dir:', dir);

function scan(d) {
    if (!fs.existsSync(d)) return [];
    let results = [];
    const files = fs.readdirSync(d);
    files.forEach(f => {
        const p = path.join(d, f);
        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
            results = results.concat(scan(p));
        } else {
            results.push({ path: p, size: stat.size, mtime: stat.mtime });
        }
    });
    return results;
}

const allFiles = scan(dir);
console.log('Total history files found in Insiders:', allFiles.length);

// Sort by mtime descending
allFiles.sort((a, b) => b.mtime - a.mtime);

console.log('Top 20 most recently modified Insiders history files:');
allFiles.slice(0, 20).forEach(f => {
    console.log(`  Path: ${f.path}`);
    console.log(`    Size: ${f.size} bytes`);
    console.log(`    Modified: ${f.mtime}`);
});
