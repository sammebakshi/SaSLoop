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
  const dest = path.join(__dirname, 'step_912_code.jsx');
  
  // The JSON string has escaped newlines like \n. We should parse them or write them directly.
  // Since we parsed the JSON, match.args.ReplacementContent is a real string with actual newlines.
  fs.writeFileSync(dest, match.args.ReplacementContent, 'utf8');
  console.log(`Saved Step 912 ReplacementContent to ${dest}`);
} else {
  console.log('Step 912 or ReplacementContent not found');
}
