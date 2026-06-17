const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        if (line.includes('BUILD SUCCESSFUL') || line.includes('BUILD FAILED')) {
            try {
                const parsed = JSON.parse(line);
                console.log(`Step ${parsed.step_index}:`);
                const content = parsed.content || '';
                if (content.includes('BUILD SUCCESSFUL')) {
                    console.log('  BUILD SUCCESSFUL');
                } else if (content.includes('BUILD FAILED')) {
                    console.log('  BUILD FAILED');
                }
            } catch (e) {}
        }
    }
}

main();
