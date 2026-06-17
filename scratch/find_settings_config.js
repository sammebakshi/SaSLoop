const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx";
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

for (let idx = 0; idx < lines.length; idx++) {
  const line = lines[idx];
  if (line.includes('isAccessLevelModalOpen') || line.includes('Configuration & Settings') || line.includes('setIsTableManagementModalOpen')) {
    console.log(`${idx + 1}: ${line.trim().substring(0, 100)}`);
  }
}
