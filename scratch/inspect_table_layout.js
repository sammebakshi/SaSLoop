const fs = require('fs');
const content = fs.readFileSync('SaSLoop-dashboard/src/pages/OutletUserManager.jsx', 'utf8');

const lines = content.split('\n');
for (let i = 319; i < Math.min(440, lines.length); i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
