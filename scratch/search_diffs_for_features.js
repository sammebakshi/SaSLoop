const fs = require('fs');
const path = require('path');

const editsPath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(editsPath)) {
  console.log('Edits file does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));
console.log(`Loaded ${edits.length} edits.`);

const features = {
  logo: /logo/i,
  phoneCorrected: /8494089744/,
  mergeCartItems: /mergeCartItems/i,
  quickBillTabHide: /quickBillPrintKot|quickBillPrintBill|hide.*sub-tab|activeTrayTab.*quick/i,
  ribbonIconChange: /Award|Ticket/i,
  tableIconSelector: /table.*selector|table.*button/i
};

edits.forEach((edit, idx) => {
  const codeBlocks = [];
  
  if (edit.args) {
    if (edit.args.CodeContent) codeBlocks.push(edit.args.CodeContent);
    if (edit.args.ReplacementContent) codeBlocks.push(edit.args.ReplacementContent);
    if (edit.args.TargetContent) codeBlocks.push(edit.args.TargetContent);
    
    if (edit.args.ReplacementChunks && Array.isArray(edit.args.ReplacementChunks)) {
      edit.args.ReplacementChunks.forEach(chunk => {
        if (chunk.replacementContent) codeBlocks.push(chunk.replacementContent);
        if (chunk.targetContent) codeBlocks.push(chunk.targetContent);
      });
    }
  }

  const matchedFeatures = [];
  for (const [name, regex] of Object.entries(features)) {
    const matches = codeBlocks.some(block => regex.test(block));
    if (matches) {
      matchedFeatures.push(name);
    }
  }

  if (matchedFeatures.length > 0) {
    console.log(`\n========================================`);
    console.log(`Edit #${idx + 1} - Step ${edit.stepIndex} - Tool: ${edit.toolName}`);
    console.log(`Description: "${edit.description}"`);
    console.log(`Matched Features in CODE: ${matchedFeatures.join(', ')}`);
    
    // Print snippet of the matching replacement code
    codeBlocks.forEach(block => {
      for (const [name, regex] of Object.entries(features)) {
        if (regex.test(block)) {
          const match = regex.exec(block);
          const start = Math.max(0, match.index - 150);
          const end = Math.min(block.length, match.index + 150);
          console.log(`  [Match ${name}]: ...${block.substring(start, end).replace(/\n/g, ' ')}...`);
        }
      }
    });
  }
});
