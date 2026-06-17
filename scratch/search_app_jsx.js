const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');

console.log('Matches for version/1.0.1 in App.jsx:');
lines.forEach((line, idx) => {
  const lower = line.toLowerCase();
  if (lower.includes('version') || lower.includes('1.0.1')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
