const fs = require('fs');
const content = fs.readFileSync('routes/brandRoutes.js', 'utf8');

// Find user route
const lines = content.split('\n');
let found = [];
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('router.get(\'/users\'') || lines[i].includes('router.get("/users"') || lines[i].includes('SELECT ') && lines[i].includes('users')) {
        found.push(i);
    }
}

console.log("Found indices:", found);
for (let idx of found) {
    console.log(`\n--- Line ${idx+1} ---`);
    for (let j = Math.max(0, idx - 5); j <= Math.min(lines.length - 1, idx + 40); j++) {
        console.log(`${j+1}: ${lines[j]}`);
    }
}
