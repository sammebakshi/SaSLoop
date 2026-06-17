const fs = require('fs');
const path = require('path');

const folder = 'c128cc3f-394c-4d5f-8471-2201f6e29d9e';
const logPath = path.join('C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain', folder, '.system_generated', 'logs', 'transcript.jsonl');

function printRaw() {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    if (!line) continue;
    if (line.includes('1738') && line.includes('TargetContent')) {
      console.log("RAW LOG LINE:");
      console.log(line.substring(0, 1000));
      break;
    }
  }
}

printRaw();
