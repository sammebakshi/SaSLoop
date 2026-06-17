const fs = require('fs');
const content = fs.readFileSync('scratch/from_zero_parsed_output.txt', 'utf8');

let clean = content;
if (content.includes('\u0000')) {
  clean = content.replace(/\u0000/g, '');
}

const lines = clean.split('\n');
lines.forEach(l => {
  const trimmed = l.trim();
  if (trimmed.startsWith('[Edit') || trimmed.includes('ERROR') || trimmed.includes('Success')) {
    console.log(trimmed);
  }
});
