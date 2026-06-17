const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(transcriptPath)) {
  console.log('Transcript file does not exist');
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(transcriptPath),
  crlfDelay: Infinity
});

let lineNum = 0;
rl.on('line', (line) => {
  lineNum++;
  // We want to find steps where the sub-tabs button rendering was modified
  if (line.includes('Order/KOT') && (line.includes('orderType') || line.includes('QUICK') || line.includes('quickBill') || line.includes('hide'))) {
    console.log(`Found sub-tabs hiding code in line ${lineNum}:`);
    try {
      const obj = JSON.parse(line);
      console.log(`  Step: ${obj.step_index}, Type: ${obj.type}`);
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          console.log(`    Tool: ${tc.name}`);
          const args = tc.args || tc.arguments || {};
          if (args.Instruction) console.log(`      Instruction: ${args.Instruction}`);
          if (args.Description) console.log(`      Description: ${args.Description}`);
          
          // Print some chunks or replacement content
          if (args.ReplacementContent) {
            console.log(`      ReplacementContent preview:`);
            console.log(args.ReplacementContent.substring(0, 500));
          }
          if (args.ReplacementChunks) {
            args.ReplacementChunks.forEach((chunk, ci) => {
              if (chunk.replacementContent.includes('Order/KOT')) {
                console.log(`      Chunk #${ci + 1} lines ${chunk.startLine || chunk.StartLine}-${chunk.endLine || chunk.EndLine}:`);
                console.log(chunk.replacementContent.substring(0, 500));
              }
            });
          }
        });
      }
    } catch (e) {
      console.log(`  Error parsing: ${e.message}`);
    }
  }
});

rl.on('close', () => {
  console.log('Search finished.');
});
