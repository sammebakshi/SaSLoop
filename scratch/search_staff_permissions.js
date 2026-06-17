const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx";
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

console.log("Searching for 'staff_permissions' / 'pos_access' in App.jsx...");
for (let idx = 0; idx < lines.length; idx++) {
  const line = lines[idx];
  if (line.includes('staff_permissions') || line.includes('pos_access')) {
    console.log(`${idx + 1}: ${line.trim().substring(0, 120)}`);
  }
}
