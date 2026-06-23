const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Sajad/Desktop/SaSLoop/scratch';
const files = fs.readdirSync(dir);

files.forEach(file => {
  const filePath = path.join(dir, file);
  const stats = fs.statSync(filePath);
  if (!stats.isFile()) return;
  
  let buffer = fs.readFileSync(filePath);
  let content = '';
  
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    content = buffer.toString('utf16le');
  } else if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
    content = buffer.toString('utf16be');
  } else {
    // Check if it's UTF-16 without BOM
    let hasZeros = false;
    for (let i = 1; i < Math.min(buffer.length, 100); i += 2) {
      if (buffer[i] === 0) hasZeros = true;
    }
    if (hasZeros) {
      content = buffer.toString('utf16le');
    } else {
      content = buffer.toString('utf8');
    }
  }
  
  if (content.includes('metallicSteel') && !file.includes('inspect') && !file.includes('clean_dial') && !file.includes('find_dial')) {
    console.log(`Found 'metallicSteel' in ${file}`);
    // find index and print 500 chars around it
    let idx = content.indexOf('metallicSteel');
    console.log(content.slice(Math.max(0, idx - 200), Math.min(content.length, idx + 1000)));
    console.log('----------------------------------------------------');
  }
});
