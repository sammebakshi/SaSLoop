const fs = require('fs');
const file1 = fs.readFileSync('scratch/whatsappManager_backup.js', 'utf8').split('\n');
console.log(file1.slice(1100, 1150).join('\n'));
