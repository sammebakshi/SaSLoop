const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain';

async function main() {
    const folders = fs.readdirSync(brainDir);
    for (const folder of folders) {
        const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
        if (!fs.existsSync(logPath)) continue;

        const fileStream = fs.createReadStream(logPath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let lineNum = 0;
        for await (const line of rl) {
            lineNum++;
            if (line.includes('assembleDebug') || line.includes('compileDebugKotlin')) {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.tool_calls) {
                        for (const tc of parsed.tool_calls) {
                            if (tc.name === 'run_command') {
                                console.log(`BUILD COMMAND in ${folder} (line ${lineNum}, step ${parsed.step_index}):`);
                                console.log(`  Cmd: ${tc.args.CommandLine}`);
                            }
                        }
                    }
                    if (parsed.type === 'run_command' && parsed.status === 'DONE') {
                        console.log(`BUILD RESULT in ${folder} (line ${lineNum}, step ${parsed.step_index}):`);
                        const output = parsed.content || '';
                        if (output.includes('BUILD SUCCESSFUL')) {
                            console.log('  ==> BUILD SUCCESSFUL!');
                        } else {
                            console.log('  ==> Build output check...');
                            console.log(output.split('\n').slice(-5).join('\n'));
                        }
                        console.log('---');
                    }
                } catch (e) {}
            }
        }
    }
}

main();
