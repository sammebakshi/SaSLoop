const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logsDir = 'C:/Users/Sajad/.gemini/antigravity-ide/brain/f6290d96-6827-4397-8034-a378a3d29f80/.system_generated/logs';
const transcriptPath = path.join(logsDir, 'transcript.jsonl');

if (!fs.existsSync(transcriptPath)) {
  console.log(`Transcript not found at ${transcriptPath}`);
  process.exit(1);
}

console.log("Found transcript.jsonl!");

const rl = readline.createInterface({
  input: fs.createReadStream(transcriptPath),
  crlfDelay: Infinity
});

let lineCount = 0;
rl.on('line', (line) => {
  lineCount++;
  if (line.includes('metallicSteel') && line.includes('TransitionSplashScreen')) {
    console.log(`Line ${lineCount} contains metallicSteel and TransitionSplashScreen`);
    // Let's write this line to a separate file so we can inspect it without truncation
    fs.writeFileSync(`c:/Users/Sajad/Desktop/SaSLoop/scratch/transcript_line_${lineCount}.json`, line, 'utf8');
    console.log(`Saved line ${lineCount} to transcript_line_${lineCount}.json`);
  }
});

rl.on('close', () => {
  console.log(`Finished scanning ${lineCount} lines in transcript.`);
});
