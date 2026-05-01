
const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/backend/SaSLoop-dashboard/src/pages/DigitalCatalog.jsx', 'utf8');

const lines = content.split('\n');
let stack = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tags = line.match(/<\/?([a-zA-Z0-9]+)/g) || [];
    
    for (const fullTag of tags) {
        const name = fullTag.replace(/<\/?/, '');
        
        // Ignore CamelCase (Components)
        if (/^[A-Z]/.test(name)) continue;
        
        // Ignore self-closing HTML
        if (name === 'input' || name === 'img' || name === 'br' || name === 'hr' || name === 'link' || name === 'meta') continue;

        if (fullTag.startsWith('</')) {
            const last = stack.pop();
            if (last && last.name !== name) {
                console.log(`Mismatch at line ${i+1}: expected </${last.name}> but found </${name}>`);
            }
        } else {
            // Check for self-closing in JSX
            if (!line.includes('/>', line.indexOf(fullTag))) {
                stack.push({name, line: i+1});
            }
        }
    }
}

console.log("Final Stack:", stack);
