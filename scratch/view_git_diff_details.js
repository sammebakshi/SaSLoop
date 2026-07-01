const { execSync } = require('child_process');
const fs = require('fs');

console.log("Analyzing changes to temporary tables between 83e6cc5 and e217906...");

try {
  const diff = execSync('git diff 83e6cc5 e217906 -- pos-app/src/App.jsx', {
    maxBuffer: 20 * 1024 * 1024,
    encoding: 'utf8'
  });
  
  const lines = diff.split('\n');
  const matchedLines = [];
  
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('temp') || line.toLowerCase().includes('temporary')) {
      // Print context of 5 lines before and after
      matchedLines.push(`--- MATCH AT LINE ${idx} ---`);
      matchedLines.push(lines.slice(Math.max(0, idx - 5), Math.min(lines.length, idx + 6)).join('\n'));
      matchedLines.push('\n');
    }
  });
  
  fs.writeFileSync('scratch/diff_details.txt', matchedLines.join('\n'), 'utf8');
  console.log("Wrote matching segments to scratch/diff_details.txt");
} catch (e) {
  console.error("Error executing diff:", e);
}
