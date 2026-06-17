const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

function cleanString(str) {
  if (typeof str !== 'string') return '';
  let val = str;
  if (val.startsWith('"') && val.endsWith('"')) {
    val = val.substring(1, val.length - 1);
  }
  val = val
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\')
    .replace(/\\t/g, '\t')
    .replace(/\\r/g, '\r')
    .replace(/\\n/g, '\n');
  return val;
}

async function check() {
  const baseContent = execSync('git show :pos-app/src/App.jsx', { 
    cwd: projectDir, 
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });

  const folder = 'c128cc3f-394c-4d5f-8471-2201f6e29d9e';
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');

  console.log("Checking first few replace_file_content calls with cleanString:");
  let count = 0;
  for (const line of lines) {
    if (!line) continue;
    const p = JSON.parse(line);
    if (p.tool_calls) {
      for (const tc of p.tool_calls) {
        if (tc.name === 'replace_file_content') {
          const file = tc.args.TargetFile || tc.args.targetFile || '';
          if (file.includes('App.jsx')) {
            count++;
            const target = tc.args.TargetContent || tc.args.targetContent || '';
            const cleanedTarget = cleanString(target);
            const includesClean = baseContent.includes(cleanedTarget);
            
            console.log(`\nEdit #${count} (Step ${p.step_index}):`);
            console.log(`  Raw starts with quote: ${target.startsWith('"')}`);
            console.log(`  Includes raw target: ${baseContent.includes(target)}`);
            console.log(`  Includes cleaned target: ${includesClean}`);
            
            if (!includesClean) {
              console.log("  Cleaned target preview:", JSON.stringify(cleanedTarget.substring(0, 150)));
            }
            if (count >= 5) return;
          }
        }
      }
    }
  }
}

check().catch(console.error);
