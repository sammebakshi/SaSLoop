const fs = require('fs');

const content = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\reconstruct_history_log.txt', 'utf8');
const cleanContent = content.replace(/\0/g, ''); // UTF-16
const lines = cleanContent.split('\n');

console.log("First 35 lines of reconstruction log:");
console.log(lines.slice(0, 35).join('\n'));
