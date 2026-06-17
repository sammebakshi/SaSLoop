const fs = require('fs');

const content = fs.readFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\boundary_check_fixed.txt', 'utf8');
const cleanContent = content.replace(/\0/g, ''); // in case of UTF-16
const lines = cleanContent.split('\n');

let firstFalseEdit = null;
let lastTrueEditBeforeFalse = null;

lines.forEach((line) => {
    if (line.includes('[Edit #')) {
        const match = line.match(/\[Edit #(\d+)\] Step (\d+)/);
        if (match) {
            const num = parseInt(match[1]);
            const isApplied = line.includes('Applied: true');
            const noChunks = line.includes('No chunks found');
            
            if (!isApplied && !noChunks) {
                if (!firstFalseEdit) {
                    firstFalseEdit = line;
                }
            } else if (isApplied && !noChunks) {
                lastTrueEditBeforeFalse = line;
            }
        }
    }
});

console.log("First False Edit:", firstFalseEdit);
console.log("Last True Edit (with chunks):", lastTrueEditBeforeFalse);
