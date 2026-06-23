const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';

function searchInFiles(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'pos-app' && file !== 'rider-app') {
        searchInFiles(fullPath);
      }
    } else if (file.endsWith('.js') || file.endsWith('.sql')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes('loyalty') || content.toLowerCase().includes('points')) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes('loyalty') || line.toLowerCase().includes('points') || line.toLowerCase().includes('redeem')) {
            if (line.includes('min_') || line.includes('max_') || line.includes('threshold') || line.includes('ratio')) {
              console.log(`${file}:${index + 1}: ${line.trim()}`);
            }
          }
        });
      }
    }
  });
}

searchInFiles(rootDir);
