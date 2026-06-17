const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'all_app_edits_from_transcript.json');
if (!fs.existsSync(filePath)) {
  console.log('all_app_edits_from_transcript.json does not exist');
  process.exit(1);
}

const edits = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const match = edits.find(e => e.stepIndex === 4385);

if (match && match.args) {
  try {
    const chunks = typeof match.args.ReplacementChunks === 'string' 
      ? JSON.parse(match.args.ReplacementChunks) 
      : match.args.ReplacementChunks;
    
    chunks.forEach((c, i) => {
      console.log(`\n=== CHUNK ${i + 1} (Start: ${c.StartLine}, End: ${c.EndLine}) ===`);
      console.log("--- TARGET ---");
      console.log(c.TargetContent);
      console.log("--- REPLACEMENT ---");
      console.log(c.ReplacementContent);
    });
  } catch (err) {
    console.error("Error parsing chunks:", err);
  }
} else {
  console.log('Step 4385 not found or has no args');
}
