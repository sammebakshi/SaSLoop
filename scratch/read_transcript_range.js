const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';

async function findInTranscript() {
  if (!fs.existsSync(logPath)) {
    console.log(`Transcript not found at ${logPath}`);
    return;
  }

  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let stepIdx = 0;
  for await (const line of rl) {
    stepIdx++;
    if (stepIdx > 4200) continue; // Skip current session
    
    if (line.toLowerCase().includes('pointshistory') || line.toLowerCase().includes('points_history') || line.toLowerCase().includes('historymodal')) {
      console.log(`Match at step ${stepIdx}`);
      const index = line.toLowerCase().indexOf('pointshistory') !== -1 ? line.toLowerCase().indexOf('pointshistory') : line.toLowerCase().indexOf('points_history');
      console.log(line.slice(Math.max(0, index - 200), Math.min(line.length, index + 1000)));
      console.log('\n----------------------------------------\n');
    }
  }
}

findInTranscript();
