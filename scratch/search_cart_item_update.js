const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx";
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

console.log("Searching for price input or handlePriceChange in App.jsx...");
for (let idx = 0; idx < lines.length; idx++) {
  const line = lines[idx];
  if (line.includes('price') && (line.includes('input') || line.includes('onChange')) && (line.includes('item') || line.includes('cart') || line.includes('Cart'))) {
    console.log(`${idx + 1}: ${line.trim().substring(0, 120)}`);
  }
}
