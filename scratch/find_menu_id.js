const fs = require('fs');

const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');
const lines = content.split(/\r?\n/);

console.log("Searching for menu_id or menuId:");
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('menu_id') || line.toLowerCase().includes('menuid')) {
    console.log(`Line ${idx+1}: ${line.trim()}`);
  }
});
