const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\5b1f6df8-6da8-4b0b-9562-4d541d53ecb6\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
  input: fs.createReadStream(logPath),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.tool_calls) {
      obj.tool_calls.forEach(tc => {
        if (tc.name === 'run_command') {
          const args = tc.args;
          let cmd = '';
          if (typeof args === 'object' && args !== null) {
            cmd = args.CommandLine || '';
          } else {
            cmd = String(args);
          }
          if (cmd.includes('git ') || cmd.includes('checkout') || cmd.includes('stash')) {
            console.log(`Step ${obj.step_index}: cmd=${cmd}`);
          }
        }
      });
    }
  } catch (e) {}
});
