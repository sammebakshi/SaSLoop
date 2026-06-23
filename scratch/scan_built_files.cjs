const fs = require('fs');
const path = require('path');

const paths = [
  'c:/Users/Sajad/Desktop/SaSLoop/pos-app/dist',
  'c:/Users/Sajad/Desktop/SaSLoop/pos-app/release-v2/win-unpacked'
];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    let stats;
    try {
      stats = fs.statSync(fullPath);
    } catch (e) {
      continue;
    }
    
    if (stats.isDirectory()) {
      scanDir(fullPath);
    } else if (stats.isFile()) {
      if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('metallicSteel')) {
            console.log(`Found 'metallicSteel' in built file: ${fullPath}`);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }
}

paths.forEach(p => {
  console.log(`Scanning ${p}...`);
  scanDir(p);
});
console.log("Built scan complete.");
