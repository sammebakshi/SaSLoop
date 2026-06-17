const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function scan() {
  const folders = fs.readdirSync(brainDir);
  const results = [];

  for (const folder of folders) {
    const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
    if (!fs.existsSync(logPath)) continue;

    // Read the file stats to check when it was last modified
    const stats = fs.statSync(logPath);
    // Only look at transcripts modified recently (e.g. within the last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    if (stats.mtimeMs < sevenDaysAgo) continue;

    console.log(`Scanning folder ${folder} (last modified: ${stats.mtime})...`);
    
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let editCount = 0;
    let firstTime = null;
    let lastTime = null;

    for await (const line of rl) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.tool_calls) {
          for (const tc of parsed.tool_calls) {
            if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content' || tc.name === 'write_to_file') {
              const args = tc.args || {};
              const file = args.TargetFile || args.targetFile || '';
              if (file.includes('App.jsx')) {
                editCount++;
                if (!firstTime) firstTime = parsed.created_at || stats.mtime;
                lastTime = parsed.created_at || stats.mtime;
              }
            }
          }
        }
      } catch (e) {}
    }

    if (editCount > 0) {
      results.push({
        folder,
        mtime: stats.mtime,
        editCount,
        firstTime,
        lastTime
      });
    }
  }

  console.log("\nScan complete. Conversations with App.jsx edits in the last 7 days:");
  results.sort((a, b) => b.mtime - a.mtime);
  console.log(JSON.stringify(results, null, 2));
}

scan().catch(console.error);
