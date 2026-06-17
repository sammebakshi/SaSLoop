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
            if (parsed.step_index === 1979) {
                const tc = parsed.tool_calls[0];
                console.log("Found Edit #860 (Step 1979):");
                console.log("Target length:", tc.args.TargetContent ? tc.args.TargetContent.length : 0);
                console.log("Replacement length:", tc.args.ReplacementContent ? tc.args.ReplacementContent.length : 0);
                console.log("Target content slice:", JSON.stringify(tc.args.TargetContent ? tc.args.TargetContent.slice(0, 100) : ''));
            }
        } catch (e) {}
    }
}
check();
