const fs = require('fs');
const brandRoutes = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\routes\\brandRoutes.js', 'utf8');

const lines = brandRoutes.split('\n');
for (let idx = 1890; idx < 2200; idx++) {
    console.log(`${idx + 1}: ${lines[idx]}`);
}
