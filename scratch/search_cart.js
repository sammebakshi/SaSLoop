const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('const addToCart') || line.includes('function addToCart') || line.includes('const handleAddItem') || line.includes('const addItemToCart')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
