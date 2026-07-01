const fs = require('fs');
const diff = fs.readFileSync('scratch/pos_app_diff_utf8.diff', 'utf8');

const lines = diff.split('\n');
const matchingChunks = [];
let currentChunk = null;

lines.forEach(line => {
  if (line.startsWith('@@')) {
    if (currentChunk) {
      const text = currentChunk.lines.join('\n').toLowerCase();
      if (text.includes('printer') && (text.includes('dine') || text.includes('delivery') || text.includes('pickup') || text.includes('kot'))) {
        matchingChunks.push(currentChunk);
      }
    }
    currentChunk = {
      header: line,
      lines: []
    };
  } else if (currentChunk) {
    currentChunk.lines.push(line);
  }
});
if (currentChunk) {
  const text = currentChunk.lines.join('\n').toLowerCase();
  if (text.includes('printer') && (text.includes('dine') || text.includes('delivery') || text.includes('pickup') || text.includes('kot'))) {
    matchingChunks.push(currentChunk);
  }
}

console.log(`Found ${matchingChunks.length} chunks related to printers and order types.`);

matchingChunks.forEach((c, idx) => {
  console.log(`\n===================================`);
  console.log(`CHUNK ${idx}: ${c.header}`);
  console.log(`===================================`);
  // Print lines that start with + or -
  c.lines.forEach(l => {
    if (l.startsWith('+') || l.startsWith('-')) {
      console.log(l);
    }
  });
});
