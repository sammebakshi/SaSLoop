const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

let stepCount = 0;
rl.on('line', (line) => {
    stepCount++;
    if (stepCount >= 3535 && stepCount <= 3555) {
        try {
            const data = JSON.parse(line);
            console.log(`Line ${stepCount}: Step ${data.step_index} [${data.type || ''}] [${data.source || ''}]:`);
            if (data.content) {
                console.log(data.content.slice(0, 800));
            }
        } catch (e) {
            // ignore
        }
    }
});
