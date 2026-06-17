const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('dist') && !file.includes('.git') && !file.includes('release-v2')) {
                results = results.concat(walk(file));
            }
        } else {
            results.push(file);
        }
    });
    return results;
};

const posAppFiles = walk(path.join(__dirname, '..', 'pos-app'));
console.log("Searching for QR printing and generation logic:");
posAppFiles.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.cjs')) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('printUpiQr') || content.includes('printUpi') || content.includes('activeStaticUpiId') || content.includes('googleReview')) {
            console.log(`Matched in file: ${file}`);
        }
    }
});
