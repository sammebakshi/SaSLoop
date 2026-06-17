const fs = require('fs');
const path = require('path');

const editsPath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(editsPath)) {
  console.log('Edits file does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));
console.log(`Loaded ${edits.length} edits.`);

// Sort by stepIndex descending to see the most recent ones first
edits.sort((a, b) => b.stepIndex - a.stepIndex);

console.log('\nLast 20 edits made to App.jsx in this conversation:');
edits.slice(0, 20).forEach((edit, idx) => {
  console.log(`${idx + 1}. Step ${edit.stepIndex} - Timestamp: ${edit.timestamp || 'N/A'}`);
  console.log(`   Description: "${edit.description}"`);
  console.log(`   Instruction: "${edit.instruction}"`);
});
