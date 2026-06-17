const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCHING FOR silentSync ===");
lines.forEach((line, idx) => {
  if (line.includes('const silentSync') || line.includes('function silentSync')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // print next 30 lines
    for (let i = 1; i <= 30; i++) {
      if (lines[idx + i]) console.log(`  +${i}: ${lines[idx + i]}`);
    }
  }
});
