const fs = require('fs');
const path = require('path');

const bundlePath = 'pos-app/dist/assets/index-cLKCerJ7.js';
if (!fs.existsSync(bundlePath)) {
  console.error('Bundle not found at:', bundlePath);
  process.exit(1);
}

const content = fs.readFileSync(bundlePath, 'utf8');
const query = process.argv[2] || '';
console.log(`Searching bundle for: ${query}`);
if (!query) {
  process.exit(1);
}

// Find matches and print surrounding context (300 chars before and after)
let index = 0;
let matchCount = 0;
while ((index = content.indexOf(query, index)) !== -1) {
  matchCount++;
  console.log(`\n--- Match #${matchCount} at index ${index} ---`);
  const start = Math.max(0, index - 400);
  const end = Math.min(content.length, index + query.length + 400);
  console.log(content.substring(start, end));
  index += query.length;
  if (matchCount >= 10) {
    console.log('\nToo many matches, stopping.');
    break;
  }
}
