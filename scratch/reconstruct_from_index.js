const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';
const outputFilePath = path.join(projectDir, 'scratch', 'App_reconstructed.jsx');

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

function normalizeContent(str) {
  if (!str) return '';
  return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

async function reconstruct() {
  console.log("Fetching base App.jsx from git index...");
  let baseContent;
  try {
    baseContent = execSync('git show :pos-app/src/App.jsx', { 
      cwd: projectDir, 
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024 
    });
  } catch (e) {
    console.error("Failed to fetch App.jsx from index:", e.message);
    return;
  }
  console.log(`Base App.jsx loaded from index (${baseContent.length} bytes, ~${baseContent.split('\n').length} lines).`);

  const targetConversations = [
    { folder: 'c128cc3f-394c-4d5f-8471-2201f6e29d9e', startStep: 818 },
    { folder: '5b1f6df8-6da8-4b0b-9562-4d541d53ecb6', startStep: 0 }
  ];

  const edits = [];

  for (const target of targetConversations) {
    const logPath = path.join(brainDir, target.folder, '.system_generated', 'logs', 'transcript.jsonl');
    if (fs.existsSync(logPath)) {
      console.log(`Scanning transcript in folder ${target.folder} starting from step ${target.startStep}...`);
      const fileStream = fs.createReadStream(logPath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
      });

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
                    tool: tc.name,
                    args: args
                  });
                }
              }
            }
          }
        } catch (e) {}
      }
    } else {
      console.warn(`Transcript log not found for folder ${target.folder}`);
    }
  }

  // Sort edits chronologically
  edits.sort((a, b) => new Date(a.time) - new Date(b.time));
  console.log(`Found ${edits.length} edits to apply sequentially.`);

  let currentContent = baseContent;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < edits.length; i++) {
    const edit = edits[i];
    
    if (edit.tool === 'write_to_file') {
      if (edit.args.CodeContent) {
        currentContent = cleanString(edit.args.CodeContent);
        console.log(`[Edit #${i + 1}] Step ${edit.step} in ${edit.folder} (${edit.time}) -> Full write: Replaced content completely (${currentContent.length} bytes)`);
        successCount++;
      } else {
        console.log(`[Edit #${i + 1}] Step ${edit.step} in ${edit.folder} (${edit.time}) -> Full write: Warning - No CodeContent in write_to_file!`);
        failCount++;
      }
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

    let editSuccess = true;
    for (let j = 0; j < chunks.length; j++) {
      const chunk = chunks[j];
      let target = chunk.target;
      let replacement = chunk.replacement;

      if (!target) continue;

      if (currentContent.includes(target)) {
        currentContent = currentContent.replace(target, replacement);
      } else {
        const normContent = normalizeContent(currentContent);
        const normTarget = normalizeContent(target);
        const normReplacement = normalizeContent(replacement);

        if (normContent.includes(normTarget)) {
          const replacedNorm = normContent.replace(normTarget, normReplacement);
          const usesCRLF = currentContent.includes('\r\n');
          currentContent = usesCRLF ? replacedNorm.replace(/\n/g, '\r\n') : replacedNorm;
        } else {
          console.log(`[Edit #${i + 1} Step ${edit.step} in ${edit.folder} (${edit.time})] Chunk #${j + 1}: WARNING - Target not found!`);
          console.log(`Target snippet (first 150 chars):`, JSON.stringify(target.slice(0, 150)));
          editSuccess = false;
        }
      }
    }

    if (editSuccess) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\nReconstruction finished.`);
  console.log(`Success: ${successCount}/${edits.length}`);
  console.log(`Failed edits: ${failCount}`);

  fs.writeFileSync(outputFilePath, currentContent, 'utf8');
  console.log(`Saved reconstructed App.jsx to ${outputFilePath} (${currentContent.length} bytes).`);
}

reconstruct().catch(console.error);
