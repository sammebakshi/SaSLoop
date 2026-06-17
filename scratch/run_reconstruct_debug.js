const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function check() {
  const targetConversations = [
    { folder: 'c128cc3f-394c-4d5f-8471-2201f6e29d9e', startStep: 818 },
    { folder: '5b1f6df8-6da8-4b0b-9562-4d541d53ecb6', startStep: 0 }
  ];

  const edits = [];
  for (const target of targetConversations) {
    const logPath = path.join(brainDir, target.folder, '.system_generated', 'logs', 'transcript.jsonl');
    console.log(`Checking path: ${logPath}`);
    if (fs.existsSync(logPath)) {
      const fileStream = fs.createReadStream(logPath);
      const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

      let count = 0;
      for await (const line of rl) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.step_index >= target.startStep && parsed.tool_calls) {
            for (const tc of parsed.tool_calls) {
              if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'write_to_file') {
                const args = tc.args || {};
                const file = args.TargetFile || args.targetFile || '';
                if (file.includes('App.jsx')) {
                  edits.push({
                    folder: target.folder,
                    step: parsed.step_index,
                    time: parsed.created_at
                  });
                  count++;
                }
              }
            }
          }
        } catch (e) {}
      }
      console.log(`Folder ${target.folder}: found ${count} edits.`);
    } else {
      console.log(`Folder ${target.folder} log path NOT found.`);
    }
  }

  console.log(`Total edits loaded in debug: ${edits.length}`);
}

check();
