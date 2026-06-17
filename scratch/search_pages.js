const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'SaSLoop-dashboard', 'src', 'pages');
const files = fs.readdirSync(pagesDir);

console.log(`Scanning ${files.length} files in pages/ for pattern...`);
const pattern = "Market Name";
const pattern2 = "Sales Report Filter";

files.forEach(file => {
  if (file.endsWith('.jsx') || file.endsWith('.js')) {
    const filePath = path.join(pagesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.toLowerCase().includes(pattern.toLowerCase()) || content.toLowerCase().includes(pattern2.toLowerCase())) {
      console.log(`Found match in: ${file}`);
    }
  }
});
