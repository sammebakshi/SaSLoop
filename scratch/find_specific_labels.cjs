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
  } else {
    content = buffer.toString('utf8');
  }
  
  if (content.includes('11.3') || content.includes('-191') || content.includes('L5')) {
    console.log(`Found in: ${file}`);
    let idx = content.indexOf('11.3');
    if (idx === -1) idx = content.indexOf('-191');
    if (idx === -1) idx = content.indexOf('L5');
    console.log(content.slice(Math.max(0, idx - 200), Math.min(content.length, idx + 1000)));
    console.log('----------------------------------------------------');
  }
});
