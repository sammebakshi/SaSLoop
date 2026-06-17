const fs = require('fs');

const editsPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\all_app_edits.json';
const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));
const edit = edits.find(e => e.step === 2031);

console.log("Step 2031 details:");
console.log("TargetContent:");
console.log(edit.args.TargetContent);
console.log("\nReplacementContent:");
console.log(edit.args.ReplacementContent);
