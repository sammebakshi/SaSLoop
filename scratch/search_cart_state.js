const fs = require('fs');
const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('setDineInCart') || line.includes('setPickupCart') || line.includes('setQuickCart')) {
    console.log(`Line ${i+1}: ${line.trim()}`);
  }
});
