const fs = require('fs');
const path = require('path');
const readline = require('readline');

const transcriptPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\31103a4e-822c-4c4b-a7e5-42b34753f329\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(transcriptPath)) {
  console.log('Current transcript file not found');
  process.exit(1);
}

const stats = fs.statSync(transcriptPath);
console.log(`Current transcript file size: ${stats.size} bytes`);

const rl = readline.createInterface({
  input: fs.createReadStream(transcriptPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    const toolCallStr = JSON.stringify(obj.tool_calls || []);
    if (toolCallStr.includes('quickBillPrintKot') || toolCallStr.includes('quickBillPrintBill') || toolCallStr.includes('quickBillPrint')) {
      console.log(`🌟 FOUND in current transcript at step ${obj.step_index}!`);
      // Let's print the tool calls
      console.log(JSON.stringify(obj.tool_calls, null, 2));
    }
  } catch (e) {}
});
