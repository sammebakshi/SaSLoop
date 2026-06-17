const fs = require('fs');
const content = fs.readFileSync('SaSLoop-dashboard/src/pages/OutletUserManager.jsx', 'utf8');

const lines = content.split('\n');
let foundFilter = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Filter') || lines[i].includes('Users List') || lines[i].includes('Add User')) {
        foundFilter = i;
        break;
    }
}

console.log("Found layout around line:", foundFilter + 1);
if (foundFilter !== -1) {
    for (let j = Math.max(0, foundFilter - 10); j <= Math.min(lines.length - 1, foundFilter + 100); j++) {
        console.log(`${j+1}: ${lines[j]}`);
    }
}
