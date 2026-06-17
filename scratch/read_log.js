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
    if (obj.step_index >= 1400 && obj.step_index <= 1680) {
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          if (tc.name === 'run_command') {
            console.log(`Step ${obj.step_index}: tool=run_command`);
            const args = tc.args;
            if (typeof args === 'object' && args !== null) {
              console.log(`  CommandLine: ${args.CommandLine}`);
              console.log(`  Cwd: ${args.Cwd}`);
            } else {
              console.log(`  Raw Args: ${args}`);
            }
          }
        });
      }
    }
  } catch (e) {}
});
