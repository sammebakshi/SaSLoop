const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'SaSLoop-dashboard', 'src', 'pages', 'Dashboard.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

function findPattern(pattern) {
  console.log(`\n=== Matches for: "${pattern}" ===`);
  const matches = [];
  lines.forEach((line, index) => {
    if (line.includes(pattern)) {
      matches.push({ lineNum: index + 1, content: line.trim() });
    }
  });
  matches.forEach(m => {
    console.log(`Line ${m.lineNum}: ${m.content}`);
  });
}

findPattern('tax_amount');
findPattern('tax_cgst');
findPattern('tax_sgst');
