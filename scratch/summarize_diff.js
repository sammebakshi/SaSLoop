const fs = require('fs');
const path = require('path');

const buf = fs.readFileSync(path.join(__dirname, 'current_checkout_diff.diff'));

let diffContent;
if (buf[0] === 0xFF && buf[1] === 0xFE) {
  diffContent = buf.toString('utf16le');
} else if (buf[0] === 0xFE && buf[1] === 0xFF) {
  diffContent = buf.toString('utf16be');
} else {
  if (buf.includes(0x00)) {
    diffContent = buf.toString('utf16le');
  } else {
    diffContent = buf.toString('utf8');
  }
}

const lines = diffContent.split(/\r?\n/);
console.log(`Total diff lines: ${lines.length}`);

const deletions = [];
const additions = [];

let currentHunk = '';
for (const line of lines) {
    if (line.startsWith('@@')) {
        currentHunk = line;
    }
    if (line.startsWith('-') && !line.startsWith('---')) {
        deletions.push(line.substring(1));
    }
    if (line.startsWith('+') && !line.startsWith('+++')) {
        additions.push(line.substring(1));
    }
}

console.log(`Deletions (what is in current HEAD but NOT in checked-out 5ff91c9): ${deletions.length}`);
console.log(`Additions (what was RESTORED in checked-out 5ff91c9): ${additions.length}`);

console.log('\n--- RESTORED LINES (Additions) ---');
const keywords = ['loyalty', 'cloche', 'points', 'deduct', 'customer', 'sorting', 'print', 'logout', 'limit'];
const seen = new Set();
additions.forEach(text => {
    const lower = text.toLowerCase();
    if (keywords.some(kw => lower.includes(kw))) {
        const trimmed = text.trim();
        if (trimmed && !seen.has(trimmed)) {
            seen.add(trimmed);
            console.log(`+ ${trimmed}`);
        }
    }
});
