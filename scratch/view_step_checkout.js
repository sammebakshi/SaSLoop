const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\5b1f6df8-6da8-4b0b-9562-4d541d53ecb6\\.system_generated\\logs\\transcript.jsonl';

async function search() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const targetSteps = [1478, 1484, 1514, 1516, 1522];
    for await (const line of rl) {
        try {
            const parsed = JSON.parse(line);
            if (targetSteps.includes(parsed.step_index)) {
                console.log(`--- Step ${parsed.step_index} (${parsed.type}) ---`);
                if (parsed.content) {
                    console.log(`Content: ${parsed.content.slice(0, 500)}...`);
                }
                if (parsed.tool_calls) {
                    console.log(`Tool Calls: ${JSON.stringify(parsed.tool_calls, null, 2)}`);
                }
            }
        } catch (e) {}
    }
}

search();
