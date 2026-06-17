const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/SalesReport.jsx', 'utf8');

// Find the tag starting at line 2103
const lines = content.split('\n');
console.log("Line 2103-2109:");
for (let i = 2102; i < 2109; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}

const pos = content.indexOf('<input', content.indexOf('SearchCustomer') - 1000); // just find the tag
console.log("Index of input around there:", pos);
// Let's print tagContent for it
let i = content.indexOf('<input \r\n', 50000);
if (i === -1) i = content.indexOf('<input\n', 50000);
if (i === -1) i = content.indexOf('<input', 50000);

console.log("Found at position:", i);
let tagContent = '';
let start = i;
i++;
while (i < content.length) {
    const char = content[i];
    if (char === '>') break;
    tagContent += char;
    i++;
}
console.log("tagContent raw length:", tagContent.length);
console.log("tagContent ends with /:", tagContent.trim().endsWith('/'));
console.log("tagContent last 10 chars:", JSON.stringify(tagContent.substring(tagContent.length - 10)));
