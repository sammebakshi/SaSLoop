const fs = require('fs');
const path = require('path');

const dirs = [
    path.join(process.env.APPDATA, 'Antigravity'),
    path.join(process.env.APPDATA, 'Antigravity IDE'),
    path.join(process.env.APPDATA, 'Antigravity-IDE'),
    path.join(process.env.USERPROFILE, '.gemini'),
];

console.log('Searching for files containing isRiderModalOpen in AppData dirs...');

function search(d) {
    if (!fs.existsSync(d)) return;
    try {
        const files = fs.readdirSync(d);
        files.forEach(f => {
            const p = path.join(d, f);
            const stat = fs.statSync(p);
            if (stat.isDirectory()) {
                if (f !== 'node_modules' && f !== 'dist' && f !== '.git' && f !== 'conversations') {
                    search(p);
                }
            } else {
                if (stat.size > 500000 && stat.size < 2000000) {
                    try {
                        const content = fs.readFileSync(p, 'utf8');
                        if (content.includes('isRiderModalOpen')) {
                            console.log('FOUND MATCH IN APPDATA:', p, 'Size:', stat.size, 'Modified:', stat.mtime);
                        }
                    } catch (e) {}
                }
            }
        });
    } catch(err) {}
}

dirs.forEach(d => {
    console.log('Scanning:', d);
    search(d);
});
console.log('Search finished.');
