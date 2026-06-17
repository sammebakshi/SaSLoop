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
    if (line.includes('extract_tabs.js')) {
        console.log(`Step ${stepCount} contains extract_tabs.js`);
        try {
            const data = JSON.parse(line);
            if (data.tool_calls) {
                console.log(`  Tool Calls:`, JSON.stringify(data.tool_calls));
            }
            if (data.type === 'RUN_COMMAND' || data.type === 'COMMAND') {
                console.log(`  Command/Response status:`, data.status);
                console.log(`  Content:`, data.content ? data.content.slice(0, 1000) : '');
            }
        } catch (e) {
            // ignore
        }
    }
});
