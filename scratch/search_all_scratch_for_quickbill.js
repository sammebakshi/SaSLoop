const fs = require('fs');
const path = require('path');

const dirPath = __dirname;
const files = fs.readdirSync(dirPath);

files.forEach(filename => {
  const filePath = path.join(dirPath, filename);
  try {
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.toLowerCase().includes('quickbillprint')) {
        console.log(`✅ Found in ${filename}!`);
      } else {
        const content16 = fs.readFileSync(filePath, 'utf16le');
        if (content16.toLowerCase().includes('quickbillprint')) {
          console.log(`✅ Found in ${filename} (UTF16)!`);
        }
      }
    }
  } catch (err) {}
});
