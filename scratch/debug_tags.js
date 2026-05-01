
const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/backend/SaSLoop-dashboard/src/pages/DigitalCatalog.jsx', 'utf8');

let tags = [];
const regex = /<\/?([a-zA-Z0-9]+)|{/g;
let match;

let openBraces = 0;

const lines = content.split('\n');
lines.forEach((line, i) => {
    let m;
    const tagRegex = /<\/?([a-zA-Z0-9]+)/g;
    while ((m = tagRegex.exec(line)) !== null) {
        const tagName = m[1];
        if (m[0].startsWith('</')) {
            const last = tags.pop();
            if (last && last.name !== tagName) {
                console.log(`Mismatch at line ${i+1}: expected </${last.name}> but found </${tagName}>`);
            }
        } else {
            // Check for self-closing
            if (!line.includes('/>', m.index)) {
                // Not a perfect check but for standard JSX tags it might work
                 tags.push({name: tagName, line: i+1});
            }
        }
    }
});

console.log("Remaining open tags:", tags);
