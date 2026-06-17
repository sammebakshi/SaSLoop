const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

let lineCount = 0;
let firstLine = null;
let lastLine = null;

rl.on('line', (line) => {
    lineCount++;
    if (lineCount === 1) firstLine = line;
    lastLine = line;
});

rl.on('close', () => {
    console.log("Total lines in log:", lineCount);
    try {
        const first = JSON.parse(firstLine);
        const last = JSON.parse(lastLine);
        console.log(`First step index: ${first.step_index}, type: ${first.type}`);
        console.log(`Last step index: ${last.step_index}, type: ${last.type}`);
    } catch (e) {
        console.log("Parsing error:", e.message);
    }
});
