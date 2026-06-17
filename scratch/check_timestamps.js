const fs = require('fs');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  try {
    const step = JSON.parse(lines[i]);
    if (step.tool_calls) {
      step.tool_calls.forEach(tc => {
        if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
          const argsStr = typeof tc.args === 'string' ? tc.args : JSON.stringify(tc.args);
          if (argsStr.includes('App.jsx')) {
            const args = typeof tc.args === 'string' ? JSON.parse(tc.args) : tc.args;
            console.log(`Step ${step.step_index}: time=${step.created_at}, description=${args.Description}`);
          }
        }
      });
    }
  } catch (e) {}
}
