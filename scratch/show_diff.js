const fs = require('fs');
const path = require('path');

const diffPath = path.join(__dirname, 'local_diff.diff');
let content = '';
try {
  content = fs.readFileSync(diffPath, 'utf8');
} catch (e) {
  // If UTF-16, read and convert
  const buffer = fs.readFileSync(diffPath);
  content = buffer.toString('utf16le');
}

const lines = content.split('\n');
console.log("Total lines in diff:", lines.length);

const additions = [];
const deletions = [];

lines.forEach(line => {
  if (line.startsWith('+') && !line.startsWith('+++')) {
    additions.push(line);
  } else if (line.startsWith('-') && !line.startsWith('---')) {
    deletions.push(line);
  }
});

console.log("Additions count:", additions.length);
console.log("Deletions count:", deletions.length);

console.log("\n--- DELETIONS FIRST 30 ---");
deletions.slice(0, 50).forEach((d, i) => console.log(`${i+1}: ${d}`));

console.log("\n--- ADDITIONS FIRST 30 ---");
additions.slice(0, 50).forEach((a, i) => console.log(`${i+1}: ${a}`));
