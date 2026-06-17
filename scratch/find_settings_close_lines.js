const fs = require('fs');

const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');
const lines = content.split(/\r?\n/);

console.log("Searching for settings modal closing lines in App.jsx:");
lines.forEach((line, idx) => {
  if (line.includes('setIsSettingsModalOpen(false)') || line.includes('Global Preview Modal')) {
    console.log(`Line ${idx+1}: ${line.trim()}`);
  }
});
