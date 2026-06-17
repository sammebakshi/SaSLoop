const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');
const targets = [3356, 7516, 7551, 7581, 7866, 7901, 7931];
targets.forEach(idx => {
  console.log(`Line ${idx}: ${lines[idx-1].trim()}`);
});
