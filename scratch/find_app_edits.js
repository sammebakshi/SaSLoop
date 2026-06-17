const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  console.log("Found transcript.jsonl!");
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  console.log("Total log lines:", lines.length);
  
  // Let's filter for steps that modified App.jsx or contain edits
  let count = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    try {
      const step = JSON.parse(lines[i]);
      if (step.tool_calls) {
        step.tool_calls.forEach(tc => {
          if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'write_to_file') {
            const args = typeof tc.args === 'string' ? JSON.parse(tc.args) : tc.args;
            const targetFile = args.TargetFile || args.targetFile;
            if (targetFile && targetFile.includes('App.jsx')) {
              console.log(`[Step ${step.step_index}] Tool: ${tc.name}`);
              console.log("Description:", args.Description);
              console.log("Instruction:", args.Instruction);
              console.log("---------------------------------------");
              count++;
            }
          }
        });
      }
    } catch (e) {
      // ignore parse errors for incomplete lines
    }
  }
  console.log(`Found ${count} edits to App.jsx in logs.`);
} else {
  console.log("transcript.jsonl NOT found at:", logPath);
}
