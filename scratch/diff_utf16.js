const fs = require('fs');
const path = require('path');

const file1 = path.join(__dirname, 'App_HEAD.jsx');
const file2 = path.join(__dirname, 'App_backup_31c7593.jsx');

const text1 = fs.readFileSync(file1, 'utf16le');
const text2 = fs.readFileSync(file2, 'utf16le');

if (text1 === text2) {
  console.log("Files are completely identical!");
  process.exit(0);
}

const lines1 = text1.split(/\r?\n/);
const lines2 = text2.split(/\r?\n/);

console.log(`File 1 has ${lines1.length} lines, File 2 has ${lines2.length} lines.`);

// Simple line-by-line comparison
const maxLines = Math.max(lines1.length, lines2.length);
let diffCount = 0;
for (let i = 0; i < maxLines; i++) {
  const l1 = lines1[i];
  const l2 = lines2[i];
  if (l1 !== l2) {
    diffCount++;
    if (diffCount <= 10) {
      console.log(`Line ${i + 1}:`);
      console.log(`- HEAD  : ${l1 || '<empty>'}`);
      console.log(`+ BACKUP: ${l2 || '<empty>'}`);
    }
  }
}
console.log(`Total diff lines: ${diffCount}`);
