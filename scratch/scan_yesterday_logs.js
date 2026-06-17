const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\2efc7792-9c57-45be-98fb-8bc221ada715\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  console.log("Yesterday's session logs total lines:", lines.length);
  
  // Find the last few steps that modified App.jsx
  let count = 0;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i].trim()) continue;
    try {
      const step = JSON.parse(lines[i]);
      if (step.tool_calls) {
        let matched = false;
        step.tool_calls.forEach(tc => {
          if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'write_to_file') {
            const argsStr = typeof tc.args === 'string' ? tc.args : JSON.stringify(tc.args);
            if (argsStr.includes('App.jsx')) {
              matched = true;
            }
          }
        });
        if (matched) {
          console.log(`[Step ${step.step_index}] time=${step.created_at}`);
          step.tool_calls.forEach(tc => {
            const args = typeof tc.args === 'string' ? JSON.parse(tc.args) : tc.args;
            console.log(`  Tool: ${tc.name}, Description: ${args.Description}`);
          });
          count++;
          if (count >= 5) break;
        }
      }
    } catch (e) {}
  }
} else {
  console.log("Yesterday's session log NOT found.");
}
