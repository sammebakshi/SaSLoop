const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\832fe37e-cc6a-4502-a268-fc8186b73341\\.system_generated\\logs\\transcript.jsonl';
const outputPath = 'c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\model_steps.txt';

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
});

rl.on('close', () => {
    const out = [];
    out.push(`Total steps: ${lines.length}`);
    for (let i = 0; i < lines.length; i++) {
        try {
            const data = JSON.parse(lines[i]);
            const step = data.step_index !== undefined ? data.step_index : i;
            if (step >= 4320) {
                out.push(`\n--- STEP ${step} (${data.source} - ${data.type}) ---`);
                if (data.content) out.push(data.content);
                if (data.tool_calls) {
                    data.tool_calls.forEach(t => {
                        out.push(`Tool: ${t.name}`);
                        out.push(`Args: ${JSON.stringify(t.args, null, 2)}`);
                    });
                }
            }
        } catch (e) {
            // ignore
        }
    }
    fs.writeFileSync(outputPath, out.join('\n'), 'utf8');
    console.log("Written steps to scratch/model_steps.txt");
});
