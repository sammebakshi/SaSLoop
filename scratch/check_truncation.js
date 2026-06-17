const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch');
files.forEach(f => {
  if (f.endsWith('.jsx')) {
    const filePath = path.join('scratch', f);
    const content = fs.readFileSync(filePath, 'utf8');
    const count = (content.match(/<truncated/g) || []).length;
    console.log(`File: ${f} contains ${count} truncation markers`);
  }
});
