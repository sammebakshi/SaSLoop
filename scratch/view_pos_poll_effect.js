const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

console.log("=== POLLING EFFECT CONTEXT ===");
for (let i = 1915; i <= 1950; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
