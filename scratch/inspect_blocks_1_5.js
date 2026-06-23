const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  content = fs.readFileSync(filePath, 'utf16le');
}

const lines = content.split(/\r?\n/);

const blocks = [
  { name: 'getPointsValueRate', start: 3640, end: 3665 },
  { name: 'calculateTotals', start: 4590, end: 4650 },
  { name: 'newOrder Payload', start: 6910, end: 6930 },
  { name: 'handlePrint totals logic', start: 7460, end: 7510 },
  { name: 'handlePrint HTML discount rows', start: 7790, end: 7815 }
];

blocks.forEach(block => {
  console.log(`\n=========================================`);
  console.log(`BLOCK: ${block.name} (Lines ${block.start} - ${block.end})`);
  console.log(`=========================================`);
  for (let i = block.start - 1; i < block.end; i++) {
    if (lines[i] !== undefined) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
