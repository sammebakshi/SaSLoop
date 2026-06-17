const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

console.log("=== VERIFYING SECTION 1 (LINE 10048) ===");
for (let i = 10045; i <= 10053; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

console.log("\n=== VERIFYING SECTION 2 (LINE 10092) ===");
for (let i = 10088; i <= 10095; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

console.log("\n=== VERIFYING SECTION 3 (LINE 10482) ===");
for (let i = 10478; i <= 10488; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
