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
                let chunks = tc.args.ReplacementChunks;
                if (typeof chunks === 'string') {
                    try {
                        chunks = eval('(' + chunks + ')');
                    } catch (e) {
                        console.error("Failed to eval chunks:", e.message);
                        continue;
                    }
                }
                console.log("Parsed chunks count:", chunks.length);
                for (let i = 0; i < chunks.length; i++) {
                    const chunk = chunks[i];
                    console.log(`Chunk ${i}: StartLine=${chunk.StartLine}, EndLine=${chunk.EndLine}`);
                    console.log(`  TargetContent (first 100 chars): ${JSON.stringify(chunk.TargetContent ? chunk.TargetContent.slice(0, 100) : '')}`);
                    console.log(`  ReplacementContent (first 100 chars): ${JSON.stringify(chunk.ReplacementContent ? chunk.ReplacementContent.slice(0, 100) : '')}`);
                }
            }
        }
    }
});
