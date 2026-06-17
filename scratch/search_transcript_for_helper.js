const fs = require('fs');
const path = require('path');
const filepath = "C:/Users/Sajad/.gemini/antigravity-ide/brain/c128cc3f-394c-4d5f-8471-2201f6e29d9e/.system_generated/logs/transcript.jsonl";

if (!fs.existsSync(filepath)) {
  console.log("Transcript file does not exist at:", filepath);
  process.exit(1);
}

const lines = fs.readFileSync(filepath, 'utf8').split('\n');
console.log(`Searching through ${lines.length} log lines...`);

for (let idx = 0; idx < lines.length; idx++) {
  const line = lines[idx];
  if (line.includes('getDashboardAccess') || line.includes('DashboardAccess') || line.includes('Today\'s Sales')) {
    console.log(`Line ${idx + 1} contains keyword.`);
    try {
      const obj = JSON.parse(line);
      console.log(`Type: ${obj.type}, Source: ${obj.source}`);
      if (obj.content) {
        console.log("--- Content Snippet ---");
        console.log(obj.content.substring(0, 1000));
      }
      if (obj.tool_calls) {
        console.log("--- Tool Calls ---");
        console.log(JSON.stringify(obj.tool_calls).substring(0, 1500));
      }
    } catch(e) {
      console.log("Failed to parse JSON, raw snippet:", line.substring(0, 500));
    }
    console.log("=========================================\n");
  }
}
