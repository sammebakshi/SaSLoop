const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\reconstruct_history_log.txt', 'utf8');
const lines = content.split('\n');
console.log("Lines:", lines.length);
console.log("Last 30 lines:");
console.log(lines.slice(-30).join('\n'));
