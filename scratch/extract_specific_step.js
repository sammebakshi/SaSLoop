const fs = require('fs');
const path = require('path');

const editsPath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(editsPath)) {
  console.log('Edits file does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));

const step2291Edits = edits.filter(e => e.stepIndex === 2291 || e.stepIndex === 2292);
console.log(`Found ${step2291Edits.length} edits for Step 2291:`);

step2291Edits.forEach((edit, idx) => {
  console.log(`\n========================================`);
  console.log(`Edit #${idx + 1} - Step ${edit.stepIndex}`);
  console.log(`Description: "${edit.description}"`);
  console.log(`Instruction: "${edit.instruction}"`);
  
  if (edit.args) {
    if (edit.args.ReplacementContent) {
      console.log('ReplacementContent:');
      console.log(edit.args.ReplacementContent);
    }
    if (edit.args.ReplacementChunks) {
      console.log('ReplacementChunks:');
      edit.args.ReplacementChunks.forEach((c, ci) => {
        console.log(`  Chunk #${ci + 1} lines ${c.StartLine}-${c.EndLine}:`);
        console.log(`  Target:`);
        console.log(c.TargetContent);
        console.log(`  Replacement:`);
        console.log(c.ReplacementContent);
      });
    }
  }
});
