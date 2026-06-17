const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\boundary_check_fixed.txt', 'utf8');
const cleanContent = content.replace(/\0/g, ''); // in case of UTF-16
const lines = cleanContent.split('\n');

lines.forEach((line, idx) => {
    if (line.includes('Edit #860')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
        // print next 5 lines
        for (let i = 1; i <= 5; i++) {
            if (lines[idx + i]) {
                console.log(`  +${i}: ${lines[idx + i].trim()}`);
            }
        }
    }
});
