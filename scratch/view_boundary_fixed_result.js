const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\boundary_check_fixed.txt', 'utf8');
const lines = content.split('\n');
console.log("Lines in boundary check:", lines.length);
console.log("Last 25 lines:");
console.log(lines.slice(-25).join('\n'));
