
const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/backend/SaSLoop-dashboard/src/pages/DigitalCatalog.jsx', 'utf8');

const lines = content.split('\n');
let stack = [];
let insideForm = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const tags = line.match(/<\/?([a-zA-Z0-9]+)/g) || [];
    
    for (const fullTag of tags) {
        const name = fullTag.replace(/<\/?/, '');
        if (name === 'input' || name === 'img' || name === 'br' || name === 'X' || name === 'Upload' || name === 'CheckCircle2' || name === 'AlertCircle' || name === 'Plus' || name === 'Activity' || name === 'Search' || name === 'Settings' || name === 'Trash2' || name === 'Edit' || name === 'Eye' || name === 'ArrowUpRight' || name === 'CreditCard' || name === 'ShoppingBag' || name === 'TrendingUp' || name === 'Megaphone' || name === 'Package' || name === 'BellRing' || name === 'Check' || name === 'Brain' || name === 'Mic') {
            // Assume these are self-closing or components
            continue;
        }
        
        if (fullTag.startsWith('</')) {
            const last = stack.pop();
            if (last && last.name !== name) {
                console.log(`Mismatch at line ${i+1}: expected </${last.name}> but found </${name}>`);
            }
        } else {
            stack.push({name, line: i+1});
        }
    }
}

console.log("Final Stack:", stack);
