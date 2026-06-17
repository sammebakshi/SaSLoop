const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

console.log("=== CONTEXT AROUND LINE 10100 ===");
for (let i = 10090; i <= 10120; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
