const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(filePath)) {
  console.log('all_app_edits_from_transcript.json does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const match = edits.find(e => e.stepIndex === 4385);

if (match && match.args && match.args.ReplacementChunks) {
  let chunks = match.args.ReplacementChunks;
  if (typeof chunks === 'string') {
    chunks = JSON.parse(chunks);
  }
  
  console.log(`Parsed ${chunks.length} chunks:`);
  chunks.forEach((chunk, ci) => {
    console.log(`\n========================================`);
    console.log(`Chunk #${ci + 1} - lines ${chunk.StartLine || chunk.startLine}-${chunk.EndLine || chunk.endLine}`);
    console.log(`Target Content:`);
    console.log(chunk.TargetContent || chunk.targetContent);
    console.log(`Replacement Content:`);
    console.log(chunk.ReplacementContent || chunk.replacementContent);
  });
} else {
  console.log('Step 4385 or chunks not found');
}
