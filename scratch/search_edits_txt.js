const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\yesterday_edits.txt', 'utf8');
const cleanContent = content.replace(/\0/g, ''); // in case of UTF-16
const lines = cleanContent.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('pos_initialized')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
