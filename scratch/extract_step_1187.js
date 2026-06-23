const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logFile = "C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\f6290d96-6827-4397-8034-a378a3d29f80\\.system_generated\\logs\\transcript.jsonl";

async function extract() {
  const fileStream = fs.createReadStream(logFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.step_index === 1187) {
        console.log("Found step 1187!");
        const toolCall = obj.tool_calls[0];
        const content = toolCall.args.ReplacementContent;
        fs.writeFileSync("scratch/extracted_dial_code.txt", content);
        console.log("Wrote code to scratch/extracted_dial_code.txt successfully!");
        return;
      }
    } catch (e) {
      // Ignore parse errors on truncated lines
    }
  }
  console.log("Step 1187 not found!");
}

extract();
