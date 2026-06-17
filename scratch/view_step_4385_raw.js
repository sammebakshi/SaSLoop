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
  console.log('=== match.args ===');
  console.log(JSON.stringify(match.args, null, 2));
} else {
  console.log('Step 4385 not found');
}
