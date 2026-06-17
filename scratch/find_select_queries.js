const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'whatsappManager.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log("Searching for SELECT statements in whatsappManager.js...");
let inQuery = false;
let queryBuffer = [];
let queryStartLine = 0;

lines.forEach((line, index) => {
    const lineNum = index + 1;
    // Look for template literals or strings containing SELECT
    if (line.includes('SELECT') || line.includes('select')) {
        console.log(`\nLine ${lineNum}: ${line.trim()}`);
    }
});
