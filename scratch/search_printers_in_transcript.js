const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logsDir = 'C:/Users/Sajad/.gemini/antigravity-ide/brain/f6290d96-6827-4397-8034-a378a3d29f80/.system_generated/logs';
const transcriptPath = path.join(logsDir, 'transcript.jsonl');

if (!fs.existsSync(transcriptPath)) {
  console.log(`Transcript not found at ${transcriptPath}`);
  process.exit(1);
}

const rl = readline.createInterface({
  input: fs.createReadStream(transcriptPath),
  crlfDelay: Infinity
});

let lineCount = 0;
rl.on('line', (line) => {
  lineCount++;
  if (line.includes('printer') || line.includes('printers') || line.includes('Printer')) {
    if (line.includes('dine_in') || line.includes('pickup') || line.includes('delivery') || line.includes('dinein') || line.includes('different') || line.includes('seperate') || line.includes('separate')) {
      console.log(`Line ${lineCount} contains printer query matches`);
      // Save matching lines to review
      fs.writeFileSync(`c:/Users/Sajad/Desktop/SaSLoop/scratch/transcript_printer_line_${lineCount}.json`, line, 'utf8');
    }
  }
});

rl.on('close', () => {
  console.log(`Finished scanning ${lineCount} lines.`);
});
