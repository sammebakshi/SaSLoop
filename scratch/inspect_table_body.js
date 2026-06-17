const fs = require('fs');
const content = fs.readFileSync('SaSLoop-dashboard/src/pages/OutletUserManager.jsx', 'utf8');

const lines = content.split('\n');
// Print lines from 500 to 650
for (let i = 500; i < Math.min(650, lines.length); i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
