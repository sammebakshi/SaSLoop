const fs = require('fs');

const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');
const lines = content.split(/\r?\n/);

let openCount = 0;
let isInside = false;
let startLine = 9380; // approximate start line

console.log("Analyzing App.jsx lines around settings modal...");
for (let i = startLine - 5; i < startLine + 1200; i++) {
  const line = lines[i];
  if (!line) continue;
  if (line.includes('{isSettingsModalOpen && (')) {
    isInside = true;
    console.log(`Start of Settings modal block: line ${i + 1}`);
  }
  if (isInside) {
    // Count opening and closing parentheses/braces or similar
    // Or just look for key closing patterns
    if (line.trim() === ')}' || line.trim() === ')} animatePresence' || line.trim() === '</AnimatePresence>') {
      console.log(`Possible end line candidate: ${i + 1}: ${line}`);
    }
  }
}
