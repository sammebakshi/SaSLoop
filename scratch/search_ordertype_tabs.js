const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('orderType') && (line.includes('===') || line.includes('setOrderType') || line.includes('className'))) {
      if (line.includes('<div') || line.includes('<button') || line.includes('<span') || line.includes('Tabs')) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
      }
    }
  }
} catch (err) {
  console.error(err);
}
