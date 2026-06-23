const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const patterns = [
  /SettingsTab/i,
  /settingsSubTab/i,
  /activeSettingsTab/i,
  /Printers/i,
  /Formatting/i,
  /Shortcuts/i,
  /General/i,
  /Profile/i
];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  patterns.forEach(pattern => {
    if (pattern.test(line)) {
      console.log(`${i + 1}: ${line.trim().substring(0, 120)}`);
    }
  });
}
