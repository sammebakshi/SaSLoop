const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\boundary_check_fixed.txt', 'utf8');
const cleanContent = content.replace(/\0/g, ''); // UTF-16
const lines = cleanContent.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('Step 818')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
