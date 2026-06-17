const fs = require('fs');
const e = JSON.parse(fs.readFileSync('scratch/all_app_edits.json', 'utf8'));
const edit = e.find(x => x.tool === 'replace_file_content');
console.log('TargetContent raw value:', edit.args.TargetContent);
try {
  const parsed = JSON.parse(edit.args.TargetContent);
  console.log('Parsed successfully! Length:', parsed.length);
  console.log('Parsed sample:', parsed.substring(0, 100));
} catch (err) {
  console.log('Failed to parse:', err.message);
}
