const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(filePath)) {
  console.log('all_app_edits_from_transcript.json does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const match = edits.find(e => e.stepIndex === 912 || e.stepIndex === 911 || e.stepIndex === 913);

if (match) {
  console.log(`\nFound edit in transcript:`);
  console.log(`Step: ${match.stepIndex}`);
  console.log(`Description: "${match.description}"`);
  console.log(`Instruction: "${match.instruction}"`);
  
  if (match.args) {
    if (match.args.TargetContent) {
      console.log('TargetContent:');
      console.log(match.args.TargetContent);
    }
    if (match.args.ReplacementContent) {
      console.log('ReplacementContent:');
      console.log(match.args.ReplacementContent);
    }
  }
} else {
  console.log('Step 912 not found in transcript edits');
}
