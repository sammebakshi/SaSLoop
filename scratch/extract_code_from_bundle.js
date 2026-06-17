const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';

async function extractCode() {
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
    if (stepIdx > 4200) continue; // Skip current session
    
    if (line.includes('isCouponModalOpen') && line.includes('PLANNER_RESPONSE')) {
      try {
        const obj = JSON.parse(line);
        const text = obj.content || '';
        // Find markdown code blocks
        const regex = /```(javascript|jsx|react|diff|html|css)?([\s\S]*?)```/g;
        let match;
        let blockCount = 0;
        while ((match = regex.exec(text)) !== null) {
          const codeBlock = match[2];
          if (codeBlock.includes('isCouponModalOpen') || codeBlock.includes('availableCoupons')) {
            blockCount++;
            const outPath = `scratch/extracted_code_step_${obj.step_index}_block_${blockCount}.jsx`;
            fs.writeFileSync(outPath, codeBlock, 'utf8');
            console.log(`Wrote extracted code block from step ${obj.step_index} to ${outPath} (${codeBlock.length} bytes)`);
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }
}

extractCode();
