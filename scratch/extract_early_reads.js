const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';

async function findInTranscript() {
  if (!fs.existsSync(logPath)) {
    console.log(`Transcript not found at ${logPath}`);
    return;
  }

  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepIdx = 0;
  for await (const line of rl) {
    stepIdx++;
    // We only care about model output before our current turn
    if (stepIdx > 4200) continue;
    
    if (line.includes('COUPON SELECTION MODAL') && line.includes('AnimatePresence')) {
      try {
        const obj = JSON.parse(line);
        console.log(`\n======================================================`);
        console.log(`FOUND STEP: ${obj.step_index}, Source: ${obj.source}, Type: ${obj.type}`);
        console.log(`======================================================`);
        if (obj.tool_calls) {
          obj.tool_calls.forEach((tc, tcIdx) => {
            if (tc.name === 'replace_file_content' || tc.name === 'write_to_file') {
              console.log(`Tool Call [${tcIdx}]: ${tc.name}`);
              console.log(`Target: ${tc.args.TargetFile}`);
              console.log(`Replacement Length: ${tc.args.ReplacementContent ? tc.args.ReplacementContent.length : (tc.args.CodeContent ? tc.args.CodeContent.length : 0)}`);
              
              // Print contents
              const code = tc.args.ReplacementContent || tc.args.CodeContent || '';
              // Let's write the code to a file so we can read it cleanly!
              const outPath = `scratch/chunk_step_${obj.step_index}.txt`;
              fs.writeFileSync(outPath, code, 'utf8');
              console.log(`Wrote code to ${outPath}`);
            }
          });
        } else if (obj.content) {
          const outPath = `scratch/chat_content_step_${obj.step_index}.txt`;
          fs.writeFileSync(outPath, obj.content, 'utf8');
          console.log(`Wrote chat content to ${outPath}`);
        }
      } catch (err) {
        console.error(`Error parsing line ${stepIdx}:`, err.message);
      }
    }
  }
}

findInTranscript();
