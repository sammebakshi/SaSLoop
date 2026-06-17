const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

function walkDir(dir, callback) {
  if (dir.includes('node_modules') || dir.includes('.git') || dir.includes('build') || dir.includes('dist')) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

const pattern = "Sales Report Filter";

walkDir(rootDir, (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.html')) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.toLowerCase().includes(pattern.toLowerCase())) {
        console.log(`Found match in: ${path.relative(rootDir, filePath)}`);
      }
    } catch (e) {}
  }
});
