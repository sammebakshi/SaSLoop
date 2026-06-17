const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  let firstStep = -1;
  let lastStep = -1;
  let edits = [];
  
  lines.forEach((line, idx) => {
    if (!line.trim()) return;
    try {
      const step = JSON.parse(line);
      if (step.tool_calls) {
        step.tool_calls.forEach(tc => {
          if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'write_to_file') {
            const args = typeof tc.args === 'string' ? JSON.parse(tc.args) : tc.args;
            const targetFile = args.TargetFile || args.targetFile;
            if (targetFile && targetFile.includes('App.jsx')) {
              if (firstStep === -1) firstStep = step.step_index;
              lastStep = step.step_index;
              edits.push({
                step: step.step_index,
                tool: tc.name,
                description: args.Description,
                instruction: args.Instruction,
                args: args
              });
            }
          }
        });
      }
    } catch (e) {}
  });
  
  console.log(`First App.jsx edit in log was at step ${firstStep}`);
  console.log(`Last App.jsx edit in log was at step ${lastStep}`);
  console.log(`Total App.jsx edits in log: ${edits.length}`);
  
  // Save all edits description to verify
  fs.writeFileSync('C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\all_app_edits.json', JSON.stringify(edits, null, 2), 'utf8');
  console.log("Saved edits metadata to all_app_edits.json");
} else {
  console.log("transcript.jsonl not found.");
}
