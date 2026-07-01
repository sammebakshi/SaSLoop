const fs = require('fs');

const diffContent = fs.readFileSync('scratch/pos_app_diff_utf8.diff', 'utf8');
const lines = diffContent.split('\n');

const chunks = [];
let currentChunk = null;

lines.forEach(line => {
  if (line.startsWith('@@')) {
    if (currentChunk) {
      chunks.push(currentChunk);
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
  chunks.push(currentChunk);
}

const targetKeywords = ['printer', 'temp', 'splash', 'dial', 'pickup', 'delivery', 'locker'];
const filteredChunks = chunks.filter(c => {
  const content = c.lines.join('\n').toLowerCase();
  return targetKeywords.some(kw => content.includes(kw));
});

let out = `Found ${filteredChunks.length} chunks related to user custom features:\n\n`;
filteredChunks.forEach((c, idx) => {
  out += `=========================================\n`;
  out += `CHUNNK ${idx}: ${c.header}\n`;
  out += `=========================================\n`;
  // Only print added lines (+) or lines with target keywords
  c.lines.forEach(l => {
    if (l.startsWith('+') || l.startsWith('-') || targetKeywords.some(kw => l.toLowerCase().includes(kw))) {
      out += l + '\n';
    }
  });
  out += '\n';
});

fs.writeFileSync('scratch/user_changes.diff', out, 'utf8');
console.log("Saved matching chunks to scratch/user_changes.diff");
