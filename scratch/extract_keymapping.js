const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(filePath)) {
  console.log('all_app_edits_from_transcript.json does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(filePath, 'utf8'));

edits.forEach(e => {
  if (e.args) {
    let chunks = e.args.ReplacementChunks || [];
    if (typeof chunks === 'string') {
      try { chunks = JSON.parse(chunks); } catch (err) { chunks = []; }
    }
    chunks.forEach(c => {
      if (c.ReplacementContent && c.ReplacementContent.includes('keyMapping')) {
        console.log(`Found in step: ${e.stepIndex}`);
        console.log("ReplacementContent:\n", c.ReplacementContent);
      }
    });
    
    if (e.args.ReplacementContent && e.args.ReplacementContent.includes('keyMapping')) {
      console.log(`Found single replacement in step: ${e.stepIndex}`);
      console.log("ReplacementContent:\n", e.args.ReplacementContent);
    }
  }
});
