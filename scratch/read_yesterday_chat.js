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
    if (obj.type === 'USER_INPUT' || obj.source === 'USER_EXPLICIT') {
      console.log(`Step ${obj.step_index} (${obj.created_at || 'no-date'}):`);
      console.log(`  Content: ${obj.content}`);
    }
  } catch (e) {}
});
