const fs = require('fs');
const path = require('path');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\7f8264b7-aecc-49d7-b055-a8addbc0d50e\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(transcriptPath)) {
  console.log('Error: Previous transcript not found at', transcriptPath);
  process.exit(1);
}

console.log('Scanning previous transcript for Step 2291...');

const rl = readline.createInterface({
  input: fs.createReadStream(transcriptPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    const stepIdx = obj.step_index;
    
    // Check if the step index matches 2291 (or description matches the Quick Bill ones)
    let isTargetStep = (stepIdx === 2291);
    
    // As a backup, check if any tool call contains "quickBillPrintKot"
    let containsKeyword = false;
    if (obj.tool_calls) {
      const toolCallStr = JSON.stringify(obj.tool_calls);
      if (toolCallStr.includes('quickBillPrintKot') || toolCallStr.includes('quickBillPrintBill')) {
        containsKeyword = true;
      }
    }
    
    if (isTargetStep || containsKeyword) {
      console.log(`\n========================================`);
      console.log(`FOUND STEP! index: ${stepIdx} | keyword match: ${containsKeyword}`);
      if (obj.tool_calls && Array.isArray(obj.tool_calls)) {
        obj.tool_calls.forEach((tc, tci) => {
          const name = tc.name || tc.toolName;
          const args = tc.args || tc.arguments || {};
          console.log(`Tool Call #${tci + 1}: ${name}`);
          console.log(`Description: ${args.Description}`);
          
          // Write this tool call args directly to a JSON file!
          const outPath = path.join(__dirname, `edit_${stepIdx || 'keyword'}_args.json`);
          fs.writeFileSync(outPath, JSON.stringify(args, null, 2), 'utf8');
          console.log(`Saved args to scratch/${path.basename(outPath)}`);
        });
      }
    }
  } catch (e) {
    // ignore parse error
  }
});

rl.on('close', () => {
  console.log('\nScan finished.');
});
