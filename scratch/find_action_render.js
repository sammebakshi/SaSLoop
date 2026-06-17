const fs = require('fs');
const content = fs.readFileSync('SaSLoop-dashboard/src/pages/OutletUserManager.jsx', 'utf8');

// Find action column code
const lines = content.split('\n');
let found = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Manage User Details') || lines[i].includes('Manage Your Store Access Level') || lines[i].includes('Manage SaSloop POS Access Level') || lines[i].includes('Manage SaSloop MPOS Access Level')) {
        found.push(i);
    }
}

console.log("Found line indices:", found);
if (found.length > 0) {
    const start = Math.max(0, found[0] - 20);
    const end = Math.min(lines.length - 1, found[found.length - 1] + 20);
    for (let j = start; j <= end; j++) {
        console.log(`${j + 1}: ${lines[j]}`);
    }
} else {
    // If not found, let's look for "key" or "monitor"
    console.log("Not found by label. Let's look for action cell rendering.");
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('key') || lines[i].includes('monitor') || lines[i].includes('pencil')) {
            if (lines[i].includes('<button') || lines[i].includes('onClick')) {
                console.log(`${i+1}: ${lines[i]}`);
            }
        }
    }
}
