const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/SalesReport.jsx', 'utf8');

let count = 0;
let pos = content.indexOf('`');
while (pos !== -1) {
    count++;
    const line = content.substring(0, pos).split('\n').length;
    console.log(`Backtick #${count} found at line ${line}`);
    pos = content.indexOf('`', pos + 1);
}
