const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logFilePath = path.join('C:', 'Users', 'Sajad', '.gemini', 'antigravity-ide', 'brain', '832fe37e-cc6a-4502-a268-fc8186b73341', '.system_generated', 'logs', 'transcript.jsonl');

if (!fs.existsSync(logFilePath)) {
  console.log(`Log file does not exist: ${logFilePath}`);
  process.exit(1);
}

const terms = ['keyMapping', 'Discount Report', 'dsr_report', 'discount_r'];

async function searchLog() {
  const fileStream = fs.createReadStream(logFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    const found = terms.some(term => line.includes(term));
    if (found) {
      try {
        const obj = JSON.parse(line);
        console.log(`\n=== Line ${lineCount} (Step ${obj.step_index}, Source ${obj.source}, Type ${obj.type}) ===`);
        if (obj.tool_calls) {
          obj.tool_calls.forEach(tc => {
            console.log(`Tool: ${tc.name}`);
            if (tc.args && tc.args.ReplacementChunks) {
              console.log("ReplacementChunks found!");
              const chunks = typeof tc.args.ReplacementChunks === 'string' 
                ? JSON.parse(tc.args.ReplacementChunks) 
                : tc.args.ReplacementChunks;
              chunks.forEach((c, ci) => {
                console.log(`Chunk ${ci + 1} Target:`, c.TargetContent);
                console.log(`Chunk ${ci + 1} Replacement:`, c.ReplacementContent);
              });
            } else if (tc.args && tc.args.ReplacementContent) {
              console.log("Single replacement:");
              console.log("Target:", tc.args.TargetContent);
              console.log("Replacement:", tc.args.ReplacementContent);
            }
          });
        } else if (obj.content) {
          console.log("Content preview:", obj.content.substring(0, 500));
        }
      } catch (err) {
        console.log(`Error parsing line ${lineCount}:`, err.message);
      }
    }
  }
}

searchLog();
