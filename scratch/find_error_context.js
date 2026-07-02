const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../pos-app/dist/assets/index-BM8m9_ly.js');
if (!fs.existsSync(filePath)) {
  console.error("File does not exist:", filePath);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log("Total lines:", lines.length);

const targetLine = 1712; // 1-indexed, so 1711
const lineContent = lines[targetLine - 1];
if (lineContent) {
  console.log("Length of line:", lineContent.length);
  // Get slice around column 9970 (1-indexed, so 9969)
  const colIndex = 9970 - 1;
  const start = Math.max(0, colIndex - 100);
  const end = Math.min(lineContent.length, colIndex + 100);
  console.log("Slice around column 9970:\n", lineContent.substring(start, end));
} else {
  console.log("Line 1712 not found!");
}
