const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dial_from_git_b4f48d8.jsx');
const text = fs.readFileSync(filePath, 'utf8');

console.log(`Length: ${text.length}`);
console.log('=== PART 1 ===');
console.log(text.substring(0, 2000));
console.log('=== PART 2 ===');
console.log(text.substring(2000, 4000));
console.log('=== PART 3 ===');
console.log(text.substring(4000, 6000));
console.log('=== PART 4 ===');
console.log(text.substring(6000));
