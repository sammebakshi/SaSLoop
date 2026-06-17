const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCH FOR CANCELLED/CANCEL IN DETAILS PANEL ===");
for (let i = 10250; i <= 10460; i++) {
  if (lines[i] && (lines[i].includes('CANCELLED') || lines[i].includes('Cancel'))) {
    console.log(`${i + 1}: ${lines[i].trim()}`);
  }
}
