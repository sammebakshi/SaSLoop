const fs = require('fs');

const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');

const regex = /localStorage\.(?:getItem|setItem|removeItem)\s*\(\s*['"`](pos_[a-zA-Z0-9_-]+)['"`]/g;
let match;
const keys = new Set();

while ((match = regex.exec(content)) !== null) {
  keys.add(match[1]);
}

console.log("All pos_ keys found in App.jsx:");
console.log(Array.from(keys).sort());
