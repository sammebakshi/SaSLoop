const fs = require('fs');
const readline = require('readline');
const path = require('path');

const logFilePath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function run() {
    const fileStream = fs.createReadStream(logFilePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.includes('"step_index":3317') || line.includes('"step_index":3318') || line.includes('"step_index":3454')) {
            try {
                const parsed = JSON.parse(line);
                console.log(`Found step: ${parsed.step_index}, Type: ${parsed.type}`);
                fs.writeFileSync(`scratch/step_${parsed.step_index}_full.json`, JSON.stringify(parsed, null, 2), 'utf8');
            } catch (e) {
                console.error(`Failed to parse step line:`, e);
            }
        }
    }
    console.log("Extraction complete!");
}

run();
