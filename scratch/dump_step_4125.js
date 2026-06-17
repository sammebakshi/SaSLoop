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
    if (stepCount >= 4120 && stepCount <= 4140) {
        try {
            const data = JSON.parse(line);
            console.log(`Line ${stepCount}: Step ${data.step_index} [${data.type || ''}] [${data.source || ''}] [${data.status || ''}]:`);
            if (data.tool_calls) {
                data.tool_calls.forEach((tc, i) => {
                    console.log(`  Tool Call ${i+1}: ${tc.name}`);
                    console.log(`    Args keys: ${Object.keys(tc.args).join(', ')}`);
                    if (tc.args.ReplacementChunks) {
                        console.log(`    ReplacementChunks (first 300):`, JSON.stringify(tc.args.ReplacementChunks).slice(0, 300));
                    }
                });
            }
            if (data.content && data.content.length > 0) {
                console.log(`  Content (first 300):`, data.content.slice(0, 300).replace(/\n/g, '\\n'));
            }
            if (data.error) {
                console.log(`  Error:`, JSON.stringify(data.error));
            }
        } catch (e) {
            console.log(`Line ${stepCount} parsing error: ${e.message}`);
        }
    }
});
