const fs = require('fs');
const path = require('path');

const rootDir = 'C:\\Users\\Sajad\\Desktop\\SaSLoop';
console.log('Searching for isRiderModalOpen in:', rootDir);

function search(d) {
    const files = fs.readdirSync(d);
    files.forEach(f => {
        const p = path.join(d, f);
        const stat = fs.statSync(p);
        if (stat.isDirectory()) {
            if (f !== 'node_modules' && f !== 'dist' && f !== '.git' && f !== 'release-v2') {
                search(p);
            }
        } else {
            const ext = path.extname(f);
            if (['.jsx', '.js', '.tmp', '.bak', '.txt'].includes(ext)) {
                try {
                    const content = fs.readFileSync(p, 'utf8');
                    if (content.includes('isRiderModalOpen')) {
                        console.log('FOUND MATCH:', p, 'Size:', stat.size, 'Modified:', stat.mtime);
                    }
                } catch (e) {}
            }
        }
    });
}

search(rootDir);
console.log('Search finished.');
