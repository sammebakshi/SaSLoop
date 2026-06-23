const fs = require('fs');

const matchesContent = fs.readFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/matches.txt', 'utf8');

// Let's find any mention of "dial-knob" or "dial-spin-sequence" in matches.txt or extracted_dial_code.txt or other files.
// Let's write a recursive scanner to find the dial knob code.
const files = [
  'c:/Users/Sajad/Desktop/SaSLoop/scratch/matches.txt',
  'c:/Users/Sajad/Desktop/SaSLoop/scratch/extracted_dial_code.txt',
  'c:/Users/Sajad/Desktop/SaSLoop/scratch/diff_checkpoints.diff',
  'c:/Users/Sajad/Desktop/SaSLoop/scratch/extracted_step_1171.txt'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('dial-spin-sequence')) {
    console.log(`Found in: ${file}`);
    // Print lines around dial-spin-sequence
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('dial-spin-sequence') || line.includes('metallicSteel')) {
        console.log(`Line ${idx + 1}: ${line.slice(0, 150)}...`);
      }
    });
  }
});
