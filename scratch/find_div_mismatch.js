const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/pos-app/src/App.jsx', 'utf8');

// Let's parse tags roughly and find where divs don't match.
// We'll track line numbers of open/close div tags.
const lines = content.split('\n');
const stack = [];

lines.forEach((line, index) => {
  const lineNum = index + 1;
  
  // Find all `<div` or `</div>` (excluding comments)
  // Let's strip comments first
  let cleanLine = line.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\/.*$/g, '');
  
  // Find `<div` matches
  const openRegex = /<div(?=\s|>)/g;
  let openMatch;
  while ((openMatch = openRegex.exec(cleanLine)) !== null) {
    stack.push({ type: 'open', line: lineNum, char: openMatch.index });
  }
  
  // Find `</div>` matches
  const closeRegex = /<\/div>/g;
  let closeMatch;
  while ((closeMatch = closeRegex.exec(cleanLine)) !== null) {
    if (stack.length === 0) {
      console.log(`Extra </div> at line ${lineNum}`);
    } else {
      stack.pop();
    }
  }
});

console.log(`Finished checking. Stack size at end: ${stack.length}`);
if (stack.length > 0) {
  console.log("Unclosed divs opened at lines:");
  stack.forEach(item => {
    console.log(`Line ${item.line}: ${lines[item.line-1].trim()}`);
  });
}
