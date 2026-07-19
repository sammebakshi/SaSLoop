const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const buffer = fs.readFileSync(filePath);

// Check encoding
let content = '';
if (buffer[0] === 0xff && buffer[1] === 0xfe) {
  content = buffer.toString('utf16le');
  console.log('Detected UTF-16LE');
} else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
  content = buffer.toString('utf16be');
  console.log('Detected UTF-16BE');
} else {
  content = buffer.toString('utf8');
  console.log('Detected UTF-8 (or other)');
}

console.log('File size:', content.length, 'characters');

const term = 'handleChangeTable';
const index = content.indexOf(term);
console.log(`Index of '${term}':`, index);

if (index !== -1) {
  console.log('Surrounding text:', content.substring(index - 100, index + 300));
}

const term2 = 'prompt';
let lastIdx = -1;
while ((lastIdx = content.indexOf(term2, lastIdx + 1)) !== -1) {
  console.log(`Found '${term2}' at index ${lastIdx}:`, content.substring(lastIdx - 50, lastIdx + 150));
}
