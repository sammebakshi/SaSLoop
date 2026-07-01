const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\f6290d96-6827-4397-8034-a378a3d29f80\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT') {
        console.log(`--- STEP ${obj.step_index} (${obj.created_at}) ---`);
        console.log(obj.content);
      }
    } catch (e) {
      // ignore parsing errors
    }
  }
}

processLineByLine();
