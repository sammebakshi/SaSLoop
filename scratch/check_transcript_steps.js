const fs = require('fs');
const readline = require('readline');

const path = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(path),
    terminal: false
});

rl.on('line', (line) => {
    try {
        const obj = JSON.parse(line);
        const step = obj.step_index;
        if (step >= 1900 && step <= 2040) {
            if (obj.tool_calls) {
                obj.tool_calls.forEach(tc => {
                    if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
                        let isTruncated = JSON.stringify(tc).includes('truncated');
                        console.log(`Transcript Step: ${step}, Tool: ${tc.name}, Truncated: ${isTruncated}`);
                    }
                });
            }
        }
    } catch (e) {}
});
