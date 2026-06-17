const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\pos-app';

function findFiles(dir) {
    try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                if (file !== 'node_modules' && file !== '.git') {
                    findFiles(fullPath);
                }
            } else {
                if (fullPath.includes('dist') || fullPath.includes('build') || fullPath.includes('release') || file.endsWith('.exe')) {
                    console.log(`Found: ${fullPath} (${stat.size} bytes) - Modified: ${stat.mtime.toISOString()}`);
                }
            }
        }
    } catch (e) {}
}

console.log("Searching for build/dist/release files...");
findFiles(projectDir);
// Also search in SaSLoop root for any .exe
const rootFiles = fs.readdirSync('c:\\Users\\Sajad\\Desktop\\SaSLoop');
for (const file of rootFiles) {
    if (file.endsWith('.exe')) {
        const fullPath = path.join('c:\\Users\\Sajad\\Desktop\\SaSLoop', file);
        const stat = fs.statSync(fullPath);
        console.log(`Found in Root: ${fullPath} (${stat.size} bytes) - Modified: ${stat.mtime.toISOString()}`);
    }
}
console.log("Done");
