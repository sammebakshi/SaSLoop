const fs = require('fs');
const path = require('path');

const editsPath = path.join(__dirname, 'all_app_edits.json');
if (!fs.existsSync(editsPath)) {
  console.log('all_app_edits.json does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));
console.log(`Loaded ${edits.length} edits from all_app_edits.json.`);

const keywords = ['logo', 'logo.png', '8494089744', 'quick bill', 'pre-order', 'ribbon', 'award', 'table', 'merge', 'kot'];

edits.forEach((edit, index) => {
  const text = JSON.stringify(edit).toLowerCase();
  const matched = keywords.filter(kw => text.includes(kw));
  if (matched.length > 0) {
    console.log(`\n========================================`);
    console.log(`Edit #${index + 1} (Step: ${edit.step_index || edit.step}, Tool: ${edit.tool})`);
    console.log(`Matched keywords: ${matched.join(', ')}`);
    if (edit.description) console.log(`Description: "${edit.description}"`);
    if (edit.instruction) console.log(`Instruction: "${edit.instruction}"`);
    
    // Look at chunks
    if (edit.chunks) {
      console.log(`Chunks count: ${edit.chunks.length}`);
      edit.chunks.forEach((chunk, ci) => {
        console.log(`  Chunk #${ci + 1} lines ${chunk.startLine}-${chunk.endLine}`);
        if (chunk.replacementContent && chunk.replacementContent.toLowerCase().includes('logo')) {
          console.log(`    Replacement has 'logo'!`);
          console.log(`    Content excerpt: ${chunk.replacementContent.substring(0, 300)}`);
        }
      });
    }
    if (edit.replacementContent && edit.replacementContent.toLowerCase().includes('logo')) {
      console.log(`  Replacement has 'logo'!`);
      console.log(`  Content excerpt: ${edit.replacementContent.substring(0, 300)}`);
    }
  }
});
