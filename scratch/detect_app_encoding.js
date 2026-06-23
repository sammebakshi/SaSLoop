const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const buffer = fs.readFileSync(filePath);

console.log('File size:', buffer.length);
console.log('Contains null byte:', buffer.includes(0));
if (buffer.length >= 2) {
  console.log('First two bytes:', buffer[0].toString(16), buffer[1].toString(16));
  if (buffer[0] === 0xff && stroke === 0xfe) {
    console.log('Detected UTF-16LE BOM');
  } else if (buffer[0] === 0xfe && buffer[1] === 0xff) {
    console.log('Detected UTF-16BE BOM');
  } else if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    console.log('Detected UTF-8 BOM');
  } else {
    console.log('No BOM detected');
  }
}
