const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';
const folders = fs.readdirSync(brainDir);

console.log(`Scanning ${folders.length} folders for App.jsx history...`);

let latestWriteTime = 0;
let bestContent = null;
let bestSource = null;

folders.forEach(folder => {
  const logFile = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(logFile)) {
    try {
      const stats = fs.statSync(logFile);
      const lines = fs.readFileSync(logFile, 'utf8').split('\n');
      lines.forEach(line => {
        if (!line.trim()) return;
        try {
          const step = JSON.parse(line);
          if (step.tool_calls) {
            step.tool_calls.forEach(tc => {
              // Look for any edit that contains the whole file or large chunks
              if (tc.name === 'write_to_file' || tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                const args = typeof tc.args === 'string' ? JSON.parse(tc.args) : tc.args;
                const targetFile = args.TargetFile || args.targetFile;
                if (targetFile && targetFile.includes('App.jsx')) {
                  const content = args.CodeContent || args.ReplacementContent || '';
                  if (content.length > 500000) { // If it's a huge write (whole file)
                    const time = new Date(step.created_at || stats.mtime).getTime();
                    if (time > latestWriteTime) {
                      latestWriteTime = time;
                      bestContent = content;
                      bestSource = `Folder: ${folder}, Step: ${step.step_index}, Tool: ${tc.name}`;
                    }
                  }
                }
              }
            });
          }
        } catch (e) {}
      });
    } catch (err) {}
  }
});

if (bestContent) {
  console.log(`Found a large App.jsx write from: ${bestSource}`);
  console.log(`Content size: ${bestContent.length} characters`);
  fs.writeFileSync('C:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\App_recovered_large.jsx', bestContent, 'utf8');
  console.log("Saved to App_recovered_large.jsx");
} else {
  console.log("No whole-file writes of App.jsx found in any logs.");
}
