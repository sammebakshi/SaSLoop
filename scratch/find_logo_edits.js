const fs = require('fs');
const path = require('path');

const editsPath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(editsPath)) {
  console.log('Edits file does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));

console.log('Searching for logo/header/svg edits...');
const terms = ['logo', 'header', 'svg', 'image', 'top', 'title', 'brand'];

edits.forEach((edit, index) => {
  const text = (edit.description + ' ' + edit.instruction).toLowerCase();
  const matchedTerms = terms.filter(t => text.includes(t));
  if (matchedTerms.length > 0) {
    console.log(`\n========================================`);
    console.log(`Edit #${index + 1} - Step ${edit.stepIndex} - Tool: ${edit.toolName}`);
    console.log(`Matched terms: ${matchedTerms.join(', ')}`);
    console.log(`Description: "${edit.description}"`);
    console.log(`Instruction: "${edit.instruction}"`);
  }
});
