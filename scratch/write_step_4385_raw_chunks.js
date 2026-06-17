const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'all_app_edits_from_transcript.json');
const edits = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const match = edits.find(e => e.stepIndex === 4385);

if (match && match.args) {
  const rawChunks = match.args.ReplacementChunks;
  fs.writeFileSync(path.join(__dirname, 'step_4385_raw_chunks.txt'), rawChunks, 'utf8');
  console.log("Wrote step_4385_raw_chunks.txt successfully. Length:", rawChunks.length);
} else {
  console.log("Step 4385 not found or has no args");
}
