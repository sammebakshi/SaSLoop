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
    if (stepCount === 4188) {
        const data = JSON.parse(line);
        console.log("Keys:", Object.keys(data));
        console.log("Source:", data.source);
        console.log("Type:", data.type);
        if (data.tool_calls) {
            data.tool_calls.forEach((tc, idx) => {
                console.log(`Tool call ${idx+1}: name=${tc.name}`);
                console.log(`Args:`, JSON.stringify(tc.args).slice(0, 1000));
                if (tc.args && tc.args.TargetFile) {
                    console.log(`TargetFile: ${tc.args.TargetFile}`);
                    try {
                        const fileContent = fs.readFileSync(tc.args.TargetFile, 'utf8');
                        console.log(`TargetFile size on disk: ${fileContent.length} bytes`);
                    } catch (err) {
                        console.log(`Error reading TargetFile on disk: ${err.message}`);
                    }
                }
            });
        }
    }
});
