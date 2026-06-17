const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('scratch');
files.forEach(f => {
  if (f.endsWith('.jsx')) {
    const filePath = path.join('scratch', f);
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.toLowerCase().includes('getcoupons')) {
      console.log(`File: ${f} matches getCoupons`);
      // Find matching lines and print them
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.toLowerCase().includes('getcoupons')) {
          console.log(`  ${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
});
