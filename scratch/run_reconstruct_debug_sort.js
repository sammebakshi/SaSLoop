const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function check() {
  const targetConversations = [
    { folder: 'c128cc3f-394c-4d5f-8471-2201f6e29d9e', startStep: 818 },
    { folder: '5b1f6df8-6da8-4b0b-9562-4d541d53ecb6', startStep: 0 }
  ];

  const edits = [];
  for (const target of targetConversations) {
    const logPath = path.join(brainDir, target.folder, '.system_generated', 'logs', 'transcript.jsonl');
    if (fs.existsSync(logPath)) {
      const fileStream = fs.createReadStream(logPath);
      const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

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
                    time: parsed.created_at,
                    tool: tc.name
                  });
                }
              }
            }
          }
        } catch (e) {}
      }
    }
  }

  console.log(`Loaded ${edits.length} edits.`);
  
  // Inspect times
  let undefinedTimes = 0;
  edits.forEach((e, idx) => {
    if (!e.time) {
      console.log(`Edit #${idx+1} (Step ${e.step} in ${e.folder}) has undefined time!`);
      undefinedTimes++;
    } else {
      const d = new Date(e.time);
      if (isNaN(d.getTime())) {
        console.log(`Edit #${idx+1} (Step ${e.step} in ${e.folder}) has invalid time: ${e.time}`);
        undefinedTimes++;
      }
    }
  });
  console.log(`Total undefined/invalid times: ${undefinedTimes}`);
}

check();
