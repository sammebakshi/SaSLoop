const fs = require('fs');

const editsPath = 'C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\all_app_edits.json';
const edits = JSON.parse(fs.readFileSync(editsPath, 'utf8'));
const edit = edits.find(e => e.step === 1911);

const safeParseChunks = (chunksStr) => {
  if (typeof chunksStr !== 'string') return chunksStr;
  return JSON.parse(chunksStr.replace(/\n/g, '\\n').replace(/\r/g, '\\r'));
};

const chunks = safeParseChunks(edit.args.ReplacementChunks);
chunks.forEach((c, idx) => {
  console.log(`--- Chunk ${idx} ---`);
  console.log("TargetContent:");
  console.log(c.TargetContent);
  console.log("ReplacementContent:");
  console.log(c.ReplacementContent);
});
