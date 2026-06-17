const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const scratchDir = path.join(projectDir, 'scratch');

function search() {
  const files = fs.readdirSync(scratchDir);
  console.log("Searching for 'checkPosAccess' in scratch files...");
  
  for (const file of files) {
    const filePath = path.join(scratchDir, file);
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) continue;
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('checkPosAccess')) {
        console.log(`- FOUND in UTF-8 file: ${file} (${stat.size} bytes, modified: ${stat.mtime})`);
        continue;
      }
      
      // Try UTF-16LE just in case
      content = fs.readFileSync(filePath, 'utf16le');
      if (content.includes('checkPosAccess')) {
        console.log(`- FOUND in UTF-16LE file: ${file} (${stat.size} bytes, modified: ${stat.mtime})`);
      }
    } catch (e) {}
  }
}

search();
