
const fs = require('fs');
const path = 'c:/Users/Sajad/Desktop/SaSLoop/backend/SaSLoop-dashboard/src/pages/DigitalCatalog.jsx';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');
let fixed = false;
for(let i=0; i<lines.length; i++) {
    // Look for the specific pattern of the mess
    if (lines[i].includes('disabled={scanning}') && lines[i+1] && lines[i+1].trim() === '<input') {
        lines[i] = lines[i].replace('disabled={scanning}', 'disabled={scanning} />');
        lines.splice(i+1, 6); // Remove the redundant 6 lines of the second input
        fixed = true;
        break;
    }
}

if (fixed) {
    fs.writeFileSync(path, lines.join('\n'));
    console.log("SUCCESS: Fixed DigitalCatalog UI!");
} else {
    console.log("ERROR: Could not find the problematic section");
}
