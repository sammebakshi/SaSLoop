const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'pos-app', 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// We want to find:
//         if (orderType === 'QUICK' || editingPreOrder) {
//           handlePrint(newOrder); // Automatically print on settlement for Quick Bill & Pre-Order
//         }
// but specifically the second one (or we can replace the specific one near is_temporary).
// Let's print the matches first or just do a regex replace.

const targetPattern = /if\s*\(\s*selectedTable\.is_temporary\s*\)\s*\{[\s\S]*?\}\s*[\r\n\s]*if\s*\(\s*orderType\s*===\s*'QUICK'\s*\|\|\s*editingPreOrder\s*\)\s*\{[\s\S]*?\}\s*[\r\n\s]*\/\/\s*UPDATE\s*SHIFT\s*SALES/g;

if (targetPattern.test(content)) {
  console.log("Found pattern!");
  content = content.replace(targetPattern, (match) => {
    // Keep everything up to the first brace close of is_temporary, then transition to UPDATE SHIFT SALES
    const isTempPart = match.substring(0, match.indexOf('}') + 1);
    return isTempPart + '\n\n        // UPDATE SHIFT SALES';
  });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log("Replacement successful!");
} else {
  console.log("Pattern NOT found!");
  // Let's search for "Automatically print on settlement"
  const commentIndex = content.indexOf('Automatically print on settlement');
  console.log("Index of comment:", commentIndex);
  if (commentIndex !== -1) {
     console.log("Around comment:\n", content.substring(commentIndex - 100, commentIndex + 150));
  }
}
