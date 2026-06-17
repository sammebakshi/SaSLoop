const fs = require('fs');
const e = JSON.parse(fs.readFileSync('scratch/all_app_edits.json', 'utf8'));
for (let i = 0; i < e.length; i++) {
  const edit = e[i];
  let info = '';
  if (edit.tool === 'multi_replace_file_content') {
    const rc = edit.args.ReplacementChunks;
    if (typeof rc === 'string') {
      info = 'rc is string (needs parsing)';
      if (rc.includes('<truncated')) {
        info = 'rc is TRUNCATED';
      }
    } else if (Array.isArray(rc)) {
      info = `rc is Array with ${rc.length} chunks`;
    } else {
      info = 'rc is unknown type';
    }
  } else {
    info = 'single replace';
  }
  console.log(`Edit ${i} (Step ${edit.step}): ${edit.description.substring(0, 60)}... | ${info}`);
}
