const fs = require('fs');
const path = require('path');

const activeDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\SaSLoop-dashboard';
const backupDir = 'D:\\18 may 6pm\\SaSLoop\\SaSLoop-dashboard';

function getFiles(dir, relativeTo) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'build' && file !== 'dist') {
                results = results.concat(getFiles(filePath, relativeTo));
            }
        } else {
            results.push(path.relative(relativeTo, filePath));
        }
    });
    return results;
}

const activeFiles = new Set(getFiles(activeDir, activeDir));
const backupFiles = new Set(getFiles(backupDir, backupDir));

console.log('=== FILES ONLY IN ACTIVE ===');
activeFiles.forEach(f => {
    if (!backupFiles.has(f)) {
        console.log(f);
    }
});

console.log('\n=== FILES ONLY IN BACKUP ===');
backupFiles.forEach(f => {
    if (!activeFiles.has(f)) {
        console.log(f);
    }
});

console.log('\n=== DIFFERING FILES ===');
activeFiles.forEach(f => {
    if (backupFiles.has(f)) {
        const activePath = path.join(activeDir, f);
        const backupPath = path.join(backupDir, f);
        const activeStat = fs.statSync(activePath);
        const backupStat = fs.statSync(backupPath);
        if (activeStat.size !== backupStat.size) {
            console.log(`${f} (Active size: ${activeStat.size}, Backup size: ${backupStat.size})`);
        }
    }
});
