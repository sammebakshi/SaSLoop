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
    if (line.includes('isCouponModalOpen')) {
      try {
        const obj = JSON.parse(line);
        console.log(`Step ${stepIdx}: Index=${obj.step_index}, Source=${obj.source}, Type=${obj.type}`);
      } catch (e) {
        console.log(`Step ${stepIdx}: (JSON parse error)`);
      }
    }
  }
}

findInTranscript();
