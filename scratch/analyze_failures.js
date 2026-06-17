const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const projectDir = 'c:\\Users\\Sajad\\Desktop\\SaSLoop';
const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function analyze() {
  const baseContent = execSync('git show :pos-app/src/App.jsx', { cwd: projectDir, encoding: 'utf8' });
  const lines = baseContent.split('\n');
  console.log(`Base content length: ${baseContent.length} bytes, lines: ${lines.length}`);

  const folder = 'c128cc3f-394c-4d5f-8471-2201f6e29d9e';
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (!fs.existsSync(logPath)) {
    console.error("Log not found!");
    return;
  }

  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const edits = [];
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

  console.log(`Found ${edits.length} edits in folder ${folder}`);
  
  // Let's look at the first 5 edits
  for (let i = 0; i < Math.min(5, edits.length); i++) {
    const edit = edits[i];
    console.log(`\n--- Edit #${i+1} at step ${edit.step} (Tool: ${edit.tool}) ---`);
    if (edit.tool === 'write_to_file') {
      console.log(`Write to file, size: ${edit.args.CodeContent?.length} bytes`);
    } else if (edit.tool === 'replace_file_content') {
      const target = edit.args.TargetContent || edit.args.targetContent;
      console.log(`Target matches: ${baseContent.includes(target)}`);
      if (!baseContent.includes(target)) {
        console.log("Target preview (first 100 chars):", JSON.stringify(target?.substring(0, 100)));
        // Try finding a partial match
        const firstLine = target?.split('\n')[0];
        console.log(`First line of target: ${JSON.stringify(firstLine)}`);
        console.log(`First line exists in base: ${baseContent.includes(firstLine)}`);
      }
    } else {
      const chunks = edit.args.ReplacementChunks || edit.args.replacementChunks || [];
      console.log(`Multi-replace chunks: ${chunks.length}`);
      chunks.forEach((chunk, ci) => {
        const target = chunk.TargetContent || chunk.targetContent;
        console.log(`  Chunk #${ci+1} target matches: ${baseContent.includes(target)}`);
        if (!baseContent.includes(target)) {
          const firstLine = target?.split('\n')[0];
          console.log(`  First line: ${JSON.stringify(firstLine)}`);
          console.log(`  First line exists in base: ${baseContent.includes(firstLine)}`);
        }
      });
    }
  }
}

analyze().catch(console.error);
