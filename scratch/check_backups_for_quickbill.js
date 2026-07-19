const fs = require('fs');
const path = require('path');

const dirPath = __dirname;
const files = fs.readdirSync(dirPath);

files.forEach(filename => {
  if (filename.startsWith('App') && filename.endsWith('.jsx')) {
    const filePath = path.join(dirPath, filename);
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('quickBillPrint')) {
        console.log(`✅ Found "quickBillPrint" in scratch/${filename}! Size: ${content.length}`);
      } else {
        // Try reading with utf16le just in case
        const content16 = fs.readFileSync(filePath, 'utf16le');
        if (content16.includes('quickBillPrint')) {
          console.log(`✅ Found "quickBillPrint" in scratch/${filename} (UTF16)! Size: ${content16.length}`);
        }
      }
    } catch (err) {
      console.log(`Error reading ${filename}: ${err.message}`);
    }
  }
});
