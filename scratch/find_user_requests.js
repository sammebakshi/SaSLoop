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
    try {
        const data = JSON.parse(line);
        if (data.type === 'USER_INPUT' || data.source === 'USER_EXPLICIT') {
            console.log(`Step ${stepCount}: [${data.type || ''}] USER Request:`);
            console.log(data.content);
            console.log('--------------------------------------------------');
        }
    } catch (e) {
        // ignore
    }
});
