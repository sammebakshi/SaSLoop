const fs = require('fs');
const path = require('path');
const readline = require('readline');

const folder = 'c128cc3f-394c-4d5f-8471-2201f6e29d9e';
const logPath = path.join('C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain', folder, '.system_generated', 'logs', 'transcript.jsonl');

async function check() {
  const rl = readline.createInterface({ input: fs.createReadStream(logPath) });
  let idx = 0;
  for await (const line of rl) {
    const p = JSON.parse(line);
    if (p.step_index === 1738 && p.tool_calls) {
      p.tool_calls.forEach(tc => {
        idx++;
        console.log(`\nTool Call #${idx}:`);
        const target = tc.args.TargetContent || tc.args.targetContent || '';
        const replacement = tc.args.ReplacementContent || tc.args.replacementContent || '';
        console.log(`Target length: ${target.length}, Replacement length: ${replacement.length}`);
        
        // Let's do a simple line-by-line diff of target vs replacement
        const targetLines = target.split('\n');
        const replacementLines = replacement.split('\n');
        
        let out = `Tool Call #${idx}\n`;
        out += `Target lines: ${targetLines.length}, Replacement lines: ${replacementLines.length}\n`;
        
        const changes = [];
        let tIdx = 0;
        let rIdx = 0;
        while (tIdx < targetLines.length || rIdx < replacementLines.length) {
          if (targetLines[tIdx] !== replacementLines[rIdx]) {
            if (replacementLines[rIdx] && !targetLines.includes(replacementLines[rIdx])) {
              changes.push(`+ Line ${rIdx+1}: ${replacementLines[rIdx]}`);
              rIdx++;
            } else if (targetLines[tIdx] && !replacementLines.includes(targetLines[tIdx])) {
              changes.push(`- Line ${tIdx+1}: ${targetLines[tIdx]}`);
              tIdx++;
            } else {
              changes.push(`Line diff:\n- ${targetLines[tIdx]}\n+ ${replacementLines[rIdx]}`);
              tIdx++;
              rIdx++;
            }
          } else {
            tIdx++;
            rIdx++;
          }
        }
        
        fs.writeFileSync(`scratch/step_1738_diff_${idx}.txt`, out + changes.join('\n'), 'utf8');
        console.log(`Wrote diff for Tool Call #${idx} to scratch/step_1738_diff_${idx}.txt`);
      });
    }
  }
}

check().catch(console.error);
