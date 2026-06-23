const fs = require('fs');
const content = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/from_zero_parsed_output.txt', 'utf16le');
const lines = content.split('\n');
const index = lines.findIndex(l => l.includes('Step: 234'));
if (index !== -1) {
  console.log(lines.slice(Math.max(0, index - 5), index + 15).join('\n'));
} else {
  console.log('Not found');
}
