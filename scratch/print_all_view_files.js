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

    for await (const line of rl) {
        try {
            const step = JSON.parse(line);
            if (step.type === 'VIEW_FILE' && step.status === 'DONE') {
                if (step.content && step.content.includes('BillingScreen.kt')) {
                    console.log(`Step ${step.step_index}: content length = ${step.content.length}`);
                    console.log(`  first 150 chars:`, step.content.slice(0, 150).replace(/\n/g, '\\n'));
                }
            }
        } catch (e) {
            // Ignore
        }
    }
}
main();
