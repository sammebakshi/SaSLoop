const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
if (!fs.existsSync(appPath)) {
  console.log("App.jsx not found.");
  process.exit(0);
}

const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

console.log("=== SEARCH RESULTS FOR ACCEPT/REJECT IN App.jsx ===");
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('accept') || line.toLowerCase().includes('reject')) {
    if (line.length < 200) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
