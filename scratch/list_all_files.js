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
    if (line.includes('view_file') && line.includes('BillingScreen.kt')) {
        try {
            const data = JSON.parse(line);
            if (data.tool_calls) {
                data.tool_calls.forEach(tc => {
                    if (tc.name === 'view_file' && tc.args.AbsolutePath.includes('BillingScreen.kt')) {
                        console.log(`Line ${stepCount}: Step ${data.step_index} view_file args: StartLine=${tc.args.StartLine}, EndLine=${tc.args.EndLine}`);
                    }
                });
            }
            if (data.type === 'VIEW_FILE' && data.content && data.content.includes('BillingScreen.kt')) {
                // Parse system output to get line count
                const lines = data.content.split('\n');
                const lineCountLine = lines.find(l => l.includes('Total Lines:'));
                console.log(`Line ${stepCount}: Step ${data.step_index} VIEW_FILE output. ${lineCountLine || ''}`);
            }
        } catch (e) {
            // ignore
        }
    }
});
