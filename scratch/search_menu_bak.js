const fs = require('fs');

const appContent = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');
const bakContent = fs.existsSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx.bak')
  ? fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx.bak', 'utf8')
  : '';

console.log("Checking App.jsx length:", appContent.length);
console.log("Checking App.jsx.bak length:", bakContent.length);

const findForms = (text, label) => {
  const lines = text.split(/\r?\n/);
  console.log(`\n=== Scanning ${label} ===`);
  lines.forEach((line, idx) => {
    if (line.includes('save') && line.includes('item') && line.toLowerCase().includes('form')) {
      console.log(`Line ${idx+1}: ${line.trim()}`);
    }
    if (line.includes('deleteMenuItem') || line.includes('updateMenuItem') || line.includes('addMenuItem')) {
      console.log(`Line ${idx+1} (API Call): ${line.trim()}`);
    }
  });
};

findForms(appContent, 'App.jsx');
findForms(bakContent, 'App.jsx.bak');
