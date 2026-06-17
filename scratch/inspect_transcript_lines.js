const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\5b1f6df8-6da8-4b0b-9562-4d541d53ecb6\\.system_generated\\logs\\transcript.jsonl';

async function inspect() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let count = 0;
    for await (const line of rl) {
        count++;
        if (count < 10) {
            try {
                const parsed = JSON.parse(line);
                console.log(`Line ${count}: keys = ${Object.keys(parsed).join(', ')}`);
                console.log(`  step_index: ${parsed.step_index}, type: ${parsed.type}, source: ${parsed.source}`);
            } catch (e) {
                console.log(`Line ${count}: error parsing: ${e.message}`);
            }
        } else {
            break;
        }
    }
}

inspect();
