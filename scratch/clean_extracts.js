const fs = require('fs');
const content = fs.readFileSync('scratch/bundle_extracts.txt', 'utf16le');
console.log(content.substring(0, 10000));
