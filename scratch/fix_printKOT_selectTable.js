const fs = require('fs');

const cleanFile = fs.readFileSync('pos-app/src/App_restored.jsx', 'utf8');
const dirtyFile = fs.readFileSync('pos-app/src/App.jsx', 'utf8');

const cleanLines = cleanFile.split('\n');
const dirtyLines = dirtyFile.split('\n');

// In App_restored.jsx: handlePrintKOT at line 7315, selectPosTable ends at line 7469 (};)
// In App.jsx: handlePrintKOT at line 7080, selectPosTable ends at line 7250 (};)
// Extract clean block (lines 7315-7469 inclusive, 0-indexed: 7314-7469)
const cleanBlock = cleanLines.slice(7314, 7469).join('\n');

// Replace dirty block (lines 7080-7250 inclusive, 0-indexed: 7079-7250)
const before = dirtyLines.slice(0, 7079).join('\n');
const after = dirtyLines.slice(7250).join('\n');

const fixedContent = before + '\n' + cleanBlock + '\n' + after;

fs.writeFileSync('pos-app/src/App.jsx', fixedContent, 'utf8');

console.log('handlePrintKOT + selectPosTable replaced successfully.');
console.log(`Clean block: ${cleanLines.slice(7314, 7469).length} lines`);
console.log(`Dirty block was: ${dirtyLines.slice(7079, 7250).length} lines`);
