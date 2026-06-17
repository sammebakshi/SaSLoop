const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\5b1f6df8-6da8-4b0b-9562-4d541d53ecb6\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.step_index >= 1454 && obj.step_index <= 1490) {
      console.log(`Step ${obj.step_index}: source=${obj.source}, type=${obj.type}, status=${obj.status}`);
      if (obj.content) {
        console.log(`  Content: ${obj.content.slice(0, 500)}`);
      }
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          console.log(`  Tool: ${tc.name}`);
          console.log(`    Args: ${JSON.stringify(tc.args).slice(0, 300)}`);
        });
      }
    }
  } catch (e) {}
});
