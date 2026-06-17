const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/all_app_edits.json', 'utf8'));

data.forEach((edit, idx) => {
  const args = edit.args;
  if (!args) return;
  const content = args.ReplacementContent || '';
  if (content.includes('COUPON SELECTION MODAL') || content.includes('isCouponModalOpen &&')) {
    console.log(`\n======================================================`);
    console.log(`Edit Index: ${idx}, Step: ${edit.step}, Tool: ${edit.tool}`);
    console.log(`Instruction: ${args.Instruction || edit.instruction}`);
    console.log(`StartLine: ${args.StartLine}, EndLine: ${args.EndLine}`);
    console.log(`======================================================`);
    console.log(content);
  }
});
