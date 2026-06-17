const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\e546bfa7-bc22-484d-95b1-d3920d26ba0c\\.system_generated\\logs\\transcript.jsonl';

async function main() {
    if (!fs.existsSync(logPath)) {
        console.log("Log not found.");
        return;
    }
    const rl = readline.createInterface({
        input: fs.createReadStream(logPath),
        crlfDelay: Infinity
    });

    let stepCount = 0;
    for await (const line of rl) {
        stepCount++;
        if (line.includes('restore_billing_screen.js')) {
            try {
                const parsed = JSON.parse(line);
                console.log(`Line ${stepCount}: Step ${parsed.step_index} [${parsed.type}] [${parsed.source}]`);
                if (parsed.tool_calls) {
                    parsed.tool_calls.forEach(tc => {
                        console.log(`  Tool: ${tc.name}`);
                        if (tc.args) {
                            console.log(`    Args:`, JSON.stringify(tc.args).slice(0, 300));
                        }
                    });
                }
                if (parsed.content) {
                    console.log(`  Content snippet:`, parsed.content.slice(0, 300));
                }
            } catch (e) {
                console.log(`  Error parsing:`, e.message);
            }
        }
    }
}

main();
