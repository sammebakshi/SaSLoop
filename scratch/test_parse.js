const fs = require('fs');
const e = JSON.parse(fs.readFileSync('scratch/all_app_edits.json', 'utf8'));
console.log('Keys in edit object:', Object.keys(e[0]));
console.log('Sample edit:', JSON.stringify(e[0], null, 2));
