const fs = require('fs');
const path = require('path');

function run() {
  const diffPath = path.join(__dirname, 'whatsapp_diff.diff');
  if (!fs.existsSync(diffPath)) {
    console.error('File not found:', diffPath);
    return;
  }
  
  const content = fs.readFileSync(diffPath, 'utf16le');
  const lines = content.split('\n');
  console.log(`Total lines in diff: ${lines.length}`);
  
  // Find lines containing AWAITING_OPTION_SELECTION
  lines.forEach((line, index) => {
    if (line.includes('AWAITING_OPTION_SELECTION')) {
      console.log(`Line ${index + 1}: ${line}`);
      
      // Print context: 10 lines before and 20 lines after
      const start = Math.max(0, index - 15);
      const end = Math.min(lines.length - 1, index + 35);
      console.log(`--- CONTEXT FOR LINE ${index + 1} ---`);
      for (let i = start; i <= end; i++) {
        console.log(`${i + 1}: ${lines[i]}`);
      }
      console.log('-------------------------------------\n');
    }
  });
}

run();
