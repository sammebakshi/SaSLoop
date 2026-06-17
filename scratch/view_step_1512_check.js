const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\boundary_check.txt', 'utf8');
const cleanContent = content.replace(/\0/g, ''); // in case of UTF-16
const lines = cleanContent.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('Step 1512')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
