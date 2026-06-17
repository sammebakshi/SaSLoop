const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'SaSLoop-dashboard', 'src');

function walkDir(dir, callback) {
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

const pattern = "Market Name";
const pattern2 = "Sales Report Filter";
const pattern3 = "Outlet Name";

walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasPattern = content.toLowerCase().includes(pattern.toLowerCase()) || 
                       content.toLowerCase().includes(pattern2.toLowerCase()) ||
                       content.toLowerCase().includes(pattern3.toLowerCase());
    if (hasPattern) {
      console.log(`Found match in: ${path.relative(srcDir, filePath)}`);
    }
  }
});
