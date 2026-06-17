const fs = require('fs');
const path = require('path');

const editsPath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(editsPath)) {
  console.log('Edits file does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));

console.log('Searching edits for "quick" code modifications...');
edits.forEach((edit, idx) => {
  const codeBlocks = [];
  if (edit.args) {
    if (edit.args.ReplacementContent) codeBlocks.push(edit.args.ReplacementContent);
    if (edit.args.ReplacementChunks && Array.isArray(edit.args.ReplacementChunks)) {
      edit.args.ReplacementChunks.forEach(chunk => {
        if (chunk.replacementContent) codeBlocks.push(chunk.replacementContent);
      });
    }
  }

  codeBlocks.forEach(block => {
    if (block.toLowerCase().includes('quick')) {
      console.log(`\n========================================`);
      console.log(`Edit #${idx + 1} - Step ${edit.stepIndex}`);
      console.log(`Description: "${edit.description}"`);
      
      // Print lines containing "quick" or "QUICK"
      const lines = block.split('\n');
      lines.forEach(line => {
        if (line.toLowerCase().includes('quick')) {
          console.log(`  > ${line.trim()}`);
        }
      });
    }
  });
});
