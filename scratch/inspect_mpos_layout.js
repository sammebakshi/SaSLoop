const fs = require('fs');
const content = fs.readFileSync('SaSLoop-dashboard/src/pages/MPOSAccessManager.jsx', 'utf8');

const lines = content.split('\n');
for (let i = 98; i < Math.min(235, lines.length); i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
