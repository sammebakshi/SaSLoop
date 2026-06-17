const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');

console.log('Matches for redeemedPoints/points_discount:');
lines.forEach((line, idx) => {
  if (line.includes('redeemedPoints') || line.includes('points_discount') || line.includes('pointsDiscount')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
