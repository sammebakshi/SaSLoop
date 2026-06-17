const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\yesterday_edits.txt', 'utf8');
const lines = content.split('\n');
console.log("Total lines in edits file:", lines.length);
console.log("Last 20 lines:");
console.log(lines.slice(-20).join('\n'));
