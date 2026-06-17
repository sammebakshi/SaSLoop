const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appJsxPath, 'utf8');
const lines = content.split('\n');

const outletBlockLines = lines.slice(16885, 17166);
outletBlockLines.forEach((line, idx) => {
    const absoluteLine = 16886 + idx;
    if (line.includes('syncedTax')) {
        console.log(`${absoluteLine}: ${line.trim()}`);
    }
});
