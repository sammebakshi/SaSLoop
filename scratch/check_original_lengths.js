const fs = require('fs');
const readline = require('readline');
const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    if (!fs.existsSync(logPath)) {
        console.log('No log path');
        return;
    }
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });

    const targetSteps = [407, 409, 439, 441, 443];
    for await (const line of rl) {
        try {
            const step = JSON.parse(line);
            if (step.type === 'VIEW_FILE' && step.status === 'DONE' && targetSteps.includes(step.step_index)) {
                console.log(`Step ${step.step_index}: content length = ${step.content ? step.content.length : 0}`);
            }
        } catch (e) {
            // Ignore
        }
    }
}
main();
