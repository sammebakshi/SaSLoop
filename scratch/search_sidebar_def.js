const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Let's find lines containing tab definitions or navigation items
// and search around line 9000 to 11000 where the sidebar is usually rendered.
const keywords = [
  /activeTab/i,
  /active_tab/i,
  /sidebar/i,
  /nav/i,
  /tab-button/i
];

console.log('Searching for tab-related structures:');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('billing') && line.includes('receipts') && (line.includes('icon') || line.includes('label'))) {
    console.log(`Potential Tab Def at ${i + 1}: ${line.trim()}`);
  }
  if (line.includes('activeTab ===') || line.includes('setActiveTab(')) {
    console.log(`ActiveTab usage at ${i + 1}: ${line.trim().substring(0, 120)}`);
  }
}
