const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(filePath)) {
  console.log('all_app_edits_from_transcript.json does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const match = edits.find(e => e.stepIndex === 4385);

if (match) {
  console.log(`\nFound edit in transcript:`);
  console.log(`Step: ${match.stepIndex}`);
  console.log(`Description: "${match.description}"`);
  console.log(`Instruction: "${match.instruction}"`);
  
  if (match.args) {
    if (match.args.ReplacementChunks) {
      match.args.ReplacementChunks.forEach((c, ci) => {
        console.log(`\nChunk #${ci + 1} lines ${c.StartLine}-${c.EndLine}:`);
        console.log(`Target:`);
        console.log(c.TargetContent);
        console.log(`Replacement:`);
        console.log(c.ReplacementContent);
      });
    }
  }
} else {
  console.log('Step 4385 not found in transcript edits');
}
