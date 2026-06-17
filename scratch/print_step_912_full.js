const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(filePath)) {
  console.log('all_app_edits_from_transcript.json does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const match = edits.find(e => e.stepIndex === 912);

if (match && match.args && match.args.ReplacementContent) {
  console.log('=== FULL REPLACEMENT CONTENT FOR STEP 912 ===');
  console.log(match.args.ReplacementContent);
} else {
  console.log('Step 912 or ReplacementContent not found');
}
