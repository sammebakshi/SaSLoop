const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\e546bfa7-bc22-484d-95b1-d3920d26ba0c\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let count = 0;
    for await (const line of rl) {
        count++;
        if (count <= 15) {
            try {
                const parsed = JSON.parse(line);
                console.log(`Step ${parsed.step_index} at ${parsed.created_at} (${parsed.type})`);
                if (parsed.type === 'USER_INPUT') {
                    console.log(`  User Input: ${parsed.content}`);
                }
            } catch (e) {}
        } else {
            break;
        }
    }
}

main();
