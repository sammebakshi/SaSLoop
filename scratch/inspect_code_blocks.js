const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/src/App.jsx');
let content = '';

content = fs.readFileSync(filePath, 'utf8');
if (content.includes('\u0000')) {
  console.log('Detected null bytes, re-reading as UTF-16LE...');
  content = fs.readFileSync(filePath, 'utf16le');
} else {
  console.log('Read successfully as UTF-8');
}

const lines = content.split(/\r?\n/);
console.log(`Loaded ${lines.length} lines.`);

const blocks = [
  { name: 'getPointsValueRate', start: 3640, end: 3665 },
  { name: 'calculateTotals', start: 4590, end: 4650 },
  { name: 'newOrder Payload', start: 6910, end: 6930 },
  { name: 'handlePrint totals logic', start: 7460, end: 7510 },
  { name: 'handlePrint HTML discount rows', start: 7790, end: 7815 },
  { name: 'tray customer points tray info', start: 10220, end: 10285 },
  { name: 'customer points input & all redeem buttons', start: 16120, end: 16165 },
  { name: 'Coupon Modal UI & manual inputs', start: 16790, end: 16945 },
  { name: 'Receipt preview print coupon/points discounts', start: 19385, end: 19425 },
  { name: 'Receipt preview ledger coupon/points discounts', start: 19640, end: 19675 }
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
