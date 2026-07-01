const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\f6290d96-6827-4397-8034-a378a3d29f80\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const targetSteps = [1187, 2087, 2109, 2110, 2179];

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (targetSteps.includes(obj.step_index)) {
        console.log(`=== STEP ${obj.step_index} ===`);
        console.log(JSON.stringify(obj, null, 2).substring(0, 4000));
        console.log(`=============================\n`);
      }
    } catch (e) {
      // ignore
    }
  }
}

processLineByLine();
