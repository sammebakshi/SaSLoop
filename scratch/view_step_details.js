const fs = require('fs');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(transcriptPath)) {
  console.log('Transcript file does not exist');
  process.exit(1);
}

const targetSteps = [1573, 1703];

const rl = readline.createInterface({
  input: fs.createReadStream(transcriptPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (targetSteps.includes(obj.step_index)) {
      console.log(`\n========================================`);
      console.log(`Step ${obj.step_index} - Source: ${obj.source} - Type: ${obj.type}`);
      if (obj.content) {
        console.log(`Content: ${obj.content.substring(0, 1000)}`);
      }
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          console.log(`  Tool: ${tc.name}`);
          const args = tc.args || tc.arguments || {};
          console.log(`    TargetFile: ${args.TargetFile}`);
          console.log(`    Description: ${args.Description}`);
          
          if (args.ReplacementContent) {
            console.log(`    ReplacementContent:`);
            console.log(args.ReplacementContent);
          }
          if (args.ReplacementChunks) {
            args.ReplacementChunks.forEach((c, ci) => {
              console.log(`    Chunk #${ci + 1}:`);
              console.log(`      Target:`);
              console.log(c.TargetContent);
              console.log(`      Replacement:`);
              console.log(c.ReplacementContent);
            });
          }
        });
      }
    }
  } catch (e) {
    // ignore
  }
});

rl.on('close', () => {
  console.log('Done.');
});
