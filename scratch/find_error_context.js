const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/Sajad/Desktop/SaSLoop/pos-app/dist/assets/index-D58SoB06.js';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Line 1712 is index 1711 (0-indexed)
const line = lines[1711];
console.log("Line 1712 length:", line.length);

const startCol = Math.max(0, 3959 - 250);
const endCol = Math.min(line.length, 3959 + 250);

console.log("Context around column 3959:\n");
console.log(line.substring(startCol, endCol));
