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
      if (obj.step_index === 1188) {
        console.log("Found step 1188!");
        fs.writeFileSync("scratch/extracted_step_1188.txt", JSON.stringify(obj, null, 2));
        console.log("Wrote full step 1188 object to scratch/extracted_step_1188.txt");
        return;
      }
    } catch (e) {
      // Ignore parse errors on truncated lines
    }
  }
  console.log("Step 1188 not found!");
}

extract();
