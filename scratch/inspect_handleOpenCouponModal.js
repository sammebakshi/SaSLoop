const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

console.log("=== handleOpenCouponModal and related ===");
for (let i = 3970; i <= 4020; i++) {
  console.log(`${i}: ${lines[i - 1]}`);
}
