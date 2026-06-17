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
            if (parsed.step_index === 1460) {
                console.log("Found Step 1460. Parsed Step:");
                console.log("Keys:", Object.keys(parsed));
                console.log("Status:", parsed.status);
                // Check where the command output is
                if (parsed.content) {
                    console.log("Content length:", parsed.content.length);
                    fs.writeFileSync('c:\\Users\\Sajad\\Desktop\\SaSLoop\\scratch\\step_1460_content.txt', parsed.content, 'utf8');
                    console.log("Saved content to scratch/step_1460_content.txt");
                }
                // Check tool_calls or output
                if (parsed.tool_calls) {
                    console.log("Tool calls:", JSON.stringify(parsed.tool_calls, null, 2));
                }
                // If the system response was in a separate step or line, we can search around it.
            }
            // Let's also check if there is a step index 1461 or 1462 that contains the system response/output of the command.
            if (parsed.step_index >= 1460 && parsed.step_index <= 1465) {
                console.log(`Step ${parsed.step_index} - type: ${parsed.type}`);
            }
        } catch (e) {}
    }
}

extract();
