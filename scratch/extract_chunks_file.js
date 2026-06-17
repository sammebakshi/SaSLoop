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
    if (stepCount === 4125) {
        const data = JSON.parse(line);
        if (data.tool_calls) {
            for (let tc of data.tool_calls) {
                const chunksStr = tc.args.ReplacementChunks;
                fs.writeFileSync('c:/Users/Sajad/Desktop/SaSLoop/scratch/chunks_4125.json', chunksStr, 'utf8');
                console.log("Successfully wrote chunks_4125.json! Size:", chunksStr.length);
            }
        }
    }
});
