const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // Match lines with root-level definitions
  if (line.startsWith('const ') || line.startsWith('function ') || line.startsWith('export default ')) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
}
