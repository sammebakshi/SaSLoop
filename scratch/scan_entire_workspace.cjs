const fs = require('fs');
const path = require('path');

const rootDir = 'c:/Users/Sajad/Desktop/SaSLoop';

function scanDir(dir) {
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
      if (file === 'node_modules' || file === '.git' || file === 'release-v2' || file === 'dist' || file === 'build') continue;
      scanDir(fullPath);
    } else if (stats.isFile()) {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.txt') || file.endsWith('.html') || file.endsWith('.diff')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('metallicSteel') && !fullPath.includes('scratch')) {
            console.log(`Found 'metallicSteel' in active file: ${fullPath}`);
          }
        } catch (e) {
          // ignore encoding or read errors
        }
      }
    }
  }
}

console.log("Scanning workspace...");
scanDir(rootDir);
console.log("Scan complete.");
