const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
try {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const start = 6810;
  const end = 6840;
  for (let i = start; i <= end; i++) {
    console.log(`${i}: ${lines[i - 1]}`);
  }
} catch (err) {
  console.error(err);
}
