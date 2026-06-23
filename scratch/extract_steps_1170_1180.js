const fs = require('fs');
const readline = require('readline');

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
      if (obj.step_index >= 1170 && obj.step_index <= 1180) {
        if (obj.tool_calls && obj.tool_calls.length > 0) {
          console.log(`Found step ${obj.step_index} with tool call: ${obj.tool_calls[0].name}`);
          fs.writeFileSync(`scratch/extracted_step_${obj.step_index}.txt`, JSON.stringify(obj, null, 2));
        }
      }
    } catch (e) {
      // Ignore
    }
  }
}

extract();
