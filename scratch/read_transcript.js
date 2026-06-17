const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Target file
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
    if (line.includes('COUPON SELECTION MODAL') || line.includes('availableCoupons')) {
      console.log(`Match at line/step ${stepIdx}, line length: ${line.length}`);
      // Find where "COUPON SELECTION MODAL" is and print 500 chars before and 2000 chars after
      const index = line.indexOf('COUPON SELECTION MODAL');
      if (index !== -1) {
        console.log(`Snippet around match:`);
        console.log(line.slice(Math.max(0, index - 200), Math.min(line.length, index + 3000)));
        console.log('\n---------------------------------------------------\n');
      }
    }
  }
}

findInTranscript();
