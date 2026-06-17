const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');

console.log('Matches for history modal in App.jsx:');
lines.forEach((line, idx) => {
  const lower = line.toLowerCase();
  if (lower.includes('history') && lower.includes('modal')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
