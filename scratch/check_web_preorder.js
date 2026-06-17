const fs = require('fs');

const content = fs.readFileSync('pos-app/src/App.jsx', 'utf8');

console.log('File size:', content.length, 'bytes');

// Check countAdvanceInSales
const countAdvanceMatches = content.match(/countAdvanceInSales/gi);
console.log('countAdvanceInSales matches:', countAdvanceMatches ? countAdvanceMatches.length : 0);

// Check print copies settings
const printCopiesMatches = content.match(/printCopies|copies|copies/gi);
console.log('copies/printCopies matches:', printCopiesMatches ? printCopiesMatches.length : 0);

// Check fulfill button
const fulfillMatches = content.match(/fulfill/gi);
console.log('fulfill matches:', fulfillMatches ? fulfillMatches.length : 0);

// Check preOrderSubTab or subTab
const subTabMatches = content.match(/preOrderSubTab/gi);
console.log('preOrderSubTab matches:', subTabMatches ? subTabMatches.length : 0);

// Let's print some lines containing preOrderSubTab
const lines = content.split('\n');
lines.forEach((line, idx) => {
    if (line.includes('preOrderSubTab') || line.includes('countAdvance') || line.includes('advanceCount')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
});
