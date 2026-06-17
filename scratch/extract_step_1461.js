const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\5b1f6df8-6da8-4b0b-9562-4d541d53ecb6\\.system_generated\\logs\\transcript.jsonl';

async function extract() {
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        try {
            const parsed = JSON.parse(line);
            if (parsed.step_index === 1461) {
                console.log("Found Step 1461.");
                console.log("Keys:", Object.keys(parsed));
                console.log("Status:", parsed.status);
                if (parsed.content) {
                    console.log("Content length:", parsed.content.length);
                    fs.writeFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\step_1461_output.txt', parsed.content, 'utf8');
                    console.log("Saved content to scratch/step_1461_output.txt");
                }
            }
        } catch (e) {}
    }
}

extract();
