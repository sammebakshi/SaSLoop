const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('.gemini') || dir.includes('build') || dir.includes('dist')) {
    return;
  }
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.html') || file.endsWith('.ts') || file.endsWith('.tsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        if (line.includes('[-]') || line.includes('[+]') || line.includes('[ - ]') || line.includes('[ + ]') || line.includes('[ - ]') || line.includes('[ + ]')) {
          console.log(`${fullPath}:${index + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

searchDir('C:/Users/Sajad/Desktop/SaSLoop');
