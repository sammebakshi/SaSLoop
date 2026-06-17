const fs = require('fs');
const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((line, idx) => {
  if (line.includes('handlePrint') || line.includes('printKOT') || line.includes('printBill') || line.includes('print-layout') || line.includes('window.print') || line.includes('ipcRenderer.send(\'print\'')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
