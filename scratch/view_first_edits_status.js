const fs = require('fs');

const content = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\reconstruct_history_log.txt', 'utf8');
const cleanContent = content.replace(/\0/g, ''); // UTF-16
const lines = cleanContent.split('\n');

const editLines = lines.filter(l => l.includes('[Edit #') || l.includes('WARNING'));
console.log("First 35 edit lines in log:");
console.log(editLines.slice(0, 35).join('\n'));
