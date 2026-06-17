const fs = require('fs');
const content = fs.readFileSync('dbInit.js', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('queries') || line.includes('await pool.query')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
