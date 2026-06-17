const fs = require('fs');
const path = require('path');
const readline = require('readline');
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
  let baseContent = execSync('git show :pos-app/src/App.jsx', { 
    cwd: projectDir, 
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });
  
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
          if (parsed.tool_calls) {
            for (const tc of parsed.tool_calls) {
              if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'write_to_file') {
                const args = tc.args || {};
                const file = args.TargetFile || args.targetFile || '';
                if (file.includes('App.jsx')) {
                  edits.push({
                    folder: target.folder,
                    step: parsed.step_index,
                    time: parsed.created_at,
                    tool: tc.name,
                    args: args
                  });
                }
              }
            }
          }
        } catch (e) {}
      }
    }
  }

  edits.sort((a, b) => new Date(a.time) - new Date(b.time));
  console.log(`Found ${edits.length} edits total.`);

  let currentContent = baseContent;
  for (let i = 0; i < edits.length; i++) {
    const edit = edits[i];
    if (edit.tool === 'write_to_file') {
      currentContent = cleanString(edit.args.CodeContent || '');
      console.log(`Edit #${i+1} (Step ${edit.step} in ${edit.folder}): Full write (New length: ${currentContent.length})`);
      continue;
    }

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

    let allMatched = true;
    const chunkStatuses = [];
    for (let j = 0; j < chunks.length; j++) {
      const chunk = chunks[j];
      const target = chunk.target;
      const replacement = chunk.replacement;
      if (!target) continue;

      if (currentContent.includes(target)) {
        currentContent = currentContent.replace(target, replacement);
        chunkStatuses.push(`Chunk #${j+1}: OK`);
      } else {
        // try normalized
        const normContent = currentContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const normTarget = target.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const normReplacement = replacement.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        if (normContent.includes(normTarget)) {
          const replacedNorm = normContent.replace(normTarget, normReplacement);
          const usesCRLF = currentContent.includes('\r\n');
          currentContent = usesCRLF ? replacedNorm.replace(/\n/g, '\r\n') : replacedNorm;
          chunkStatuses.push(`Chunk #${j+1}: OK (normalized)`);
        } else {
          chunkStatuses.push(`Chunk #${j+1}: FAILED`);
          allMatched = false;
        }
      }
    }

    console.log(`Edit #${i+1} (Step ${edit.step} in ${edit.folder}): ${allMatched ? 'SUCCESS' : 'FAILED'} - Chunks: ${chunkStatuses.join(', ')}`);
  }
}

check().catch(err => {
  console.error("Error occurred during check:");
  console.error(err.message);
  console.error(err.stack ? err.stack.split('\n').slice(0, 10).join('\n') : err);
});

