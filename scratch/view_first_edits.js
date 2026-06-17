const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function check() {
  const baseContent = execSync('git show :pos-app/src/App.jsx', { 
    cwd: projectDir, 
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });

  const folder = 'c128cc3f-394c-4d5f-8471-2201f6e29d9e';
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (!fs.existsSync(logPath)) return;

  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let count = 0;
  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'write_to_file') {
            const args = tc.args || {};
            const file = args.TargetFile || args.targetFile || '';
            if (file.includes('App.jsx')) {
              count++;
              console.log(`\n=================== EDIT #${count} (Step ${parsed.step_index}) ===================`);
              console.log("Tool:", tc.name);
              console.log("Time:", parsed.created_at);
              if (tc.name === 'write_to_file') {
                console.log("CodeContent length:", args.CodeContent?.length);
              } else if (tc.name === 'replace_file_content') {
                const target = args.TargetContent || args.targetContent || '';
                console.log("Target (first 200 chars):", JSON.stringify(target.substring(0, 200)));
                console.log("Includes target:", baseContent.includes(target));
              } else {
                let chunks = args.ReplacementChunks || args.replacementChunks || [];
                if (typeof chunks === 'string') {
                  try { chunks = JSON.parse(chunks); } catch(e) { chunks = []; }
                }
                console.log("Chunks count:", chunks.length);
                chunks.forEach((c, idx) => {
                  const target = c.TargetContent || c.targetContent || '';
                  console.log(`  Chunk #${idx+1} Target (first 200 chars):`, JSON.stringify(target.substring(0, 200)));
                  console.log(`  Includes chunk #${idx+1} target:`, baseContent.includes(target));
                });
              }
              if (count >= 5) return;
            }
          }
        }
      }
    } catch (e) {}
  }
}

check().catch(console.error);
