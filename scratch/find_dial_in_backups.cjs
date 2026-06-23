const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/Sajad/Desktop/SaSLoop/scratch';
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (!file.startsWith('App_') || !file.endsWith('.jsx')) return;
  const filePath = path.join(dir, file);
  
  let buffer = fs.readFileSync(filePath);
  let content = '';
  
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
    content = buffer.toString('utf16le');
  } else {
    content = buffer.toString('utf8');
  }
  
  if (content.includes('metallicSteel') || content.includes('dial-knob') || content.includes('dial-spin-sequence')) {
    console.log(`FOUND in backup file: ${file}`);
    let idx = content.indexOf('metallicSteel');
    if (idx === -1) idx = content.indexOf('dial-knob');
    console.log(content.slice(Math.max(0, idx - 200), Math.min(content.length, idx + 1000)));
    console.log('----------------------------------------------------');
  }
});
