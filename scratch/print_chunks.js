const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/all_app_edits.json', 'utf8'));

const edit = data[29];
console.log('Structure of edit 29:');
console.log(JSON.stringify(edit, null, 2).slice(0, 1000));
