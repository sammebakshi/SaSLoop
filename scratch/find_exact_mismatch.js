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

async function findMismatch() {
  let baseContent = execSync('git show :pos-app/src/App.jsx', { 
    cwd: projectDir, 
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });

  const folder = 'c128cc3f-394c-4d5f-8471-2201f6e29d9e';
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');

  let targetEdit = null;
  // Let's replay edits up to 1732
  const edits = [];
  for (const line of lines) {
    if (!line) continue;
    const p = JSON.parse(line);
    if (p.step_index >= 818 && p.step_index <= 1738 && p.tool_calls) {
      p.tool_calls.forEach(tc => {
        if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
          const file = tc.args.TargetFile || tc.args.targetFile || '';
          if (file.includes('App.jsx')) {
            edits.push({
              step: p.step_index,
              tool: tc.name,
              args: tc.args
            });
          }
        }
      });
    }
  }

  let currentContent = baseContent;
  for (const edit of edits) {
    if (edit.step === 1738) {
      targetEdit = edit;
      break;
    }
    // apply edit
    const chunks = [];
    if (edit.tool === 'replace_file_content') {
      chunks.push({
        target: cleanString(edit.args.TargetContent || edit.args.targetContent),
        replacement: cleanString(edit.args.ReplacementContent || edit.args.replacementContent)
      });
    } else {
      let chunksList = edit.args.ReplacementChunks || edit.args.replacementChunks || [];
      if (typeof chunksList === 'string') {
        try {
          chunksList = JSON.parse(chunksList);
        } catch (e) {
          chunksList = [];
        }
      }
      if (Array.isArray(chunksList)) {
        chunksList.forEach(c => {
          chunks.push({
            target: cleanString(c.TargetContent || c.targetContent),
            replacement: cleanString(c.ReplacementContent || c.replacementContent)
          });
        });
      }
    }
    for (const chunk of chunks) {
      currentContent = currentContent.replace(chunk.target, chunk.replacement);
    }
  }

  if (!targetEdit) {
    console.error("Step 1738 edit not found!");
    return;
  }

  const target = cleanString(targetEdit.args.TargetContent || targetEdit.args.targetContent);
  console.log("Cleaned target length:", target.length);

  // Normalize newlines for both
  const normContent = currentContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const normTarget = target.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  console.log("Normalized target length:", normTarget.length);
  console.log("Includes normalized target:", normContent.includes(normTarget));

  if (!normContent.includes(normTarget)) {
    // Find where the row 1 comment starts in normContent
    const comment = "{/* Row 1: Mobile, Name, History, Bell, Checkbox */}";
    const startIndex = normContent.indexOf(comment);
    if (startIndex === -1) {
      console.log("Comment not found in normContent!");
      return;
    }
    console.log("Comment found in normContent at index:", startIndex);
    
    // Compare character by character starting from startIndex
    let matchLen = 0;
    for (let i = 0; i < normTarget.length; i++) {
      if (normContent[startIndex + i] === normTarget[i]) {
        matchLen++;
      } else {
        console.log(`Mismatch at index ${i}:`);
        console.log(`Expected (target):`, JSON.stringify(normTarget.substring(i, i + 50)));
        console.log(`Actual (content):`, JSON.stringify(normContent.substring(startIndex + i, startIndex + i + 50)));
        break;
      }
    }
    console.log(`Matched first ${matchLen} characters.`);
  }
}

findMismatch().catch(console.error);
