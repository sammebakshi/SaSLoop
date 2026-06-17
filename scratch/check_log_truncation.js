const fs = require('fs');
const path = require('path');

const folders = ['c128cc3f-394c-4d5f-8471-2201f6e29d9e', '5b1f6df8-6da8-4b0b-9562-4d541d53ecb6'];
const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

function check() {
  for (const folder of folders) {
    const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
    if (!fs.existsSync(logPath)) continue;
    
    console.log(`Checking folder ${folder}...`);
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.split('\n');
    let truncatedCount = 0;
    let totalEdits = 0;
    
    for (const line of lines) {
      if (!line) continue;
      const p = JSON.parse(line);
      if (p.tool_calls) {
        let isAppEdit = false;
        p.tool_calls.forEach(tc => {
          if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'write_to_file') {
            const file = tc.args.TargetFile || tc.args.targetFile || '';
            if (file.includes('App.jsx')) {
              isAppEdit = true;
            }
          }
        });
        
        if (isAppEdit) {
          totalEdits++;
          if (line.includes('<truncated')) {
            truncatedCount++;
            // Find which step it is
            console.log(`  Step ${p.step_index} is TRUNCATED!`);
          }
        }
      }
    }
    console.log(`Folder ${folder}: ${truncatedCount} out of ${totalEdits} edits are truncated.`);
  }
}

check();
