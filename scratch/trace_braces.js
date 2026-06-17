const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'SaSLoop-dashboard', 'src', 'pages', 'POSAccessManager.jsx');
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
let parenBalance = 0;
lines.forEach((line, idx) => {
  const lineNum = idx + 1;
  const openings = (line.match(/\(/g) || []).length;
  const closings = (line.match(/\)/g) || []).length;
  parenBalance += openings - closings;
  if (parenBalance !== 0 && (openings !== 0 || closings !== 0)) {
    console.log(`${lineNum}: [Paren Balance: ${parenBalance}] (${openings}-${closings}) -> ${line.trim()}`);
  }
});
console.log("Final Paren Balance:", parenBalance);
