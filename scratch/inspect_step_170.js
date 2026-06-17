const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'step_170_replacement.kt');
const content = fs.readFileSync(filePath, 'utf8');
console.log('Total content length:', content.length);
console.log('First 1000 characters:');
console.log(content.slice(0, 1000));
console.log('\nLast 1000 characters:');
console.log(content.slice(-1000));
