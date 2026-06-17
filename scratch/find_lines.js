const fs = require('fs');
const filepath = "c:/Users/Sajad/Desktop/SaSLoop/SaSLoop-dashboard/src/pages/StoreAccessManager.jsx";
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

for (let idx = 0; idx < lines.length; idx++) {
  const line = lines[idx];
  if (line.includes('const MODULES') || line.includes('const modules') || line.includes('key:') || line.includes('name:')) {
    console.log(`${idx + 1}: ${line.trim().substring(0, 120)}`);
  }
}
