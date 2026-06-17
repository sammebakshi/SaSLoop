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
    if (line.includes('setIsCouponModalOpen') || line.includes('isCouponModalOpen')) {
      if (line.includes('onClick') || line.includes('<button') || line.includes('trigger') || line.includes('button')) {
        console.log(`Match at step ${stepIdx}`);
        try {
          const obj = JSON.parse(line);
          console.log(`  Step Index: ${obj.step_index}, Type: ${obj.type}`);
          if (obj.tool_calls) {
            obj.tool_calls.forEach(tc => {
              const code = tc.args.ReplacementContent || tc.args.CodeContent || '';
              if (code) {
                // Find lines with coupon in code
                code.split('\n').forEach((l, lidx) => {
                  if (l.toLowerCase().includes('coupon') || l.toLowerCase().includes('setiscouponmodalopen')) {
                    console.log(`    Line ${lidx}: ${l.trim()}`);
                  }
                });
              }
            });
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }
}

findInTranscript();
