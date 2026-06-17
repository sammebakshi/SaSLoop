const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\35e87087-c4f0-4007-b306-556a8840142a\\.system_generated\\logs\\transcript.jsonl';

async function check() {
    if (!fs.existsSync(logPath)) {
        console.log("Log path doesn't exist");
        return;
    }
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        try {
            const parsed = JSON.parse(line);
            if (parsed.step_index === 72) {
                console.log("Found Step 72. Tool calls:");
                console.log(JSON.stringify(parsed.tool_calls, null, 2));
            }
        } catch (e) {}
    }
}
check();
