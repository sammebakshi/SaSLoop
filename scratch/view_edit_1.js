const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\reconstruct_history_log.txt', 'utf8');
const cleanContent = content.replace(/\0/g, ''); // UTF-16
const lines = cleanContent.split('\n');

lines.forEach((line) => {
    if (line.includes('[Edit #1]') || line.includes('[Edit #1 ')) {
        console.log(line);
    }
});
