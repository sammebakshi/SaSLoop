const fs = require('fs');
const path = require('path');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\5b1f6df8-6da8-4b0b-9562-4d541d53ecb6\\.system_generated\\logs\\transcript.jsonl';

async function search() {
    if (!fs.existsSync(logPath)) {
        console.log("Log file does not exist");
        return;
    }
    const fileStream = fs.createReadStream(logPath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let stepCount = 0;
    for await (const line of rl) {
        stepCount++;
        try {
            const step = JSON.parse(line);
            if (step.tool_calls) {
                for (const tool of step.tool_calls) {
                    if (tool.name === 'run_command') {
                        const args = tool.args || {};
                        const cmd = args.CommandLine || args.commandLine;
                        if (cmd && (cmd.includes('git') || cmd.includes('checkout') || cmd.includes('reset') || cmd.includes('stash'))) {
                            console.log(`Step ${step.step_index || stepCount}: git command: ${cmd}`);
                        }
                    }
                }
            }
        } catch (e) {
            // ignore
        }
    }
    console.log("Finished scanning transcript.");
}

search();
