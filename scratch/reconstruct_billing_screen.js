const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    if (!fs.existsSync(logPath)) {
        console.log('Log does not exist:', logPath);
        return;
    }
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        try {
            const step = JSON.parse(line);
            if (step.step_index >= 4055 && step.step_index <= 4065) {
                console.log(`\n--- Step ${step.step_index} (${step.type}) ---`);
                if (step.content) {
                    console.log(step.content.slice(0, 500));
                }
            }
        } catch (e) {
            // Ignore parse errors
        }
    }
}

main();
