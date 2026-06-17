const fs = require('fs');
const readline = require('readline');

const path = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(path),
    terminal: false
});

let count = 0;
rl.on('line', (line) => {
    try {
        const obj = JSON.parse(line);
        const step = obj.step_index;
        if (obj.tool_calls) {
            obj.tool_calls.forEach(tc => {
                if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                    const targetFile = tc.args.TargetFile;
                    if (targetFile && targetFile.includes('App.jsx')) {
                        count++;
                        let isTruncated = false;
                        const str = JSON.stringify(tc);
                        if (str.includes('truncated')) {
                            isTruncated = true;
                        }
                        console.log(`[${count}] Transcript Step: ${step}, Tool: ${tc.name}, Truncated in log: ${isTruncated}`);
                        if (tc.args.Instruction) {
                            console.log(`  Instruction: ${tc.args.Instruction}`);
                        }
                        if (tc.args.Description) {
                            console.log(`  Description: ${tc.args.Description}`);
                        }
                    }
                }
            });
        }
    } catch (e) {
        console.error('Error parsing line:', e);
    }
});

rl.on('close', () => {
    console.log(`Total edits found on App.jsx in current transcript: ${count}`);
});
