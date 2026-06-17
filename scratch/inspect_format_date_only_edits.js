const fs = require('fs');
const edits = JSON.parse(fs.readFileSync('scratch/all_app_edits.json', 'utf8'));

edits.forEach((edit, idx) => {
  const editStr = JSON.stringify(edit);
  if (editStr.includes('formatDateOnly')) {
    console.log(`Edit ${idx} (Step ${edit.step}): ${edit.description}`);
    if (edit.tool === 'replace_file_content') {
      console.log(`  TargetContent: ${edit.args.TargetContent ? edit.args.TargetContent.substring(0, 100) : 'none'}`);
    } else {
      console.log('  Multi-replace');
    }
  }
});
