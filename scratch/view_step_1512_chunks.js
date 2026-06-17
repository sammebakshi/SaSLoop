const fs = require('fs');
const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\5b1f6df8-6da8-4b0b-9562-4d541d53ecb6\\.system_generated\\logs\\transcript.jsonl';

async function check() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        try {
            const parsed = JSON.parse(line);
            if (parsed.step_index === 1512) {
                console.log("Found Step 1512. Tool calls:");
                console.log(JSON.stringify(parsed.tool_calls, null, 2));
            }
        } catch (e) {}
    }
}
check();
