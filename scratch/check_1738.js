const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function check() {
  let baseContent = execSync('git show :pos-app/src/App.jsx', { 
    cwd: projectDir, 
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });

  const folder = 'c128cc3f-394c-4d5f-8471-2201f6e29d9e';
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const edits = [];
  for await (const line of rl) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.step_index >= 818 && parsed.step_index <= 1738 && parsed.tool_calls) {
        for (const tc of parsed.tool_calls) {
          if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
            const args = tc.args || {};
            const file = args.TargetFile || args.targetFile || '';
            if (file.includes('App.jsx')) {
              edits.push({
                step: parsed.step_index,
                tool: tc.name,
                args: args
              });
            }
          }
        }
      }
    } catch (e) {}
  }

  console.log(`Applying edits up to step 1732...`);
  let currentContent = baseContent;
  for (let i = 0; i < edits.length; i++) {
    const edit = edits[i];
    if (edit.step === 1738) {
      console.log(`\nReached Step 1738! Target:`);
      const target = edit.args.TargetContent || edit.args.targetContent;
      console.log("Includes target exactly:", currentContent.includes(target));
      if (!currentContent.includes(target)) {
        // Find best partial match
        const targetLines = target.split('\n');
        console.log(`Target first 5 lines:`, targetLines.slice(0, 5).join('\n'));
        console.log(`Target last 5 lines:`, targetLines.slice(-5).join('\n'));
        
        // Print lines in currentContent that contain "{/* Row 1: Mobile, Name, History, Bell, Checkbox */}"
        const currentLines = currentContent.split('\n');
        currentLines.forEach((l, idx) => {
          if (l.includes('Row 1: Mobile, Name, History, Bell, Checkbox')) {
            console.log(`\nFound matching line in file at line ${idx+1}:`);
            console.log(currentLines.slice(idx, idx + 20).join('\n'));
          }
        });
      }
      continue;
    }

    const chunks = [];
    if (edit.tool === 'replace_file_content') {
      chunks.push({
        target: edit.args.TargetContent || edit.args.targetContent,
        replacement: edit.args.ReplacementContent || edit.args.replacementContent
      });
    } else {
      let chunksList = edit.args.ReplacementChunks || edit.args.replacementChunks || [];
      if (typeof chunksList === 'string') {
        try { chunksList = JSON.parse(chunksList); } catch (e) { chunksList = []; }
      }
      if (Array.isArray(chunksList)) {
        chunksList.forEach(c => {
          chunks.push({
            target: c.TargetContent || c.targetContent,
            replacement: c.ReplacementContent || c.replacementContent
          });
        });
      }
    }

    for (const chunk of chunks) {
      if (currentContent.includes(chunk.target)) {
        currentContent = currentContent.replace(chunk.target, chunk.replacement);
      } else {
        const normContent = currentContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const normTarget = chunk.target.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const normReplacement = chunk.replacement.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        if (normContent.includes(normTarget)) {
          const replacedNorm = normContent.replace(normTarget, normReplacement);
          const usesCRLF = currentContent.includes('\r\n');
          currentContent = usesCRLF ? replacedNorm.replace(/\n/g, '\r\n') : replacedNorm;
        } else {
          console.warn(`WARNING: Edit step ${edit.step} chunk failed!`);
        }
      }
    }
  }
}

check().catch(console.error);
