const fs = require('fs');

const matchesPath = 'c:/Users/Sajad/Desktop/SaSLoop/scratch/matches.txt';
if (!fs.existsSync(matchesPath)) {
  console.log("matches.txt does not exist");
  process.exit(1);
}

const buffer = fs.readFileSync(matchesPath);
let content = '';
if (buffer[0] === 0xff && buffer[1] === 0xfe) {
  content = buffer.toString('utf16le');
} else {
  content = buffer.toString('utf8');
}

console.log("matches.txt decoded length:", content.length);

const term = 'metallicSteel';
const idx = content.indexOf(term);
if (idx !== -1) {
  console.log(`Found '${term}' at index ${idx}`);
  // Let's write the surrounding 20000 characters
  const start = Math.max(0, idx - 1000);
  const end = Math.min(content.length, idx + 15000);
  const chunk = content.slice(start, end);
  fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/untruncated_metallic.jsx', chunk, 'utf8');
  console.log("Wrote untruncated_metallic.jsx!");
  
  // Let's print if it contains the word '<truncated'
  console.log("Chunk contains '<truncated'?", chunk.includes('<truncated'));
} else {
  console.log(`Term '${term}' not found`);
}
