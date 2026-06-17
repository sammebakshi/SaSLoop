const fs = require('fs');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\2efc7792-9c57-45be-98fb-8bc221ada715\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = 1260; i < lines.length; i++) {
  if (!lines[i] || !lines[i].trim()) continue;
  try {
    const step = JSON.parse(lines[i]);
    if (step.tool_calls) {
      step.tool_calls.forEach(tc => {
        if (tc.name === 'run_command') {
          const args = typeof tc.args === 'string' ? JSON.parse(tc.args) : tc.args;
          console.log(`Step ${step.step_index}: time=${step.created_at}, cmd=${args.CommandLine}`);
        }
      });
    }
  } catch (e) {}
}
