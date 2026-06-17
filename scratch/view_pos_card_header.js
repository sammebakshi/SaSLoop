const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

console.log("=== ORDER CARD CARD SCOPE ===");
for (let i = 10030; i <= 10069; i++) {
  if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
}
