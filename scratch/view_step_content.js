const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lineNum = 0;
    for await (const line of rl) {
        lineNum++;
        if (line.includes('"step_index":259,') || line.includes('"step_index": 259,')) {
            try {
                const parsed = JSON.parse(line);
                console.log(`Step ${parsed.step_index} keys:`, Object.keys(parsed));
                const content = parsed.content || '';
                console.log(`Content length: ${content.length}`);
                console.log("--- First 50 lines of content ---");
                console.log(content.split('\n').slice(0, 50).join('\n'));
            } catch (e) {
                console.error("JSON parse error:", e.message);
            }
            break;
        }
    }
}

main();
